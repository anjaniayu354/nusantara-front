"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Route,
  Navigation,
  MapPin,
  Clock,
  Compass,
  CloudSun,
  CloudRain,
  Cloud,
  CloudLightning,
  Wind,
  Droplets,
  Bookmark,
  BookmarkCheck,
  Play,
  RotateCcw,
  X,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  LogIn,
  Trash2,
  Share2,
  Car,
} from "lucide-react";
import { DESTINATIONS, CulturalDestination } from "@/data/destinations";
import {
  RouteWaypoint,
  RouteTrackingResult,
  RouteWeatherStep,
  SavedTravelRoute,
  getSavedRoutes,
  saveRoute,
  deleteSavedRoute,
} from "@/data/routeTracking";
import { AuthUser } from "@/lib/auth";

interface RouteTrackerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  authUser: AuthUser | null;
  startPoint: RouteWaypoint | null;
  endPoint: RouteWaypoint | null;
  routeResult: RouteTrackingResult | null;
  isPickingOnMap: "start" | "end" | null;
  onStartPicking: (type: "start" | "end") => void;
  onCancelPicking: () => void;
  onSelectWaypoint: (type: "start" | "end", point: RouteWaypoint) => void;
  onCalculateRoute: () => void;
  isCalculating: boolean;
  onStartSimulation: () => void;
  isSimulating: boolean;
  onFocusStep: (step: RouteWeatherStep) => void;
  onLoadSavedRoute: (saved: SavedTravelRoute) => void;
  onClearRoute: () => void;
}

export function RouteTrackerDrawer({
  isOpen,
  onClose,
  authUser,
  startPoint,
  endPoint,
  routeResult,
  isPickingOnMap,
  onStartPicking,
  onCancelPicking,
  onSelectWaypoint,
  onCalculateRoute,
  isCalculating,
  onStartSimulation,
  isSimulating,
  onFocusStep,
  onLoadSavedRoute,
  onClearRoute,
}: RouteTrackerDrawerProps) {
  const [activeTab, setActiveTab] = useState<"detail" | "saved">("detail");
  const [savedRoutes, setSavedRoutes] = useState<SavedTravelRoute[]>([]);
  const [customTitle, setCustomTitle] = useState("");
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Load saved routes when drawer opens or user changes
  useEffect(() => {
    if (authUser && authUser.id) {
      setSavedRoutes(getSavedRoutes(authUser.id));
    } else {
      setSavedRoutes([]);
    }
  }, [authUser, isOpen]);

  const handleSaveRoute = () => {
    if (!authUser || !authUser.id || !routeResult) return;
    const saved = saveRoute(
      authUser.id,
      routeResult,
      customTitle || undefined
    );
    setSavedRoutes((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleDeleteSaved = (id: string) => {
    if (!authUser || !authUser.id) return;
    deleteSavedRoute(authUser.id, id);
    setSavedRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  // Weather condition icon helper
  const getWeatherIcon = (cond?: string) => {
    if (!cond) return <CloudSun className="w-3.5 h-3.5 text-amber-500" />;
    const l = cond.toLowerCase();
    if (l.includes("petir") || l.includes("kilat")) {
      return <CloudLightning className="w-3.5 h-3.5 text-amber-400" />;
    }
    if (l.includes("hujan")) {
      return <CloudRain className="w-3.5 h-3.5 text-sky-400" />;
    }
    if (l.includes("kabut") || l.includes("berawan tebal")) {
      return <Cloud className="w-3.5 h-3.5 text-slate-400" />;
    }
    return <CloudSun className="w-3.5 h-3.5 text-amber-400" />;
  };

  if (!isOpen) return null;

  return (
    <aside
      className="fixed z-40 top-14 bottom-11 sm:bottom-12 left-0 sm:left-4 w-full sm:w-[410px] bg-[var(--bx-surface-card)]/98 backdrop-blur-2xl border border-[var(--bx-border-bright)] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[var(--bx-ink)] animate-in slide-in-from-left duration-300"
      aria-label="Panel Pelacak Rute & Cuaca Perjalanan"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-[var(--bx-border)] bg-gradient-to-r from-amber-500/15 via-transparent to-sky-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--gold)]/20 border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)]">
            <Route className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--bx-ink-bright)]">
              Rute & Cuaca Perjalanan
            </h3>
            <p className="text-[10.5px] text-[var(--bx-muted)]">
              BMKG SATU PETA & Navigasi OSRM
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-[var(--bx-muted)] hover:text-[var(--bx-ink-bright)] hover:bg-[var(--bx-border)] transition"
          aria-label="Tutup Panel Rute"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Picking status banner */}
      {isPickingOnMap && (
        <div className="px-3.5 py-2 bg-amber-500/20 border-b border-amber-500/40 text-[11px] text-amber-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Klik peta untuk menentukan:{" "}
              <strong>
                {isPickingOnMap === "start" ? "Titik Awal (Start)" : "Titik Tujuan (Akhir)"}
              </strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onCancelPicking}
            className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 hover:bg-black/60 text-white font-bold"
          >
            Batal
          </button>
        </div>
      )}

      {/* Origin & Destination Input Section */}
      <div className="p-3 border-b border-[var(--bx-border)] bg-[var(--bx-bg)]/60 space-y-2.5">
        {/* Start Point Input */}
        <div className="space-y-1">
          <label className="text-[10.5px] font-semibold text-[var(--bx-muted)] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Titik Awal (Start)
            </span>
            <button
              type="button"
              onClick={() => onStartPicking("start")}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${
                isPickingOnMap === "start"
                  ? "bg-emerald-500 text-slate-950"
                  : "text-emerald-400 hover:bg-emerald-500/10"
              }`}
            >
              {isPickingOnMap === "start" ? "Pilih di Peta..." : "+ Klik di Peta"}
            </button>
          </label>

          <div className="flex gap-1.5">
            <select
              value={startPoint?.name || ""}
              onChange={(e) => {
                const found = DESTINATIONS.find((d) => d.name === e.target.value);
                if (found) {
                  onSelectWaypoint("start", {
                    lat: found.coordinates[0],
                    lng: found.coordinates[1],
                    name: found.name,
                  });
                }
              }}
              className="flex-1 text-xs py-1.5 px-2.5 rounded-lg bg-[var(--bx-surface)] border border-[var(--bx-border)] text-[var(--bx-ink)] focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="">
                {startPoint ? startPoint.name : "— Pilih Destinasi atau Klik Peta —"}
              </option>
              {DESTINATIONS.map((d) => (
                <option key={`start-${d.id}`} value={d.name}>
                  {d.name} ({d.province})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Destination Point Input */}
        <div className="space-y-1">
          <label className="text-[10.5px] font-semibold text-[var(--bx-muted)] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Titik Tujuan (Destinasi)
            </span>
            <button
              type="button"
              onClick={() => onStartPicking("end")}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${
                isPickingOnMap === "end"
                  ? "bg-rose-500 text-white"
                  : "text-rose-400 hover:bg-rose-500/10"
              }`}
            >
              {isPickingOnMap === "end" ? "Pilih di Peta..." : "+ Klik di Peta"}
            </button>
          </label>

          <div className="flex gap-1.5">
            <select
              value={endPoint?.name || ""}
              onChange={(e) => {
                const found = DESTINATIONS.find((d) => d.name === e.target.value);
                if (found) {
                  onSelectWaypoint("end", {
                    lat: found.coordinates[0],
                    lng: found.coordinates[1],
                    name: found.name,
                  });
                }
              }}
              className="flex-1 text-xs py-1.5 px-2.5 rounded-lg bg-[var(--bx-surface)] border border-[var(--bx-border)] text-[var(--bx-ink)] focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="">
                {endPoint ? endPoint.name : "— Pilih Destinasi atau Klik Peta —"}
              </option>
              {DESTINATIONS.map((d) => (
                <option key={`end-${d.id}`} value={d.name}>
                  {d.name} ({d.province})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button: Calculate Route */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            disabled={!startPoint || !endPoint || isCalculating}
            onClick={onCalculateRoute}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-[var(--gold)] hover:brightness-110 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
          >
            {isCalculating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Menghitung Rute & Cuaca...</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4" />
                <span>Cek Rute & Cuaca BMKG</span>
              </>
            )}
          </button>

          {routeResult && (
            <button
              type="button"
              onClick={onClearRoute}
              title="Reset Rute"
              className="p-2 rounded-xl bg-[var(--bx-surface)] hover:bg-[var(--bx-border)] border border-[var(--bx-border)] text-[var(--bx-muted)] transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs: Detail vs Rute Tersimpan */}
      <div className="flex border-b border-[var(--bx-border)] bg-[var(--bx-surface)] text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("detail")}
          className={`flex-1 py-2 border-b-2 text-center transition ${
            activeTab === "detail"
              ? "border-[var(--gold)] text-[var(--gold)] font-bold bg-[var(--gold)]/5"
              : "border-transparent text-[var(--bx-muted)] hover:text-[var(--bx-ink-bright)]"
          }`}
        >
          Rincian Rute & Cuaca
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-2 border-b-2 text-center flex items-center justify-center gap-1 transition ${
            activeTab === "saved"
              ? "border-[var(--gold)] text-[var(--gold)] font-bold bg-[var(--gold)]/5"
              : "border-transparent text-[var(--bx-muted)] hover:text-[var(--bx-ink-bright)]"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Rute Tersimpan</span>
          {savedRoutes.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--gold)]/20 text-[var(--gold)]">
              {savedRoutes.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {activeTab === "saved" ? (
          /* SAVED ROUTES TAB */
          <div className="space-y-2">
            {!authUser ? (
              <div className="p-4 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-center space-y-2">
                <LogIn className="w-6 h-6 text-[var(--gold)] mx-auto opacity-70" />
                <h4 className="text-xs font-bold text-[var(--bx-ink-bright)]">
                  Masuk untuk Akses Rute Tersimpan
                </h4>
                <p className="text-[11px] text-[var(--bx-muted)]">
                  Simpan rute perjalanan budaya dan pantau cuaca kapan saja setelah login.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--gold)] text-slate-950 font-bold text-xs hover:brightness-110 transition mt-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk Sekarang</span>
                </Link>
              </div>
            ) : savedRoutes.length === 0 ? (
              <div className="py-8 text-center text-xs text-[var(--bx-muted)] space-y-1">
                <Bookmark className="w-6 h-6 text-slate-500 mx-auto opacity-50 mb-1" />
                <p>Belum ada rute yang disimpan.</p>
                <p className="text-[10px]">
                  Hitung rute di tab rincian lalu klik tombol "Simpan Rute Ini".
                </p>
              </div>
            ) : (
              savedRoutes.map((saved) => (
                <div
                  key={saved.id}
                  className="p-3 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] hover:border-[var(--gold)]/60 transition group space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-1">
                    <h5 className="text-xs font-bold text-[var(--bx-ink-bright)] group-hover:text-[var(--gold)] transition">
                      {saved.title}
                    </h5>
                    <button
                      type="button"
                      onClick={() => handleDeleteSaved(saved.id)}
                      title="Hapus Rute"
                      className="text-[var(--bx-muted)] hover:text-rose-400 p-0.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-[var(--bx-muted)] flex items-center gap-2">
                    <span>{saved.startName} → {saved.destName}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[var(--bx-border)] text-[10px]">
                    <span className="text-[var(--gold)] font-mono font-bold">
                      {saved.distanceKm} km • {Math.round(saved.durationMinutes)} mnt
                    </span>
                    <button
                      type="button"
                      onClick={() => onLoadSavedRoute(saved)}
                      className="px-2 py-0.5 rounded bg-[var(--gold)]/15 hover:bg-[var(--gold)] text-[var(--gold)] hover:text-slate-950 font-bold transition"
                    >
                      Tampilkan di Peta →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : routeResult ? (
          /* ROUTE DETAILS & WEATHER STEPS */
          <div className="space-y-3">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-center">
                <span className="text-[9.5px] uppercase font-bold text-[var(--bx-muted)] block">
                  Jarak Total
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[var(--bx-ink-bright)] font-mono">
                  {routeResult.totalDistanceKm} km
                </span>
              </div>

              <div className="p-2 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-center">
                <span className="text-[9.5px] uppercase font-bold text-[var(--bx-muted)] block">
                  Estimasi Waktu
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[var(--gold)] font-mono">
                  {Math.floor(routeResult.totalDurationMinutes / 60) > 0
                    ? `${Math.floor(routeResult.totalDurationMinutes / 60)}j `
                    : ""}
                  {Math.round(routeResult.totalDurationMinutes % 60)}m
                </span>
              </div>

              <div className="p-2 rounded-xl bg-[var(--bx-bg)] border border-[var(--bx-border)] text-center">
                <span className="text-[9.5px] uppercase font-bold text-[var(--bx-muted)] block">
                  Suhu Rata-rata
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-sky-400 font-mono">
                  {routeResult.avgTemperature}°C
                </span>
              </div>
            </div>

            {/* Weather & Safety Advisory Card */}
            <div
              className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                routeResult.safetyIndex === "AMAN"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-300"
              }`}
            >
              {routeResult.safetyIndex === "AMAN" ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="text-[11px] leading-snug">
                <div className="font-bold flex items-center gap-1.5">
                  <span>Indeks Perjalanan: {routeResult.safetyIndex}</span>
                  <span className="text-[9.5px] px-1 py-0.2 rounded bg-black/30 font-mono">
                    {routeResult.dominantCondition}
                  </span>
                </div>
                <p className="opacity-90 mt-0.5 text-[10.5px]">
                  {routeResult.safetyReason}
                </p>
              </div>
            </div>

            {/* Route Action Tools: Simulation & Save */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onStartSimulation}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-[var(--bx-bg)] hover:bg-[var(--gold)]/15 border border-[var(--gold)]/40 text-[var(--gold)] font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Car className="w-3.5 h-3.5" />
                <span>{isSimulating ? "Ulangi Simulasi" : "Simulasi Perjalanan"}</span>
              </button>

              {authUser ? (
                <button
                  type="button"
                  onClick={handleSaveRoute}
                  className="py-1.5 px-3 rounded-lg bg-[var(--gold)] hover:brightness-110 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs transition active:scale-95 shrink-0"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Simpan Rute</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  title="Masuk untuk menyimpan rute"
                  className="py-1.5 px-3 rounded-lg bg-[var(--bx-bg)] border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--gold)] font-bold text-xs flex items-center gap-1 transition shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk untuk Simpan</span>
                </Link>
              )}
            </div>

            {isSavedToast && (
              <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-semibold animate-in fade-in">
                ✓ Rute perjalanan berhasil disimpan ke akun Anda!
              </div>
            )}

            {/* Turn by turn and weather along road */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--bx-ink-bright)] pt-1">
                <span>Panduan Jalan & Cuaca Tiap Ruas</span>
                <span className="text-[10px] text-[var(--bx-muted)]">
                  {routeResult.steps.length} Ruas
                </span>
              </div>

              <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-0.5">
                {routeResult.steps.map((st) => (
                  <div
                    key={`step-${st.index}`}
                    onClick={() => onFocusStep(st)}
                    className="p-2 rounded-xl bg-[var(--bx-bg)]/80 hover:bg-[var(--bx-surface-card)] border border-[var(--bx-border)] hover:border-[var(--gold)]/60 cursor-pointer transition text-[11px] space-y-1 group"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 font-bold text-[var(--bx-ink-bright)] group-hover:text-[var(--gold)] transition">
                        <Navigation
                          className="w-3 h-3 text-amber-500 shrink-0"
                          style={{ transform: `rotate(${st.bearing}deg)` }}
                        />
                        <span className="truncate">
                          {st.streetName || st.instruction || `Ruas KM ${st.index}`}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--bx-muted)] shrink-0">
                        {st.distanceKm} km
                      </span>
                    </div>

                    {/* Step Weather Snapshot from BMKG */}
                    {st.weather && (
                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[var(--bx-border)] text-[var(--bx-muted)]">
                        <div className="flex items-center gap-1 text-[var(--bx-ink)]">
                          {getWeatherIcon(st.weather.condition)}
                          <span>{st.weather.condition}</span>
                          <span className="text-amber-400 font-bold font-mono">
                            {st.weather.temperature}°C
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9.5px]">
                          <span className="flex items-center gap-0.5">
                            <Droplets className="w-2.5 h-2.5 text-sky-400" />
                            {st.weather.humidity}%
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Wind className="w-2.5 h-2.5 text-slate-400" />
                            {st.weather.windDirection} {st.weather.windSpeed}m/s
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="py-10 text-center text-xs text-[var(--bx-muted)] space-y-2">
            <Route className="w-8 h-8 text-[var(--gold)] mx-auto opacity-50" />
            <p className="font-semibold text-[var(--bx-ink-bright)]">
              Pilih Titik Awal & Tujuan
            </p>
            <p className="text-[11px] max-w-[240px] mx-auto text-[var(--bx-muted)]">
              Tentukan lokasi awal dan akhir perjalanan dengan memilih destinasi budaya atau langsung klik di peta untuk menganalisis rute dan kondisi cuaca BMKG.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
