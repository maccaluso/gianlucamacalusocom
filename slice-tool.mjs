import http from 'http';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECTS_DIR = path.join(__dirname, 'public/projects-originals');
const OUTPUT_WEBP_DIR = path.join(__dirname, 'public/projects-webp');
const PORT = 3333;

// ── Variance analysis ──────────────────────────────────────────────────────────
async function analyzeRows(imgPath) {
  const { data, info } = await sharp(imgPath)
    .resize({ width: 320 })          // downsample for speed
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const variances = [];

  for (let y = 0; y < height; y++) {
    let sum = 0, sumSq = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const luma = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      sum += luma;
      sumSq += luma * luma;
    }
    const mean = sum / width;
    variances.push(sumSq / width - mean * mean);
  }

  return { variances, height, scaleFactor: info.height / height };
}

function suggestCuts(variances, originalHeight, scaleFactor, targetSliceH = 1080) {
  const scaledTarget = Math.round(targetSliceH / scaleFactor);
  const searchWindow = Math.round(scaledTarget * 0.25); // ±25%
  const cuts = [];
  let searchFrom = scaledTarget - searchWindow;

  while (searchFrom < variances.length) {
    const searchTo = Math.min(searchFrom + searchWindow * 2, variances.length - 1);
    let minVar = Infinity, minIdx = searchFrom;
    for (let i = searchFrom; i <= searchTo; i++) {
      if (variances[i] < minVar) { minVar = variances[i]; minIdx = i; }
    }
    const cutPx = Math.round(minIdx * scaleFactor);
    if (cutPx < originalHeight - 50) cuts.push(cutPx);
    searchFrom = minIdx + scaledTarget - searchWindow;
  }

  return cuts;
}

// ── Collect images ─────────────────────────────────────────────────────────────
function collectImages(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const project of fs.readdirSync(dir)) {
    const projectDir = path.join(dir, project);
    if (!fs.statSync(projectDir).isDirectory()) continue;
    for (const file of fs.readdirSync(projectDir)) {
      if (/\.(jpe?g|png|webp)$/i.test(file)) {
        results.push({ project, file, fullPath: path.join(projectDir, file) });
      }
    }
  }
  return results;
}

// ── Slice & export ─────────────────────────────────────────────────────────────
async function exportSlices(srcPath, cuts, project, baseName, keepIndices) {
  const image = sharp(srcPath).rotate();
  const meta = await image.metadata();
  const { width, height } = meta;

  const allCuts = [0, ...cuts, height];
  const outDir = path.join(OUTPUT_WEBP_DIR, project);
  fs.mkdirSync(outDir, { recursive: true });

  const saved = [];
  for (let i = 0; i < allCuts.length - 1; i++) {
    if (!keepIndices.includes(i)) continue;
    const top = allCuts[i];
    const sliceH = allCuts[i + 1] - top;
    const sliceName = allCuts.length - 1 === 1
      ? `${baseName}.webp`
      : `${baseName}-${String(i + 1).padStart(2, '0')}.webp`;
    const outPath = path.join(outDir, sliceName);
    await sharp(srcPath).rotate().extract({ left: 0, top, width, height: sliceH })
      .webp({ quality: 90 }).toFile(outPath);
    saved.push(sliceName);
  }
  return saved;
}

// ── HTTP server ────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Serve image as base64
  if (url.pathname === '/api/image') {
    const project = url.searchParams.get('project');
    const file = url.searchParams.get('file');
    const fullPath = path.join(PROJECTS_DIR, project, file);
    if (!fs.existsSync(fullPath)) { res.writeHead(404); res.end(); return; }
    const buf = fs.readFileSync(fullPath);
    const ext = path.extname(file).slice(1).replace('jpg', 'jpeg');
    res.writeHead(200, { 'Content-Type': `image/${ext}`, 'Cache-Control': 'max-age=3600' });
    res.end(buf);
    return;
  }

  // List images
  if (url.pathname === '/api/images') {
    const images = collectImages(PROJECTS_DIR);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(images.map(i => ({ project: i.project, file: i.file }))));
    return;
  }

  // Analyze
  if (url.pathname === '/api/analyze') {
    const project = url.searchParams.get('project');
    const file = url.searchParams.get('file');
    const fullPath = path.join(PROJECTS_DIR, project, file);
    try {
      const { variances, height, scaleFactor } = await analyzeRows(fullPath);
      const meta = await sharp(fullPath).rotate().metadata();
      const cuts = suggestCuts(variances, meta.height, scaleFactor);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ cuts, width: meta.width, height: meta.height }));
    } catch (e) {
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Export slices
  if (url.pathname === '/api/export' && req.method === 'POST') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', async () => {
      try {
        const { project, file, cuts, keepIndices } = JSON.parse(body);
        const fullPath = path.join(PROJECTS_DIR, project, file);
        const baseName = path.parse(file).name;
        const saved = await exportSlices(fullPath, cuts, project, baseName, keepIndices);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ saved }));
      } catch (e) {
        res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Serve HTML
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
    return;
  }

  res.writeHead(404); res.end();
});

server.listen(PORT, () => {
  console.log(`\n🔪 Slice Tool → http://localhost:${PORT}\n`);
});

// ── HTML UI ────────────────────────────────────────────────────────────────────
const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>slice tool</title>
<style>
  :root {
    --bg: #0a0a0a;
    --surface: #141414;
    --border: #2a2a2a;
    --accent: #7f5af0;
    --accent2: violet;
    --text: #e0e0e0;
    --muted: #555;
    --danger: #ff4d4d;
    --green: #2cb67d;
    --font: 'Courier New', monospace;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: var(--font); font-size: 12px; display: flex; height: 100vh; overflow: hidden; }

  /* Sidebar */
  #sidebar {
    width: 260px; min-width: 260px; background: var(--surface);
    border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden;
  }
  #sidebar h1 { padding: 16px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent2); border-bottom: 1px solid var(--border); }
  #project-list { overflow-y: auto; flex: 1; }
  .project-group { border-bottom: 1px solid var(--border); }
  .project-label {
    padding: 8px 16px; font-size: 10px; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted); cursor: default;
    background: #0f0f0f;
  }
  .img-item {
    padding: 7px 16px 7px 24px; cursor: pointer; color: var(--text);
    transition: background 0.1s; display: flex; align-items: center; gap: 8px;
  }
  .img-item:hover { background: #1e1e1e; }
  .img-item.active { background: #1a1530; color: var(--accent2); }
  .img-item .status { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); flex-shrink: 0; }
  .img-item.done .status { background: var(--green); }
  .img-item .fname { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* Main */
  #main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  #toolbar {
    padding: 10px 16px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  #toolbar span { color: var(--muted); font-size: 11px; }
  button {
    background: #1e1e1e; border: 1px solid var(--border); color: var(--text);
    font-family: var(--font); font-size: 11px; padding: 5px 12px; cursor: pointer;
    transition: border-color 0.1s, color 0.1s;
  }
  button:hover { border-color: var(--accent); color: var(--accent2); }
  button.primary { background: var(--accent); border-color: var(--accent); color: white; }
  button.primary:hover { background: #6b46e0; }
  button.danger { border-color: var(--danger); color: var(--danger); }
  #info { color: var(--muted); font-size: 11px; margin-left: auto; }

  /* Canvas area */
  #canvas-wrap {
    flex: 1; overflow: auto; position: relative; background: #050505;
    display: flex; justify-content: center; padding: 20px;
  }
  #canvas-container { position: relative; display: inline-block; }
  #img-canvas { display: block; max-width: 100%; }

  /* Cut lines */
  .cut-line {
    position: absolute; left: 0; right: 0; height: 2px;
    background: var(--accent); cursor: ns-resize; z-index: 10;
    transition: background 0.1s;
  }
  .cut-line:hover { background: var(--accent2); }
  .cut-line::before {
    content: attr(data-label);
    position: absolute; right: 6px; top: -18px;
    font-size: 10px; color: var(--accent2); font-family: var(--font);
    background: rgba(0,0,0,0.7); padding: 1px 4px;
    pointer-events: none;
  }
  .cut-line .del-btn {
    position: absolute; right: 6px; bottom: 4px;
    background: var(--danger); border: none; color: white;
    font-size: 9px; padding: 1px 4px; cursor: pointer; display: none;
  }
  .cut-line:hover .del-btn { display: block; }

  /* Slice overlays */
  .slice-overlay {
    position: absolute; left: 0; right: 0;
    z-index: 5; pointer-events: none;
    transition: background 0.15s;
  }
  .slice-overlay.excluded {
    background: rgba(255,77,77,0.18);
    pointer-events: auto; cursor: pointer;
  }
  .slice-overlay.included {
    background: rgba(44,182,125,0.06);
    pointer-events: auto; cursor: pointer;
  }
  .slice-overlay .slice-label {
    position: absolute; left: 8px; top: 4px;
    font-size: 10px; font-family: var(--font);
    padding: 1px 5px; border-radius: 2px;
  }
  .slice-overlay.excluded .slice-label { background: var(--danger); color: white; }
  .slice-overlay.included .slice-label { background: var(--green); color: #000; }

  /* Status bar */
  #statusbar {
    padding: 6px 16px; background: var(--surface); border-top: 1px solid var(--border);
    font-size: 10px; color: var(--muted); display: flex; gap: 16px;
  }
  #statusbar b { color: var(--text); }

  /* Empty state */
  #empty { display: flex; align-items: center; justify-content: center; flex: 1; color: var(--muted); font-size: 13px; letter-spacing: 0.05em; }

  /* Toast */
  #toast {
    position: fixed; bottom: 40px; right: 24px; background: var(--green); color: #000;
    padding: 8px 16px; font-family: var(--font); font-size: 12px;
    opacity: 0; transition: opacity 0.3s; pointer-events: none; z-index: 999;
  }
  #toast.show { opacity: 1; }
</style>
</head>
<body>

<div id="sidebar">
  <h1>✂ slice tool</h1>
  <div id="project-list"><div style="padding:16px;color:var(--muted)">loading...</div></div>
</div>

<div id="main">
  <div id="empty">← select an image to begin</div>
  <div id="editor" style="display:none; flex:1; flex-direction:column; overflow:hidden;">
    <div id="toolbar">
      <button onclick="analyzeImage()">⚡ auto-detect cuts</button>
      <button onclick="addCutAtCenter()">+ add cut</button>
      <button onclick="toggleAllSlices()">◐ toggle all</button>
      <button class="primary" onclick="exportSlices()">↓ export selected</button>
      <span id="info"></span>
    </div>
    <div id="canvas-wrap">
      <div id="canvas-container">
        <canvas id="img-canvas"></canvas>
      </div>
    </div>
    <div id="statusbar">
      <span>cuts: <b id="sb-cuts">0</b></span>
      <span>slices: <b id="sb-slices">0</b></span>
      <span>selected: <b id="sb-selected">0</b></span>
      <span id="sb-dims"></span>
    </div>
  </div>
</div>

<div id="toast"></div>

<script>
let images = [];
let current = null; // { project, file }
let imgEl = null;
let naturalW = 0, naturalH = 0;
let displayScale = 1;

let cuts = [];       // array of Y positions in natural px
let excluded = new Set(); // slice indices that are excluded

// ── Init ───────────────────────────────────────────────────────────────────────
async function init() {
  const res = await fetch('/api/images');
  images = await res.json();

  const byProject = {};
  for (const img of images) {
    if (!byProject[img.project]) byProject[img.project] = [];
    byProject[img.project].push(img);
  }

  const list = document.getElementById('project-list');
  list.innerHTML = '';
  for (const [project, imgs] of Object.entries(byProject)) {
    const group = document.createElement('div');
    group.className = 'project-group';
    group.innerHTML = '<div class="project-label">' + project + '</div>';
    for (const img of imgs) {
      const item = document.createElement('div');
      item.className = 'img-item';
      item.id = 'item-' + project + '-' + img.file;
      item.innerHTML = '<div class="status"></div><div class="fname">' + img.file + '</div>';
      item.onclick = () => loadImage(img.project, img.file);
      group.appendChild(item);
    }
    list.appendChild(group);
  }
}

// ── Load image ─────────────────────────────────────────────────────────────────
async function loadImage(project, file) {
  current = { project, file };
  cuts = [];
  excluded = new Set();

  document.querySelectorAll('.img-item').forEach(el => el.classList.remove('active'));
  const item = document.getElementById('item-' + project + '-' + file);
  if (item) item.classList.add('active');

  document.getElementById('empty').style.display = 'none';
  const editor = document.getElementById('editor');
  editor.style.display = 'flex';

  document.getElementById('info').textContent = project + ' / ' + file;

  const canvas = document.getElementById('img-canvas');
  const ctx = canvas.getContext('2d');

  imgEl = new Image();
  imgEl.onload = () => {
    naturalW = imgEl.naturalWidth;
    naturalH = imgEl.naturalHeight;
    const wrap = document.getElementById('canvas-wrap');
    const maxW = wrap.clientWidth - 40;
    displayScale = Math.min(1, maxW / naturalW);
    canvas.width = Math.round(naturalW * displayScale);
    canvas.height = Math.round(naturalH * displayScale);
    ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
    renderOverlays();
    updateStatus();
  };
  imgEl.src = '/api/image?project=' + encodeURIComponent(project) + '&file=' + encodeURIComponent(file);
}

// ── Analyze ────────────────────────────────────────────────────────────────────
async function analyzeImage() {
  if (!current) return;
  document.getElementById('info').textContent = 'analyzing...';
  const res = await fetch('/api/analyze?project=' + encodeURIComponent(current.project) + '&file=' + encodeURIComponent(current.file));
  const data = await res.json();
  cuts = data.cuts;
  excluded = new Set();
  renderOverlays();
  updateStatus();
  document.getElementById('info').textContent = current.project + ' / ' + current.file;
}

// ── Render overlays ────────────────────────────────────────────────────────────
function renderOverlays() {
  const container = document.getElementById('canvas-container');
  container.querySelectorAll('.cut-line, .slice-overlay').forEach(el => el.remove());

  const sortedCuts = [...cuts].sort((a, b) => a - b);
  const allBoundaries = [0, ...sortedCuts, naturalH];

  // Slice overlays
  for (let i = 0; i < allBoundaries.length - 1; i++) {
    const topNat = allBoundaries[i];
    const botNat = allBoundaries[i + 1];
    const topPx = Math.round(topNat * displayScale);
    const heightPx = Math.round((botNat - topNat) * displayScale);

    const el = document.createElement('div');
    el.className = 'slice-overlay ' + (excluded.has(i) ? 'excluded' : 'included');
    el.style.top = topPx + 'px';
    el.style.height = heightPx + 'px';
    el.dataset.index = i;
    el.innerHTML = '<div class="slice-label">' + (excluded.has(i) ? '✕ skip' : '✓ keep') + ' #' + (i + 1) + '</div>';
    el.onclick = () => toggleSlice(i);
    container.appendChild(el);
  }

  // Cut lines
  for (let i = 0; i < sortedCuts.length; i++) {
    const yNat = sortedCuts[i];
    const yPx = Math.round(yNat * displayScale);
    const el = document.createElement('div');
    el.className = 'cut-line';
    el.style.top = yPx + 'px';
    el.dataset.nat = yNat;
    el.dataset.label = 'cut ' + (i + 1) + ' — ' + yNat + 'px';

    const delBtn = document.createElement('button');
    delBtn.className = 'del-btn';
    delBtn.textContent = '✕ remove';
    delBtn.onclick = (e) => { e.stopPropagation(); removeCut(yNat); };
    el.appendChild(delBtn);

    makeDraggable(el, yNat);
    container.appendChild(el);
  }

  updateStatus();
}

// ── Draggable cut lines ────────────────────────────────────────────────────────
function makeDraggable(el, natY) {
  let startY, startNat;
  el.addEventListener('mousedown', e => {
    if (e.target.classList.contains('del-btn')) return;
    e.preventDefault();
    startY = e.clientY;
    startNat = natY;
    const onMove = (e) => {
      const delta = e.clientY - startY;
      const newNat = Math.max(1, Math.min(naturalH - 1, Math.round(startNat + delta / displayScale)));
      const idx = cuts.indexOf(natY);
      if (idx !== -1) { cuts[idx] = newNat; natY = newNat; startY = e.clientY; startNat = newNat; }
      renderOverlays();
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

// ── Slice actions ──────────────────────────────────────────────────────────────
function toggleSlice(i) {
  if (excluded.has(i)) excluded.delete(i);
  else excluded.add(i);
  renderOverlays();
  updateStatus();
}

function toggleAllSlices() {
  const sortedCuts = [...cuts].sort((a, b) => a - b);
  const total = sortedCuts.length + 1;
  const allExcluded = excluded.size === total;
  excluded = allExcluded ? new Set() : new Set([...Array(total).keys()]);
  renderOverlays();
  updateStatus();
}

function removeCut(natY) {
  cuts = cuts.filter(c => c !== natY);
  excluded = new Set();
  renderOverlays();
  updateStatus();
}

function addCutAtCenter() {
  const sortedCuts = [...cuts].sort((a, b) => a - b);
  const allBoundaries = [0, ...sortedCuts, naturalH];
  // Find largest slice and add cut in its middle
  let maxH = 0, maxI = 0;
  for (let i = 0; i < allBoundaries.length - 1; i++) {
    const h = allBoundaries[i + 1] - allBoundaries[i];
    if (h > maxH) { maxH = h; maxI = i; }
  }
  const midY = Math.round((allBoundaries[maxI] + allBoundaries[maxI + 1]) / 2);
  cuts.push(midY);
  excluded = new Set();
  renderOverlays();
  updateStatus();
}

// ── Status ─────────────────────────────────────────────────────────────────────
function updateStatus() {
  const total = cuts.length + 1;
  const selected = total - excluded.size;
  document.getElementById('sb-cuts').textContent = cuts.length;
  document.getElementById('sb-slices').textContent = total;
  document.getElementById('sb-selected').textContent = selected;
  document.getElementById('sb-dims').textContent = naturalW + ' × ' + naturalH + 'px';
}

// ── Export ─────────────────────────────────────────────────────────────────────
async function exportSlices() {
  if (!current) return;
  const total = cuts.length + 1;
  const keepIndices = [...Array(total).keys()].filter(i => !excluded.has(i));
  if (keepIndices.length === 0) { toast('no slices selected'); return; }

  const res = await fetch('/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project: current.project, file: current.file, cuts, keepIndices })
  });
  const data = await res.json();
  if (data.saved) {
    toast('saved ' + data.saved.length + ' slices → ' + data.saved.join(', '));
    const item = document.getElementById('item-' + current.project + '-' + current.file);
    if (item) item.classList.add('done');
  } else {
    toast('error: ' + data.error);
  }
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

init();
</script>
</body>
</html>`;
