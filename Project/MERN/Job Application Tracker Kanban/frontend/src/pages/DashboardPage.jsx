import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { STATUS_META, formatDate } from '../utils/status'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/applications/dashboard/stats')
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
      <p className="mx-auto max-w-lg px-4 py-16 text-center text-[var(--color-coral)]">
        {error || 'Something went wrong.'}
      </p>
    )
  }

  const { stats, upcomingDeadlines } = data

  const tiles = [
    { label: 'Total applied', value: stats.total, key: 'total' },
    { label: 'In applied', value: stats.applied, key: 'applied' },
    { label: 'Interviews', value: stats.interview, key: 'interview' },
    { label: 'Offers', value: stats.offer, key: 'offer' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Job search dashboard</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Snapshot of applications, interviews, and upcoming deadlines.
          </p>
        </div>
        <Link
          to="/board"
          className="rounded-xl bg-[var(--color-ink)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Open board
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile, i) => (
          <div
            key={tile.key}
            className="animate-rise rounded-2xl border border-[var(--color-line)] bg-white p-5"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)]">
              {tile.label}
            </p>
            <p className="font-display mt-2 text-3xl font-bold">{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <h2 className="font-display text-lg font-semibold">Pipeline</h2>
          <ul className="mt-4 space-y-2">
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <li
                key={key}
                className="flex items-center justify-between rounded-xl bg-[var(--color-paper)] px-3 py-2.5 text-sm"
              >
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${meta.accent}`}>
                  {meta.label}
                </span>
                <span className="font-semibold">{stats[key] ?? 0}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <h2 className="font-display text-lg font-semibold">Deadlines (7 days)</h2>
          {upcomingDeadlines.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              No deadlines in the next week.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {upcomingDeadlines.map((app) => (
                <li
                  key={app._id}
                  className="rounded-xl border border-[var(--color-line)] px-3 py-2.5"
                >
                  <p className="text-sm font-semibold">
                    {app.role} · {app.company}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {STATUS_META[app.status]?.label} · due {formatDate(app.deadline)}
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
