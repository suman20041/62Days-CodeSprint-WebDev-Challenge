import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import { STATUSES, STATUS_META, toDateInput } from '../utils/status'

const empty = {
  company: '',
  role: '',
  status: 'applied',
  location: '',
  salary: '',
  jobUrl: '',
  notes: '',
  deadline: '',
  appliedDate: toDateInput(new Date()),
}

export default function ApplicationEditorPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    api
      .get(`/applications/${id}`)
      .then((res) => {
        const a = res.data.application
        setForm({
          company: a.company || '',
          role: a.role || '',
          status: a.status || 'applied',
          location: a.location || '',
          salary: a.salary || '',
          jobUrl: a.jobUrl || '',
          notes: a.notes || '',
          deadline: toDateInput(a.deadline),
          appliedDate: toDateInput(a.appliedDate) || toDateInput(new Date()),
        })
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      ...form,
      deadline: form.deadline || null,
      appliedDate: form.appliedDate || new Date().toISOString(),
    }

    try {
      if (isEdit) {
        await api.put(`/applications/${id}`, payload)
      } else {
        await api.post('/applications', payload)
      }
      navigate('/board')
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="py-20 text-center text-[var(--color-muted)]">Loading…</p>
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">
          {isEdit ? 'Edit application' : 'New application'}
        </h1>
        <Link to="/board" className="text-sm font-semibold text-[var(--color-muted)]">
          Cancel
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="animate-rise space-y-4 rounded-2xl border border-[var(--color-line)] bg-white p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-1">
            <span className="mb-1.5 block text-sm font-semibold">Company</span>
            <input
              required
              value={form.company}
              onChange={update('company')}
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Role</span>
            <input
              required
              value={form.role}
              onChange={update('role')}
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Status</span>
            <select
              value={form.status}
              onChange={update('status')}
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Location</span>
            <input
              value={form.location}
              onChange={update('location')}
              placeholder="Remote / City"
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Salary</span>
            <input
              value={form.salary}
              onChange={update('salary')}
              placeholder="e.g. 12–15 LPA"
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Job URL</span>
            <input
              type="url"
              value={form.jobUrl}
              onChange={update('jobUrl')}
              placeholder="https://"
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Applied date</span>
            <input
              type="date"
              value={form.appliedDate}
              onChange={update('appliedDate')}
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Deadline</span>
            <input
              type="date"
              value={form.deadline}
              onChange={update('deadline')}
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Notes</span>
          <textarea
            rows={5}
            value={form.notes}
            onChange={update('notes')}
            placeholder="Recruiter name, follow-ups, interview prep…"
            className="w-full resize-y rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-steel)]"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-[var(--color-coral-soft)] px-3 py-2 text-sm text-[var(--color-coral)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[var(--color-coral)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEdit ? 'Update application' : 'Save application'}
        </button>
      </form>
    </div>
  )
}
