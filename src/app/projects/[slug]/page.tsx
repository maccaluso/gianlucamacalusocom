import Image from 'next/image'
import Link from 'next/link'
import styles from './project.module.css'

import { projects } from '../data'

export default async function Project ({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const project = projects.find(p => p.slug === slug)

  return (
    <div className={styles.projectContainer}>
      <div className={styles.projectData}>
        <h1>{project?.name} ({project?.year})</h1>
        <p>{project?.description}</p>

        <div className={styles.projectSkills}>
          Skills:&nbsp;
          {
            project?.skills.map((skill, i) =>
              <span className={styles.projectSkill} key={i}>{skill}</span>
            )
          }
        </div>

        <div className={styles.projectMates}>
          Mates:&nbsp;
          {
            project?.mates.map((mate, i) =>
              <span className={styles.projectMate} key={i}>{mate.name + '(' + mate.role + ')'}</span>
            )
          }
        </div>
      </div>

      {
        project?.images.map((image, i) => 
          // <>
            <div className={styles.projectImageContainer} key={'image' + i}>
              <Image
                key={i}
                src={'/projects-webp/' + project.slug + '/' + image.fileName}
                alt={project.name + ' - ' + image.alt}
                width={0}
                height={0}
                unoptimized
                style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
              />

              { image.caption && <span>{image.caption}</span> }
              { !image.caption && <span>{project.name + ' - ' + image.alt}</span> }
            </div>
          // </>
        )
      }

      <Link href="/projects" className={styles.backButton}>
        <i className={styles.backIcon} />
        back
      </Link>
    </div>
  )
}