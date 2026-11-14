"use client";

import React from "react";
import Link from "next/link";

export function BrandWidget() {
  return (
    <div className="absolute top-5 left-5 z-20 select-none pointer-events-auto">
      <Link
        href="/"
        className="relative group cursor-pointer flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900/95 backdrop-blur-md border border-amber-500/30 hover:border-amber-400/80 transition-all shadow-xl active:scale-95"
        aria-label="Kembali ke Portal Nusa Antara"
        title="Kembali ke Portal Dashboard Nusa Antara"
      >
        <img
          src="/mandala.png"
          alt="Logo Mandala Nusa Antara"
          className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-out group-hover:rotate-90 group-hover:scale-105"
        />
        <div className="hidden sm:flex flex-col pr-1 text-left">
          <span className="text-[11px] font-black tracking-widest text-amber-300 font-cinzel leading-tight">
            NUSA ANTARA
          </span>
          <span className="text-[9px] text-amber-400/80 font-semibold flex items-center gap-0.5">
            ← Ke Portal
          </span>
        </div>
      </Link>
    </div>
  );
}
