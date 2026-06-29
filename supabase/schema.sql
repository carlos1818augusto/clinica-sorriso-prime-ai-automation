create extension if not exists "pgcrypto";

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  customer_name text,
  status text not null default 'em_andamento'
    check (status in ('em_andamento', 'aguardando_humano', 'encerrada')),
  intent text
    check (intent in ('orçamento', 'agendamento', 'dúvidas', 'humano', 'outros')),
  sentiment text
    check (sentiment in ('positivo', 'neutro', 'negativo', 'urgente')),
  needs_human boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (phone)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  message_type text not null default 'text' check (message_type in ('text', 'audio', 'image')),
  content text,
  ai_response text,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.agent_events (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_conversations_phone on public.conversations(phone);
create index if not exists idx_conversations_status on public.conversations(status);
create index if not exists idx_conversations_updated_at on public.conversations(updated_at desc);
create index if not exists idx_messages_conversation_created on public.messages(conversation_id, created_at asc);
create index if not exists idx_messages_created_at on public.messages(created_at desc);
create index if not exists idx_agent_events_conversation_created on public.agent_events(conversation_id, created_at desc);

grant usage on schema public to anon, authenticated;
grant select on public.conversations to anon, authenticated;
grant select on public.messages to anon, authenticated;
grant select on public.agent_events to anon, authenticated;

create or replace function public.touch_conversation_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_conversations_updated_at on public.conversations;
create trigger trg_conversations_updated_at
before update on public.conversations
for each row
execute function public.touch_conversation_updated_at();

create or replace function public.touch_conversation_from_message()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  update public.conversations
  set updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists trg_messages_touch_conversation on public.messages;
create trigger trg_messages_touch_conversation
after insert on public.messages
for each row
execute function public.touch_conversation_from_message();

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.agent_events enable row level security;

drop policy if exists "Dashboard can read conversations" on public.conversations;
create policy "Dashboard can read conversations"
on public.conversations for select
to anon, authenticated
using (true);

drop policy if exists "Dashboard can read messages" on public.messages;
create policy "Dashboard can read messages"
on public.messages for select
to anon, authenticated
using (true);

drop policy if exists "Dashboard can read events" on public.agent_events;
create policy "Dashboard can read events"
on public.agent_events for select
to anon, authenticated
using (true);

drop policy if exists "Agent can insert conversations" on public.conversations;
create policy "Agent can insert conversations"
on public.conversations for insert
to anon, authenticated
with check (true);

drop policy if exists "Agent can update conversations" on public.conversations;
create policy "Agent can update conversations"
on public.conversations for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Agent can insert messages" on public.messages;
create policy "Agent can insert messages"
on public.messages for insert
to anon, authenticated
with check (true);

drop policy if exists "Agent can insert events" on public.agent_events;
create policy "Agent can insert events"
on public.agent_events for insert
to anon, authenticated
with check (true);

do $$
begin
  alter publication supabase_realtime add table public.conversations;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.agent_events;
exception when duplicate_object then null;
end $$;
