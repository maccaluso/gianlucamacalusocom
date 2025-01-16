import Link from 'next/link'

export default function Bio () {
  return (
    <div className="pageContainer">
      <p>
        My career and research begins with the world of printing and desktop publishing and, passing through an
        experience in the world of communication agencies and advertising creativity, it comes to the current
        interest in the computational design and interaction (both in the web than in the field of physical
        computing).
      </p>
      <br />
      <p>
        My design approach tends to simplifications of the interaction between users/viewers and software/hardware,
        looking for creative solutions and a strong visual impact that are at the same time as much as
        possible easy to use, scalable and easy to maintain.
      </p>
      <br />
      <p>
        From an aesthetic point of view instead I&apos;m fascinated by the expressive potential of the generative
        software, analysis of the relationship between viewer, community and creativity/research within the
        paradigms of interaction design and finally open data, WebGL, internet of things.
      </p>
      <br />
      <p>
        If you&apos;re interested you can download my CV <Link href="/CV-Gianluca-Macaluso.pdf" target="_blank" rel="noopener noreferrer" locale={false}>here</Link>
      </p>
    </div>
  )
}