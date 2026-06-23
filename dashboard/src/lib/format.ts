import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateTime(value: string) {
  return format(parseISO(value), "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function formatDay(value: string) {
  return format(parseISO(value), "dd/MM", { locale: ptBR });
}

export function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}
