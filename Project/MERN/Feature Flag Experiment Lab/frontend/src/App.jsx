import { useEffect, useState } from 'react'
import api from './api.js'
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [email, setEmail] = useState(localStorage.getItem('email') || '')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(null)
  const [flags, setFlags] = useState([])
  const [audit, setAudit] = useState([])
  const [demo, setDemo] = useState(null)
  const [key, setKey] = useState('new_checkout')
  const loadProjects = async () => setProjects((await api.get('/flags/projects')).data)
  useEffect(() => { if (token) loadProjects() }, [token])
  const openProject = async (p) => {
    setProject(p)
    setFlags((await api.get('/flags/projects/' + p._id + '/flags')).data)
    setAudit((await api.get('/flags/projects/' + p._id + '/audit')).data)
    setDemo((await api.get('/flags/eval/' + p.key, { params: { email } })).data)
  }
  if (!token) return (
    <div className="wrap"><h1>Feature Flag Lab</h1>
      <div className="card row">
        <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button onClick={async () => { const { data } = await api.post('/auth/register', form); localStorage.setItem('token', data.token); localStorage.setItem('email', data.user.email); setToken(data.token); setEmail(data.user.email) }}>Register</button>
        <button onClick={async () => { const { data } = await api.post('/auth/login', form); localStorage.setItem('token', data.token); localStorage.setItem('email', data.user.email); setToken(data.token); setEmail(data.user.email) }}>Login</button>
      </div>
    </div>
  )
  return (
    <div className="wrap">
      <h1>Feature Flag & Experiment Lab</h1>
      <div className="card row">
        <button onClick={async () => { await api.post('/flags/projects', { name: 'Demo App', key: 'demo_app' }); loadProjects() }}>+ Project</button>
        {projects.map((p) => <button key={p._id} onClick={() => openProject(p)}>{p.name}</button>)}
      </div>
      {project && (
        <>
          <div className="card row">
            <input value={key} onChange={(e) => setKey(e.target.value)} />
            <button onClick={async () => { await api.post('/flags/projects/' + project._id + '/flags', { key, enabled: true, percentage: 25, segments: [{ name: 'beta', emails: [email] }] }); openProject(project) }}>Create flag 25%</button>
          </div>
          <div className="card">
            <h3>Flags</h3>
            {flags.map((f) => (
              <div key={f._id} className="row" style={{ justifyContent: 'space-between' }}>
                <span>{f.key} · {f.percentage}% · {f.enabled ? 'on' : 'off'}</span>
                <button onClick={async () => { await api.put('/flags/' + f._id, { enabled: !f.enabled, percentage: f.percentage === 100 ? 25 : 100 }); openProject(project) }}>Toggle / rollout</button>
              </div>
            ))}
          </div>
          <div className="card">
            <h3>Live SDK demo</h3>
            {demo && Object.entries(demo.flags).map(([k, v]) => <div key={k} className={v ? 'on' : 'off'}>{k}: {String(v)}</div>)}
            <p className="muted">Evaluated for {email}</p>
          </div>
          <div className="card">
            <h3>Audit log</h3>
            {audit.map((a) => <div key={a._id} className="muted">{String(a.at)} {a.action} {a.flagKey} by {a.by}</div>)}
          </div>
        </>
      )}
    </div>
  )
}
