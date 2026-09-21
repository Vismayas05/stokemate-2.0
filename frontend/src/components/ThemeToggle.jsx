
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.04 }}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-sm transition hover:border-emerald-500 hover:text-emerald-500"
    >
      {theme === "light" ? (
        <Moon size={19} />
      ) : (
        <Sun size={19} className="text-amber-400" />
      )}
    </motion.button>
  );
}
