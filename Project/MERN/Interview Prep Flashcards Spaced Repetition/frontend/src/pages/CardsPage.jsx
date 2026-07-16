import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { TOPICS, formatDue, formatTopic } from '../utils/topics'

export default function CardsPage() {
  const [cards, setCards] = useState([])
  const [q, setQ] = useState('')
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [aiEnabled, setAiEnabled] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (q.trim()) params.q = q.trim()
      if (topic) params.topic = topic
      const { data } = await api.get('/cards', { params })
      setCards(data.cards || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cards.')
    } finally {
      setLoading(false)
    }
  }, [q, topic])

  useEffect(() => {
    const t = setTimeout(load, 200)
    return () => clearTimeout(t)
  }, [load])

  useEffect(() => {
    api
      .get('/ai/status')
      .then((res) => setAiEnabled(Boolean(res.data.enabled)))
      .catch(() => setAiEnabled(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this card?')) return
    try {
      await api.delete(`/cards/${id}`)
      setCards((prev) => prev.filter((c) => c._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Your cards</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {cards.length} card{cards.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {aiEnabled && (
            <Link
              to="/cards/ai"
              className="rounded-xl border border-[var(--color-forest)] bg-[var(--color-forest-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--color-forest)]"
            >
              AI generate
            </Link>
          )}
          <Link
            to="/cards/new"
            className="rounded-xl bg-[var(--color-copper)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            + New card
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-4 sm:grid-cols-2">
        <input
          type="search"
          placeholder="Search questions or answers…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-forest)]"
        />
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-forest)]"
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
        <p className="mt-4 rounded-xl bg-[var(--color-copper-soft)] px-4 py-3 text-sm text-[var(--color-copper)]">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-center text-[var(--color-muted)]">Loading…</p>
      ) : cards.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-[var(--color-line)] bg-white/70 px-6 py-14 text-center">
          <p className="font-display text-lg font-semibold">No cards yet</p>
          <Link
            to="/cards/new"
            className="mt-4 inline-flex rounded-xl bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white"
          >
            Create your first card
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {cards.map((card, i) => (
            <article
              key={card._id}
              className="animate-rise rounded-2xl border border-[var(--color-line)] bg-white p-4 sm:p-5"
              style={{ animationDelay: `${Math.min(i, 8) * 0.03}s` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-md bg-[var(--color-forest-soft)] px-2 py-0.5 text-xs font-bold text-[var(--color-forest)]">
                      {formatTopic(card.topic)}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">
                      Due {formatDue(card.dueDate)} · EF {card.easeFactor} ·{' '}
                      {card.interval}d
                    </span>
                  </div>
                  <h2 className="font-semibold text-[var(--color-ink)]">{card.front}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">
                    {card.back}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/cards/${card._id}/edit`}
                    className="rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(card._id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
