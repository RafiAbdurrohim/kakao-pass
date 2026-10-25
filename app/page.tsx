"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileCheck2,
  Layers,
  Leaf,
  MapPin,
  Menu,
  Phone,
  Play,
  QrCode,
  ShieldCheck,
  Sparkles,
  Thermometer,
  TrendingUp,
  X,
} from "lucide-react";

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="landing-dark-luxury">
      {/* ====================================================================
          1. HEADER / NAVIGASI SLATE DARK
          ==================================================================== */}
      <header className="dark-site-header">
        <div className="dark-nav-wrap">
          <Link href="/" className="dark-brand">
            <span className="brand-glow-box">
              <QrCode size={18} strokeWidth={2.4} />
            </span>
            <span className="dark-brand-text">
              kakao<span className="text-amber">pass</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="dark-nav-links">
            <a href="#solusi">Luaran FORMIKA</a>
            <a href="#video-edukasi">Video Panduan</a>
            <a href="#zero-waste">Zero Waste</a>
            <a href="#alur">Alur Kerja</a>
            <a href="#kontak">Kontak</a>
          </nav>

          {/* Header Action Button */}
          <div className="dark-nav-actions">
            <Link href="/login" className="btn-pill-portal">
              <span>Masuk Portal</span>
              <ArrowUpRight size={14} />
            </Link>

            <button
              type="button"
              className="btn-dark-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="dark-mobile-dropdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <a href="#solusi" onClick={() => setMobileMenuOpen(false)}>Luaran FORMIKA</a>
              <a href="#video-edukasi" onClick={() => setMobileMenuOpen(false)}>Video Panduan</a>
              <a href="#zero-waste" onClick={() => setMobileMenuOpen(false)}>Zero Waste</a>
              <a href="#alur" onClick={() => setMobileMenuOpen(false)}>Alur Kerja</a>
              <a href="#kontak" onClick={() => setMobileMenuOpen(false)}>Kontak</a>
              <Link href="/login" className="btn-pill-portal mobile" onClick={() => setMobileMenuOpen(false)}>
                Masuk Portal Petani &amp; Admin
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ====================================================================
          2. VIDEO MODAL PLAYER (GOOGLE DRIVE EMBED)
          ==================================================================== */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            className="dark-video-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              className="dark-video-modal-dialog"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dark-video-modal-header">
                <div>
                  <span className="modal-amber-tag">LUARAN FORMIKA 2026</span>
                  <h3>Video Edukasi Praktik Fermentasi Mutu</h3>
                </div>
                <button
                  type="button"
                  className="dark-modal-close"
                  onClick={() => setVideoOpen(false)}
                  aria-label="Tutup video"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="dark-video-modal-frame">
                <iframe
                  src="https://drive.google.com/file/d/1-HeXo9qPBZi9DVmPxywXjNDp60gOKwBT/preview"
                  title="Video Panduan Petani Kakao"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>

              <div className="dark-video-modal-footer">
                <p>
                  Dokumentasi pelatihan kelompok tani: pengisian kotak kayu 3 lapis,
                  monitoring sensor suhu IoT, standar uji belah SNI, dan pengolahan kompos kulit kakao.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          3. HERO SECTION (FRAMED DARK LUXURY CANVAS ALA WUDO & SYNAPSEX)
          ==================================================================== */}
      <section className="hero-dark-wrap">
        <div className="hero-framed-container">
          <div className="hero-framed-grid">
            {/* Left Column: Headline Tajam, Font Serif Berkelas & Tombol Kapsul */}
            <div className="hero-left-content">
              <div className="hero-kicker-badge">
                <span className="live-amber-dot" />
                <span>KELOMPOK TANI KARANGAN MANDIRI · KUTAI TIMUR</span>
              </div>

              <h1 className="hero-dark-title">
                Pantau Mutu Fermentasi{" "}
                <span className="serif-title text-amber">Kakao Lebih Pasti.</span>
              </h1>

              <p className="hero-dark-lead">
                Pencatatan suhu kotak kayu berbasis IoT dan standar uji belah SNI
                untuk jaminan mutu panen kelompok tani.
              </p>

              <div className="hero-btn-row">
                <Link href="/login" className="btn-pill-amber">
                  <span>Buka Portal Petani</span>
                  <ArrowRight size={15} />
                </Link>

                <button
                  type="button"
                  className="btn-pill-glass"
                  onClick={() => setVideoOpen(true)}
                >
                  <span className="play-badge-amber">
                    <Play size={12} fill="currentColor" />
                  </span>
                  <span>Tonton Video Edukasi</span>
                </button>
              </div>

              {/* Ticker Nilai Nyata */}
              <div className="hero-metrics-ticker">
                <div className="ticker-pill">
                  <span className="dot-green" />
                  <span>Probe IoT 24/7</span>
                </div>
                <div className="ticker-pill">
                  <span className="dot-amber" />
                  <span>Mutu I SNI 2323</span>
                </div>
                <div className="ticker-pill">
                  <span className="dot-green" />
                  <span>70% Kompos Kulit</span>
                </div>
              </div>
            </div>

            {/* Right Column: Asymmetric Showcase Grid (Foto Asli + Spotlight) */}
            <div className="hero-right-visual">
              {/* Main Photo Card */}
              <div className="main-photo-card">
                <div className="main-photo-wrap">
                  <Image
                    src="/images/kakao-artisan.png"
                    alt="Biji kakao fermentasi artisan Karangan Mandiri"
                    width={640}
                    height={520}
                    priority
                    className="main-photo-img"
                  />
                  <div className="photo-spotlight-gradient" />
                </div>

                {/* Floating Telemetry Badge */}
                <div className="floating-telemetry-badge">
                  <div className="telemetry-icon-box">
                    <Thermometer size={16} />
                  </div>
                  <div>
                    <div className="telemetry-meta">
                      <span className="live-iot-pulse" />
                      <span>Suhu Kotak Fermentasi</span>
                    </div>
                    <strong className="telemetry-value">
                      48.6°C <small>Fase Panas</small>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Bottom Twin Micro-Cards ala Gambar 3 */}
              <div className="hero-twin-cards">
                {/* Micro-Card 1: Kompos Zero Waste */}
                <a href="#zero-waste" className="micro-card-link">
                  <div className="micro-thumb-wrap">
                    <Image
                      src="/images/kakao-flatlay.jpg"
                      alt="Kompos kulit kakao"
                      width={160}
                      height={120}
                      className="micro-thumb-img"
                    />
                  </div>
                  <div className="micro-card-body">
                    <span className="micro-tag">ZERO WASTE</span>
                    <strong>70% Kulit Jadi Pupuk</strong>
                  </div>
                  <span className="micro-arrow-btn">
                    <ArrowUpRight size={13} />
                  </span>
                </a>

                {/* Micro-Card 2: Quick Video Trigger */}
                <button
                  type="button"
                  className="micro-card-link video-trigger"
                  onClick={() => setVideoOpen(true)}
                >
                  <div className="micro-video-icon">
                    <Play size={18} fill="currentColor" />
                  </div>
                  <div className="micro-card-body">
                    <span className="micro-tag amber">DOKUMENTASI</span>
                    <strong>Putar Video Praktik</strong>
                  </div>
                  <span className="micro-arrow-btn">
                    <ArrowUpRight size={13} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. SECTION: TIGA LUARAN FORMIKA (BENTO GRID VISUAL - ZERO ESAY)
          ==================================================================== */}
      <section className="dark-section" id="solusi">
        <div className="section-container">
          <div className="dark-section-header">
            <span className="dark-kicker">LUARAN INOVASI FORMIKA 2026</span>
            <h2>Tiga Standar Dari Kebun Hingga Pabrik</h2>
            <p>
              Telemetri real-time, standar mutu fisik, dan pemanfaatan biomassa limbah kakao.
            </p>
          </div>

          <div className="bento-three-grid">
            {/* Bento 1: Sensor Suhu IoT */}
            <div className="bento-dark-card">
              <div className="bento-topline">
                <span className="bento-badge green">
                  <span className="dot-green" />
                  Telemetri Real-Time
                </span>
                <span className="bento-num">01</span>
              </div>

              <div className="bento-metric-block">
                <span className="metric-super-text">48.6°C</span>
                <span className="metric-label">Target Termofilik 45°C–50°C</span>
              </div>

              {/* Mini SVG Curve Graph */}
              <div className="mini-graph-box">
                <svg viewBox="0 0 300 60" fill="none" className="graph-svg" aria-hidden="true">
                  <path
                    d="M0 45 C 50 42, 100 35, 150 12 C 200 8, 250 20, 300 32"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 45 C 50 42, 100 35, 150 12 C 200 8, 250 20, 300 32 L 300 60 L 0 60 Z"
                    fill="url(#greenGradient)"
                    opacity="0.18"
                  />
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <h3>Sensor Kotak Kayu 3 Lapis</h3>
              <p>
                Probe sensor sedalam 20 cm mencatat kenaikan suhu tanpa perlu membuka penutup kotak.
              </p>
            </div>

            {/* Bento 2: Standardisasi Uji Belah SNI */}
            <div className="bento-dark-card highlight-border">
              <div className="bento-topline">
                <span className="bento-badge amber">
                  <ShieldCheck size={12} />
                  Standar Mutu I
                </span>
                <span className="bento-num">02</span>
              </div>

              <div className="bento-metric-block">
                <span className="metric-super-text text-amber">88%</span>
                <span className="metric-label">Biji Fermentasi Sempurna</span>
              </div>

              {/* Progress Bar Visual */}
              <div className="metric-bar-wrap">
                <div className="metric-bar-fill" style={{ width: "88%" }} />
              </div>

              <h3>Uji Belah SNI 2323:2008</h3>
              <p>
                Pemeriksaan sampel 100 butir biji belah untuk menjaga kadar air di bawah 7.5%.
              </p>
            </div>

            {/* Bento 3: Zero Waste Kompos */}
            <div className="bento-dark-card">
              <div className="bento-topline">
                <span className="bento-badge green">
                  <Leaf size={12} />
                  Ekonomi Sirkular
                </span>
                <span className="bento-num">03</span>
              </div>

              <div className="bento-metric-block">
                <span className="metric-super-text">70%</span>
                <span className="metric-label">Biomassa Kulit Dimanfaatkan</span>
              </div>

              {/* Progress Bar Visual */}
              <div className="metric-bar-wrap">
                <div className="metric-bar-fill green" style={{ width: "70%" }} />
              </div>

              <h3>Kompos Kulit Kakao</h3>
              <p>
                Kulit buah dicacah dan difermentasi menjadi pupuk organik untuk mencegah jamur kebun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. SECTION: VIDEO EDUKASI LAPANGAN (CINEMATIC SHOWCASE)
          ==================================================================== */}
      <section className="dark-section" id="video-edukasi">
        <div className="section-container">
          <div className="dark-section-header">
            <span className="dark-kicker">DOKUMENTASI RESMI LAPANGAN</span>
            <h2>Praktik Fermentasi Mutu di Kebun</h2>
            <p>
              Video panduan teknik kotak bertingkat, pemantauan sensor suhu, dan pengolahan kompos.
            </p>
          </div>

          <div className="cinematic-video-card">
            <div className="cinematic-iframe-wrap">
              <iframe
                src="https://drive.google.com/file/d/1-HeXo9qPBZi9DVmPxywXjNDp60gOKwBT/preview"
                title="Video Praktik Fermentasi KakaoPass"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="cinematic-iframe"
              />
            </div>

            {/* Timeline Markers (Data-First, Bukan Narasi) */}
            <div className="video-timeline-strip">
              <div className="timeline-marker">
                <span className="marker-timestamp">01:15</span>
                <span className="marker-label">Pemasangan Probe IoT 20 cm</span>
              </div>
              <div className="timeline-marker">
                <span className="marker-timestamp">03:40</span>
                <span className="marker-label">Pembalikan Kotak Tiap 48 Jam</span>
              </div>
              <div className="timeline-marker">
                <span className="marker-timestamp">06:20</span>
                <span className="marker-label">Pengolahan Kompos Kulit Kakao</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. SECTION: ZERO WASTE (FOTO & BENEFIT SINGKAT)
          ==================================================================== */}
      <section className="dark-section" id="zero-waste">
        <div className="section-container zero-waste-dark-grid">
          {/* Left: Real Photo with Dark Spotlight */}
          <div className="zw-photo-spotlight">
            <Image
              src="/images/kakao-flatlay.jpg"
              alt="Kulit buah kakao dan biji kakao diolah zero waste"
              width={620}
              height={460}
              className="zw-photo-img"
            />
            <div className="zw-photo-badge">
              <strong>70% Bobot Panen</strong>
              <span>Biomassa kulit diolah jadi pupuk organik</span>
            </div>
          </div>

          {/* Right: 3 Benefit Cards */}
          <div className="zw-benefits-side">
            <span className="dark-kicker">EKONOMI SIRKULAR ZERO WASTE</span>
            <h2>Kebun Lebih Bersih, Hemat Biaya Pupuk</h2>
            <p className="zw-lead">
              Limbah kulit kakao tidak lagi dibuang membusuk di kebun, melainkan diolah kembali menjadi nutrisi tanah.
            </p>

            <div className="zw-card-stack">
              <div className="zw-benefit-card">
                <div className="zw-icon-box">
                  <CheckCircle2 size={18} className="text-green" />
                </div>
                <div>
                  <strong>Cegah Jamur &amp; Hama Buah</strong>
                  <p>Kebun bersih dari tumpukan kulit busuk pembawa spora jamur.</p>
                </div>
              </div>

              <div className="zw-benefit-card">
                <div className="zw-icon-box">
                  <CheckCircle2 size={18} className="text-green" />
                </div>
                <div>
                  <strong>Hemat Pengeluaran Pupuk</strong>
                  <p>Kompos organik dipakai menyuburkan kebun kakao sendiri.</p>
                </div>
              </div>

              <div className="zw-benefit-card">
                <div className="zw-icon-box">
                  <CheckCircle2 size={18} className="text-green" />
                </div>
                <div>
                  <strong>Pencatatan Karung Kompos</strong>
                  <p>Setiap batch kompos yang siap pakai tercatat rapi di sistem.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. SECTION: ALUR KERJA LAPANGAN (HORIZONTAL STEPPER)
          ==================================================================== */}
      <section className="dark-section" id="alur">
        <div className="section-container">
          <div className="dark-section-header">
            <span className="dark-kicker">INTEGRASI TIGA PERAN</span>
            <h2>Alur Kerja dari Kebun ke Pembeli</h2>
            <p>
              Pencatatan praktis petani, verifikasi cepat penyuluh, dan kepastian mutu pembeli.
            </p>
          </div>

          <div className="stepper-horizontal-grid">
            {/* Step 1 */}
            <div className="stepper-card">
              <div className="stepper-head">
                <span className="stepper-role-pill">PETANI</span>
                <span className="stepper-number">01</span>
              </div>
              <h3>Catat Panen &amp; Suhu</h3>
              <p>
                Input berat panen, pantau suhu sensor fermentasi harian, dan masukkan foto uji belah.
              </p>
              <span className="stepper-foot">Dashboard Petani</span>
            </div>

            {/* Step 2 */}
            <div className="stepper-card highlight">
              <div className="stepper-head">
                <span className="stepper-role-pill amber">PENYULUH (PPL)</span>
                <span className="stepper-number">02</span>
              </div>
              <h3>Audit &amp; Setujui Mutu</h3>
              <p>
                Periksa kurva suhu telemetri dan foto belah biji. Setelah lolos, setujui stiker karung.
              </p>
              <span className="stepper-foot">Portal Admin PPL</span>
            </div>

            {/* Step 3 */}
            <div className="stepper-card">
              <div className="stepper-head">
                <span className="stepper-role-pill green">PEMBELI</span>
                <span className="stepper-number">03</span>
              </div>
              <h3>Terima Biji Berstandar</h3>
              <p>
                Terima karung dengan stiker resmi Karangan Mandiri yang memuat riwayat mutu jelas.
              </p>
              <span className="stepper-foot">Jaminan Mutu Terstandar</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. SECTION: CALL TO ACTION STRIP (DARK AMBER GLOW)
          ==================================================================== */}
      <section className="dark-cta-strip">
        <div className="section-container cta-strip-inner">
          <div className="cta-strip-copy">
            <span className="dark-kicker">PORTAL KELOMPOK TANI</span>
            <h2>Mulai Kelola Panen &amp; Fermentasi Hari Ini</h2>
            <p>
              Pencatatan suhu kotak kayu dan sertifikasi panen kelompok tani Karangan Mandiri.
            </p>
          </div>

          <div className="cta-strip-btns">
            <Link href="/login" className="btn-pill-amber">
              <span>Masuk Portal Petani &amp; Admin</span>
              <ArrowRight size={15} />
            </Link>
            <a href="#kontak" className="btn-pill-outline">
              Hubungi Penyuluh via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. FOOTER SLATE DARK
          ==================================================================== */}
      <footer className="dark-site-footer" id="kontak">
        <div className="section-container footer-dark-grid">
          {/* Brand & Provenance */}
          <div className="footer-brand-side">
            <div className="dark-brand">
              <span className="brand-glow-box">
                <QrCode size={18} strokeWidth={2.4} />
              </span>
              <span className="dark-brand-text">
                kakao<span className="text-amber">pass</span>
              </span>
            </div>
            <p className="footer-lead-p">
              Sistem pencatatan fermentasi kotak kayu, standar uji belah SNI,
              dan pengolahan kompos kulit kakao kelompok tani.
            </p>
            <div className="footer-location-tag">
              <MapPin size={13} className="text-amber" />
              <span>Desa Karangan, Kec. Karangan, Kab. Kutai Timur</span>
            </div>
          </div>

          {/* Navigasi */}
          <div className="footer-col-nav">
            <strong>Navigasi Menu</strong>
            <a href="#solusi">Luaran FORMIKA</a>
            <a href="#video-edukasi">Video Panduan</a>
            <a href="#zero-waste">Zero Waste</a>
            <a href="#alur">Alur Kerja</a>
          </div>

          {/* Portal Akses */}
          <div className="footer-col-nav">
            <strong>Portal Sistem</strong>
            <Link href="/login">Masuk Petani (Pak Budi)</Link>
            <Link href="/login">Masuk Penyuluh (Bu Sari)</Link>
          </div>

          {/* Kontak & Legal */}
          <div className="footer-col-contact">
            <strong>Sekretariat &amp; Kontak</strong>
            <p>Kelompok Tani Karangan Mandiri</p>
            <div className="contact-item">
              <Phone size={13} className="text-amber" />
              <span>WhatsApp: 0812-5820-2026</span>
            </div>
            <span className="competition-chip">
              Karya Inovasi FORMIKA 2026
            </span>
          </div>
        </div>

        <div className="section-container footer-bottom-bar">
          <span>&copy; 2026 KakaoPass Indonesia</span>
          <span>Kelompok Tani Karangan Mandiri · Kutai Timur</span>
        </div>
      </footer>
    </main>
  );
}
