"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("nusantara_theme") ||
      localStorage.getItem("anvieo_theme")) as "light" | "dark" | null;
    const currentDocTheme = document.documentElement.getAttribute(
      "data-theme"
    ) as "light" | "dark" | null;
    const active =
      savedTheme === "dark" || currentDocTheme === "dark" ? "dark" : "light";
    setTheme(active);
    document.documentElement.setAttribute("data-theme", active);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("nusantara_theme", next);
    localStorage.setItem("anvieo_theme", next);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="portal-theme-btn"
        aria-label="Ganti Tema Warna"
        style={{ opacity: 0.7 }}
      >
        <Moon className="w-4 h-4 text-[var(--gold)]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      className="portal-theme-btn"
      onClick={toggleTheme}
      aria-label="Ganti Tema Warna"
      title={
        theme === "light"
          ? "Beralih ke Tema Gelap (Dark Mode)"
          : "Beralih ke Tema Terang (Light Mode)"
      }
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-[var(--brand)] hover:text-[var(--gold)] transition-colors" />
      ) : (
        <Sun className="w-4 h-4 text-[var(--gold)] transition-colors" />
      )}
    </button>
  );
}
