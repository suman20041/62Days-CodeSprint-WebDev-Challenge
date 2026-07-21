// Very small offline mutation queue backed by localStorage.
//
// This is intentionally simple (educational, not production-grade):
// - Each queued item is a plain description of an HTTP mutation.
// - Mutations are applied optimistically to local UI state by the caller
//   *before* being queued/sent, so the app feels responsive offline.
// - When the browser comes back online we replay the queue in order.
//
// A "real" offline-capable app would likely use IndexedDB + a service
// worker background-sync event instead of localStorage + an online
// listener, but this demonstrates the same concept end-to-end.

const STORAGE_KEY = 'ledger_offline_queue';

export function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function enqueueMutation({ method, url, data, description }) {
  const queue = getQueue();
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    method,
    url,
    data,
    description,
    createdAt: new Date().toISOString(),
  };
  queue.push(item);
  saveQueue(queue);
  return item;
}

export function removeFromQueue(id) {
  saveQueue(getQueue().filter((item) => item.id !== id));
}

export function clearQueue() {
  saveQueue([]);
}

export async function flushQueue(client, { onItemSuccess, onItemError } = {}) {
  const queue = getQueue();
  for (const item of queue) {
    try {
      await client.request({ method: item.method, url: item.url, data: item.data });
      removeFromQueue(item.id);
      onItemSuccess?.(item);
    } catch (err) {
      // Stop at the first failure to preserve ordering; the rest stay queued.
      onItemError?.(item, err);
      break;
    }
  }
}
