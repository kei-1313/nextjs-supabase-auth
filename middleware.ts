

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

//NextRequestの型とDatabaseの型をimportしている
import type { NextRequest } from 'next/server'
import type  {Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  //getSession関数により、sessionの情報を取得でき、ログインの監視ができる
  await supabase.auth.getSession()
  return res
}
