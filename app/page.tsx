"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  Layers,
  Leaf,
  MapPin,
  Menu,
  Phone,
  Play,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sprout,
  Thermometer,
  X,
} from "lucide-react";

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="landing-modern">
      {/* ====================================================================
          1. HEADER / NAVIGATION
          ==================================================================== */}
      <header className="site-header">
        <div className="nav-wrap">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <QrCode size={19} strokeWidth={2.4} />
            </span>
            <span className="brand-name">
              kakao<span>pass</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nav-desktop">
            <a href="#solusi">Solusi IoT</a>
            <a href="#video-edukasi">Video Edukasi</a>
            <a href="#zero-waste">Zero Waste</a>
            <a href="#alur">Alur Kerja</a>
            <a href="#kontak">Kontak</a>
          </nav>

          {/* Right Header Action */}
          <div className="nav-actions">
            <Link href="/login" className="btn-nav-portal">
              <span>Masuk Portal</span>
              <ArrowRight size={14} />
            </Link>

            <button
              type="button"
              className="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="nav-mobile-dropdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <a href="#solusi" onClick={() => setMobileMenuOpen(false)}>Solusi IoT</a>
              <a href="#video-edukasi" onClick={() => setMobileMenuOpen(false)}>Video Edukasi</a>
              <a href="#zero-waste" onClick={() => setMobileMenuOpen(false)}>Zero Waste</a>
              <a href="#alur" onClick={() => setMobileMenuOpen(false)}>Alur Kerja</a>
              <a href="#kontak" onClick={() => setMobileMenuOpen(false)}>Kontak</a>
              <Link href="/login" className="btn-nav-portal mobile" onClick={() => setMobileMenuOpen(false)}>
                Masuk Portal Petani &amp; Admin
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ====================================================================
          2. VIDEO EDUKASI MODAL (GOOGLE DRIVE PREVIEW EMBED)
          ==================================================================== */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            className="video-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              className="video-modal-dialog"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="video-modal-header">
                <div>
                  <span className="video-modal-tag">LUARAN FORMIKA 2026</span>
                  <h3>Video Edukasi &amp; Praktik Mutu Kakao</h3>
                </div>
                <button
                  type="button"
                  className="video-modal-close"
                  onClick={() => setVideoOpen(false)}
                  aria-label="Tutup video"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="video-modal-frame">
                <iframe
                  src="https://drive.google.com/file/d/1-HeXo9qPBZi9DVmPxywXjNDp60gOKwBT/preview"
                  title="Video Edukasi KakaoPass"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>

              <div className="video-modal-footer">
                <p>
                  Dokumentasi pelatihan kelompok tani mengenai pembalikan kotak fermentasi kayu 3 lapis,
                  monitoring suhu IoT, standar uji belah SNI 2323:2008, dan pengolahan kompos kulit kakao.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          3. HERO SECTION (EDITORIAL MODERN DENGAN FOTO ASLI KAKAO)
          ==================================================================== */}
      <section className="hero-section-clean">
        <div className="section-wrap hero-clean-grid">
          {/* Left Column: Headline & Value Proposition */}
          <div className="hero-clean-copy">
            <div className="hero-kicker-pill">
              <span>KELOMPOK TANI KARANGAN MANDIRI · KUTAI TIMUR</span>
            </div>

            <h1 className="hero-main-title">
              Paspor Mutu &amp; Ketertelusuran <span className="text-bronze">Kakao Mandiri.</span>
            </h1>

            <p className="hero-lead-text">
              Pemantauan suhu fermentasi kotak kayu berbasis IoT dan sertifikasi mutu biji
              terintegrasi uji belah SNI 2323:2008. Menjamin transparansi mutu bagi petani
              dan pembeli industri cokelat.
            </p>

            <div className="hero-cta-group">
              <Link href="/login" className="btn-solid-primary">
                <span>Buka Portal Petani</span>
                <ArrowRight size={15} />
              </Link>

              <button
                type="button"
                className="btn-outline-video"
                onClick={() => setVideoOpen(true)}
              >
                <span className="play-icon-badge">
                  <Play size={12} fill="currentColor" />
                </span>
                <span>Tonton Video Edukasi</span>
              </button>
            </div>

            {/* Factual Trust Indicators (No Emojis) */}
            <div className="hero-trust-row">
              <div className="trust-item">
                <CheckCircle2 size={15} className="text-bronze" />
                <span>Sensor IoT Probe 24/7</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={15} className="text-bronze" />
                <span>Standar Mutu I SNI</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={15} className="text-bronze" />
                <span>Ekonomi Sirkular 0% Limbah</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Res Real Cocoa Photo Showcase */}
          <div className="hero-clean-visual">
            <div className="hero-photo-card">
              <div className="hero-img-wrap">
                <Image
                  src="/images/kakao-artisan.png"
                  alt="Biji kakao fermentasi berkualitas tinggi dan buah kakao segar Karangan Mandiri"
                  width={640}
                  height={520}
                  priority
                  className="hero-photo"
                />
                <div className="hero-img-overlay" />
              </div>

              {/* Floating Minimal Metric 1: Live IoT Core Temp */}
              <div className="floating-badge badge-top-right">
                <div className="badge-icon-box green">
                  <Thermometer size={16} />
                </div>
                <div>
                  <div className="badge-label">
                    <span className="pulse-dot on" />
                    <span>Suhu Inti Fermentasi</span>
                  </div>
                  <strong className="badge-value">48.6°C <small>Fase Termofilik</small></strong>
                </div>
              </div>

              {/* Floating Minimal Metric 2: SNI Quality Status */}
              <div className="floating-badge badge-bottom-left">
                <div className="badge-icon-box bronze">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="badge-label">Standar SNI 2323:2008</span>
                  <strong className="badge-value">Grade Mutu I <small>88% Biji Baik</small></strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. SECTION 1: APA ITU KAKAOPASS (3 PILAR TERPADU)
          ==================================================================== */}
      <section className="section-clean bg-alt" id="solusi">
        <div className="section-wrap">
          <div className="section-header-center">
            <span className="section-pretitle">STANDARISASI HILIRISASI KAKAO</span>
            <h2>Tiga Pilar Mutu Dari Kebun Hingga Pabrik</h2>
            <p>
              Menjawab tantangan disparitas mutu biji kakao lokal melalui perpaduan sensor telemetri,
              uji fisik terstandarisasi, dan paspor digital transparan.
            </p>
          </div>

          <div className="grid-three-pillars">
            {/* Pilar 1 */}
            <div className="pillar-card">
              <div className="pillar-num-row">
                <span className="pillar-icon-box">
                  <Thermometer size={20} />
                </span>
                <span className="pillar-num">01</span>
              </div>
              <h3>Sensor IoT Kotak Kayu</h3>
              <p>
                Probe sensor merekam suhu inti fermentasi 28°C–50°C secara otomatis tanpa perlu
                membuka penutup kotak yang dapat mengganggu aktivitas mikroba asetat.
              </p>
              <div className="pillar-footer-tag">
                <span>Pembalikan terjadwal tiap 48 jam</span>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="pillar-card">
              <div className="pillar-num-row">
                <span className="pillar-icon-box">
                  <FileCheck2 size={20} />
                </span>
                <span className="pillar-num">02</span>
              </div>
              <h3>Uji Belah Standar SNI</h3>
              <p>
                Pemeriksaan fisik 100 butir biji belah untuk mengukur rasio fermentasi sempurna,
                menjaga kadar air di bawah 7.5%, serta meniadakan biji slaty (mentah) dan jamur.
              </p>
              <div className="pillar-footer-tag">
                <span>Klasifikasi SNI 2323:2008</span>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="pillar-card">
              <div className="pillar-num-row">
                <span className="pillar-icon-box">
                  <QrCode size={20} />
                </span>
                <span className="pillar-num">03</span>
              </div>
              <h3>Paspor Digital Karung</h3>
              <p>
                Sertifikat digital terenkripsi pada stiker karung 60 kg yang memuat profil kebun,
                grafik suhu fermentasi, dan persentase uji mutu untuk akses instan pembeli.
              </p>
              <div className="pillar-footer-tag">
                <span>Akses publik tanpa login</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. SECTION 2: VIDEO EDUKASI PETANI (EMBED RESMI)
          ==================================================================== */}
      <section className="section-clean" id="video-edukasi">
        <div className="section-wrap">
          <div className="video-section-container">
            <div className="video-copy-side">
              <span className="section-pretitle">LUARAN FORMIKA 2026</span>
              <h2>Video Edukasi Praktik Fermentasi Mutu</h2>
              <p>
                Panduan terpadu bagi kelompok tani mengenai teknik pengisian kotak kayu 3 lapis,
                pemantauan grafik suhu IoT, prosedur uji belah SNI, hingga pemanfaatan limbah kulit kakao.
              </p>

              <div className="video-keypoints-list">
                <div className="keypoint-item">
                  <span className="keypoint-bullet">1</span>
                  <div>
                    <strong>Pemasangan Probe IoT 20 cm</strong>
                    <p>Memastikan sensor berada di zona inti tumpukan biji kakao.</p>
                  </div>
                </div>

                <div className="keypoint-item">
                  <span className="keypoint-bullet">2</span>
                  <div>
                    <strong>Pembalikan Kotak Tiap 48 Jam</strong>
                    <p>Meratakan pasokan oksigen agar proses fermentasi seragam.</p>
                  </div>
                </div>

                <div className="keypoint-item">
                  <span className="keypoint-bullet">3</span>
                  <div>
                    <strong>Pemilahan Biji Uji Belah</strong>
                    <p>Menentukan persentase biji cokelat berongga standar Mutu I.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Responsive Embedded Video Player */}
            <div className="video-frame-side">
              <div className="video-player-wrapper">
                <iframe
                  src="https://drive.google.com/file/d/1-HeXo9qPBZi9DVmPxywXjNDp60gOKwBT/preview"
                  title="Video Edukasi Praktik Fermentasi KakaoPass"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="video-embedded-iframe"
                />
              </div>
              <div className="video-player-meta">
                <span>Durasi Praktik Lapangan · Kelompok Tani Karangan Mandiri</span>
                <button
                  type="button"
                  className="btn-text-link"
                  onClick={() => setVideoOpen(true)}
                >
                  Buka Layar Penuh <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. SECTION 3: ZERO WASTE & EKONOMI SIRKULAR
          ==================================================================== */}
      <section className="section-clean bg-alt" id="zero-waste">
        <div className="section-wrap zero-waste-split">
          {/* Left: Real Photo (kakao-flatlay.jpg) */}
          <div className="zero-waste-photo-wrap">
            <Image
              src="/images/kakao-flatlay.jpg"
              alt="Kulit buah kakao dan biji kakao fermentasi diolah zero waste"
              width={620}
              height={460}
              className="zero-waste-photo"
            />
            <div className="zero-waste-stat-badge">
              <strong>70% Bobot Panen</strong>
              <span>Biomassa kulit kakao diolah menjadi pupuk organik</span>
            </div>
          </div>

          {/* Right: Technical Explanation */}
          <div className="zero-waste-copy">
            <span className="section-pretitle">EKONOMI SIRKULAR ZERO WASTE</span>
            <h2>Mengubah Limbah Kulit Menjadi Pupuk Organik</h2>
            <p>
              Pada pengolahan konvensional, 70% bobot buah kakao berupa kulit sering dibuang
              membusuk di sekitar pohon dan menjadi sarang penyakit jamur <em>Phytophthora palmivora</em>.
            </p>
            <p>
              Melalui KakaoPass, limbah kulit buah dicacah dan difermentasikan bersama bioaktivator
              serta kotoran hewan menjadi pupuk kompos organik berkualitas yang mengembalikan unsur hara
              ke tanah kebun petani.
            </p>

            <div className="zero-waste-points">
              <div className="zw-point-card">
                <CheckCircle2 size={18} className="text-forest" />
                <div>
                  <strong>Cegah Jamur Busuk Buah</strong>
                  <p>Kebun bersih dari tumpukan limbah basah pembawa spora patogen.</p>
                </div>
              </div>

              <div className="zw-point-card">
                <CheckCircle2 size={18} className="text-forest" />
                <div>
                  <strong>Efisiensi Biaya Pupuk Petani</strong>
                  <p>Mengurangi ketergantungan kelompok tani pada pupuk anorganik sintetis.</p>
                </div>
              </div>

              <div className="zw-point-card">
                <CheckCircle2 size={18} className="text-forest" />
                <div>
                  <strong>Stiker Paspor Khusus Kompos</strong>
                  <p>Tersedia sertifikasi QR mandiri untuk setiap karung pupuk kompos organik.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. SECTION 4: ALUR KERJA 3 PERAN (PETANI, ADMIN, PEMBELI)
          ==================================================================== */}
      <section className="section-clean" id="alur">
        <div className="section-wrap">
          <div className="section-header-center">
            <span className="section-pretitle">INTEGRASI TIGA ENTITAS</span>
            <h2>Alur Kerja Sistem Dari Kebun Ke Pembeli</h2>
            <p>
              Alur yang jelas dan terpisah memastikan peran budidaya, audit verifikasi, dan transaksi pasar
              berjalan secara berkesinambungan.
            </p>
          </div>

          <div className="workflow-three-cards">
            {/* Step 1 */}
            <div className="workflow-step-card">
              <div className="step-badge-row">
                <span className="step-role-badge">PETANI DI KEBUN</span>
                <span className="step-seq-num">01</span>
              </div>
              <h3>Pencatatan &amp; Fermentasi</h3>
              <p>
                Petani memasukkan data batch panen, menancapkan probe suhu IoT ke kotak kayu,
                melakukan uji belah SNI 100 butir, dan mengunggah foto bukti timbangan.
              </p>
              <div className="step-action-note">
                Input melalui Dashboard Petani
              </div>
            </div>

            {/* Step 2 */}
            <div className="workflow-step-card highlight">
              <div className="step-badge-row">
                <span className="step-role-badge bronze">VERIFIKATOR &amp; PPL</span>
                <span className="step-seq-num">02</span>
              </div>
              <h3>Audit &amp; Pengesahan Paspor</h3>
              <p>
                Petugas memeriksa kurva suhu IoT fermentasi, foto fisik uji belah, serta batch kompos.
                Setelah dinyatakan memenuhi standar, admin mengesahkan dan mencetak label stiker QR karung.
              </p>
              <div className="step-action-note">
                Otorisasi via Portal Admin
              </div>
            </div>

            {/* Step 3 */}
            <div className="workflow-step-card">
              <div className="step-badge-row">
                <span className="step-role-badge green">PEMBELI DI PABRIK</span>
                <span className="step-seq-num">03</span>
              </div>
              <h3>Pindai QR &amp; Transaksi Adil</h3>
              <p>
                Pembeli memindai stiker QR pada karung 60 kg menggunakan kamera HP biasa tanpa perlu login.
                Seluruh riwayat suhu dan sertifikat SNI tampil transparan untuk jaminan harga premium.
              </p>
              <div className="step-action-note">
                Akses publik di kakaopass.web.id/p/[id]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. SECTION 5: CALL TO ACTION PASPOR DEMO
          ==================================================================== */}
      <section className="section-cta-dark">
        <div className="section-wrap cta-content-row">
          <div className="cta-copy">
            <span className="cta-kicker">SIMULASI TERBUKA UNTUK JURI</span>
            <h2>Uji Langsung Transparansi Paspor Mutu KakaoPass</h2>
            <p>
              Lihat bagaimana pembeli dan juri dapat memeriksa kurva suhu IoT, hasil uji belah,
              dan legalitas kelompok tani dalam satu halaman publik yang terkunci.
            </p>
          </div>

          <div className="cta-actions">
            <Link href="/p/demo" target="_blank" className="btn-cta-gold">
              <QrCode size={16} />
              <span>Buka Demo Paspor QR</span>
              <ArrowUpRight size={14} />
            </Link>
            <Link href="/login" className="btn-cta-subtle">
              Masuk Portal Petani &amp; Admin
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. FOOTER & KONTAK RESMI KELOMPOK TANI
          ==================================================================== */}
      <footer className="site-footer-modern" id="kontak">
        <div className="section-wrap footer-modern-grid">
          {/* Brand & Mission */}
          <div className="footer-col-brand">
            <div className="brand">
              <span className="brand-mark">
                <QrCode size={18} strokeWidth={2.4} />
              </span>
              <span className="brand-name">
                kakao<span>pass</span>
              </span>
            </div>
            <p className="footer-mission-text">
              Platform integrasi IoT fermentasi, standardisasi uji belah SNI 2323:2008,
              dan ekonomi sirkular limbah kulit kakao berkelanjutan.
            </p>
            <div className="footer-origin-tag">
              <MapPin size={14} className="text-bronze" />
              <span>Desa Karangan, Kec. Karangan, Kab. Kutai Timur, Kalimantan Timur</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col-links">
            <strong>Navigasi Menu</strong>
            <a href="#solusi">Solusi Tiga Pilar</a>
            <a href="#video-edukasi">Video Edukasi Petani</a>
            <a href="#zero-waste">Inisiatif Zero Waste</a>
            <a href="#alur">Alur Tiga Entitas</a>
            <Link href="/p/demo">Contoh Paspor Digital</Link>
          </div>

          {/* Portal Akses */}
          <div className="footer-col-links">
            <strong>Portal Sistem</strong>
            <Link href="/login">Masuk Petani (Pak Budi)</Link>
            <Link href="/login">Masuk Verifikator (Bu Sari)</Link>
            <Link href="/p/demo">Verifikasi Paspor QR Publik</Link>
          </div>

          {/* Kontak & Informasi */}
          <div className="footer-col-contact">
            <strong>Sekretariat &amp; Kemitraan</strong>
            <p>Kelompok Tani Karangan Mandiri</p>
            <div className="contact-row">
              <Phone size={14} className="text-bronze" />
              <span>WhatsApp: 0812-5820-2026</span>
            </div>
            <div className="contact-row">
              <MapPin size={14} className="text-bronze" />
              <span>Wilayah Binaan PPL Kutai Timur</span>
            </div>
            <span className="competition-badge">
              Karya Inovasi FORMIKA 2026
            </span>
          </div>
        </div>

        <div className="section-wrap footer-modern-bottom">
          <span>&copy; 2026 KakaoPass Indonesia · Hak Cipta Terpelihara</span>
          <span>Menjaga Mutu · Merawat Bumi · Memberdayakan Petani</span>
        </div>
      </footer>
    </main>
  );
}
