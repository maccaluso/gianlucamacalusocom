import Link from "next/link"

export default function Contacts () {
  return (
    <div className={'pageContainer contactPage'}>
      <ul>
        <li>
          <Link href="https://www.linkedin.com/in/maccaluso/">Linkedin</Link>
        </li>

        <li>
          <Link href="mailto:maccaluso@gmail.com">Email</Link>
        </li>
      </ul>
    </div>
  )
}