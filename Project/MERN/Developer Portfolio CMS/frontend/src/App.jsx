import { useEffect, useMemo, useState } from 'react'
import EditorForms from './components/EditorForms'
import Preview from './components/Preview'
import ThemePanel from './components/ThemePanel'
import {
  defaultData,
  defaultTheme,
  loadDraft,
  saveDraft,
} from './defaults'
import { buildHtml, downloadFile } from './exportPortfolio'

const SECTIONS = [
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'contact',
  'theme',
]

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003'

export default function App() {
  const draft = useMemo(() => loadDraft(), [])
  const [data, setData] = useState(draft?.data || defaultData)
  const [theme, setTheme] = useState(draft?.theme || defaultTheme)
  const [section, setSection] = useState('about')
  const [remoteId, setRemoteId] = useState(draft?.remoteId || '')
  const [status, setStatus] = useState('')

  useEffect(() => {
    saveDraft({ data, theme, remoteId })
  }, [data, theme, remoteId])

  const exportJson = () => {
    downloadFile(
      `${slug(data.about.fullName)}-portfolio.json`,
      JSON.stringify({ data, theme }, null, 2),
      'application/json'
    )
    setStatus('JSON exported')
  }

  const exportHtml = () => {
    downloadFile(
      `${slug(data.about.fullName)}-portfolio.html`,
      buildHtml({ data, theme }),
      'text/html'
    )
    setStatus('HTML exported')
  }

  const saveRemote = async () => {
    setStatus('Saving to server…')
    try {
      const payload = { data, theme }
      const url = remoteId
        ? `${API_URL}/api/portfolios/${remoteId}`
        : `${API_URL}/api/portfolios`
      const res = await fetch(url, {
        method: remoteId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Save failed')
      setRemoteId(json.portfolio.id)
      setStatus(`Saved on server · id ${json.portfolio.id}`)
    } catch (err) {
      setStatus(err.message || 'Server unavailable (draft still in localStorage)')
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
              No-code style CMS
            </p>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Developer Portfolio Builder
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportJson}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={exportHtml}
              className="rounded-xl bg-sky-700 px-3 py-2 text-sm font-semibold text-white"
            >
              Export HTML
            </button>
            <button
              type="button"
              onClick={saveRemote}
              className="rounded-xl bg-teal-700 px-3 py-2 text-sm font-semibold text-white"
            >
              Save to server
            </button>
          </div>
        </div>
        {status ? (
          <p className="border-t border-black/5 px-4 py-2 text-center text-xs text-slate-500 sm:px-6">
            {status}
          </p>
        ) : null}
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[280px_1fr_1.15fr] sm:px-6">
        <aside className="rounded-2xl border border-black/5 bg-white p-3 shadow-sm h-fit">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Sections
          </p>
          <nav className="flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSection(s)}
                className={`rounded-xl px-3 py-2 text-left text-sm font-semibold capitalize ${
                  section === s
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </nav>
          <p className="mt-4 px-2 text-[11px] leading-relaxed text-slate-400">
            Draft auto-saves to localStorage. Optional backend stores portfolios as JSON files.
          </p>
        </aside>

        <section className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-semibold capitalize">{section}</h2>
          {section === 'theme' ? (
            <ThemePanel theme={theme} onChange={setTheme} />
          ) : (
            <EditorForms section={section} data={data} onChange={setData} />
          )}
        </section>

        <section className="min-h-[70vh]">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Live preview
            </h2>
          </div>
          <Preview data={data} theme={theme} />
        </section>
      </div>
    </div>
  )
}

function slug(name = 'portfolio') {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'portfolio'
}
