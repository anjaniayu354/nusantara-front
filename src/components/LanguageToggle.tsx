"use client";

import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import {
  getStoredLanguage,
  setStoredLanguage,
  subscribeLanguage,
  Language,
} from "@/lib/i18n";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const [lang, setLang] = useState<Language>("EN");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLang(getStoredLanguage());
    const unsub = subscribeLanguage((newLang) => {
      setLang(newLang);
    });
    return unsub;
  }, []);

  const handleToggle = () => {
    const nextLang: Language = lang === "EN" ? "ID" : "EN";
    setStoredLanguage(nextLang);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={`h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg border border-[var(--bx-border)] bg-[var(--bx-bg)] text-xs font-bold flex items-center gap-1.5 opacity-70 ${className}`}
        aria-label="Language Selector"
      >
        <Globe className="w-3.5 h-3.5 text-[var(--gold)]" />
        <span className="font-mono text-[11px] font-bold text-[var(--gold)]">EN</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg border border-[var(--bx-border)] hover:border-[var(--gold)] bg-[var(--bx-bg)] hover:bg-[var(--gold)]/10 text-[var(--bx-ink)] transition-all flex items-center gap-1.5 shadow-2xs group cursor-pointer ${className}`}
      title={lang === "EN" ? "Beralih ke Bahasa Indonesia (ID)" : "Switch to English (EN)"}
      aria-label="Toggle Language (EN / ID)"
    >
      <Globe className="w-3.5 h-3.5 text-[var(--gold)] group-hover:rotate-45 transition-transform" />
      <div className="flex items-center text-[11px] font-bold font-mono tracking-tight">
        <span
          className={`transition-colors ${
            lang === "EN"
              ? "text-[var(--gold)] font-extrabold"
              : "text-[var(--bx-muted)] group-hover:text-[var(--bx-ink)]"
          }`}
        >
          EN
        </span>
        <span className="mx-1 text-[var(--bx-border)]">/</span>
        <span
          className={`transition-colors ${
            lang === "ID"
              ? "text-[var(--gold)] font-extrabold"
              : "text-[var(--bx-muted)] group-hover:text-[var(--bx-ink)]"
          }`}
        >
          ID
        </span>
      </div>
    </button>
  );
}
