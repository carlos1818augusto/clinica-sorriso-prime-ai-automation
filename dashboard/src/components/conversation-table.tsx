"use client";

import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import type { ConversationWithLastMessage } from "@/types/database";
import { SentimentBadge, StatusBadge } from "./status-badge";

export function ConversationTable({ conversations }: { conversations: ConversationWithLastMessage[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Intenção</th>
              <th className="px-4 py-3">Sentimento</th>
              <th className="px-4 py-3">Humano</th>
              <th className="px-4 py-3">Última atualização</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {conversations.map((conversation) => (
              <tr key={conversation.id} className="hover:bg-slate-50 dark:hover:bg-slate-950">
                <td className="px-4 py-3">
                  <Link href={`/conversations/${conversation.id}`} className="font-medium text-teal hover:underline">
                    {conversation.customer_name || "Sem nome"}
                  </Link>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{conversation.phone}</div>
                </td>
                <td className="px-4 py-3"><StatusBadge value={conversation.status} /></td>
                <td className="px-4 py-3">{conversation.intent || "outros"}</td>
                <td className="px-4 py-3"><SentimentBadge value={conversation.sentiment} /></td>
                <td className="px-4 py-3">{conversation.needs_human ? "Sim" : "Não"}</td>
                <td className="px-4 py-3">{formatDateTime(conversation.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
