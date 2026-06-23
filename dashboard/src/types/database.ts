export type ConversationStatus = "em_andamento" | "aguardando_humano" | "encerrada";
export type Intent = "orçamento" | "agendamento" | "dúvidas" | "humano" | "outros";
export type Sentiment = "positivo" | "neutro" | "negativo" | "urgente";
export type MessageDirection = "inbound" | "outbound";
export type MessageType = "text" | "audio" | "image";

export type Conversation = {
  id: string;
  phone: string;
  customer_name: string | null;
  status: ConversationStatus;
  intent: Intent | null;
  sentiment: Sentiment | null;
  needs_human: boolean;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  direction: MessageDirection;
  message_type: MessageType;
  content: string | null;
  ai_response: string | null;
  created_at: string;
};

export type ConversationWithLastMessage = Conversation & {
  messages?: Pick<Message, "content" | "created_at" | "direction">[];
};
