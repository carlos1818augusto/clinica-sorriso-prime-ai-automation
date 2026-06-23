import { Bot, UserRound } from "lucide-react";
import { clsx } from "clsx";
import { formatDateTime } from "@/lib/format";
import type { Message } from "@/types/database";

export function MessageTimeline({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const inbound = message.direction === "inbound";
        return (
          <article key={message.id} className={clsx("flex gap-3", inbound ? "justify-start" : "justify-end")}>
            {inbound && (
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                <UserRound size={18} />
              </span>
            )}
            <div className={clsx("max-w-3xl rounded-md px-4 py-3", inbound ? "bg-white dark:bg-slate-900" : "bg-teal text-white")}>
              <div className="flex flex-wrap items-center gap-2 text-xs opacity-80">
                <span>{inbound ? "Cliente" : "Agente IA"}</span>
                <span>{message.message_type}</span>
                <time>{formatDateTime(message.created_at)}</time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.content || message.ai_response || "Mensagem sem conteúdo textual."}</p>
            </div>
            {!inbound && (
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal text-white">
                <Bot size={18} />
              </span>
            )}
          </article>
        );
      })}
    </div>
  );
}
