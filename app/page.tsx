import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'



export default function Home() {
  return (
    <main className="flex-1 container max-w-screen-sm mx-auto px-1 py-5">
      <h1>HOME</h1>
    </main>
  )
}
