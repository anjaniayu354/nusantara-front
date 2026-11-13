"use client";

import React, { useEffect, useRef, useState } from "react";

interface BarongAvatarProps {
  size?: number;
  className?: string;
  isActive?: boolean;
}

export function BarongAvatar({
  size = 48,
  className = "",
  isActive = false,
}: BarongAvatarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftEyeballRef = useRef<HTMLDivElement | null>(null);
  const rightEyeballRef = useRef<HTMLDivElement | null>(null);

  const [isBlinking, setIsBlinking] = useState(false);

  // Mouse tracking state via refs for 60fps smoothness without React re-renders
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastMoveTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Natural blink loop (every 2.6s - 5.2s with chance of double-blink)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleBlink = () => {
      const delay = Math.floor(Math.random() * 2600) + 2600;
      timeoutId = setTimeout(() => {
        setIsBlinking(true);

        setTimeout(() => {
          setIsBlinking(false);

          // 20% chance of double blink
          if (Math.random() < 0.2) {
            setTimeout(() => {
              setIsBlinking(true);
              setTimeout(() => {
                setIsBlinking(false);
                scheduleBlink();
              }, 90);
            }, 120);
          } else {
            scheduleBlink();
          }
        }, 95);
      }, delay);
    };

    scheduleBlink();

    return () => clearTimeout(timeoutId);
  }, []);

  // Gaze tracking loop: follows mouse pointer smoothly across the viewport
  useEffect(() => {
    lastMoveTimeRef.current = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      lastMoveTimeRef.current = Date.now();

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.4316; // Eye vertical baseline

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      if (distance === 0) {
        targetRef.current = { x: 0, y: 0 };
        return;
      }

      // Max pupil displacement scaled to icon size
      const maxRadius = Math.max(1.2, rect.width * 0.026);
      const clampDist = Math.min(distance / 20, maxRadius);

      targetRef.current = {
        x: (dx / distance) * clampDist,
        y: (dy / distance) * clampDist,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        handleMouseMove(e.touches[0] as unknown as MouseEvent);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // 60fps silky smooth lerp interpolation loop
    const animateGaze = () => {
      // Auto-recenter if mouse has been idle for > 4 seconds
      if (Date.now() - lastMoveTimeRef.current > 4000) {
        targetRef.current = { x: 0, y: 0 };
      }

      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.14;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.14;

      const tx = currentRef.current.x.toFixed(2);
      const ty = currentRef.current.y.toFixed(2);

      const transformStr = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;

      if (leftEyeballRef.current) {
        leftEyeballRef.current.style.transform = transformStr;
      }
      if (rightEyeballRef.current) {
        rightEyeballRef.current.style.transform = transformStr;
      }

      rafIdRef.current = requestAnimationFrame(animateGaze);
    };

    rafIdRef.current = requestAnimationFrame(animateGaze);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative select-none flex items-center justify-center shrink-0 barong-floating-avatar transition-transform duration-300 ${
        isActive ? "scale-105" : "hover:scale-105"
      } ${className}`}
    >
      {/* 2 Lapisan Gelombang Bayangan Warna-Warni:
          Lapisan 1: Jangan terlalu tipis & jangan terlalu lebar
          Lapisan 2: Lebih tipis dari lapisan pertama & jangan terlalu lebar */}
      <div className="barong-wave-layer-1" aria-hidden="true" />
      <div className="barong-wave-layer-2" aria-hidden="true" />

      {/* Barong Mask Artwork (Tanpa Kotak/Box Pembungkus) */}
      <img
        src="/animasi/assets/bot-base-transparent.png"
        alt="Barong AI Mask"
        className="relative z-[4] w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      />

      {/* Mata Kiri (Mengikuti Mouse & Kedip) */}
      <div
        className={`barong-eye-socket left ${isBlinking ? "blinking" : ""}`}
        style={{
          left: "42.65%",
          top: "43.16%",
        }}
      >
        <div className="barong-sclera" />
        <div ref={leftEyeballRef} className="barong-eyeball">
          <div className="barong-iris">
            <div className="barong-pupil">
              <div className="barong-catchlight" />
              <div className="barong-catchlight-sub" />
            </div>
          </div>
        </div>
        <div className="barong-eyelid-top" />
        <div className="barong-eyelid-bottom" />
      </div>

      {/* Mata Kanan (Mengikuti Mouse & Kedip) */}
      <div
        className={`barong-eye-socket right ${isBlinking ? "blinking" : ""}`}
        style={{
          left: "57.24%",
          top: "43.16%",
        }}
      >
        <div className="barong-sclera" />
        <div ref={rightEyeballRef} className="barong-eyeball">
          <div className="barong-iris">
            <div className="barong-pupil">
              <div className="barong-catchlight" />
              <div className="barong-catchlight-sub" />
            </div>
          </div>
        </div>
        <div className="barong-eyelid-top" />
        <div className="barong-eyelid-bottom" />
      </div>
    </div>
  );
}
