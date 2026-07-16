import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth()

  if (!loading && isAuthenticated) return <Navigate to="/board" replace />

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <section className="animate-rise grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-steel)]">
            HireBoard
          </p>
          <h1 className="font-display max-w-xl text-4xl font-bold leading-tight text-[var(--color-ink)] sm:text-5xl">
            Track every application on one Kanban board.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            Move cards across Applied, Interview, Offer, and Rejected. Add notes,
            deadlines, and filters so your job search stays organized.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Start tracking free
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-[var(--color-line)] bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--color-ink)]"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {['Applied', 'Interview', 'Offer', 'Rejected'].map((col, i) => (
            <div
              key={col}
              className="animate-rise rounded-2xl border border-[var(--color-line)] bg-white p-4 shadow-[0_12px_30px_rgba(12,35,64,0.06)]"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)]">
                {col}
              </p>
              <div className="mt-3 space-y-2">
                <div className="h-10 rounded-lg bg-[var(--color-paper)]" />
                <div className="h-10 rounded-lg bg-[var(--color-paper)]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: 'Drag or click to move',
            body: 'Update status instantly as interviews progress.',
          },
          {
            title: 'Deadlines & notes',
            body: 'Never miss a follow-up — keep context on every card.',
          },
          {
            title: 'Search & filter',
            body: 'Find applications by company, role, status, or date.',
          },
        ].map((item, i) => (
          <div
            key={item.title}
            className="animate-rise rounded-2xl border border-[var(--color-line)] bg-white/85 p-5"
            style={{ animationDelay: `${0.08 * (i + 1)}s` }}
          >
            <h2 className="font-display text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              {item.body}
            </p>
          </div>
        ))}
      </section>
    </div>
  )
}
