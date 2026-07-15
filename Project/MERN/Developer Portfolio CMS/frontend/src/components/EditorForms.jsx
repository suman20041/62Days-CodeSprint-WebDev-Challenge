import { uid } from '../defaults'

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15'

export default function EditorForms({ section, data, onChange }) {
  if (section === 'about') {
    const a = data.about
    const set = (key, value) => onChange({ ...data, about: { ...a, [key]: value } })
    return (
      <div>
        <Field label="Full name">
          <input className={inputClass} value={a.fullName} onChange={(e) => set('fullName', e.target.value)} />
        </Field>
        <Field label="Title">
          <input className={inputClass} value={a.title} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="Tagline">
          <input className={inputClass} value={a.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </Field>
        <Field label="Bio">
          <textarea className={inputClass} rows={4} value={a.bio} onChange={(e) => set('bio', e.target.value)} />
        </Field>
        <Field label="Location">
          <input className={inputClass} value={a.location} onChange={(e) => set('location', e.target.value)} />
        </Field>
      </div>
    )
  }

  if (section === 'skills') {
    return (
      <div className="space-y-3">
        {data.skills.map((skill, i) => (
          <div key={skill.id} className="rounded-xl border border-slate-200 p-3">
            <Field label="Skill">
              <input
                className={inputClass}
                value={skill.name}
                onChange={(e) => {
                  const skills = [...data.skills]
                  skills[i] = { ...skill, name: e.target.value }
                  onChange({ ...data, skills })
                }}
              />
            </Field>
            <Field label="Level">
              <select
                className={inputClass}
                value={skill.level}
                onChange={(e) => {
                  const skills = [...data.skills]
                  skills[i] = { ...skill, level: e.target.value }
                  onChange({ ...data, skills })
                }}
              >
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
            <button
              type="button"
              className="text-xs font-semibold text-rose-600"
              onClick={() =>
                onChange({
                  ...data,
                  skills: data.skills.filter((s) => s.id !== skill.id),
                })
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
          onClick={() =>
            onChange({
              ...data,
              skills: [...data.skills, { id: uid(), name: 'New skill', level: 'Intermediate' }],
            })
          }
        >
          Add skill
        </button>
      </div>
    )
  }

  if (section === 'projects') {
    return (
      <ListEditor
        items={data.projects}
        onChange={(projects) => onChange({ ...data, projects })}
        blank={() => ({
          id: uid(),
          name: 'New project',
          description: '',
          tech: '',
          link: '',
        })}
        fields={[
          ['name', 'Name'],
          ['description', 'Description', 'textarea'],
          ['tech', 'Tech stack'],
          ['link', 'Link'],
        ]}
      />
    )
  }

  if (section === 'experience') {
    return (
      <ListEditor
        items={data.experience}
        onChange={(experience) => onChange({ ...data, experience })}
        blank={() => ({
          id: uid(),
          role: 'Role',
          company: 'Company',
          period: '',
          details: '',
        })}
        fields={[
          ['role', 'Role'],
          ['company', 'Company'],
          ['period', 'Period'],
          ['details', 'Details', 'textarea'],
        ]}
      />
    )
  }

  if (section === 'education') {
    return (
      <ListEditor
        items={data.education}
        onChange={(education) => onChange({ ...data, education })}
        blank={() => ({
          id: uid(),
          school: 'School',
          degree: 'Degree',
          period: '',
        })}
        fields={[
          ['school', 'School'],
          ['degree', 'Degree'],
          ['period', 'Period'],
        ]}
      />
    )
  }

  if (section === 'contact') {
    const c = data.contact
    const set = (key, value) => onChange({ ...data, contact: { ...c, [key]: value } })
    return (
      <div>
        {['email', 'github', 'linkedin', 'website'].map((key) => (
          <Field key={key} label={key}>
            <input className={inputClass} value={c[key]} onChange={(e) => set(key, e.target.value)} />
          </Field>
        ))}
      </div>
    )
  }

  return null
}

function ListEditor({ items, onChange, blank, fields }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="rounded-xl border border-slate-200 p-3">
          {fields.map(([key, label, type]) => (
            <Field key={key} label={label}>
              {type === 'textarea' ? (
                <textarea
                  className={inputClass}
                  rows={3}
                  value={item[key]}
                  onChange={(e) => {
                    const next = [...items]
                    next[i] = { ...item, [key]: e.target.value }
                    onChange(next)
                  }}
                />
              ) : (
                <input
                  className={inputClass}
                  value={item[key]}
                  onChange={(e) => {
                    const next = [...items]
                    next[i] = { ...item, [key]: e.target.value }
                    onChange(next)
                  }}
                />
              )}
            </Field>
          ))}
          <button
            type="button"
            className="text-xs font-semibold text-rose-600"
            onClick={() => onChange(items.filter((x) => x.id !== item.id))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
        onClick={() => onChange([...items, blank()])}
      >
        Add item
      </button>
    </div>
  )
}
