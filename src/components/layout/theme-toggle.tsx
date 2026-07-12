import { Moon, Sun } from "lucide-react";
import { useUI } from "@/lib/store";

export function ThemeToggle() {
  const darkMode = useUI((s) => s.darkMode);
  const toggle = useUI((s) => s.toggleDarkMode);

  return (
    <button
      onClick={toggle}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors overflow-hidden"
    >
      <span
        key={darkMode ? "moon" : "sun"}
        className="absolute inset-0 flex items-center justify-center theme-icon-anim"
      >
        {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </span>
    </button>
  );
}