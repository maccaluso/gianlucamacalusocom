import Link from 'next/link'
import type { CSSProperties } from 'react'
import { projects } from './data'
import styles from './projects.module.css'

export default function Bio () {
  return (
    <div className={styles.projectsContainer}>
      {
        projects.map((p) =>
          <Link className={styles.projectLine} href={'projects/' + p.slug} key={p.id}>
            <div
              className={styles.lineBackground}
              style={{
                backgroundImage: 'url(/projects-webp/' + p.slug + '/' + p.cover + ')',
                ['--cover' as string]: 'url(/projects-webp/' + p.slug + '/' + p.cover + ')'
              } as CSSProperties}
            />
            <div className={styles.projectName} data-text={p.name}>
              <span className={styles.projectYear}>{p.year}&nbsp;-&nbsp;</span>{p.name}
            </div>
            <div className={styles.projectDescription}>
              {p.description}
            </div>
          </Link>
        )
      }
    </div>
  )
}