
'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

type Entry = {
  id: string
  tag: string
  value: number
  note: string
  created_at: string
}

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [tag, setTag] = useState('')
  const [value, setValue] = useState<number | ''>('')
  const [note, setNote] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // 🔄 データ読み込み
  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('読み込みエラー:', error.message)
        setErrorMessage('読み込みに失敗しました')
      } else if (data) {
        setEntries(data as Entry[])
      }
    }

    fetchEntries()
  }, [])

  // ➕ データ送信
  const handleSubmit = async () => {
    setErrorMessage('')
    if (!tag || value === '') {
      setErrorMessage('タグと数値は必須です')
      return
    }

    const { data, error } = await supabase.from('entries').insert([
      {
        tag,
        value: Number(value),
        note,
      },
    ])

    if (error) {
      console.error('挿入エラー:', error.message)
      setErrorMessage('保存に失敗しました')
    } else if (data) {
      setTag('')
      setValue('')
      setNote('')
      setEntries((prev) => [...(data as Entry[]), ...prev])
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">📘 記録アプリ v0.2.1（Supabase対応）</h1>

      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="タグ（例: 酒）"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full p-2 bg-zinc-800 text-white border border-zinc-700 rounded"
        />
        <input
          type="number"
          placeholder="数値（例: 16.8）"
          value={value}
          onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full p-2 bg-zinc-800 text-white border border-zinc-700 rounded"
        />
        <textarea
          placeholder="メモ（例: ジムビーム350ml）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 bg-zinc-800 text-white border border-zinc-700 rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded"
        >
          Supabaseに記録する
        </button>

        {errorMessage && (
          <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
        )}
      </div>

      <hr className="border-zinc-700 my-6" />

      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="p-3 bg-zinc-800 rounded border border-zinc-700"
          >
            <div className="text-sm text-zinc-400">
              {new Date(entry.created_at).toLocaleString()}
            </div>
            <div className="text-lg font-semibold">
              {entry.tag}: {entry.value}
            </div>
            {entry.note && (
              <div className="text-zinc-300">{entry.note}</div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
