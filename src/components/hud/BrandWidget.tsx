"use client";

import React, { useEffect, useRef } from "react";

export function BrandWidget() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  // Synchronize title width with subtitle width for exact alignment
  useEffect(() => {
    const updateWidth = () => {
      if (!titleRef.current || !subtitleRef.current) return;

      const titleEl = titleRef.current;
      const subEl = subtitleRef.current;

      // Reset letterSpacing to measure raw natural widths
      titleEl.style.letterSpacing = "0px";
      subEl.style.letterSpacing = "0px";

      const rTitle = document.createRange();
      rTitle.selectNodeContents(titleEl);
      const naturalTitleWidth = rTitle.getBoundingClientRect().width;

      const rSub = document.createRange();
      rSub.selectNodeContents(subEl);
      const naturalSubWidth = rSub.getBoundingClientRect().width;

      if (naturalTitleWidth > 0 && naturalSubWidth > 0) {
        if (naturalSubWidth >= naturalTitleWidth) {
          // "Nusa Antara" has 11 chars -> 10 gaps
          const extraSpacing = (naturalSubWidth - naturalTitleWidth) / 10;
          titleEl.style.letterSpacing = `${extraSpacing}px`;
          subEl.style.letterSpacing = "0px";
        } else {
          // "peta petualangan nusantara" has 27 chars -> 26 gaps
          const extraSpacing = (naturalTitleWidth - naturalSubWidth) / 26;
          subEl.style.letterSpacing = `${extraSpacing}px`;
          titleEl.style.letterSpacing = "0px";
        }
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    if (document.fonts) {
      document.fonts.ready.then(updateWidth);
    }

    // Secondary pass to ensure web fonts are completely styled
    const timer = setTimeout(updateWidth, 150);

    return () => {
      window.removeEventListener("resize", updateWidth);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="absolute top-5 left-5 z-20 select-none pointer-events-auto">
      <div className="flex items-center gap-3.5">
        {/* Logo Mandala */}
        <div className="relative group cursor-pointer">
          <img
            src="/mandala.png"
            alt="Logo Mandala Nusantara"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-out group-hover:rotate-90 group-hover:scale-105"
          />
        </div>

        {/* Brand Title and Subtitle: Font Hitam & Tipografi Budaya Nusantara */}
        <div className="flex flex-col justify-center items-start">
          <h1
            ref={titleRef}
            style={{
              color: "#000000",
              textShadow: "0 1px 3px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.75)",
            }}
            className="font-nusantara text-2xl sm:text-[30px] font-normal tracking-wide leading-tight text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]"
          >
            Nusa Antara
          </h1>
          <p
            ref={subtitleRef}
            style={{
              color: "#000000",
              textShadow: "0 1px 2px rgba(255,255,255,0.95), 0 0 8px rgba(255,255,255,0.75)",
            }}
            className="font-aesthetic italic text-xs sm:text-[13px] font-normal leading-tight text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]"
          >
            peta petualangan nusantara
          </p>
        </div>
      </div>
    </div>
  );
}
