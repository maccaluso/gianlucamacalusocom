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

  const links = [
    { href: '/', label: 'home' },
    { href: '/projects', label: 'projects' },
    { href: '/bio', label: 'bio' },
    { href: '/contacts', label: 'contacts' }
  ]

  return <div className={styles.menu}>
    <a className={styles.menuTrigger} onClick={() => setShowMenu(true)}>menu</a>

    {showMenu && <div className={styles.menuLinks}>
      <a className={styles.closeMenu} onClick={() => setShowMenu(false)}>X</a>

      <ul>
        {
          links.map(link => {
            const isActive = link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href)

            return <li key={link.href}>
              <Link
                href={link.href}
                data-text={link.label}
                className={isActive ? styles.activeLink : undefined}
              >
                {link.label}
              </Link>
            </li>
          })
        }
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