import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Campus Connect - Budget-Friendly Inter-Campus Bus System',
  description: 'Connect with friends across college campuses. Budget-friendly bus service connecting UIUC, IU, and Purdue for students.',
  keywords: 'campus bus, student transportation, college travel, UIUC, IU, Purdue, budget travel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
