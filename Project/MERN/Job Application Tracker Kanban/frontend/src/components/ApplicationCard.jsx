import { Link } from 'react-router-dom'
import { STATUS_META, formatDate, isOverdue } from '../utils/status'

export default function ApplicationCard({
  app,
  onDragStart,
  onMove,
  onDelete,
}) {
  const overdue = isOverdue(app.deadline)

  return (
    <article
      draggable
      onDragStart={(e) => onDragStart?.(e, app)}
      className="cursor-grab rounded-xl border border-[var(--color-line)] bg-white p-3 shadow-[0_4px_14px_rgba(12,35,64,0.04)] transition hover:-translate-y-0.5 hover:border-[var(--color-steel)] active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[var(--color-ink)]">{app.role}</h3>
          <p className="mt-0.5 truncate text-sm text-[var(--color-muted)]">{app.company}</p>
        </div>
        <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${STATUS_META[app.status]?.accent}`}>
          {STATUS_META[app.status]?.label}
        </span>
      </div>

      {(app.location || app.salary) && (
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          {[app.location, app.salary].filter(Boolean).join(' · ')}
        </p>
      )}

      {app.deadline && (
        <p
          className={`mt-2 text-xs font-semibold ${
            overdue ? 'text-[var(--color-coral)]' : 'text-[var(--color-steel)]'
          }`}
        >
          {overdue ? 'Overdue' : 'Due'} {formatDate(app.deadline)}
        </p>
      )}

      {app.notes ? (
        <p className="mt-2 line-clamp-2 text-xs text-[var(--color-muted)]">{app.notes}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <select
          value={app.status}
          onChange={(e) => onMove?.(app._id, e.target.value)}
          className="rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-1.5 py-1 text-[11px] font-medium"
          title="Move to column"
        >
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>
        <Link
          to={`/applications/${app._id}/edit`}
          className="rounded-md border border-[var(--color-line)] px-2 py-1 text-[11px] font-semibold"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete?.(app._id)}
          className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700"
        >
          Delete
        </button>
      </div>
    </article>
  )
}
