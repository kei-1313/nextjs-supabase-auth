'use client'

// エラー画面 サーバコンポーネントでエラーが発生したときにエラーが出るようになる
const Error = () => {
  return (
    <div>
      <div className="text-center text-5xl font-bold mb-3">500</div>
      <div className="text-center text-xl font-bold">Server Error</div>
    </div>
  )
}

export default Error