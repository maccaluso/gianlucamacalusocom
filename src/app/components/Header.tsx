'use client'

import styles from './header.module.css'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from "next/navigation";

function Logo () {
    return <div>gianlucamacaluso.com</div>
}

function Menu () {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setShowMenu(false)
  }, [pathname])

  return <div className={styles.menu}>
    <a className={styles.menuTrigger} onClick={() => setShowMenu(true)}>menu</a>

    {showMenu && <div className={styles.menuLinks}>
      <a className={styles.closeMenu} onClick={() => setShowMenu(false)}>X</a>

      <ul>
        <li><Link href="/">home</Link></li>
        <li><Link href="/projects">projects</Link></li>
        <li><Link href="/bio">bio</Link></li>
        <li><Link href="/contacts">contacts</Link></li>
      </ul>
    </div>}
  </div>
}

export default function Header () {
  return <header className={styles.header}>
    <Logo />
    <Menu />
  </header>
}