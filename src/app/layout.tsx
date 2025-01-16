import type { Metadata } from 'next'
import './globals.css'

import Visualization from './components/Visualization'
import Header from './components/Header'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'gianlucamacaluso.com',
  description: 'Bio and Portfolio of Gianluca Macaluso - Frontend web dev, UI/UX Designer and Creative Coder'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Visualization />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}