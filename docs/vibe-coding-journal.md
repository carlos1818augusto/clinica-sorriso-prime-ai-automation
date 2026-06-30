# Vibe Coding Journal

## Prompts usados

Prompt principal:

> Criar uma solução completa para teste técnico de Analista de IA e Automações com agente IA no WhatsApp usando n8n, Evolution API, Gemini, Supabase e dashboard Next.js.

Prompts derivados durante o desenvolvimento:

- Definir schema mínimo para conversas, mensagens e eventos.
- Criar workflow n8n exportável com webhook, Supabase, Gemini e Evolution API.
- Criar dashboard sem dados mockados, lendo diretamente do Supabase.
- Documentar configuração, deploy, vídeo e checklist final.

## Decisões técnicas

- **Upsert por telefone:** evita conversas duplicadas para o mesmo número.
- **Anon key no teste técnico:** o dashboard e o n8n usam anon key com RLS ajustado para facilitar a demonstração.
- **Realtime no dashboard:** as páginas recarregam dados quando Supabase emite mudanças.
- **Gemini retornando JSON:** facilita atualizar `intent`, `sentiment`, `status` e `needs_human`.
- **Fallback de IA:** se Gemini falhar, o cliente recebe uma resposta educada e a conversa vai para humano.
- **RLS com leitura pública:** simplifica o teste técnico; em produção, recomenda-se autenticar o dashboard.

## Erros comuns e correções

- **Payload da Evolution API muda entre versões:** ajustar o node `Normalizar mensagem` conforme o payload real.
- **Gemini retorna texto fora de JSON:** manter `responseMimeType: application/json` e fallback no node `Tratar resposta IA`.
- **Realtime não atualiza:** confirmar se as tabelas foram adicionadas à publication `supabase_realtime`.
- **Dashboard vazio:** gerar dados pelo fluxo real do n8n, não inserir mock manual no frontend.
- **Erro 401 no Supabase via n8n:** conferir `SUPABASE_ANON_KEY`, permissões RLS e headers `apikey` e `Authorization`.
- **Evolution API não envia mensagem:** confirmar `EVOLUTION_API_URL`, `EVOLUTION_INSTANCE` e endpoint `/message/sendText/{instance}`.
- **QR Code da Evolution expirado:** gerar novo QR em `/instance/connect/{instance}` e escanear imediatamente.

## Melhorias futuras

- Autenticação no dashboard.
- Fila de atendimento humano.
- Transcrição de áudio.
- Anexos e imagens de radiografia.
- Resumo automático da conversa para o dentista.
- Integração com calendário para agendamentos reais.
