import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import { TOPICS, formatTopic } from '../utils/topics'

const empty = { front: '', back: '', topic: 'javascript', hint: '' }

export default function CardEditorPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(false)
  const [hintLoading, setHintLoading] = useState(false)

  useEffect(() => {
    api
      .get('/ai/status')
      .then((res) => setAiEnabled(Boolean(res.data.enabled)))
      .catch(() => setAiEnabled(false))
  }, [])

  useEffect(() => {
    if (!isEdit) return
    api
      .get(`/cards/${id}`)
      .then((res) => {
        const c = res.data.card
        setForm({
          front: c.front || '',
          back: c.back || '',
          topic: c.topic || 'general',
          hint: c.hint || '',
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
    try {
      if (isEdit) {
        await api.put(`/cards/${id}`, form)
      } else {
        await api.post('/cards', form)
      }
      navigate('/cards')
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const generateHint = async () => {
    if (!form.front.trim()) {
      setError('Add a question before generating a hint.')
      return
    }
    setHintLoading(true)
    setError('')
    try {
      const { data } = await api.post('/ai/hint', {
        front: form.front,
        back: form.back,
        topic: form.topic,
      })
      setForm((prev) => ({ ...prev, hint: data.hint || '' }))
    } catch (err) {
      setError(err.response?.data?.message || 'Hint generation failed.')
    } finally {
      setHintLoading(false)
    }
  }

  if (loading) {
    return <p className="py-20 text-center text-[var(--color-muted)]">Loading…</p>
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">
          {isEdit ? 'Edit card' : 'New card'}
        </h1>
        <Link to="/cards" className="text-sm font-semibold text-[var(--color-muted)]">
          Cancel
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="animate-rise space-y-4 rounded-2xl border border-[var(--color-line)] bg-white p-5 sm:p-6"
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Topic</span>
          <select
            value={form.topic}
            onChange={update('topic')}
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-forest)]"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {formatTopic(t)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Front (question)</span>
          <textarea
            required
            rows={3}
            value={form.front}
            onChange={update('front')}
            className="w-full resize-y rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-forest)]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Back (answer)</span>
          <textarea
            required
            rows={5}
            value={form.back}
            onChange={update('back')}
            className="w-full resize-y rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-forest)]"
          />
        </label>

        <label className="block">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold">Hint (optional)</span>
            {aiEnabled && (
              <button
                type="button"
                onClick={generateHint}
                disabled={hintLoading}
                className="text-xs font-bold text-[var(--color-forest)] disabled:opacity-60"
              >
                {hintLoading ? 'Generating…' : 'AI hint'}
              </button>
            )}
          </div>
          <textarea
            rows={2}
            value={form.hint}
            onChange={update('hint')}
            className="w-full resize-y rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-forest)]"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-[var(--color-copper-soft)] px-3 py-2 text-sm text-[var(--color-copper)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[var(--color-copper)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEdit ? 'Update card' : 'Save card'}
        </button>
      </form>
    </div>
  )
}
