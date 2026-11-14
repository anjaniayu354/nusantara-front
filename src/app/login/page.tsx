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
  Sparkles,
  Compass,
  LogOut,
  User,
} from "lucide-react";
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

  // Format phone number gracefully (e.g. 0812-3456-7890)
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
      setSuccessMessage("Berhasil masuk! Mengalihkan ke Peta Nusa Antara...");
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
      setSuccessMessage("Berhasil masuk via Google! Mengalihkan ke Peta...");
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
    <div className="relative min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Background Ambience & Cultural Ornaments */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03] bg-repeat"
          style={{
            backgroundImage: "radial-gradient(#f59e0b 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-semibold transition active:scale-95 shadow-lg group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Peta Petualangan</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-amber-400/80 font-black">
            Nusa Antara ID
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-6 sm:mb-8">
            <Link href="/" className="inline-block relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-slate-900 to-amber-600/20 border border-amber-500/40 p-2.5 shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <img
                  src="/mandala.png"
                  alt="Logo Nusa Antara"
                  className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(245,158,11,0.4)]"
                />
              </div>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-tight">
              NUSA ANTARA
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto">
              Masuk untuk menyimpan rencana petualangan, bookmark destinasi adat, dan sinkronisasi rute budaya.
            </p>
          </div>

          {/* Active User Card (if already logged in) */}
          {currentUser && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-amber-600/10 border border-amber-500/40 backdrop-blur-xl shadow-xl text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full border border-amber-400/60 overflow-hidden bg-slate-800 flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-amber-300" />
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-white">{currentUser.name}</p>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 border border-amber-400/30 text-amber-300 font-semibold uppercase">
                      {currentUser.provider}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    {currentUser.phone || currentUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-white/10">
                <Link
                  href="/"
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-4 h-4" />
                  <span>Jelajahi Peta Sekarang</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 border border-white/10 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs font-semibold transition active:scale-95 flex items-center justify-center gap-1.5"
                  title="Keluar dari akun ini"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          )}

          {/* Login Box */}
          <div className="bg-slate-900/85 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />

            {/* Notification Badges */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 animate-bounce" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Phone & Password Login Form */}
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Nomor Handphone (No HP)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 text-slate-400 pointer-events-none border-r border-slate-700 pr-2">
                    <span className="text-base">🇮🇩</span>
                    <span className="text-xs font-mono font-bold text-amber-300">+62</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="812-3456-7890"
                    disabled={isLoading}
                    className="w-full pl-24 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-amber-400 rounded-xl text-white placeholder-slate-500 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                  <Smartphone className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Contoh: 08123456789 atau 8123456789
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Kata Sandi (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Tautan pemulihan kata sandi telah dikirimkan via SMS/WhatsApp ke nomor terdaftar.")}
                    className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline transition"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700 focus:border-amber-400 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="absolute right-3 text-slate-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-slate-900 bg-slate-950"
                  />
                  <span className="text-xs text-slate-400">Ingat saya di perangkat ini</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide uppercase transition-all shadow-[0_4px_20px_rgba(245,158,11,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && authMethod === "phone" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Masuk dengan No HP</span>
                  </>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative bg-slate-900 px-3 text-[11px] uppercase tracking-widest text-slate-400">
                Atau Masuk Menggunakan
              </span>
            </div>

            {/* SSO Google Button */}
            <button
              type="button"
              onClick={handleGoogleSubmit}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-white font-semibold text-sm transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {isLoading && authMethod === "google" ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-amber-300">Menghubungkan ke Google...</span>
                </>
              ) : (
                <>
                  {/* Official Google 'G' SVG Logo */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span className="group-hover:text-amber-200 transition">
                    Masuk dengan Google (SSO)
                  </span>
                </>
              )}
            </button>

            {/* Registration note */}
            <div className="mt-6 text-center text-xs text-slate-400">
              Belum memiliki akun Nusa Antara?{" "}
              <button
                type="button"
                onClick={() => {
                  alert(
                    "Pendaftaran akun baru terbuka otomatis. Cukup masukkan nomor handphone Anda pada form di atas untuk pendaftaran langsung tanpa ribet."
                  );
                }}
                className="font-bold text-amber-400 hover:text-amber-300 hover:underline transition ml-1"
              >
                Daftar Sekarang
              </button>
            </div>
          </div>

          {/* Adat & Security Guarantee Footer */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-500 text-center">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Enkripsi Standar Nasional
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Akses Penuh Rute Budaya
            </span>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-slate-500 border-t border-slate-900 bg-slate-950/60">
        © 2026 Nusa Antara — Pelopor Ekspedisi Digital Budaya & Petualangan Indonesia
      </footer>
    </div>
  );
}
