"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-2 w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
      style={{
        background: "var(--muted)",
        border: "1px solid var(--border-outline)",
        color: "var(--color-text-nav)",
      }}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun size={16} style={{ color: "var(--color-accent-italic)" }} />
      ) : (
        <Moon size={16} style={{ color: "var(--color-primary)" }} />
      )}
    </button>
  );
}
