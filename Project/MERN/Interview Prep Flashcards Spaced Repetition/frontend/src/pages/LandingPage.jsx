import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth()

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <section className="animate-rise grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-forest)]">
            CardForge
          </p>
          <h1 className="font-display max-w-xl text-4xl font-bold leading-tight text-[var(--color-ink)] sm:text-5xl">
            Interview flashcards that remember when to come back.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            Create topic-based cards, rate difficulty as you review, and follow an
            SM-2 spaced repetition schedule — with a dashboard for streaks and mastery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-[var(--color-copper)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Start studying free
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-[var(--color-line)] bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--color-ink)]"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-[0_18px_40px_rgba(20,33,61,0.08)]">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)]">
            Sample card · React
          </p>
          <p className="font-display mt-3 text-xl font-semibold">
            What is the virtual DOM?
          </p>
          <p className="mt-4 rounded-xl bg-[var(--color-forest-soft)] p-4 text-sm leading-relaxed text-[var(--color-ink)]">
            A lightweight in-memory representation of the UI that React diffs to
            apply minimal real DOM updates.
          </p>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {['Again', 'Hard', 'Good', 'Easy'].map((r) => (
              <span
                key={r}
                className="rounded-lg border border-[var(--color-line)] py-2 text-center text-xs font-semibold"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: 'SM-2 schedule',
            body: 'Intervals grow with ease factor so tough cards return sooner.',
          },
          {
            title: 'Due-today queue',
            body: 'Review only what is scheduled — stay consistent without overwhelm.',
          },
          {
            title: 'Optional AI',
            body: 'Generate topic cards or study hints when GEMINI_API_KEY is set.',
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
