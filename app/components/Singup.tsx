'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Loading from '@/app/loading'
import * as z from 'zod'
import type { Database } from '@/lib/database.types'
type Schema = z.infer<typeof schema>

// 入力データの検証ルールを定義
const schema = z.object({
  email: z.string().email({ message: 'メールアドレスの形式ではありません。' }),
  password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
})

const Signup = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [ loading, setLoading ] = useState(false)
  const [ message, setMessage ] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(schema)
  })

  const onSubmit: SubmitHandler<Schema> = async(data) => {
    setLoading(true)

    try{
      console.log(data);
      
    } catch {

    } finally {
      router.refresh()
    }
  }




  return(
    <div className="max-w-[400px] mx-auto">
      <div className="text-center font-bold text-xl mb-10">サインアップ</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
          <input 
            type="email"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder='メールアドレス'
            {...register('email', { required: true })}
          />
          <div className="my-3 text-sm text-red-500">{errors.email?.message}</div>
        </div>
        <div className='mb-3'>
          <input 
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder='パスワード'
            {...register('password', { required: true })}
          />
          <div className="my-3 text-sm text-red-500">{errors.password?.message}</div>
        </div>
          <div className='mb-5'>
            {loading? (
              <Loading color="bg-pink-500"/>
            ) : (
              <button 
                type='submit'
                className="font-bold bg-pink-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
              >サインアップ</button>
            )}
          </div>
      </form>

      <div className="text-center text-sm mb-5">
        <Link href="/auth/reset-password" className="text-gray-500 font-bold">
          パスワードを忘れた方はこちら
        </Link>
      </div>

      <div className="text-center text-sm">
        <Link href="/auth/login" className="text-gray-500 font-bold">
          ログインする
        </Link>
      </div>
    </div>
  )
}

export default Signup

