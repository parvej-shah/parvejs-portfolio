"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(current);
    }

    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(current);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Ignore localStorage errors in private mode
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
          : "Toggle color theme"
      }
      className={cn(
        "relative grid size-10 place-items-center rounded-full border border-line bg-ink-2/60 text-foreground transition-all duration-300 hover:border-brand/40 hover:bg-ink-3 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        className
      )}
    >
      <Sun
        className={cn(
          "size-4.5 transition-all duration-300",
          mounted && theme === "light"
            ? "rotate-0 scale-100 opacity-100 text-amber-500"
            : "absolute rotate-90 scale-0 opacity-0 pointer-events-none"
        )}
      />
      <Moon
        className={cn(
          "size-4.5 transition-all duration-300",
          mounted && theme === "dark"
            ? "rotate-0 scale-100 opacity-100 text-foreground"
            : "absolute -rotate-90 scale-0 opacity-0 pointer-events-none"
        )}
      />
      {/* Fallback while not mounted */}
      {!mounted && <Moon className="size-4.5 opacity-50" />}
    </button>
  );
}
