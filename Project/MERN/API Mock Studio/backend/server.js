const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { readMocks, writeMocks, normalizePath } = require('./store');

const app = express();
const PORT = process.env.PORT || 5002;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'API Mock Studio is running',
    studio: '/api/mocks',
    mockBase: '/mock/*',
  });
});

/** CRUD for managing mock definitions */
app.get('/api/mocks', (_req, res) => {
  const mocks = readMocks().sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  res.json({ mocks });
});

app.get('/api/mocks/:id', (req, res) => {
  const mock = readMocks().find((m) => m.id === req.params.id);
  if (!mock) return res.status(404).json({ message: 'Mock not found.' });
  res.json({ mock });
});

app.post('/api/mocks', (req, res) => {
  const {
    name,
    method = 'GET',
    path: mockPath,
    statusCode = 200,
    delayMs = 0,
    responseBody = {},
    enabled = true,
  } = req.body;

  const upperMethod = String(method).toUpperCase();
  if (!METHODS.includes(upperMethod)) {
    return res.status(400).json({ message: `Method must be one of: ${METHODS.join(', ')}` });
  }

  const pathNorm = normalizePath(mockPath);
  if (!pathNorm || pathNorm === '/') {
    return res.status(400).json({ message: 'A valid path is required (e.g. /users).' });
  }

  let body = responseBody;
  if (typeof responseBody === 'string') {
    try {
      body = JSON.parse(responseBody || '{}');
    } catch {
      return res.status(400).json({ message: 'responseBody must be valid JSON.' });
    }
  }

  const mocks = readMocks();
  const duplicate = mocks.find(
    (m) => m.method === upperMethod && m.path === pathNorm
  );
  if (duplicate) {
    return res.status(400).json({
      message: `A mock for ${upperMethod} ${pathNorm} already exists.`,
    });
  }

  const now = new Date().toISOString();
  const mock = {
    id: uuidv4(),
    name: (name || `${upperMethod} ${pathNorm}`).slice(0, 80),
    method: upperMethod,
    path: pathNorm,
    statusCode: Number(statusCode) || 200,
    delayMs: Math.max(0, Math.min(10000, Number(delayMs) || 0)),
    responseBody: body,
    enabled: Boolean(enabled),
    createdAt: now,
    updatedAt: now,
  };

  mocks.push(mock);
  writeMocks(mocks);
  res.status(201).json({ mock });
});

app.put('/api/mocks/:id', (req, res) => {
  const mocks = readMocks();
  const index = mocks.findIndex((m) => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Mock not found.' });

  const current = mocks[index];
  const {
    name,
    method,
    path: mockPath,
    statusCode,
    delayMs,
    responseBody,
    enabled,
  } = req.body;

  let nextMethod = current.method;
  if (method !== undefined) {
    nextMethod = String(method).toUpperCase();
    if (!METHODS.includes(nextMethod)) {
      return res.status(400).json({ message: `Method must be one of: ${METHODS.join(', ')}` });
    }
  }

  let nextPath = current.path;
  if (mockPath !== undefined) {
    nextPath = normalizePath(mockPath);
    if (!nextPath || nextPath === '/') {
      return res.status(400).json({ message: 'A valid path is required.' });
    }
  }

  let nextBody = current.responseBody;
  if (responseBody !== undefined) {
    if (typeof responseBody === 'string') {
      try {
        nextBody = JSON.parse(responseBody || '{}');
      } catch {
        return res.status(400).json({ message: 'responseBody must be valid JSON.' });
      }
    } else {
      nextBody = responseBody;
    }
  }

  const duplicate = mocks.find(
    (m) =>
      m.id !== current.id &&
      m.method === nextMethod &&
      m.path === nextPath
  );
  if (duplicate) {
    return res.status(400).json({
      message: `A mock for ${nextMethod} ${nextPath} already exists.`,
    });
  }

  const updated = {
    ...current,
    name: name !== undefined ? String(name).slice(0, 80) : current.name,
    method: nextMethod,
    path: nextPath,
    statusCode:
      statusCode !== undefined ? Number(statusCode) || 200 : current.statusCode,
    delayMs:
      delayMs !== undefined
        ? Math.max(0, Math.min(10000, Number(delayMs) || 0))
        : current.delayMs,
    responseBody: nextBody,
    enabled: enabled !== undefined ? Boolean(enabled) : current.enabled,
    updatedAt: new Date().toISOString(),
  };

  mocks[index] = updated;
  writeMocks(mocks);
  res.json({ mock: updated });
});

app.delete('/api/mocks/:id', (req, res) => {
  const mocks = readMocks();
  const next = mocks.filter((m) => m.id !== req.params.id);
  if (next.length === mocks.length) {
    return res.status(404).json({ message: 'Mock not found.' });
  }
  writeMocks(next);
  res.json({ message: 'Mock deleted.' });
});

/**
 * Serve user-defined mocks at /mock/*
 * Example: GET /mock/users  →  matches mock path /users
 */
app.use('/mock', async (req, res) => {
  const mockPath = normalizePath(req.path || '/');
  const method = req.method.toUpperCase();
  const mock = readMocks().find(
    (m) => m.enabled && m.method === method && m.path === mockPath
  );

  if (!mock) {
    return res.status(404).json({
      message: `No enabled mock for ${method} ${mockPath}`,
      hint: 'Create one in the API Mock Studio UI.',
    });
  }

  if (mock.delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, mock.delayMs));
  }

  // 204 should not send a body
  if (mock.statusCode === 204) {
    return res.status(204).send();
  }

  res.status(mock.statusCode).json(mock.responseBody);
});

app.listen(PORT, () => {
  console.log(`API Mock Studio server running on port ${PORT}`);
});
