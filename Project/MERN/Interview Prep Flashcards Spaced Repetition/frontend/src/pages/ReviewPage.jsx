import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { TOPICS, formatTopic } from '../utils/topics'

const RATINGS = [
  { key: 'again', label: 'Again', className: 'border-red-200 bg-red-50 text-red-800' },
  { key: 'hard', label: 'Hard', className: 'border-amber-200 bg-amber-50 text-amber-900' },
  { key: 'good', label: 'Good', className: 'border-[var(--color-forest)] bg-[var(--color-forest-soft)] text-[var(--color-forest)]' },
  { key: 'easy', label: 'Easy', className: 'border-sky-200 bg-sky-50 text-sky-900' },
]

export default function ReviewPage() {
  const { updateStreak } = useAuth()
  const [topic, setTopic] = useState('')
  const [queue, setQueue] = useState([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [doneCount, setDoneCount] = useState(0)

  const loadQueue = async (selectedTopic = topic) => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (selectedTopic) params.topic = selectedTopic
      const { data } = await api.get('/cards/review/due', { params })
      setQueue(data.cards || [])
      setIndex(0)
      setFlipped(false)
      setShowHint(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load review queue.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueue('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const card = queue[index]

  const rate = async (rating) => {
    if (!card || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const { data } = await api.post(`/cards/${card._id}/review`, { rating })
      if (typeof data.streak === 'number') updateStreak(data.streak)
      setDoneCount((n) => n + 1)
      setFlipped(false)
      setShowHint(false)
      const nextQueue = queue.filter((_, i) => i !== index)
      setQueue(nextQueue)
      setIndex((i) => Math.min(i, Math.max(0, nextQueue.length - 1)))
    } catch (err) {
      setError(err.response?.data?.message || 'Review failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="py-20 text-center text-[var(--color-muted)]">Loading due cards…</p>
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Review session</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            SM-2 ratings · {queue.length} remaining · {doneCount} done
          </p>
        </div>
        <select
          value={topic}
          onChange={(e) => {
            const next = e.target.value
            setTopic(next)
            loadQueue(next)
          }}
          className="rounded-xl border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
        >
          <option value="">All topics</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {formatTopic(t)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-[var(--color-copper-soft)] px-4 py-3 text-sm text-[var(--color-copper)]">
          {error}
        </p>
      )}

      {!card ? (
        <div className="animate-rise rounded-2xl border border-[var(--color-line)] bg-white px-6 py-14 text-center">
          <p className="font-display text-2xl font-bold">All caught up</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            No cards due right now. Check the dashboard for upcoming reviews.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-xl bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/cards/new"
              className="rounded-xl border border-[var(--color-line)] px-4 py-2 text-sm font-semibold"
            >
              Add cards
            </Link>
          </div>
        </div>
      ) : (
        <div className="animate-rise">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white p-6 text-left shadow-[0_12px_30px_rgba(20,33,61,0.06)] transition hover:border-[var(--color-forest)] sm:p-8"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-md bg-[var(--color-forest-soft)] px-2 py-0.5 text-xs font-bold text-[var(--color-forest)]">
                {formatTopic(card.topic)}
              </span>
              <span className="text-xs text-[var(--color-muted)]">
                {flipped ? 'Answer' : 'Question'} · click to flip
              </span>
            </div>

            {!flipped ? (
              <p className="font-display text-2xl font-semibold leading-snug">
                {card.front}
              </p>
            ) : (
              <div className="animate-flip">
                <p className="text-base leading-relaxed whitespace-pre-wrap">{card.back}</p>
              </div>
            )}
          </button>

          {card.hint && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowHint((s) => !s)}
                className="text-sm font-semibold text-[var(--color-copper)]"
              >
                {showHint ? 'Hide hint' : 'Show hint'}
              </button>
              {showHint && (
                <p className="mt-2 rounded-xl bg-[var(--color-copper-soft)] px-4 py-3 text-sm text-[var(--color-ink)]">
                  {card.hint}
                </p>
              )}
            </div>
          )}

          {flipped && (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {RATINGS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  disabled={submitting}
                  onClick={() => rate(r.key)}
                  className={`rounded-xl border px-3 py-3 text-sm font-bold transition disabled:opacity-50 ${r.className}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {!flipped && (
            <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
              Flip the card, then rate how well you recalled it.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
