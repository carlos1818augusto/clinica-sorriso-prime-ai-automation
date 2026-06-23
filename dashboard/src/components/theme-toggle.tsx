"use client";

import { useContext } from "react";
import { ThemeContext } from "./theme-provider";

export function ThemeToggle({ icons }: { icons: { sun: React.ReactNode; moon: React.ReactNode } }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      {theme === "dark" ? icons.sun : icons.moon}
    </button>
  );
}
