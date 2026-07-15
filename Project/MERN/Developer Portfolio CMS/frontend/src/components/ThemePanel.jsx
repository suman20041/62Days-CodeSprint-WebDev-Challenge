export default function ThemePanel({ theme, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Primary</span>
        <input
          type="color"
          value={theme.primary}
          onChange={(e) => onChange({ ...theme, primary: e.target.value })}
          className="h-10 w-full cursor-pointer rounded-lg border border-slate-200"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Accent</span>
        <input
          type="color"
          value={theme.accent}
          onChange={(e) => onChange({ ...theme, accent: e.target.value })}
          className="h-10 w-full cursor-pointer rounded-lg border border-slate-200"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Background</span>
        <input
          type="color"
          value={theme.background}
          onChange={(e) => onChange({ ...theme, background: e.target.value })}
          className="h-10 w-full cursor-pointer rounded-lg border border-slate-200"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Text</span>
        <input
          type="color"
          value={theme.text}
          onChange={(e) => onChange({ ...theme, text: e.target.value })}
          className="h-10 w-full cursor-pointer rounded-lg border border-slate-200"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Layout</span>
        <select
          value={theme.layout}
          onChange={(e) => onChange({ ...theme, layout: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
        >
          <option value="classic">Classic</option>
          <option value="compact">Compact</option>
          <option value="bold">Bold</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Font</span>
        <select
          value={theme.font}
          onChange={(e) => onChange({ ...theme, font: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
        >
          <option value="sora">Sora</option>
          <option value="literata">Literata</option>
          <option value="mono">Plex Mono</option>
        </select>
      </label>
    </div>
  )
}
