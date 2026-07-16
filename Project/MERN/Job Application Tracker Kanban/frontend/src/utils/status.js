export const STATUSES = ['applied', 'interview', 'offer', 'rejected']

export const STATUS_META = {
  applied: {
    label: 'Applied',
    accent: 'bg-[var(--color-steel-soft)] text-[var(--color-steel)]',
    column: 'border-t-[var(--color-steel)]',
  },
  interview: {
    label: 'Interview',
    accent: 'bg-amber-50 text-amber-800',
    column: 'border-t-amber-500',
  },
  offer: {
    label: 'Offer',
    accent: 'bg-[var(--color-sea-soft)] text-[var(--color-sea)]',
    column: 'border-t-[var(--color-sea)]',
  },
  rejected: {
    label: 'Rejected',
    accent: 'bg-[var(--color-coral-soft)] text-[var(--color-coral)]',
    column: 'border-t-[var(--color-coral)]',
  },
}

export function formatDate(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export function toDateInput(value) {
  if (!value) return ''
  try {
    return new Date(value).toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

export function isOverdue(deadline) {
  if (!deadline) return false
  const d = new Date(deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}
