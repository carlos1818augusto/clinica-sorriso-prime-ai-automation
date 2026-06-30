# Entrega do teste técnico

## Links públicos

- GitHub: https://github.com/carlos1818augusto/clinica-sorriso-prime-ai-automation
- Dashboard publicado: https://dashboard-seven-liart-80.vercel.app/dashboard
- Workflow n8n ativo: `Agente WhatsApp IA - Clinica Sorriso Prime`
- Webhook de produção: `https://carlos1818.app.n8n.cloud/webhook/whatsapp-sorriso-prime`
- Evolution API: Railway, instância `sorriso-prime`

## Arquivos para enviar

- Workflow exportado: `n8n/workflow-agente-whatsapp.json`
- SQL Supabase: `supabase/schema.sql`
- Roteiro do vídeo: `docs/roteiro-video.md`
- Arquitetura: `docs/arquitetura.md`
- Vibe Coding Journal: `docs/vibe-coding-journal.md`

## Status da entrega

- [x] Workflow n8n com webhook de entrada.
- [x] Integração real com Evolution API open source.
- [x] Integração com Gemini.
- [x] Resposta automática enviada ao WhatsApp.
- [x] Supabase/Postgres gravando conversas, mensagens e eventos.
- [x] Dashboard Next.js publicado na Vercel.
- [x] Dashboard conectado a dados reais, sem mock.
- [x] Cards de métricas, gráficos, filtros, busca e detalhe de conversa.
- [x] Tema claro/escuro simples.
- [x] Repositório GitHub público com documentação.
- [x] Teste real validado com mensagem inbound, resposta outbound e registro no Supabase.

## Texto pronto para WhatsApp

Olá! Seguem os entregáveis do teste técnico:

GitHub:
https://github.com/carlos1818augusto/clinica-sorriso-prime-ai-automation

Dashboard publicado:
https://dashboard-seven-liart-80.vercel.app/dashboard

Workflow n8n:
Arquivo JSON exportado em `n8n/workflow-agente-whatsapp.json` no repositório.

Resumo:
Criei um agente de atendimento para a Clínica Sorriso Prime usando n8n, Evolution API, Gemini, Supabase/Postgres e dashboard em Next.js. O fluxo recebe mensagens do WhatsApp, classifica intenção/sentimento, grava tudo no Supabase e responde automaticamente pelo WhatsApp. O dashboard publicado mostra métricas e conversas reais geradas pelo agente.

Vídeo:
[colar aqui o link do Loom ou arquivo do vídeo]

## Sequência recomendada para gravar o vídeo

1. Mostrar rapidamente o README e a arquitetura.
2. Abrir o n8n e mostrar o workflow ativo.
3. Enviar uma mensagem real no WhatsApp para o número conectado.
4. Mostrar a resposta automática chegando no WhatsApp.
5. Abrir o dashboard publicado e mostrar a nova conversa aparecendo.
6. Mostrar `/conversations` e o detalhe da conversa.
7. Mostrar no GitHub a estrutura `n8n`, `supabase`, `dashboard` e `docs`.
8. Fechar explicando o uso de Codex/vibe coding e as decisões registradas no Vibe Coding Journal.
