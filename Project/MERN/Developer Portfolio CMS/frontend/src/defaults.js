export const STORAGE_KEY = 'dev-portfolio-cms-draft'

export const defaultTheme = {
  primary: '#0f766e',
  accent: '#0369a1',
  background: '#f8fafc',
  text: '#0f172a',
  layout: 'classic', // classic | compact | bold
  font: 'sora', // sora | literata | mono
}

export const defaultData = {
  about: {
    fullName: 'Alex Rivera',
    title: 'Full-Stack Developer',
    tagline: 'I build clean, useful web apps with React and Node.js.',
    bio: 'Developer focused on practical UX, accessible interfaces, and maintainable code. Open to collaboration and open-source contributions.',
    location: 'Remote',
    avatarUrl: '',
  },
  skills: [
    { id: '1', name: 'React', level: 'Advanced' },
    { id: '2', name: 'Node.js', level: 'Advanced' },
    { id: '3', name: 'MongoDB', level: 'Intermediate' },
    { id: '4', name: 'TypeScript', level: 'Intermediate' },
  ],
  projects: [
    {
      id: '1',
      name: 'Issue Finder Dashboard',
      description: 'Discover beginner-friendly GitHub issues with filters and favorites.',
      tech: 'React, GitHub API',
      link: 'https://github.com',
    },
  ],
  experience: [
    {
      id: '1',
      role: 'Frontend Developer',
      company: 'Studio North',
      period: '2023 — Present',
      details: 'Built responsive dashboards and design systems with React.',
    },
  ],
  education: [
    {
      id: '1',
      school: 'State University',
      degree: 'B.S. Computer Science',
      period: '2019 — 2023',
    },
  ],
  contact: {
    email: 'alex@example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    website: 'https://example.com',
  },
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveDraft(payload) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
