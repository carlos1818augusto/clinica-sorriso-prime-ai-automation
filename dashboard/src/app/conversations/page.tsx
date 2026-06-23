"use client";

import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/loading-state";
import { ConversationTable } from "@/components/conversation-table";
import { normalizeSearch } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import type { ConversationStatus, ConversationWithLastMessage } from "@/types/database";

const statuses: Array<"todos" | ConversationStatus> = ["todos", "em_andamento", "aguardando_humano", "encerrada"];

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationWithLastMessage[]>([]);
  const [status, setStatus] = useState<"todos" | ConversationStatus>("todos");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    const { data, error: requestError } = await supabase
      .from("conversations")
      .select("*, messages(content, created_at, direction)")
      .order("updated_at", { ascending: false })
      .limit(1, { referencedTable: "messages" });

    if (requestError) setError(requestError.message);
    else setConversations((data || []) as ConversationWithLastMessage[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel("conversations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, loadData)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  const filtered = useMemo(() => {
    const term = normalizeSearch(query);
    return conversations.filter((conversation) => {
      const matchesStatus = status === "todos" || conversation.status === status;
      const lastMessage = conversation.messages?.[0]?.content || "";
      const haystack = normalizeSearch(`${conversation.phone} ${conversation.customer_name || ""} ${conversation.intent || ""} ${lastMessage}`);
      return matchesStatus && (!term || haystack.includes(term));
    });
  }, [conversations, query, status]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Conversas</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Filtre por status, telefone, nome, intenção ou palavra-chave da última mensagem.</p>
      </div>
      <section className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {statuses.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setStatus(item)}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                status === item ? "bg-teal text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {item.replace("_", " ")}
            </button>
          ))}
        </div>
        <label className="flex min-w-0 items-center gap-2 rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700 lg:w-96">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar telefone ou palavra-chave"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
      </section>
      {filtered.length ? (
        <ConversationTable conversations={filtered} />
      ) : (
        <EmptyState title="Nada encontrado" description="Ajuste os filtros ou gere uma conversa pelo fluxo real do n8n." />
      )}
    </div>
  );
}
