"use client";

import React from "react";
import Link from "next/link";

export function BrandWidget() {
  return (
    <div className="absolute top-5 left-5 z-20 select-none pointer-events-auto">
      <Link
        href="/"
        className="relative group cursor-pointer inline-flex items-center justify-center transition-transform active:scale-95"
        aria-label="Kembali ke Portal Nusa Antara"
        title="Kembali ke Portal Nusa Antara"
      >
        <img
          src="/mandala.png"
          alt="Logo Mandala Nusa Antara"
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)] drop-shadow-[0_0_12px_rgba(245,158,11,0.35)] transition-all duration-700 ease-out group-hover:rotate-90 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.7)]"
        />
      </Link>
    </div>
  );
}
