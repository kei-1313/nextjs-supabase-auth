'use client'
import { useCallback, useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Loading from '@/app/loading'
import * as z from 'zod'
import type { Database } from '@/lib/database.types'
import useStore from '@/store'
type Schema = z.infer<typeof schema>

// 入力データの検証ルールを定義
const schema = z.object({
  newEmail: z.string().email({ message: 'メールアドレスの形式ではありません'}),
  newEmailConfirm: z.string().email({ message: 'メールアドレスの形式ではありません'})
})

const Email = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useStore()
  const [currentUserEmail, setCurrentUserEmail ] = useState('')
  
  useEffect(() => {
    setCurrentUserEmail(user.email)
  },[])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: {
      newEmail: '',
      newEmailConfirm: ''
    },
    // 入力値の検証
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true)
    setMessage('')
    setSuccessMessage('')

    try {
      //どっちかが空の場合
      if(data.newEmail == '' || data.newEmailConfirm == '') {
        setMessage('入力してください')
        return
      }

      //確認のメールアドレスが異なる場合
      if(data.newEmail !== data.newEmailConfirm) {
        setMessage('確認のメールアドレスが違います')
        return
      }

      //現在のメールアドレスと変更後のメールアドレスが同じ時
      if(currentUserEmail == data.newEmail) {
        setMessage('変更後メールアドレスが現在のメールアドレスと同じです')
        return
      }

      const { error: updatedEmailError } = await supabase.auth.updateUser(
        { email: data.newEmail },
        { emailRedirectTo: `${location.origin}/auth/login` }
      )

       // エラーチェック
       if (updatedEmailError) {
        setMessage('エラーが発生しました。' + updatedEmailError.message)
        return
      }
      
      //ログアウト cookieの情報と新しいメールアドレスとの整合性がとれなくなるため
      const { error: logoutError } = await supabase.auth.signOut()
    
       // エラーチェック
       if (logoutError) {
        setMessage('エラーが発生しました。' + logoutError.message)
        return
      }

      setSuccessMessage('確認用のURLを記載したメールを送信しました')
     

    } catch(error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }
  

	return (
		<div>
      <div className="text-center font-bold text-xl mb-10">メールアドレス変更</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">現在のメールアドレス</div>
          <p>{ currentUserEmail }</p>
        </div>

        {/* 新しいメールアドレス */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">新しいメールアドレス</div>
          <input 
            type="email" 
            className='border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500'
            placeholder='新しいメールアドレス'
            {...register('newEmail', { required: true })}
          />
          <p className="my-3 text-sm text-red-500">{errors.newEmail?.message}</p>
        </div>

        {/* 新しいメールアドレス確認 */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">確認</div>
          <input 
            type="email" 
            className='border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500'
            placeholder='確認'
            {...register('newEmailConfirm', { required: true })}
          />
          <div className="my-3 text-sm text-red-500">{errors.newEmailConfirm?.message}</div>
        </div>

        {/* 変更ボタン */}
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            >
              変更
            </button>
          )}
        </div>
      </form>
      {/* メッセージ */}
      {message && <div className="my-5 text-center text-red-500 mb-5">{message}</div>}
      {successMessage && <div className="my-5 text-center text-blue-500 mb-5">{successMessage}</div>}
    </div>
	)
}

export default Email

