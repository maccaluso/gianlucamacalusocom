import Link from 'next/link'

export default function Bio () {
  return (
    <div className="pageContainer">
      <p>
        My career and research begins with the world of printing and desktop publishing then, after an
        experience in the fields of art direction for advertising, lands to the current
        interest in UI/UX design and interfaces. Especially in the web but also in the fields of interaction design, creative coding, physical
        computing and exhibit design.
      </p>
      <br />
      <p>
        My design approach focuses on simplifing the relation between the users and the digital product,
        trying to mix together creative solutions and a strong visual impact that are at the same time as much as
        possible easy to use, scalable and easy to maintain.
      </p>
      <br />
      <p>
        From an aesthetic point of view I&apos;m fascinated by the expressive potential of generative
        algorithms and the relationship between viewers, community and creativity/research.
      </p>
      <br />
      <p>
        If you&apos;re interested you can download my CV <Link href="/CV-Gianluca-Macaluso.pdf" target="_blank" rel="noopener noreferrer" locale={false}>here</Link>
      </p>
    </div>
  )
}