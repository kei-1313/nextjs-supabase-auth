// ローディング データを取得中に自動的にローディング画面がでる
const Loading = () => {
  return (
    <div className="flex justify-center">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
    </div>
  )
}

export default Loading