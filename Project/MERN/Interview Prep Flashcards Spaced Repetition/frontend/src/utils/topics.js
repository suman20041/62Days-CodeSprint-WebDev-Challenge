export const TOPICS = [
  'javascript',
  'react',
  'nodejs',
  'mongodb',
  'system-design',
  'dsa',
  'css',
  'typescript',
  'behavioral',
  'general',
]

export function formatTopic(topic) {
  return String(topic || '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function formatDue(date) {
  try {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}
