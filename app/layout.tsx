import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SupabaseListener from './components/SupabaseListener'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'nextjs-supabase-auth',
  description: 'nextjs-supabase-auth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <SupabaseListener/>
        <main className="flex-1 container max-w-screen-sm mx-auto px-1 py-5">
          {children}
        </main>
      </body>
    </html>
  )
}
