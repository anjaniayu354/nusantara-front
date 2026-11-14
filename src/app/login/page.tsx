"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Compass,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import {
  getStoredUser,
  loginWithPhone,
  loginWithGoogle,
  logout,
  AuthUser,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"phone" | "google" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Check if already logged in on mount
  useEffect(() => {
    const existing = getStoredUser();
    if (existing) {
      setCurrentUser(existing);
    }
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 13) val = val.slice(0, 13);
    setPhone(val);
    if (errorMessage) setErrorMessage(null);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      setErrorMessage("Masukkan nomor handphone yang valid (minimal 9-10 digit).");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage("Kata sandi harus minimal 6 karakter.");
      return;
    }

    setIsLoading(true);
    setAuthMethod("phone");
    setErrorMessage(null);

    try {
      const user = await loginWithPhone(phone, password);
      setCurrentUser(user);
      setSuccessMessage("Berhasil masuk! Mengalihkan ke Portal Dashboard...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch {
      setErrorMessage("Gagal masuk. Silakan periksa kembali nomor HP dan kata sandi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setIsLoading(true);
    setAuthMethod("google");
    setErrorMessage(null);

    try {
      const user = await loginWithGoogle();
      setCurrentUser(user);
      setSuccessMessage("Berhasil masuk via Google! Mengalihkan ke Portal...");
      setTimeout(() => {
        router.push("/");
      }, 900);
    } catch {
      setErrorMessage("Gagal masuk dengan Google SSO. Silakan coba kembali.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setSuccessMessage("Anda telah berhasil keluar.");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="relative h-screen h-[100dvh] max-h-screen w-full bg-[var(--bx-bg)] text-[var(--bx-ink)] flex flex-col justify-between overflow-hidden selection:bg-[var(--gold)] selection:text-[var(--brand)] font-sans">
      {/* Blackbox Architectural Rails Background Overlay */}
      <div className="blackbox-rails" aria-hidden="true">
        <div className="blackbox-rail-inner">
          <span className="blackbox-rail-hatch blackbox-rail-hatch-left" />
          <span className="blackbox-rail-hatch blackbox-rail-hatch-right" />
        </div>
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-14 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bx-surface)] hover:bg-[var(--bx-darker)] border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--gold)] text-xs font-semibold transition active:scale-95 shadow-xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Portal</span>
          </Link>
          <Link
            href="/peta"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 border border-[var(--gold)]/30 text-[var(--gold)] text-xs font-semibold transition active:scale-95 shadow-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buka Peta Petualangan</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <span className="portal-badge-portal !text-[9px]">
              NUSA ANTARA ID
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>
      </header>

      {/* Main Login Card Section - Fitted height, non-scrolling */}
      <main className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center px-4 py-1 sm:py-2 overflow-y-auto">
        <div className="w-full max-w-sm sm:max-w-md my-auto">
          {/* Brand Header */}
          <div className="text-center mb-2.5 sm:mb-3">
            <Link href="/" className="inline-block relative group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 mx-auto mb-1.5 rounded-xl bg-[var(--bx-surface)] border border-[var(--bx-border)] p-1.5 shadow-sm flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <img
                  src="/mandala.png"
                  alt="Logo Nusa Antara"
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--bx-ink-bright)] tracking-tight font-serif leading-tight">
              NUSA ANTARA
            </h1>
            <p className="text-[11px] sm:text-xs text-[var(--bx-muted)] mt-0.5 max-w-xs mx-auto line-clamp-1 sm:line-clamp-none font-sans">
              Masuk untuk menyimpan rencana petualangan & rute budaya.
            </p>
          </div>

          {/* Active User Card (if already logged in) */}
          {currentUser && (
            <div className="mb-2.5 p-3 rounded-xl bg-[var(--bx-surface)] border border-[var(--bx-border)] shadow-sm text-center">
              <div className="flex items-center justify-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-full border border-[var(--gold)]/60 overflow-hidden bg-[var(--bx-bg)] flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-[var(--gold)]" />
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[var(--bx-ink-bright)] font-serif">{currentUser.name}</p>
                    <span className="portal-badge-gold !text-[8px] !px-1.5 !py-0.2">
                      {currentUser.provider}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--bx-muted)] font-mono">
                    {currentUser.phone || currentUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[var(--bx-border)]">
                <Link
                  href="/"
                  className="portal-submit-btn-gold !h-8 !text-xs !px-2 flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Ke Portal</span>
                </Link>
                <Link
                  href="/peta"
                  className="py-1.5 px-2.5 rounded-lg bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] text-[var(--gold)] text-xs font-bold transition border border-[var(--bx-border)] active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Buka Peta</span>
                </Link>
              </div>

              <div className="mt-1.5 pt-1.5 border-t border-[var(--bx-border)] flex justify-center">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-0.5 px-2.5 rounded-md text-[var(--bx-muted)] hover:text-rose-500 text-[11px] font-medium transition flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Ganti Akun / Keluar</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Card (AUI Card Wrap) */}
          <div className="portal-card-wrap !p-4 sm:!p-5 sm:!px-6">
            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-600 dark:text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <p className="flex-1 font-medium">{errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className="mb-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-emerald-600 dark:text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                <p className="flex-1 font-medium">{successMessage}</p>
              </div>
            )}

            {/* Phone & Password Form */}
            <form onSubmit={handlePhoneSubmit} className="space-y-2.5 sm:space-y-3">
              {/* Phone Field */}
              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold text-[var(--bx-ink-bright)] uppercase tracking-wider mb-1 font-mono">
                  Nomor Handphone (WhatsApp / SMS)
                </label>
                <div className="portal-input-wrap">
                  <div className="absolute left-3 flex items-center gap-1 pointer-events-none text-[var(--bx-muted)] border-r border-[var(--bx-border)] pr-2">
                    <span className="text-xs font-bold text-[var(--gold)]">🇮🇩 +62</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="81234567890"
                    autoFocus
                    required
                    className="portal-input !pl-20 sm:!pl-22 !h-10 text-xs sm:text-sm font-mono"
                  />
                  <Smartphone className="absolute right-3 w-4 h-4 text-[var(--bx-muted)] pointer-events-none" />
                </div>
                <p className="text-[9px] text-[var(--bx-muted)] mt-0.5">
                  Contoh: 812-3456-7890 (tanpa angka 0 di depan)
                </p>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] sm:text-[11px] font-bold text-[var(--bx-ink-bright)] uppercase tracking-wider font-mono">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Silakan hubungi administrator atau masukkan nomor HP untuk reset password via OTP WhatsApp.")}
                    className="text-[10px] sm:text-[11px] text-[var(--gold)] hover:underline transition"
                  >
                    Lupa Sandi?
                  </button>
                </div>
                <div className="portal-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masukkan minimal 6 karakter"
                    required
                    className="portal-input !pl-9 !pr-9 !h-10 text-xs sm:text-sm"
                  />
                  <Lock className="absolute left-3 w-4 h-4 text-[var(--bx-muted)] pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[var(--bx-muted)] hover:text-[var(--gold)] transition"
                    title={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-[11px] text-[var(--bx-muted)] pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[var(--bx-border)] text-[var(--gold)] focus:ring-[var(--gold)]/20"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
              </div>

              {/* Submit Phone Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="portal-submit-btn-gold w-full !h-10 mt-1"
              >
                {isLoading && authMethod === "phone" ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <span>Masuk dengan Nomor HP</span>
                )}
              </button>
            </form>

            {/* Divider OR */}
            <div className="relative my-2.5 sm:my-3 flex items-center justify-center">
              <div className="border-t border-[var(--bx-border)] w-full" />
              <span className="bg-[var(--bx-surface-card)] px-2.5 text-[10px] text-[var(--bx-muted)] uppercase tracking-wider font-semibold shrink-0 font-mono">
                Atau
              </span>
              <div className="border-t border-[var(--bx-border)] w-full" />
            </div>

            {/* Google SSO Button */}
            <button
              type="button"
              onClick={handleGoogleSubmit}
              disabled={isLoading}
              className="w-full h-10 px-4 rounded-lg bg-[var(--bx-bg)] hover:bg-[var(--bx-darker)] border border-[var(--bx-border)] hover:border-[var(--gold)] text-[var(--bx-ink)] font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5 group"
            >
              {isLoading && authMethod === "google" ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
                  <span>Menghubungkan ke Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="font-medium">
                    Lanjutkan dengan Google
                  </span>
                </>
              )}
            </button>

            {/* Security Assurance Badge */}
            <div className="mt-2.5 pt-2 border-t border-[var(--bx-border)] flex items-center justify-center gap-1.5 text-[10px] text-[var(--bx-muted)]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Autentikasi Terenkripsi & Privasi Terjaga</span>
            </div>
          </div>

          {/* Quick Registration Hint */}
          <p className="text-center text-[10px] sm:text-[11px] text-[var(--bx-muted)] mt-2 font-sans">
            Belum punya akun? Cukup masukkan nomor HP di atas untuk langsung membuat profil.
          </p>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 h-9 sm:h-10 shrink-0 text-center text-[11px] text-[var(--bx-muted)] border-t border-[var(--bx-border)] flex flex-col sm:flex-row items-center justify-between gap-1">
        <p>© 2026 Nusa Antara — Portal Wisata Budaya Indonesia</p>
        <div className="flex items-center gap-4 text-[var(--bx-muted)]">
          <Link href="/" className="hover:text-[var(--gold)] transition">
            Portal Utama
          </Link>
          <Link href="/peta" className="hover:text-[var(--gold)] transition">
            Peta Petualangan
          </Link>
          <span>BMKG Terintegrasi</span>
        </div>
      </footer>
    </div>
  );
}
