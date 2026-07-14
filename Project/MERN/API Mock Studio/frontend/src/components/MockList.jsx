import { API_URL } from '../api'

const methodColor = {
  GET: 'bg-teal-100 text-teal-800',
  POST: 'bg-sky-100 text-sky-800',
  PUT: 'bg-amber-100 text-amber-800',
  PATCH: 'bg-violet-100 text-violet-800',
  DELETE: 'bg-rose-100 text-rose-800',
}

export default function MockList({ mocks, selectedId, onSelect, onEdit, onDelete, onTest }) {
  if (!mocks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-5 py-10 text-center text-sm text-[var(--color-muted)]">
        No mocks yet. Create your first endpoint to get started.
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {mocks.map((mock) => (
        <li
          key={mock.id}
          className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
            selectedId === mock.id
              ? 'border-[var(--color-signal)] ring-2 ring-[var(--color-signal)]/20'
              : 'border-black/5'
          }`}
        >
          <button
            type="button"
            onClick={() => onSelect(mock)}
            className="w-full text-left"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                  methodColor[mock.method] || 'bg-slate-100'
                }`}
              >
                {mock.method}
              </span>
              <span className="font-mono text-sm font-medium">{mock.path}</span>
              {!mock.enabled ? (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500">
                  Disabled
                </span>
              ) : null}
            </div>
            <p className="mt-1 truncate text-sm text-[var(--color-muted)]">
              {mock.name} · {mock.statusCode} · {mock.delayMs}ms
            </p>
            <p className="mt-1 font-mono text-[11px] text-[var(--color-signal)]">
              {API_URL}/mock{mock.path}
            </p>
          </button>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onTest(mock)}
              className="rounded-lg bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-navy)]"
            >
              Test
            </button>
            <button
              type="button"
              onClick={() => onEdit(mock)}
              className="rounded-lg bg-[var(--color-surface)] px-2.5 py-1.5 text-xs font-semibold"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(mock)}
              className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
