import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import Login from '@/app/components/Login'
import type { Database } from '@/lib/database.types'
import Signup from '@/app/components/Singup'

const signupPage = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 認証している場合、リダイレクト
  if(session) {
    redirect('/')
  }

	return <Signup/>
}

export default signupPage

