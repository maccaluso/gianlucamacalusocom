import Image from 'next/image'
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
          <>
            <div className={styles.projectImageContainer}>
              <Image
                key={i}
                src={'/projects/' + project.slug + '/' + image.fileName}
                alt={project.name + ' - ' + image.alt}
                layout="responsive"
                objectFit="contain"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>

            { image.caption && <span>{image.caption}</span> }
            { !image.caption && <span>{project.name + ' - ' + image.alt}</span> }
          </>
        )
      } 
    </div>
  )
}