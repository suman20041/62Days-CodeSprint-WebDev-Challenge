import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { formatDue, formatTopic } from '../utils/topics'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/cards/dashboard/stats')
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load dashboard.')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="py-20 text-center text-[var(--color-muted)]">Loading dashboard…</p>
  }

  if (error || !data) {
    return (
      <p className="mx-auto max-w-lg px-4 py-16 text-center text-[var(--color-copper)]">
        {error || 'Something went wrong.'}
      </p>
    )
  }

  const { stats, upcoming, byTopic } = data

  const tiles = [
    { label: 'Due today', value: stats.dueToday, hint: 'Ready to review' },
    { label: 'Streak', value: stats.streak, hint: 'Days in a row' },
    { label: 'Mastered', value: stats.mastered, hint: `${stats.masteryRate}% of deck` },
    { label: 'Total cards', value: stats.total, hint: `${stats.reviewedToday} reviewed today` },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-rise flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Progress dashboard</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Track streaks, mastery, and what is coming up next.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/review"
            className="rounded-xl bg-[var(--color-copper)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Start review ({stats.dueToday})
          </Link>
          <Link
            to="/cards/new"
            className="rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold"
          >
            Add card
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile, i) => (
          <div
            key={tile.label}
            className="animate-rise rounded-2xl border border-[var(--color-line)] bg-white p-5"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)]">
              {tile.label}
            </p>
            <p className="font-display mt-2 text-3xl font-bold text-[var(--color-ink)]">
              {tile.value}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{tile.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <h2 className="font-display text-lg font-semibold">By topic</h2>
          {byTopic.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              No cards yet — create your first flashcard.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {byTopic.map((row) => (
                <li
                  key={row.topic}
                  className="flex items-center justify-between rounded-xl bg-[var(--color-paper)] px-3 py-2.5 text-sm"
                >
                  <span className="font-semibold">{formatTopic(row.topic)}</span>
                  <span className="text-[var(--color-muted)]">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <h2 className="font-display text-lg font-semibold">Upcoming (7 days)</h2>
          {upcoming.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              Nothing scheduled beyond today yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {upcoming.map((card) => (
                <li
                  key={card._id}
                  className="rounded-xl border border-[var(--color-line)] px-3 py-2.5"
                >
                  <p className="line-clamp-1 text-sm font-semibold">{card.front}</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {formatTopic(card.topic)} · due {formatDue(card.dueDate)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
