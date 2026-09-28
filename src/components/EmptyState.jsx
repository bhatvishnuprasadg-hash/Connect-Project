export default function EmptyState({ icon = "📭", title, subtitle, action }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="text-4xl">{icon}</div>
      <p className="font-display text-lg font-bold text-ink-900">{title}</p>
      {subtitle && <p className="max-w-sm text-sm text-ink-400">{subtitle}</p>}
      {action}
    </div>
  );
}
