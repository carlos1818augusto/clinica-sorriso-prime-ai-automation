import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Activity, MessageCircle, Moon, Sun } from "lucide-react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clínica Sorriso Prime | IA Dashboard",
  description: "Dashboard de conversas reais do agente IA no WhatsApp."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-mist text-ink transition-colors dark:bg-slate-950 dark:text-slate-100">
            <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal text-white">
                    <MessageCircle size={22} />
                  </span>
                  <span>
                    <span className="block text-base font-semibold">Clínica Sorriso Prime</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Agente IA WhatsApp</span>
                  </span>
                </Link>
                <nav className="flex items-center gap-2">
                  <Link className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900" href="/dashboard">
                    Dashboard
                  </Link>
                  <Link className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900" href="/conversations">
                    Conversas
                  </Link>
                  <ThemeToggle icons={{ sun: <Sun size={18} />, moon: <Moon size={18} /> }} />
                </nav>
              </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
            <div className="fixed bottom-4 right-4 hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 sm:flex">
              <Activity size={14} />
              Dados em tempo real via Supabase
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
