'use client'

import Image from 'next/image'
import styles from './footer.module.css'

export default function Header () {
  return <footer className={styles.footer}>
    © 2025/2026 G<span className={styles.nameAbbreviation}>.</span><span className={styles.extendedName}>ianluca</span>
    Macaluso - PI IT02861321202 - CF MCLGLC76A17L219M -&nbsp;
    <a href="mailto:maccaluso@gmail.com" className={styles.textMailLink}>maccaluso@gmail.com</a>
    
    <a href="mailto:maccaluso@gmail.com" className={styles.iconMailLink}>
      <Image src={'/mail.png'} width={15} height={15} alt='Mail link' />
    </a>
  </footer>
}