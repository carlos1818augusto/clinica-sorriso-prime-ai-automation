"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatDay } from "@/lib/format";
import type { Conversation, Message } from "@/types/database";
import { ConversationsByDayChart, StatusDistributionChart } from "@/components/dashboard-charts";
import { EmptyState, ErrorState, LoadingState } from "@/components/loading-state";
import { MetricCard } from "@/components/metric-card";

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    const [conversationResult, messageResult] = await Promise.all([
      supabase.from("conversations").select("*").order("updated_at", { ascending: false }),
      supabase.from("messages").select("*").order("created_at", { ascending: false })
    ]);

    if (conversationResult.error || messageResult.error) {
      setError(conversationResult.error?.message || messageResult.error?.message || "Erro ao ler Supabase.");
    } else {
      setConversations((conversationResult.data || []) as Conversation[]);
      setMessages((messageResult.data || []) as Message[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, loadData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  const metrics = useMemo(() => {
    const byStatus = conversations.reduce<Record<string, number>>((acc, conversation) => {
      acc[conversation.status] = (acc[conversation.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalConversations: conversations.length,
      totalMessages: messages.length,
      ongoing: byStatus.em_andamento || 0,
      waitingHuman: byStatus.aguardando_humano || 0,
      closed: byStatus.encerrada || 0
    };
  }, [conversations, messages]);

  const conversationsByDay = useMemo(() => {
    const grouped = conversations.reduce<Record<string, number>>((acc, conversation) => {
      const day = formatDay(conversation.created_at);
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([day, total]) => ({ day, total }));
  }, [conversations]);

  const statusDistribution = useMemo(
    () => [
      { status: "em andamento", total: metrics.ongoing },
      { status: "aguardando humano", total: metrics.waitingHuman },
      { status: "encerrada", total: metrics.closed }
    ].filter((item) => item.total > 0),
    [metrics]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!conversations.length) return <EmptyState title="Nenhuma conversa encontrada" description="Envie uma mensagem pelo fluxo Evolution API > n8n para popular o Supabase." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard operacional</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Métricas reais das conversas gravadas no Supabase.</p>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard title="Conversas" value={metrics.totalConversations} detail="Total registrado" />
        <MetricCard title="Mensagens" value={metrics.totalMessages} detail="Inbound e outbound" />
        <MetricCard title="Em andamento" value={metrics.ongoing} detail="Atendimentos ativos" />
        <MetricCard title="Aguardando humano" value={metrics.waitingHuman} detail="Precisa intervenção" />
        <MetricCard title="Encerradas" value={metrics.closed} detail="Finalizadas" />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <ConversationsByDayChart data={conversationsByDay} />
        <StatusDistributionChart data={statusDistribution} />
      </section>
    </div>
  );
}
