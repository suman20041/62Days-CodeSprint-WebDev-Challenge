import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive
        ? 'text-[var(--color-coral)]'
        : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)]/80 bg-[rgba(242,245,248,0.9)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5">
        <Link to={isAuthenticated ? '/board' : '/'} className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-ink)] text-xs font-bold text-white transition group-hover:scale-105">
            HB
          </span>
          <div>
            <p className="font-display text-lg font-bold leading-none text-[var(--color-ink)]">
              HireBoard
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--color-muted)]">
              Kanban · Deadlines · Notes
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-3 sm:gap-5">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/board" className={linkClass}>
                Board
              </NavLink>
              <span className="hidden text-sm text-[var(--color-muted)] sm:inline">
                {user?.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-[var(--color-line)] bg-white px-3 py-1.5 text-sm font-semibold transition hover:border-[var(--color-ink)]"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <Link
                to="/register"
                className="rounded-lg bg-[var(--color-coral)] px-3.5 py-1.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
