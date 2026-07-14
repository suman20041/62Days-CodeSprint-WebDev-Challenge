import { useEffect, useState } from 'react'
import { callMock } from '../api'

export default function RequestTester({ seed }) {
  const [method, setMethod] = useState(seed?.method || 'GET')
  const [path, setPath] = useState(seed?.path || '/users')
  const [body, setBody] = useState('{}')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!seed) return
    setMethod(seed.method)
    setPath(seed.path)
    setResult(null)
    setError('')
  }, [seed])

  const run = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await callMock({ method, path, body })
      setResult(res)
    } catch (err) {
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm animate-fade-up">
      <h2 className="font-display text-xl font-semibold">Live request tester</h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Hit your mock endpoints and inspect status, delay, and JSON body.
      </p>

      <form onSubmit={run} className="mt-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-[7rem_1fr]">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="rounded-xl border border-slate-200 bg-[var(--color-surface)] px-3 py-2.5 font-mono text-sm outline-none"
          >
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="rounded-xl border border-slate-200 bg-[var(--color-surface)] px-3 py-2.5 font-mono text-sm outline-none focus:border-[var(--color-signal)]"
            placeholder="/users"
          />
        </div>

        {method !== 'GET' && method !== 'DELETE' ? (
          <textarea
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-[#111827] p-3 font-mono text-sm text-sky-100 outline-none"
            placeholder="Request body JSON"
            spellCheck={false}
          />
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[var(--color-signal)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Send request'}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      {result ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-[var(--color-surface)] p-4">
          <div className="flex flex-wrap gap-3 text-sm">
            <span
              className={`font-mono font-semibold ${
                result.ok ? 'text-teal-700' : 'text-rose-600'
              }`}
            >
              {result.status}
            </span>
            <span className="text-[var(--color-muted)]">{result.elapsed} ms</span>
            <span className="break-all font-mono text-xs text-[var(--color-navy)]">
              {result.url}
            </span>
          </div>
          <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-[#111827] p-3 font-mono text-xs text-emerald-100">
            {typeof result.body === 'string'
              ? result.body
              : JSON.stringify(result.body, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  )
}
