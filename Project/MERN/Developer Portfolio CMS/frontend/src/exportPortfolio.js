function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const fontStacks = {
  sora: "'Sora', system-ui, sans-serif",
  literata: "'Literata', Georgia, serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
}

export function buildHtml({ data, theme }) {
  const font = fontStacks[theme.font] || fontStacks.sora
  const skills = (data.skills || [])
    .map(
      (s) =>
        `<li><strong>${esc(s.name)}</strong><span>${esc(s.level)}</span></li>`
    )
    .join('')
  const projects = (data.projects || [])
    .map(
      (p) => `
      <article class="card">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description)}</p>
        <p class="muted">${esc(p.tech)}</p>
        ${p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noreferrer">View project</a>` : ''}
      </article>`
    )
    .join('')
  const experience = (data.experience || [])
    .map(
      (e) => `
      <div class="item">
        <h3>${esc(e.role)} · ${esc(e.company)}</h3>
        <p class="muted">${esc(e.period)}</p>
        <p>${esc(e.details)}</p>
      </div>`
    )
    .join('')
  const education = (data.education || [])
    .map(
      (e) => `
      <div class="item">
        <h3>${esc(e.degree)}</h3>
        <p>${esc(e.school)} · <span class="muted">${esc(e.period)}</span></p>
      </div>`
    )
    .join('')

  const layoutClass =
    theme.layout === 'compact'
      ? 'layout-compact'
      : theme.layout === 'bold'
        ? 'layout-bold'
        : 'layout-classic'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(data.about?.fullName || 'Portfolio')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Literata:opsz,wght@7..72,600;7..72,700&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  :root {
    --primary: ${theme.primary};
    --accent: ${theme.accent};
    --bg: ${theme.background};
    --text: ${theme.text};
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${font};
    color: var(--text);
    background: var(--bg);
    line-height: 1.6;
  }
  .wrap { max-width: 920px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
  .layout-bold header { border-left: 6px solid var(--primary); padding-left: 1rem; }
  .layout-compact .section { margin-top: 1.5rem; }
  .layout-classic .section { margin-top: 2.25rem; }
  h1 { font-size: clamp(2rem, 4vw, 2.8rem); margin: 0 0 0.35rem; }
  h2 { color: var(--primary); font-size: 1.15rem; letter-spacing: 0.04em; text-transform: uppercase; }
  h3 { margin: 0 0 0.35rem; font-size: 1.05rem; }
  .muted { color: #64748b; font-size: 0.92rem; }
  .tagline { font-size: 1.1rem; color: var(--accent); font-weight: 600; }
  .skills { list-style: none; padding: 0; display: grid; gap: 0.5rem; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .skills li { background: #fff; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 0.65rem 0.8rem; display: flex; justify-content: space-between; gap: 0.5rem; }
  .grid { display: grid; gap: 0.9rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
  .card, .item { background: #fff; border: 1px solid #e2e8f0; border-radius: 0.9rem; padding: 1rem; }
  a { color: var(--accent); }
  .contact a { margin-right: 0.85rem; }
</style>
</head>
<body>
  <main class="wrap ${layoutClass}">
    <header>
      <h1>${esc(data.about?.fullName)}</h1>
      <p class="tagline">${esc(data.about?.title)}</p>
      <p>${esc(data.about?.tagline)}</p>
      <p class="muted">${esc(data.about?.location)}</p>
    </header>
    <section class="section">
      <h2>About</h2>
      <p>${esc(data.about?.bio)}</p>
    </section>
    <section class="section">
      <h2>Skills</h2>
      <ul class="skills">${skills}</ul>
    </section>
    <section class="section">
      <h2>Projects</h2>
      <div class="grid">${projects}</div>
    </section>
    <section class="section">
      <h2>Experience</h2>
      ${experience}
    </section>
    <section class="section">
      <h2>Education</h2>
      ${education}
    </section>
    <section class="section contact">
      <h2>Contact</h2>
      ${data.contact?.email ? `<a href="mailto:${esc(data.contact.email)}">${esc(data.contact.email)}</a>` : ''}
      ${data.contact?.github ? `<a href="${esc(data.contact.github)}" target="_blank" rel="noreferrer">GitHub</a>` : ''}
      ${data.contact?.linkedin ? `<a href="${esc(data.contact.linkedin)}" target="_blank" rel="noreferrer">LinkedIn</a>` : ''}
      ${data.contact?.website ? `<a href="${esc(data.contact.website)}" target="_blank" rel="noreferrer">Website</a>` : ''}
    </section>
  </main>
</body>
</html>`
}

export function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
