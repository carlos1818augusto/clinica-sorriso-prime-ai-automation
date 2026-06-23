import { clsx } from "clsx";
import type { ConversationStatus, Sentiment } from "@/types/database";

const statusStyles: Record<ConversationStatus, string> = {
  em_andamento: "bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-950 dark:text-cyan-200 dark:ring-cyan-800",
  aguardando_humano: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-800",
  encerrada: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800"
};

const sentimentStyles: Record<Sentiment, string> = {
  positivo: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800",
  neutro: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700",
  negativo: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:ring-rose-800",
  urgente: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-200 dark:ring-red-800"
};

export function StatusBadge({ value }: { value: ConversationStatus }) {
  return <span className={clsx("rounded-md px-2 py-1 text-xs font-medium ring-1", statusStyles[value])}>{value.replace("_", " ")}</span>;
}

export function SentimentBadge({ value }: { value: Sentiment | null }) {
  if (!value) return <span className="text-xs text-slate-400">sem sentimento</span>;
  return <span className={clsx("rounded-md px-2 py-1 text-xs font-medium ring-1", sentimentStyles[value])}>{value}</span>;
}
