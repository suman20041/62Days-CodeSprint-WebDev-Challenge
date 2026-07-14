import { useEffect, useState } from 'react'

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const STATUS_CODES = [200, 201, 204, 400, 401, 403, 404, 422, 500, 503]

const emptyForm = {
  name: '',
  method: 'GET',
  path: '/users',
  statusCode: 200,
  delayMs: 0,
  responseBody: '{\n  "message": "ok"\n}',
  enabled: true,
}

function toForm(initial) {
  if (!initial) return { ...emptyForm }
  return {
    name: initial.name || '',
    method: initial.method || 'GET',
    path: initial.path || '/users',
    statusCode: initial.statusCode ?? 200,
    delayMs: initial.delayMs ?? 0,
    responseBody: JSON.stringify(initial.responseBody ?? {}, null, 2),
    enabled: initial.enabled !== false,
  }
}

export default function MockForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(() => toForm(initial))

  useEffect(() => {
    setForm(toForm(initial))
  }, [initial])

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      JSON.parse(form.responseBody || '{}')
    } catch {
      alert('Response body must be valid JSON.')
      return
    }
    onSubmit({
      ...form,
      statusCode: Number(form.statusCode),
      delayMs: Number(form.delayMs),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm animate-fade-up"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-xl font-semibold">
          {initial?.id ? 'Edit mock' : 'New mock endpoint'}
        </h2>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[var(--color-muted)]">Name</span>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Users list"
          className="w-full rounded-xl border border-slate-200 bg-[var(--color-surface)] px-3 py-2.5 outline-none focus:border-[var(--color-signal)]"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--color-muted)]">Method</span>
          <select
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-[var(--color-surface)] px-3 py-2.5 outline-none focus:border-[var(--color-signal)]"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--color-muted)]">Path</span>
          <input
            required
            value={form.path}
            onChange={(e) => setForm({ ...form, path: e.target.value })}
            placeholder="/users"
            className="w-full rounded-xl border border-slate-200 bg-[var(--color-surface)] px-3 py-2.5 font-mono text-sm outline-none focus:border-[var(--color-signal)]"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--color-muted)]">
            Status code
          </span>
          <select
            value={form.statusCode}
            onChange={(e) => setForm({ ...form, statusCode: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-[var(--color-surface)] px-3 py-2.5 outline-none focus:border-[var(--color-signal)]"
          >
            {STATUS_CODES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[var(--color-muted)]">
            Delay (ms)
          </span>
          <input
            type="number"
            min="0"
            max="10000"
            value={form.delayMs}
            onChange={(e) => setForm({ ...form, delayMs: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-[var(--color-surface)] px-3 py-2.5 outline-none focus:border-[var(--color-signal)]"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[var(--color-muted)]">
          JSON response body
        </span>
        <textarea
          required
          rows={10}
          value={form.responseBody}
          onChange={(e) => setForm({ ...form, responseBody: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-[#111827] p-3 font-mono text-sm text-emerald-100 outline-none focus:ring-2 focus:ring-[var(--color-signal)]/40"
          spellCheck={false}
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
        />
        Enabled (served at runtime)
      </label>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[var(--color-navy)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#162b47] disabled:opacity-60"
      >
        {saving ? 'Saving…' : initial?.id ? 'Update mock' : 'Create mock'}
      </button>
    </form>
  )
}
