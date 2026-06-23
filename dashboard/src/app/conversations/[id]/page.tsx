"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MessageTimeline } from "@/components/message-timeline";
import { EmptyState, ErrorState, LoadingState } from "@/components/loading-state";
import { SentimentBadge, StatusBadge } from "@/components/status-badge";
import { formatDateTime } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import type { Conversation, Message } from "@/types/database";

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    const [conversationResult, messageResult] = await Promise.all([
      supabase.from("conversations").select("*").eq("id", params.id).single(),
      supabase.from("messages").select("*").eq("conversation_id", params.id).order("created_at", { ascending: true })
    ]);

    if (conversationResult.error || messageResult.error) {
      setError(conversationResult.error?.message || messageResult.error?.message || "Erro ao carregar conversa.");
    } else {
      setConversation(conversationResult.data as Conversation);
      setMessages((messageResult.data || []) as Message[]);
    }
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel(`conversation-${params.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations", filter: `id=eq.${params.id}` }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `conversation_id=eq.${params.id}` }, loadData)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData, params.id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!conversation) return <EmptyState title="Conversa não encontrada" description="Confirme se o ID existe no Supabase." />;

  return (
    <div className="space-y-6">
      <Link href="/conversations" className="inline-flex items-center gap-2 text-sm font-medium text-teal hover:underline">
        <ArrowLeft size={16} />
        Voltar
      </Link>
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{conversation.customer_name || "Cliente sem nome"}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{conversation.phone}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={conversation.status} />
            <SentimentBadge value={conversation.sentiment} />
            {conversation.needs_human && <span className="rounded-md bg-coral px-2 py-1 text-xs font-medium text-white">precisa humano</span>}
          </div>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div><dt className="text-slate-500 dark:text-slate-400">Intenção</dt><dd className="font-medium">{conversation.intent || "outros"}</dd></div>
          <div><dt className="text-slate-500 dark:text-slate-400">Criada em</dt><dd className="font-medium">{formatDateTime(conversation.created_at)}</dd></div>
          <div><dt className="text-slate-500 dark:text-slate-400">Atualizada em</dt><dd className="font-medium">{formatDateTime(conversation.updated_at)}</dd></div>
        </dl>
      </section>
      {messages.length ? <MessageTimeline messages={messages} /> : <EmptyState title="Sem mensagens" description="O fluxo ainda não gravou mensagens nesta conversa." />}
    </div>
  );
}
