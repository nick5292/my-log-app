// app/layout.tsx

import './globals.css'

export const metadata = {
  title: '記録アプリ',
  description: 'NickのSupabase連携アプリ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}