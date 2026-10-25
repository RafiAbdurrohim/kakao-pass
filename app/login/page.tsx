"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, setUser, type User } from "@/lib/fb";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Leaf,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [who, setWho] = useState<User | null>(null);
  const router = useRouter();

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier.trim()) {
      setErrorMessage("Silakan masukkan Nomor WhatsApp atau ID Petani Anda.");
      return;
    }

    if (pin.length < 4) {
      setErrorMessage("PIN keamanan minimal 4 hingga 6 digit.");
      return;
    }

    void doLogin(identifier, pin);
  };

  const doLogin = async (id: string, p: string) => {
    setIsLoading(true);
    try {
      const u = await login(id, p);
      if (!u) {
        setErrorMessage("ID/nomor HP atau PIN tidak cocok.");
      } else {
        setUser(u);
        setWho(u);
        setLoginSuccess(true);
        setTimeout(() => router.push(u.role === "admin" ? "/admin" : "/dashboard"), 900);
      }
    } catch {
      setErrorMessage("Tidak bisa terhubung ke database. Periksa internet dan aturan Firebase.");
    }
    setIsLoading(false);
  };

  // 1-Click Quick Demo for FORMIKA Competition Judges
  const handleQuickDemo = (kind: "petani" | "admin") => {
    const [i, p] = kind === "admin" ? ["ADM-001", "202602"] : ["KTIM-024", "202601"];
    setIdentifier(i);
    setPin(p);
    setErrorMessage("");
    void doLogin(i, p);
  };

  return (
    <div className="login-hero-view">
      {/* Background Decorative Ambient Layers */}
      <div className="login-bg-pattern" />
      <div className="login-ambient-orb orb-top-left" />
      <div className="login-ambient-orb orb-bottom-right" />
      <div className="login-ambient-orb orb-center" />

      {/* Floating Botanical Leaf Watermarks */}
      <svg
        className="login-bg-botanical leaf-left"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M20 180 C40 100 120 40 180 20 C140 100 80 160 20 180 Z"
          fill="#718263"
          fillOpacity="0.08"
        />
        <path
          d="M20 180 C80 120 120 80 180 20"
          stroke="#718263"
          strokeWidth="1.5"
          strokeOpacity="0.12"
        />
      </svg>
      <svg
        className="login-bg-botanical leaf-right"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M180 20 C100 40 40 120 20 180 C100 140 160 80 180 20 Z"
          fill="#b7653e"
          fillOpacity="0.06"
        />
      </svg>

      {/* Centered Compact Hero Card */}
      <div className="login-compact-card">
        {/* Top Header Row: Back Link & Portal Chip */}
        <div className="card-topline">
          <Link href="/" className="back-link">
            <ArrowLeft size={15} />
            <span>Beranda</span>
          </Link>

          <span className="portal-pill">
            <span className="live-dot-green" />
            Portal Petani
          </span>
        </div>

        {/* Brand Logo & Title */}
        <div className="card-brand-header">
          <Link href="/" className="compact-brand">
            <span className="brand-mark-small">
              <QrCode size={18} strokeWidth={2.2} />
            </span>
            <span className="brand-name-text">
              kakao<span>pass</span>
            </span>
          </Link>
          <h2>Masuk Akun Petani</h2>
          <p>Kelompok Tani Karangan Mandiri · Kutai Timur</p>
        </div>

        {/* Success State Overlay */}
        <AnimatePresence>
          {loginSuccess && (
            <motion.div
              className="compact-success-view"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
            >
              <div className="success-icon-badge">
                <CheckCircle2 size={34} className="text-green" />
              </div>
              <h3>Selamat Datang, {who?.name}!</h3>
              <p>Otentikasi berhasil. Anda terhubung ke sistem pemantauan IoT.</p>
              <div className="success-pill">
                <span>ID: <strong>{who?.id}</strong></span>
                <span>·</span>
                <span><strong>{who?.group}</strong></span>
              </div>
              <Link href={who?.role === "admin" ? "/admin" : "/dashboard"} className="button button-primary btn-full">
                Buka Dashboard Petani <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="btn-text-subtle"
                onClick={() => {
                  setLoginSuccess(false);
                  setIdentifier("");
                  setPin("");
                }}
              >
                Ganti Akun Lain
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Body */}
        {!loginSuccess && (
          <div className="card-form-body">
            {/* 1-Click Competition Demo Showcase (FORMIKA Judges) */}
            <div className="login-demo-section">
              <div className="demo-header-row">
                <span className="demo-header-tag">
                  <Sparkles size={11} style={{ color: "#d97706" }} />
                  SIMULASI JURI FORMIKA 2026
                </span>
                <span className="demo-header-sub">Masuk instan 1-klik</span>
              </div>

              <div className="persona-grid">
                {/* Persona 1: Pak Budi (Petani) */}
                <button
                  type="button"
                  className="persona-card persona-petani"
                  onClick={() => handleQuickDemo("petani")}
                  disabled={isLoading}
                >
                  <div className="persona-top">
                    <div className="persona-avatar green">
                      <Sprout size={14} />
                    </div>
                    <span className="persona-chip green">Petani</span>
                  </div>
                  <div className="persona-body">
                    <strong className="persona-name">Pak Budi</strong>
                    <span className="persona-role">Kebun Karangan</span>
                  </div>
                  <div className="persona-footer">
                    <span>Masuk Petani</span>
                    <ArrowRight size={11} />
                  </div>
                </button>

                {/* Persona 2: Bu Sari (Admin / Penyuluh) */}
                <button
                  type="button"
                  className="persona-card persona-admin"
                  onClick={() => handleQuickDemo("admin")}
                  disabled={isLoading}
                >
                  <div className="persona-top">
                    <div className="persona-avatar rust">
                      <ShieldCheck size={14} />
                    </div>
                    <span className="persona-chip rust">Verifikator</span>
                  </div>
                  <div className="persona-body">
                    <strong className="persona-name">Bu Sari</strong>
                    <span className="persona-role">PPL &amp; Admin Mutu</span>
                  </div>
                  <div className="persona-footer">
                    <span>Masuk Admin</span>
                    <ArrowRight size={11} />
                  </div>
                </button>
              </div>
            </div>

            <div className="form-or-divider">
              <span>atau isi manual</span>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="compact-error-alert" role="alert">
                <HelpCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="compact-form">
              {/* Single Versatile Input: Phone or Farmer ID */}
              <div className="form-group-compact">
                <label htmlFor="farmer-identifier">
                  Nomor WhatsApp atau ID Petani
                </label>
                <div className="input-wrap">
                  <Sprout size={16} className="input-icon-left" />
                  <input
                    id="farmer-identifier"
                    type="text"
                    placeholder="Contoh: 08123456789 atau KTIM-024"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="compact-input"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* PIN Input Field */}
              <div className="form-group-compact">
                <div className="label-row">
                  <label htmlFor="farmer-pin">PIN Keamanan (6 Digit)</label>
                  <button
                    type="button"
                    className="forgot-pin-link"
                    onClick={() =>
                      alert(
                        "Untuk mereset PIN, hubungi Ketua Kelompok Tani atau Pendamping Lapangan via WhatsApp."
                      )
                    }
                  >
                    Lupa PIN?
                  </button>
                </div>

                <div className="input-wrap">
                  <KeyRound size={16} className="input-icon-left" />
                  <input
                    id="farmer-pin"
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="compact-input pin-styled"
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    onClick={() => setShowPin(!showPin)}
                    aria-label={showPin ? "Sembunyikan PIN" : "Tampilkan PIN"}
                  >
                    {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="remember-row">
                <label className="checkbox-compact">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Ingat saya di HP ini</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="button button-primary btn-full btn-login-compact"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner-wrap">
                    <span className="spinner-dot" />
                    Memverifikasi...
                  </span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Assistance Link */}
            <div className="assistance-footer">
              <a
                href="https://wa.me/6281258202026?text=Halo%20KakaoPass,%20saya%20petani%20butuh%20bantuan%20login"
                target="_blank"
                rel="noopener noreferrer"
                className="assistance-link"
              >
                <MessageCircle size={14} className="text-green" />
                <span>Butuh bantuan? Chat Pendamping Lapangan</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
