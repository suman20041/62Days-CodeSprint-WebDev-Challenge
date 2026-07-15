const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5003;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'portfolios.json');

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: '2mb' }));

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ portfolios: [] }, null, 2));
  }
}

function readAll() {
  ensureStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return Array.isArray(parsed.portfolios) ? parsed.portfolios : [];
  } catch {
    return [];
  }
}

function writeAll(portfolios) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify({ portfolios }, null, 2));
}

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Developer Portfolio CMS API is running',
  });
});

app.get('/api/portfolios', (_req, res) => {
  const list = readAll().map(({ id, updatedAt, data }) => ({
    id,
    updatedAt,
    name: data?.about?.fullName || 'Untitled',
    title: data?.about?.title || '',
  }));
  res.json({ portfolios: list });
});

app.get('/api/portfolios/:id', (req, res) => {
  const found = readAll().find((p) => p.id === req.params.id);
  if (!found) return res.status(404).json({ message: 'Portfolio not found.' });
  res.json({ portfolio: found });
});

app.post('/api/portfolios', (req, res) => {
  const { data, theme } = req.body || {};
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ message: 'Portfolio data is required.' });
  }

  const now = new Date().toISOString();
  const portfolio = {
    id: uuidv4().slice(0, 8),
    data,
    theme: theme || {},
    createdAt: now,
    updatedAt: now,
  };

  const all = readAll();
  all.push(portfolio);
  writeAll(all);
  res.status(201).json({ portfolio });
});

app.put('/api/portfolios/:id', (req, res) => {
  const all = readAll();
  const index = all.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Portfolio not found.' });

  const { data, theme } = req.body || {};
  all[index] = {
    ...all[index],
    data: data || all[index].data,
    theme: theme || all[index].theme,
    updatedAt: new Date().toISOString(),
  };
  writeAll(all);
  res.json({ portfolio: all[index] });
});

app.delete('/api/portfolios/:id', (req, res) => {
  const all = readAll();
  const next = all.filter((p) => p.id !== req.params.id);
  if (next.length === all.length) {
    return res.status(404).json({ message: 'Portfolio not found.' });
  }
  writeAll(next);
  res.json({ message: 'Deleted.' });
});

app.listen(PORT, () => {
  console.log(`Portfolio CMS API running on port ${PORT}`);
});
