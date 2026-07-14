const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'mocks.json');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ mocks: [] }, null, 2));
  }
}

function readMocks() {
  ensureStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.mocks) ? parsed.mocks : [];
  } catch {
    return [];
  }
}

function writeMocks(mocks) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify({ mocks }, null, 2));
}

function normalizePath(p) {
  let cleaned = String(p || '').trim();
  if (!cleaned.startsWith('/')) cleaned = `/${cleaned}`;
  cleaned = cleaned.replace(/\/{2,}/g, '/');
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}

module.exports = {
  readMocks,
  writeMocks,
  normalizePath,
};
