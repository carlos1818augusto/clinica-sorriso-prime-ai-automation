# Roteiro do vídeo de apresentação

Tempo sugerido: até 5 minutos.

## 0:00 - 0:30 | Contexto

Apresentar a solução:

> "Este projeto é um agente de IA para WhatsApp da Clínica Sorriso Prime, uma clínica odontológica. Ele responde clientes, classifica intenção e sentimento, identifica casos que precisam de humano e registra tudo em um banco real no Supabase."

## 0:30 - 1:20 | Arquitetura

Mostrar `docs/arquitetura.md` ou o diagrama do README.

Falar:

- WhatsApp entra pela Evolution API.
- n8n recebe o webhook e orquestra o fluxo.
- Gemini gera a resposta e classificações.
- Supabase guarda conversas, mensagens e eventos.
- Next.js mostra métricas reais na Vercel.

## 1:20 - 2:20 | Banco e workflow

Mostrar `supabase/schema.sql` e o workflow no n8n.

Pontos principais:

- `conversations` guarda status, intenção, sentimento e `needs_human`.
- `messages` guarda inbound e outbound.
- `agent_events` guarda logs técnicos.
- Workflow trata fallback caso Gemini ou Evolution falhem.

## 2:20 - 3:30 | Demonstração do fluxo

Enviar mensagem real no WhatsApp:

> "Oi, estou com dor forte no dente. Vocês atendem hoje?"

Mostrar:

- mensagem entrando no n8n;
- resposta automática;
- conversa registrada no Supabase;
- dashboard atualizando.

## 3:30 - 4:30 | Dashboard

Mostrar:

- cards de métricas;
- gráfico de conversas por dia;
- distribuição por status;
- filtro por status;
- busca por telefone ou palavra-chave;
- tela de detalhe com histórico.

## 4:30 - 5:00 | Encerramento

Falar:

> "A solução está preparada para deploy: Supabase com SQL versionado, workflow n8n exportável, dashboard Next.js pronto para Vercel e documentação completa para reproduzir o ambiente."
