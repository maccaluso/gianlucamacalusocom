'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from './footer.module.css'

const FONT_SCALES = [1, 1.15, 1.3]
const FONT_SCALE_KEY = 'font-scale-index'

export default function Header () {
  const [scaleIndex, setScaleIndex] = useState(0)

  useEffect(() => {
    const saved = Number(localStorage.getItem(FONT_SCALE_KEY))
    const index = FONT_SCALES[saved] ? saved : 0
    setScaleIndex(index)
    document.documentElement.style.setProperty('--font-scale', String(FONT_SCALES[index]))
  }, [])

  const increaseFontSize = () => {
    const nextIndex = (scaleIndex + 1) % FONT_SCALES.length
    setScaleIndex(nextIndex)
    document.documentElement.style.setProperty('--font-scale', String(FONT_SCALES[nextIndex]))
    localStorage.setItem(FONT_SCALE_KEY, String(nextIndex))
  }

  return <footer className={styles.footer}>
    <div className={styles.footerLine}>
      © 2025/2026 G<span className={styles.nameAbbreviation}>.</span><span className={styles.extendedName}>ianluca</span>&nbsp;
      Macaluso - PI IT02861321202
    </div>

    <div className={styles.footerLine}>
      <span>&nbsp;- CF MCLGLC76A17L219M -&nbsp;</span>
      <a href="mailto:maccaluso@gmail.com" className={styles.textMailLink}>maccaluso@gmail.com</a>

      <a href="mailto:maccaluso@gmail.com" className={styles.iconMailLink}>
        <Image src={'/mail.png'} width={11} height={11} alt='Mail link' />
      </a>

      &nbsp;-&nbsp;
      <a className={styles.fontSizeLink} onClick={increaseFontSize}>A+</a>
    </div>
  </footer>
}