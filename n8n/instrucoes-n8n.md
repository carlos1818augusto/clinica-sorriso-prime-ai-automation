# Instruções do n8n

## Variáveis obrigatórias

Configure estas variáveis no ambiente do n8n antes de ativar o workflow:

```env
EVOLUTION_API_URL=https://sua-evolution-api.com
EVOLUTION_API_KEY=sua-chave-evolution
EVOLUTION_INSTANCE=sorriso-prime
GEMINI_API_KEY=sua-chave-gemini
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-publica
```

## Importação

1. Acesse o n8n.
2. No editor, abra `Barra de comandos` e escolha `Importar fluxo de trabalho a partir de um URL`.
3. Use a URL raw do arquivo `n8n/workflow-agente-whatsapp.json` no GitHub.
4. Abra o node `Webhook Evolution API` e copie a URL de produção.
5. Configure essa URL como webhook da instância na Evolution API.
6. Ative o workflow.

## Fluxo

1. A Evolution API envia o evento para o webhook.
2. O node `Normalizar mensagem` extrai telefone, nome, texto e tipo.
3. O Supabase faz upsert da conversa usando `phone` como chave única.
4. O n8n grava a mensagem inbound.
5. O Gemini gera resposta e classificação em JSON.
6. O n8n atualiza `intent`, `sentiment`, `status` e `needs_human`.
7. A resposta outbound é gravada no Supabase.
8. A resposta é enviada para o WhatsApp pela Evolution API.
9. O resultado é registrado em `agent_events`.

## Observações

- O workflow usa a variavel `SUPABASE_ANON_KEY`; para este teste, o Supabase tem politicas RLS permitindo escrita do agente.
- Se o Gemini falhar ou retornar JSON inválido, o workflow usa uma resposta de fallback e marca `needs_human = true`.
- O dashboard usa apenas `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
