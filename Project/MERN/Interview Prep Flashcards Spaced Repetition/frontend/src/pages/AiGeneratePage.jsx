import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { TOPICS, formatTopic } from '../utils/topics'

export default function AiGeneratePage() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('javascript')
  const [count, setCount] = useState(3)
  const [drafts, setDrafts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [enabled, setEnabled] = useState(null)

  useEffect(() => {
    api
      .get('/ai/status')
      .then((res) => setEnabled(Boolean(res.data.enabled)))
      .catch(() => setEnabled(false))
  }, [])

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/ai/generate-cards', { topic, count })
      setDrafts(data.cards || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const saveAll = async () => {
    if (!drafts.length) return
    setSaving(true)
    setError('')
    try {
      for (const card of drafts) {
        await api.post('/cards', card)
      }
      navigate('/cards')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save cards.')
    } finally {
      setSaving(false)
    }
  }

  if (enabled === false) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">AI is optional</h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Add <code className="font-semibold">GEMINI_API_KEY</code> to{' '}
          <code className="font-semibold">backend/.env</code> to enable card generation.
        </p>
        <Link to="/cards/new" className="mt-6 inline-block font-semibold text-[var(--color-copper)]">
          Create a card manually →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">AI card generator</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Generate interview questions for a topic, then save them to your deck.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase text-[var(--color-muted)]">
            Topic
          </span>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2.5 text-sm"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {formatTopic(t)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase text-[var(--color-muted)]">
            Count
          </span>
          <input
            type="number"
            min={1}
            max={8}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2.5 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="rounded-xl bg-[var(--color-forest)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-[var(--color-copper-soft)] px-4 py-3 text-sm text-[var(--color-copper)]">
          {error}
        </p>
      )}

      {drafts.length > 0 && (
        <div className="mt-6 space-y-3">
          {drafts.map((card, i) => (
            <article
              key={i}
              className="rounded-2xl border border-[var(--color-line)] bg-white p-4"
            >
              <p className="text-xs font-bold text-[var(--color-forest)]">
                {formatTopic(card.topic)}
              </p>
              <p className="mt-1 font-semibold">{card.front}</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{card.back}</p>
              {card.hint && (
                <p className="mt-2 text-xs italic text-[var(--color-muted)]">
                  Hint: {card.hint}
                </p>
              )}
            </article>
          ))}
          <button
            type="button"
            onClick={saveAll}
            disabled={saving}
            className="rounded-xl bg-[var(--color-copper)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving…' : `Save ${drafts.length} cards`}
          </button>
        </div>
      )}
    </div>
  )
}
