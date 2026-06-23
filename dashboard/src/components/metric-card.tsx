export function MetricCard({ title, value, detail }: { title: string; value: number; detail: string }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <strong className="mt-2 block text-3xl font-semibold">{value}</strong>
      <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400">{detail}</span>
    </article>
  );
}
