import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import KanbanColumn from '../components/KanbanColumn'
import { STATUSES } from '../utils/status'

export default function BoardPage() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [deadlineFrom, setDeadlineFrom] = useState('')
  const [deadlineTo, setDeadlineTo] = useState('')
  const dragId = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (q.trim()) params.q = q.trim()
      if (company.trim()) params.company = company.trim()
      if (role.trim()) params.role = role.trim()
      if (status) params.status = status
      if (deadlineFrom) params.deadlineFrom = deadlineFrom
      if (deadlineTo) params.deadlineTo = deadlineTo

      const { data } = await api.get('/applications', { params })
      setApps(data.applications || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load board.')
    } finally {
      setLoading(false)
    }
  }, [q, company, role, status, deadlineFrom, deadlineTo])

  useEffect(() => {
    const t = setTimeout(load, 220)
    return () => clearTimeout(t)
  }, [load])

  const grouped = useMemo(() => {
    const map = Object.fromEntries(STATUSES.map((s) => [s, []]))
    apps.forEach((app) => {
      if (map[app.status]) map[app.status].push(app)
    })
    STATUSES.forEach((s) => {
      map[s].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    })
    return map
  }, [apps])

  const onDragStart = (e, app) => {
    dragId.current = app._id
    e.dataTransfer.setData('text/plain', app._id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const moveApp = async (id, nextStatus) => {
    const current = apps.find((a) => a._id === id)
    if (!current || current.status === nextStatus) return

    setApps((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: nextStatus } : a))
    )

    try {
      await api.patch(`/applications/${id}/move`, {
        status: nextStatus,
        order: grouped[nextStatus]?.length || 0,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Move failed.')
      load()
    }
  }

  const onDrop = (e, nextStatus) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || dragId.current
    if (id) moveApp(id, nextStatus)
    dragId.current = null
  }

  const onDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return
    try {
      await api.delete(`/applications/${id}`)
      setApps((prev) => prev.filter((a) => a._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Kanban board</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Drag cards between columns or use the status menu.
          </p>
        </div>
        <Link
          to="/applications/new"
          className="inline-flex rounded-xl bg-[var(--color-coral)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Add application
        </Link>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <input
          type="search"
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-sm outline-none focus:border-[var(--color-steel)]"
        />
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-sm outline-none focus:border-[var(--color-steel)]"
        />
        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-sm outline-none focus:border-[var(--color-steel)]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-sm outline-none focus:border-[var(--color-steel)]"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={deadlineFrom}
          onChange={(e) => setDeadlineFrom(e.target.value)}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-sm outline-none focus:border-[var(--color-steel)]"
          title="Deadline from"
        />
        <input
          type="date"
          value={deadlineTo}
          onChange={(e) => setDeadlineTo(e.target.value)}
          className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-sm outline-none focus:border-[var(--color-steel)]"
          title="Deadline to"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-[var(--color-coral-soft)] px-4 py-3 text-sm text-[var(--color-coral)]">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-center text-[var(--color-muted)]">Loading board…</p>
      ) : (
        <div className="kanban-scroll mt-6 flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((s) => (
            <KanbanColumn
              key={s}
              status={s}
              apps={status && status !== s ? [] : grouped[s]}
              onDragStart={onDragStart}
              onDrop={onDrop}
              onMove={moveApp}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
