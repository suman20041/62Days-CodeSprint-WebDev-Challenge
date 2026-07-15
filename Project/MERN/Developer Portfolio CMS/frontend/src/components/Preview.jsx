const fontClass = {
  sora: 'font-[family-name:var(--font-sans)]',
  literata: 'font-[family-name:var(--font-display)]',
  mono: 'font-[family-name:var(--font-mono)]',
}

export default function Preview({ data, theme }) {
  const layoutPad = theme.layout === 'compact' ? 'space-y-5' : 'space-y-8'
  const titleSize = theme.layout === 'bold' ? 'text-4xl' : 'text-3xl'

  return (
    <div
      className={`h-full overflow-auto rounded-2xl border border-black/5 p-5 shadow-inner sm:p-7 ${fontClass[theme.font] || ''}`}
      style={{ background: theme.background, color: theme.text }}
    >
      <header
        className={theme.layout === 'bold' ? 'border-l-4 pl-4' : ''}
        style={theme.layout === 'bold' ? { borderColor: theme.primary } : undefined}
      >
        <h1 className={`font-bold leading-tight ${titleSize}`}>{data.about.fullName}</h1>
        <p className="mt-1 text-lg font-semibold" style={{ color: theme.accent }}>
          {data.about.title}
        </p>
        <p className="mt-2 opacity-90">{data.about.tagline}</p>
        <p className="mt-1 text-sm opacity-60">{data.about.location}</p>
      </header>

      <div className={`mt-8 ${layoutPad}`}>
        <Section title="About" color={theme.primary}>
          <p className="text-sm leading-relaxed opacity-90">{data.about.bio}</p>
        </Section>

        <Section title="Skills" color={theme.primary}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {data.skills.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-black/5 bg-white/80 px-3 py-2 text-sm"
              >
                <span className="font-medium">{s.name}</span>
                <span className="text-xs opacity-60">{s.level}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Projects" color={theme.primary}>
          <div className="grid gap-3">
            {data.projects.map((p) => (
              <article
                key={p.id}
                className="rounded-xl border border-black/5 bg-white/80 p-3"
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm opacity-80">{p.description}</p>
                <p className="mt-1 text-xs opacity-55">{p.tech}</p>
                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-semibold"
                    style={{ color: theme.accent }}
                  >
                    View project →
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </Section>

        <Section title="Experience" color={theme.primary}>
          <div className="space-y-3">
            {data.experience.map((e) => (
              <div key={e.id} className="rounded-xl border border-black/5 bg-white/80 p-3">
                <h3 className="font-semibold">
                  {e.role} · {e.company}
                </h3>
                <p className="text-xs opacity-55">{e.period}</p>
                <p className="mt-1 text-sm opacity-80">{e.details}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Education" color={theme.primary}>
          <div className="space-y-3">
            {data.education.map((e) => (
              <div key={e.id} className="rounded-xl border border-black/5 bg-white/80 p-3">
                <h3 className="font-semibold">{e.degree}</h3>
                <p className="text-sm">
                  {e.school} · <span className="opacity-55">{e.period}</span>
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Contact" color={theme.primary}>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            {data.contact.email ? (
              <a href={`mailto:${data.contact.email}`} style={{ color: theme.accent }}>
                {data.contact.email}
              </a>
            ) : null}
            {data.contact.github ? (
              <a href={data.contact.github} target="_blank" rel="noreferrer" style={{ color: theme.accent }}>
                GitHub
              </a>
            ) : null}
            {data.contact.linkedin ? (
              <a href={data.contact.linkedin} target="_blank" rel="noreferrer" style={{ color: theme.accent }}>
                LinkedIn
              </a>
            ) : null}
            {data.contact.website ? (
              <a href={data.contact.website} target="_blank" rel="noreferrer" style={{ color: theme.accent }}>
                Website
              </a>
            ) : null}
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, color, children }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em]" style={{ color }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
