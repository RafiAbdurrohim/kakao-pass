"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, setUser, type User } from "@/lib/fb";
import { AnimatePresence, motion } from "motion/react";
import { KakaoPassLogo } from "@/components/KakaoPassLogo";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  QrCode,
  User as UserIcon,
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
      setErrorMessage("Masukkan No. HP atau ID Anda.");
      return;
    }

    if (pin.length < 4) {
      setErrorMessage("PIN minimal 4 hingga 6 digit.");
      return;
    }

    void doLogin(identifier, pin);
  };

  const doLogin = async (id: string, p: string) => {
    setIsLoading(true);
    try {
      const u = await login(id, p);
      if (!u) {
        setErrorMessage("No. HP/ID atau PIN salah.");
      } else {
        setUser(u);
        setWho(u);
        setLoginSuccess(true);
        setTimeout(() => router.push(u.role === "admin" ? "/admin" : "/dashboard"), 800);
      }
    } catch {
      setErrorMessage("Koneksi gagal. Periksa koneksi internet Anda.");
    }
    setIsLoading(false);
  };

  // Quick Demo for Evaluators
  const handleQuickDemo = (kind: "petani" | "admin") => {
    const [i, p] = kind === "admin" ? ["ADM-001", "202602"] : ["KTIM-024", "202601"];
    setIdentifier(i);
    setPin(p);
    setErrorMessage("");
    void doLogin(i, p);
  };

  return (
    <div className="login-clean-page">
      <div className="login-clean-card">
        {/* Top Header: Back Link */}
        <div className="login-card-header">
          <Link href="/" className="login-back-btn">
            <ArrowLeft size={14} />
            <span>Beranda</span>
          </Link>
          <span className="login-location-chip">Karangan Mandiri</span>
        </div>

        {/* Brand */}
        <div className="login-brand-center">
          <div className="brand">
            <span className="brand-mark">
              <KakaoPassLogo size={26} />
            </span>
            <span className="brand-name">
              kakao<span>pass</span>
            </span>
          </div>
          <h1>Masuk Akun</h1>
          <p>Portal Petani &amp; Penyuluh Lapangan</p>
        </div>

        {/* Success View */}
        <AnimatePresence>
          {loginSuccess && (
            <motion.div
              className="login-success-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="login-success-icon">
                <CheckCircle2 size={32} />
              </div>
              <h3>Selamat Datang, {who?.name}</h3>
              <p>Membuka dashboard sistem...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        {!loginSuccess && (
          <form onSubmit={handleSubmit} className="login-clean-form">
            {errorMessage && (
              <div className="login-error-pill" role="alert">
                <HelpCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-field-clean">
              <label htmlFor="identifier">No. HP atau ID</label>
              <div className="input-box-clean">
                <UserIcon size={16} className="field-icon" />
                <input
                  id="identifier"
                  type="text"
                  placeholder="Contoh: 0812... atau KTIM-024"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-field-clean">
              <div className="field-label-row">
                <label htmlFor="pin">PIN (6 Digit)</label>
                <button
                  type="button"
                  className="btn-forgot-subtle"
                  onClick={() =>
                    alert("Untuk bantuan PIN, silakan hubungi penyuluh lapangan atau ketua kelompok tani.")
                  }
                >
                  Lupa PIN?
                </button>
              </div>
              <div className="input-box-clean">
                <KeyRound size={16} className="field-icon" />
                <input
                  id="pin"
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="PIN 6 digit"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-eye-toggle"
                  onClick={() => setShowPin(!showPin)}
                  aria-label={showPin ? "Sembunyikan PIN" : "Tampilkan PIN"}
                >
                  {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="form-remember-row">
              <label className="checkbox-clean">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ingat saya di perangkat ini</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Memeriksa...</span>
              ) : (
                <>
                  <span>Masuk ke Portal</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            {/* Quick Demo Links (Subtle & Clean) */}
            <div className="login-quick-demo-row">
              <span>Akun coba:</span>
              <button
                type="button"
                className="demo-chip-btn"
                onClick={() => handleQuickDemo("petani")}
                disabled={isLoading}
              >
                Petani (Pak Budi)
              </button>
              <span>·</span>
              <button
                type="button"
                className="demo-chip-btn"
                onClick={() => handleQuickDemo("admin")}
                disabled={isLoading}
              >
                Penyuluh (Bu Sari)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
