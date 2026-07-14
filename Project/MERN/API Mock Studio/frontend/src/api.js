const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002'

export async function listMocks() {
  const res = await fetch(`${API_URL}/api/mocks`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to load mocks')
  return data.mocks
}

export async function createMock(payload) {
  const res = await fetch(`${API_URL}/api/mocks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create mock')
  return data.mock
}

export async function updateMock(id, payload) {
  const res = await fetch(`${API_URL}/api/mocks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update mock')
  return data.mock
}

export async function deleteMock(id) {
  const res = await fetch(`${API_URL}/api/mocks/${id}`, { method: 'DELETE' })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to delete mock')
}

export async function callMock({ method, path, body }) {
  const clean = path.startsWith('/') ? path : `/${path}`
  const url = `${API_URL}/mock${clean}`
  const started = performance.now()

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (method !== 'GET' && method !== 'DELETE' && body) {
    options.body = body
  }

  const res = await fetch(url, options)
  const elapsed = Math.round(performance.now() - started)
  const text = await res.text()
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = text
  }

  return {
    status: res.status,
    ok: res.ok,
    elapsed,
    url,
    body: json,
  }
}

export { API_URL }
