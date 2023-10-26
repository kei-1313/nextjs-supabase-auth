'use client'

import { useCallback, useState, useEffect } from 'react'
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
  name: z.string().min(2, { message: '2文字以上入力する必要があります。' }),
  introduce: z.string().min(0),
})

const Profile = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [fileMessage, setFileMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('/default.png')
  const { user } = useStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: {
      name: user.name ? user.name : '',
      introduce: user.introduce ? user.introduce : '',
    },
    // 入力値の検証
    resolver: zodResolver(schema),
  })

  //アバターの画像取得
  useEffect(() => {
    if(user && user.avatar_url) {
      setAvatarUrl(user.avatar_url)
    }
  }, [user])

  // 画像アップロード
  const onUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setFileMessage('')

    // ファイルが選択されていない場合
    if (!files || files?.length == 0) {
      setFileMessage('画像をアップロードしてください。')
      return
    }

    const fileSize = files[0]?.size / 1024 / 1024 // size in MB
    const fileType = files[0]?.type // MIME type of the file

    // 画像サイズが2MBを超える場合
    if (fileSize > 2) {
      setFileMessage('画像サイズを2MB以下にする必要があります。')
      return
    }

    // ファイル形式がjpgまたはpngでない場合
    if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
      setFileMessage('画像はjpgまたはpng形式である必要があります。')
      return
    }

    // 画像をセット
    setAvatar(files[0])
  }, [])

  const onSubmit = () => {

  }



	return (
    <div>
      <div className="text-center font-bold text-xl mb-10">プロフィール</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* アバター画像 */}
        <div className="mb-5">
          <div className="flex flex-col text-sm items-center justify-center mb-5">
            <div className="relative w-24 h-24 mb-5">
              <Image src={avatarUrl} className="rounded-full object-cover" alt="avatar" fill />
            </div>
            <input type="file" id="avatar" onChange={onUploadImage} />
            {fileMessage && <div className="text-center text-red-500 my-5">{fileMessage}</div>}
          </div>
        </div>

        {/* 名前 */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">名前</div>
          <input
            type="text"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="名前"
            id="name"
            {...register('name', { required: true })}
            required
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.name?.message}</div>
        </div>

        {/* 自己紹介 */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">自己紹介</div>
          <textarea
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="自己紹介"
            id="introduce"
            {...register('introduce')}
            rows={5}
          />
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
    </div>
	)
}

export default Profile

