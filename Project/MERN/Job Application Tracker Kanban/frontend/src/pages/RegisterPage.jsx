import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) return <Navigate to="/board" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(name, email, password)
      navigate('/board')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="animate-rise rounded-2xl border border-[var(--color-line)] bg-white p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Organize your job search on a Kanban board.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
            />
          </label>
          {error && (
            <p className="rounded-lg bg-[var(--color-coral-soft)] px-3 py-2 text-sm text-[var(--color-coral)]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[var(--color-coral)] py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Sign up'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-[var(--color-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--color-coral)]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
