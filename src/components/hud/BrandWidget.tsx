"use client";

import React from "react";

export function BrandWidget() {
  return (
    <div className="absolute top-5 left-5 z-20 select-none pointer-events-auto">
      <div
        className="relative group cursor-pointer"
        aria-label="Logo Nusa Antara"
        title="Nusa Antara — Peta Petualangan"
      >
        <img
          src="/mandala.png"
          alt="Logo Mandala Nusa Antara"
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-out group-hover:rotate-90 group-hover:scale-105"
        />
      </div>
    </div>
  );
}
