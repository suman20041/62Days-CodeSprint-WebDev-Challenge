import { useCallback, useEffect, useState } from 'react'
import {
  createMock,
  deleteMock,
  listMocks,
  updateMock,
} from './api'
import MockForm from './components/MockForm'
import MockList from './components/MockList'
import RequestTester from './components/RequestTester'

export default function App() {
  const [mocks, setMocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState(null)
  const [testerSeed, setTesterSeed] = useState(null)

  const refresh = useCallback(async () => {
    setError('')
    try {
      const data = await listMocks()
      setMocks(data)
    } catch (err) {
      setError(err.message || 'Failed to load mocks. Is the backend running on port 5002?')
      setMocks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleSave = async (form) => {
    setSaving(true)
    setError('')
    try {
      if (editing?.id) {
        await updateMock(editing.id, form)
      } else {
        await createMock(form)
      }
      setShowForm(false)
      setEditing(null)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (mock) => {
    if (!window.confirm(`Delete ${mock.method} ${mock.path}?`)) return
    try {
      await deleteMock(mock.id)
      if (selected?.id === mock.id) setSelected(null)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-signal)]">
          Frontend testing utility
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-[var(--color-ink)]">
          API Mock Studio
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          Define custom mock endpoints with JSON bodies, delays, and status codes — then call them
          live while you build UI.
        </p>
      </header>

      {error ? (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="rounded-xl bg-[var(--color-navy)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          New mock
        </button>
        <button
          type="button"
          onClick={refresh}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Your mocks</h2>
          {loading ? (
            <p className="text-sm text-[var(--color-muted)]">Loading…</p>
          ) : (
            <MockList
              mocks={mocks}
              selectedId={selected?.id}
              onSelect={setSelected}
              onEdit={(m) => {
                setEditing(m)
                setShowForm(true)
              }}
              onDelete={handleDelete}
              onTest={(m) => setTesterSeed({ ...m, _t: Date.now() })}
            />
          )}

          {showForm ? (
            <div className="mt-6">
              <MockForm
                initial={editing}
                saving={saving}
                onCancel={() => {
                  setShowForm(false)
                  setEditing(null)
                }}
                onSubmit={handleSave}
              />
            </div>
          ) : null}
        </section>

        <section>
          <RequestTester seed={testerSeed || selected} />
        </section>
      </div>

      <footer className="mt-12 text-center text-xs text-[var(--color-muted)]">
        API Mock Studio · Issue #182 · Mocks saved in <code>backend/data/mocks.json</code>
      </footer>
    </div>
  )
}
