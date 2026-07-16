import ApplicationCard from './ApplicationCard'
import { STATUS_META } from '../utils/status'

export default function KanbanColumn({
  status,
  apps,
  onDragStart,
  onDrop,
  onMove,
  onDelete,
}) {
  const meta = STATUS_META[status]

  return (
    <section
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop?.(e, status)}
      className={`flex min-h-[420px] w-[280px] shrink-0 flex-col rounded-2xl border border-[var(--color-line)] border-t-4 bg-[rgba(255,255,255,0.72)] ${meta.column}`}
    >
      <header className="flex items-center justify-between px-3 py-3">
        <h2 className="text-sm font-bold text-[var(--color-ink)]">{meta.label}</h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${meta.accent}`}>
          {apps.length}
        </span>
      </header>

      <div className="kanban-scroll flex flex-1 flex-col gap-2.5 overflow-y-auto px-2.5 pb-3">
        {apps.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--color-line)] px-3 py-8 text-center text-xs text-[var(--color-muted)]">
            Drop cards here
          </p>
        ) : (
          apps.map((app) => (
            <ApplicationCard
              key={app._id}
              app={app}
              onDragStart={onDragStart}
              onMove={onMove}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  )
}
