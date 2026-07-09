'use client'

import * as THREE from 'three'
import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, extend, useFrame, useLoader, ThreeElement } from '@react-three/fiber'
import { Effects } from '@react-three/drei'
import { FilmPass, WaterPass, UnrealBloomPass, LUTPass, LUTCubeLoader } from 'three-stdlib'

extend({ WaterPass, UnrealBloomPass, FilmPass, LUTPass })

declare module '@react-three/fiber' {
  interface ThreeElements {
    waterPass: ThreeElement<typeof WaterPass>
    unrealBloomPass: ThreeElement<typeof UnrealBloomPass>
    filmPass: ThreeElement<typeof FilmPass>
    lUTPass: ThreeElement<typeof LUTPass>
  }
}

import styles from './futuristicHud.module.css'

export default function FuturisticHUD () {
  return <div className={styles.hudContainer}>
    {/* <Canvas>
      <color attach="background" args={['#131313']} />
      <ambientLight intensity={2} />
      <directionalLight castShadow intensity={0.6} position={[0, 0, 10]} />
      
      <OrbitControls makeDefault />

      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial color={'#131313'}/>
      </mesh>
    </Canvas> */}

    <Canvas linear flat legacy dpr={1} camera={{ fov: 100, position: [0, 0, 30] }}>
      <ambientLight intensity={0.01} />
      <pointLight distance={60} intensity={4} color="lightblue" />
      <spotLight intensity={1.5} position={[0, 0, 2000]} penumbra={1} color="red" />

      <mesh>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#00ffff" roughness={0.5} depthTest={false} />
      </mesh>

      <Swarm count={20000} />

      <Postpro />
    </Canvas>

    <HudOverlay />
  </div>
}

// Random glyphs from katakana, cyrillic, greek and technical symbols, for a
// cyberpunk HUD/visor readout feel over the particle field.
const GLYPH_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンабвгдежзиклмнопрстуфхцчшщΑΒΓΔΘΛΞΠΣΦΨΩ0123456789<>/\\|_-+*#░▒▓█≡∆∑'
const HUD_COLORS = ['#0ff', '#f0f', '#ff0']
const HUD_FRAGMENT_COUNT = 14
const HUD_TICK_MS = 80
const HUD_HOLD_TICKS = 20

function randomGlyphString (length: number) {
  let out = ''
  for (let i = 0; i < length; i++) {
    out += GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)]
  }
  return out
}

interface HudFragment {
  id: number
  x: number
  y: number
  color: string
  text: string
  revealCount: number
  holdCount: number
}

function makeHudFragment (id: number): HudFragment {
  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: HUD_COLORS[Math.floor(Math.random() * HUD_COLORS.length)],
    text: randomGlyphString(3 + Math.floor(Math.random() * 6)),
    revealCount: 0,
    holdCount: 0
  }
}

function HudOverlay () {
  const [fragments, setFragments] = useState<HudFragment[]>([])

  useEffect(() => {
    setFragments(Array.from({ length: HUD_FRAGMENT_COUNT }, (_, i) => makeHudFragment(i)))

    const interval = setInterval(() => {
      setFragments(prev => prev.map(fragment => {
        if (fragment.revealCount < fragment.text.length) {
          return { ...fragment, revealCount: fragment.revealCount + 1 }
        }
        if (fragment.holdCount < HUD_HOLD_TICKS) {
          return { ...fragment, holdCount: fragment.holdCount + 1 }
        }
        return makeHudFragment(fragment.id)
      }))
    }, HUD_TICK_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.hudOverlay}>
      {fragments.map(fragment => {
        const isTyping = fragment.revealCount < fragment.text.length
        return (
          <span
            key={fragment.id}
            className={styles.hudGlyph}
            style={{ left: `${fragment.x}%`, top: `${fragment.y}%`, color: fragment.color }}
          >
            {fragment.text.slice(0, fragment.revealCount)}
            {isTyping && <span className={styles.hudCursor}>_</span>}
          </span>
        )
      })}
    </div>
  )
}

function Swarm({ count, dummy = new THREE.Object3D() }: { count: number; dummy?: THREE.Object3D }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const light = useRef<THREE.PointLight>(null)

  // Stands in for the pointer position, since there's no hover/mouse on touch devices.
  // A new random target is picked periodically and eased towards each frame, mimicking
  // the slow drift of a real mouse instead of a real pointer position.
  const fakeMouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    const pickTarget = () => {
      fakeMouse.current.targetX = Math.random() * 2 - 1
      fakeMouse.current.targetY = Math.random() * 2 - 1
    }
    pickTarget()
    const interval = setInterval(pickTarget, 3000)
    return () => clearInterval(interval)
  }, [])

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  useFrame((state) => {
    fakeMouse.current.x += (fakeMouse.current.targetX - fakeMouse.current.x) * 0.01
    fakeMouse.current.y += (fakeMouse.current.targetY - fakeMouse.current.y) * 0.01

    light.current?.position.set((-fakeMouse.current.x * state.viewport.width) / 5, (-fakeMouse.current.y * state.viewport.height) / 5, 0)
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      particle.mx += (fakeMouse.current.x * 1000 - particle.mx) * 0.01
      particle.my += (fakeMouse.current.y * 1000 - 1 - particle.my) * 0.01
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.setScalar(s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      mesh.current?.setMatrixAt(i, dummy.matrix)
    })
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="lightblue">
        <mesh scale={[1, 1, 6]}>
          <dodecahedronGeometry args={[4, 0]} />
        </mesh>
      </pointLight>
      
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#020000" roughness={0.5} />
      </instancedMesh>
    </>
  )
}

function Postpro() {
  const water = useRef<WaterPass>(null)
  // const data = useLoader(LUTCubeLoader, '/cubicle.CUBE')
  useFrame((state) => {
    if (water.current) water.current.time = state.clock.elapsedTime * 4
  })
  return (
    <Effects disableGamma>
      <waterPass ref={water} factor={1} />
      <unrealBloomPass args={[new THREE.Vector2(384, 384), 0.9, 0.65, 0.12]} />
      <filmPass args={[0.2, 0.5, 1500, false]} />
      {/* <lUTPass lut={data.texture} intensity={0.75} /> */}
    </Effects>
  )
}