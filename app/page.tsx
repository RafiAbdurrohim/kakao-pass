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
  ShieldCheck,
  Sparkles,
  Thermometer,
  TrendingUp,
  X,
} from "lucide-react";
import HeroCanvas3D from "@/components/HeroCanvas3D";

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="twinkle-page">
      {/* ====================================================================
          1. HEADER BERSIH & PUTIH
          ==================================================================== */}
      <header className="twinkle-header">
        <div className="twinkle-nav-wrap">
          <Link href="/" className="twinkle-brand">
            <span className="brand-dot-black">
              <QrCode size={16} strokeWidth={2.4} />
            </span>
            <span className="brand-title-text">
              kakao<span>pass</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="twinkle-nav-links">
            <a href="#fitur">Standar Mutu</a>
            <a href="#video-panduan">Video Panduan</a>
            <a href="#zero-waste">Olah Kompos</a>
            <a href="#alur">Alur Kerja</a>
            <a href="#kontak">Kontak</a>
          </nav>

          {/* Action Button: Black Pill */}
          <div className="twinkle-nav-actions">
            <Link href="/login" className="btn-black-pill">
              <span>Masuk Portal</span>
              <ArrowUpRight size={14} />
            </Link>

            <button
              type="button"
              className="btn-twinkle-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka navigasi"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="twinkle-mobile-dropdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <a href="#fitur" onClick={() => setMobileMenuOpen(false)}>Standar Mutu</a>
              <a href="#video-panduan" onClick={() => setMobileMenuOpen(false)}>Video Panduan</a>
              <a href="#zero-waste" onClick={() => setMobileMenuOpen(false)}>Olah Kompos</a>
              <a href="#alur" onClick={() => setMobileMenuOpen(false)}>Alur Kerja</a>
              <a href="#kontak" onClick={() => setMobileMenuOpen(false)}>Kontak</a>
              <Link href="/login" className="btn-black-pill mobile" onClick={() => setMobileMenuOpen(false)}>
                Masuk Portal Petani &amp; Admin
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ====================================================================
          2. VIDEO MODAL (GOOGLE DRIVE PREVIEW)
          ==================================================================== */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            className="twinkle-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              className="twinkle-modal-dialog"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="twinkle-modal-header">
                <div>
                  <span className="modal-green-tag">DOKUMENTASI LAPANGAN</span>
                  <h3>Video Panduan Fermentasi Mutu</h3>
                </div>
                <button
                  type="button"
                  className="twinkle-modal-close"
                  onClick={() => setVideoOpen(false)}
                  aria-label="Tutup video"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="twinkle-modal-frame">
                <iframe
                  src="https://drive.google.com/file/d/1-HeXo9qPBZi9DVmPxywXjNDp60gOKwBT/preview"
                  title="Video Panduan Petani Kakao"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>

              <div className="twinkle-modal-footer">
                <p>
                  Praktik lapangan: pengisian kotak fermentasi bertingkat, pemantauan sensor suhu IoT,
                  uji belah standar SNI 2323:2008, dan pengolahan kompos kulit kakao.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          3. HERO SECTION (CENTERED ALA TWINKLE.AI + 3D THREE.JS SHOWCASE)
          ==================================================================== */}
      <section className="twinkle-hero-section">
        <div className="twinkle-container">
          {/* Tag Penanda Kebun */}
          <div className="hero-origin-pill">
            <span className="origin-green-dot" />
            <span>KELOMPOK TANI KARANGAN MANDIRI · KUTAI TIMUR</span>
          </div>

          {/* Centered Bold Title */}
          <h1 className="twinkle-hero-title">
            Standar Mutu Kakao<br />
            Dari Kebun Hingga Pabrik
          </h1>

          {/* Short 2-line Subtitle */}
          <p className="twinkle-hero-sub">
            Pencatatan suhu kotak fermentasi berbasis sensor IoT dan uji belah SNI
            untuk jaminan mutu panen kelompok tani.
          </p>

          {/* Centered Action Button */}
          <div className="twinkle-hero-cta">
            <Link href="/login" className="btn-hero-primary-pill">
              <span>Buka Portal Petani</span>
              <ArrowRight size={15} />
            </Link>

            <button
              type="button"
              className="btn-hero-video-pill"
              onClick={() => setVideoOpen(true)}
            >
              <Play size={12} fill="currentColor" />
              <span>Tonton Video Panduan</span>
            </button>
          </div>

          {/* Central Split Showcase:
              - Background: Three.js Interactive 3D Canvas
              - Left: Layar HP Setengah (Real Mobile Screen Cutoff)
              - Right: Foto Buah Kakao Segar Cutout Diperbesar */}
          <div className="twinkle-hero-split-stage">
            {/* Interactive Three.js Background Canvas */}
            <HeroCanvas3D />

            {/* Showcase Split Grid */}
            <div className="stage-split-grid">
              {/* Sisi Kiri: Layar HP Setengah (Real Mobile App UI) */}
              <div className="half-phone-container">
                <div className="half-phone-body">
                  <div className="phone-notch-bar">
                    <span className="notch-pill" />
                  </div>

                  <div className="phone-screen-content">
                    {/* Header HP */}
                    <div className="screen-header-row">
                      <div className="app-badge">
                        <QrCode size={13} />
                        <span>KakaoPass App</span>
                      </div>
                      <span className="batch-pill-code">Batch #24</span>
                    </div>

                    {/* Sensor Suhu Telemetri */}
                    <div className="phone-telemetry-card">
                      <div className="telemetry-head">
                        <span className="pulse-green-dot" />
                        <span>Sensor Suhu IoT (Probe 20 cm)</span>
                      </div>
                      <div className="telemetry-temp-row">
                        <span className="temp-number">48.6°C</span>
                        <span className="temp-phase-pill">Fase Panas</span>
                      </div>

                      {/* Kurva Grafik Suhu */}
                      <div className="phone-graph-strip">
                        <svg viewBox="0 0 220 45" fill="none" className="graph-strip-svg" aria-hidden="true">
                          <path
                            d="M0 38 C 40 35, 90 28, 130 8 C 170 4, 190 14, 220 22"
                            stroke="#10b981"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Uji Belah SNI */}
                    <div className="phone-sni-grid">
                      <div className="sni-cell">
                        <span className="sni-val">88%</span>
                        <span className="sni-lbl">SNI Mutu I</span>
                      </div>
                      <div className="sni-cell">
                        <span className="sni-val">6.8%</span>
                        <span className="sni-lbl">Kadar Air</span>
                      </div>
                    </div>

                    {/* Status Pengesahan */}
                    <div className="phone-verified-pill">
                      <CheckCircle2 size={13} className="text-green" />
                      <span>Diverifikasi PPL Karangan</span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge di atas HP */}
                <div className="floating-bubble bubble-phone-top">
                  <span className="bubble-dot-green" />
                  <strong>+ Sensor IoT 20 cm</strong>
                </div>
              </div>

              {/* Sisi Kanan: Foto Buah Kakao Segar Cutout Diperbesar */}
              <div className="cocoa-fresh-large-side">
                <div className="cocoa-fresh-image-wrap">
                  <Image
                    src="/images/kakao-fresh-cutout.png"
                    alt="Buah kakao segar dipotong dengan biji dan daun Karangan Mandiri"
                    width={480}
                    height={480}
                    priority
                    className="cocoa-fresh-large-img"
                  />
                  {/* Natural Ground Contact Shadow */}
                  <div className="cocoa-natural-shadow" />
                </div>

                {/* Floating Badge di dekat Buah Kakao */}
                <div className="floating-bubble bubble-cocoa-right">
                  <span className="bubble-icon-therm">
                    <Thermometer size={14} />
                  </span>
                  <div>
                    <span className="bubble-tiny-label">Suhu Inti</span>
                    <strong className="bubble-bold-val">48.6°C ↗</strong>
                  </div>
                </div>

                {/* Floating Card Zero Waste di bawah Buah Kakao */}
                <a href="#zero-waste" className="floating-card-pill card-cocoa-bottom">
                  <div className="pill-thumb-box">
                    <Image
                      src="/images/kakao-flatlay.jpg"
                      alt="Kompos kulit kakao"
                      width={42}
                      height={42}
                      className="pill-thumb-img"
                    />
                  </div>
                  <div>
                    <span className="pill-tag-green">ZERO WASTE</span>
                    <strong>70% Kulit Jadi Pupuk</strong>
                  </div>
                  <ArrowUpRight size={13} className="pill-arrow" />
                </a>
              </div>
            </div>
          </div>

          {/* ====================================================================
              4. TIGA KOTAK STATISTIK ABU-ABU TERANG (ALA TWINKLE.AI STATS ROW)
              ==================================================================== */}
          <div className="twinkle-stats-row">
            <div className="twinkle-stat-box">
              <span className="stat-super-num">48.6°C</span>
              <strong className="stat-main-label">SUHU INTI FERMENTASI (IOT)</strong>
              <p className="stat-sub-label">Probe 20 cm mencatat panas tanpa buka kotak</p>
            </div>

            <div className="twinkle-stat-box">
              <span className="stat-super-num">88%</span>
              <strong className="stat-main-label">BIJI MUTU I STANDAR SNI 2323</strong>
              <p className="stat-sub-label">Uji belah 100 butir biji sampel kelompok tani</p>
            </div>

            <div className="twinkle-stat-box">
              <span className="stat-super-num">70%</span>
              <strong className="stat-main-label">LIMBAH KULIT DIOLAH JADI KOMPOS</strong>
              <p className="stat-sub-label">Cegah jamur busuk buah di sekitar pohon</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. SECTION: FITUR STANDAR MUTU TERPADU (BUKAN "LUARAN FORMIKA")
          ==================================================================== */}
      <section className="twinkle-clean-section bg-subtle" id="fitur">
        <div className="twinkle-container">
          <div className="twinkle-section-head">
            <span className="section-kicker-clean">STANDAR PASCAPANEN</span>
            <h2>Fitur Standar Dari Kebun ke Pabrik</h2>
            <p>
              Pencatatan suhu kotak kayu, uji belah fisik, dan pemanfaatan biomassa limbah dalam satu sistem.
            </p>
          </div>

          <div className="twinkle-feature-grid">
            {/* Fitur 1 */}
            <div className="feature-white-card">
              <div className="feature-icon-circle green">
                <Thermometer size={22} />
              </div>
              <h3>Sensor Suhu Kotak Kayu</h3>
              <p>
                Probe sensor merekam kenaikan suhu fermentasi 28°C–50°C secara otomatis
                tanpa perlu membuka tutup kotak kayu yang bisa mengganggu panas alami.
              </p>
              <div className="feature-card-footer">
                <span>Pembalikan tiap 48 jam</span>
              </div>
            </div>

            {/* Fitur 2 */}
            <div className="feature-white-card">
              <div className="feature-icon-circle amber">
                <FileCheck2 size={22} />
              </div>
              <h3>Pencatatan Uji Belah SNI</h3>
              <p>
                Catat hasil potong 100 butir biji sampel. Sistem otomatis mengklasifikasikan
                persentase biji fermentasi dan memastikan kadar air aman di bawah 7.5%.
              </p>
              <div className="feature-card-footer">
                <span>Standar SNI 2323:2008</span>
              </div>
            </div>

            {/* Fitur 3 */}
            <div className="feature-white-card">
              <div className="feature-icon-circle green">
                <Leaf size={22} />
              </div>
              <h3>Pengolahan Kompos Kulit</h3>
              <p>
                Kulit buah kakao dicacah dan difermentasi menjadi pupuk kompos organik.
                Kebun menjadi bersih dari sarang jamur dan petani menghemat biaya pupuk.
              </p>
              <div className="feature-card-footer">
                <span>Ekonomi Sirkular 0% Limbah</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. SECTION: VIDEO PANDUAN LAPANGAN
          ==================================================================== */}
      <section className="twinkle-clean-section" id="video-panduan">
        <div className="twinkle-container">
          <div className="twinkle-section-head">
            <span className="section-kicker-clean">PANDUAN PRAKTIK KEBUN</span>
            <h2>Video Panduan Petani Kakao</h2>
            <p>
              Panduan pengisian kotak bertingkat, pemantauan sensor suhu, dan pengolahan kompos kulit kakao.
            </p>
          </div>

          <div className="twinkle-video-wrapper">
            <div className="twinkle-iframe-container">
              <iframe
                src="https://drive.google.com/file/d/1-HeXo9qPBZi9DVmPxywXjNDp60gOKwBT/preview"
                title="Video Panduan Petani Kakao"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="twinkle-video-iframe"
              />
            </div>

            {/* Timeline Strip */}
            <div className="twinkle-timeline-bar">
              <div className="timeline-step-chip">
                <span className="chip-time">01:15</span>
                <span>Pemasangan Sensor Probe di Kotak Kayu</span>
              </div>
              <div className="timeline-step-chip">
                <span className="chip-time">03:40</span>
                <span>Pembalikan Kotak Tiap 48 Jam</span>
              </div>
              <div className="timeline-step-chip">
                <span className="chip-time">06:20</span>
                <span>Pengolahan Kompos Kulit Kakao</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. SECTION: ZERO WASTE (KULIT KAKAO JADI KOMPOS)
          ==================================================================== */}
      <section className="twinkle-clean-section bg-subtle" id="zero-waste">
        <div className="twinkle-container zero-waste-split-layout">
          {/* Foto Asli Kompos */}
          <div className="zw-white-photo-card">
            <Image
              src="/images/kakao-flatlay.jpg"
              alt="Kulit buah kakao dan pupuk kompos"
              width={600}
              height={440}
              className="zw-clean-photo"
            />
            <div className="zw-clean-badge">
              <strong>70% Bobot Buah</strong>
              <span>Biomassa kulit diolah jadi pupuk kompos organik</span>
            </div>
          </div>

          {/* Manfaat Praktis Petani */}
          <div className="zw-clean-copy">
            <span className="section-kicker-clean">PENGOLAHAN LIMBAH KULIT</span>
            <h2>Kebun Lebih Bersih, Hemat Biaya Pupuk</h2>
            <p className="zw-copy-lead">
              Kulit buah kakao jangan dibiarkan menumpuk di dekat pohon karena dapat memicu jamur busuk buah.
              Di KakaoPass, limbah kulit dicatat untuk diolah menjadi pupuk organik kebun sendiri.
            </p>

            <div className="zw-clean-points-stack">
              <div className="zw-clean-point-item">
                <CheckCircle2 size={18} className="text-green" />
                <div>
                  <strong>Cegah Jamur &amp; Penyakit Buah</strong>
                  <p>Kebun bersih tanpa tumpukan kulit busuk di dekat pohon.</p>
                </div>
              </div>

              <div className="zw-clean-point-item">
                <CheckCircle2 size={18} className="text-green" />
                <div>
                  <strong>Hemat Pengeluaran Pupuk Kimia</strong>
                  <p>Kompos dipakai kembali untuk menyuburkan kebun kakao sendiri.</p>
                </div>
              </div>

              <div className="zw-clean-point-item">
                <CheckCircle2 size={18} className="text-green" />
                <div>
                  <strong>Pencatatan Karung Kompos Mandiri</strong>
                  <p>Setiap batch kompos yang siap pakai dicatat datanya di portal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. SECTION: ALUR KERJA LAPANGAN (3 LANGKAH RINGKAS)
          ==================================================================== */}
      <section className="twinkle-clean-section" id="alur">
        <div className="twinkle-container">
          <div className="twinkle-section-head">
            <span className="section-kicker-clean">INTEGRASI TIGA PERAN</span>
            <h2>Alur Kerja Lapangan</h2>
            <p>
              Pencatatan mudah untuk petani, verifikasi cepat oleh penyuluh, dan kepastian mutu bagi pembeli.
            </p>
          </div>

          <div className="twinkle-stepper-row">
            {/* Step 1 */}
            <div className="stepper-white-box">
              <div className="stepper-box-top">
                <span className="stepper-pill-role">PETANI DI KEBUN</span>
                <span className="stepper-seq">01</span>
              </div>
              <h3>Catat Panen &amp; Suhu</h3>
              <p>
                Petani memasukkan berat panen, memantau suhu sensor fermentasi harian, dan mencatat foto uji belah.
              </p>
              <div className="stepper-foot-tag">Dashboard Petani</div>
            </div>

            {/* Step 2 */}
            <div className="stepper-white-box highlight">
              <div className="stepper-box-top">
                <span className="stepper-pill-role green">PENYULUH (PPL)</span>
                <span className="stepper-seq">02</span>
              </div>
              <h3>Audit &amp; Setujui Mutu</h3>
              <p>
                Penyuluh memeriksa kurva suhu telemetri dan foto belah biji. Setelah memenuhi syarat, batch disetujui.
              </p>
              <div className="stepper-foot-tag">Portal Admin PPL</div>
            </div>

            {/* Step 3 */}
            <div className="stepper-white-box">
              <div className="stepper-box-top">
                <span className="stepper-pill-role">PEMBELI PABRIK</span>
                <span className="stepper-seq">03</span>
              </div>
              <h3>Terima Biji Terstandar</h3>
              <p>
                Pembeli menerima karung dengan stiker resmi Karangan Mandiri yang memuat riwayat mutu jelas.
              </p>
              <div className="stepper-foot-tag">Jaminan Mutu Terstandar</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. CTA BANNER (BERSIH & TERANG)
          ==================================================================== */}
      <section className="twinkle-cta-section">
        <div className="twinkle-container">
          <div className="twinkle-cta-box">
            <div className="cta-left-text">
              <span className="section-kicker-clean">PORTAL KELOMPOK TANI</span>
              <h2>Mulai Kelola Panen &amp; Fermentasi Hari Ini</h2>
              <p>
                Pencatatan suhu kotak kayu dan sertifikasi panen kelompok tani Karangan Mandiri.
              </p>
            </div>

            <div className="cta-right-btns">
              <Link href="/login" className="btn-hero-primary-pill">
                <span>Buka Portal Petani</span>
                <ArrowRight size={15} />
              </Link>
              <a href="#kontak" className="btn-hero-video-pill">
                Hubungi Penyuluh Lapangan
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          10. FOOTER BERSIH & PUTIH
          ==================================================================== */}
      <footer className="twinkle-footer" id="kontak">
        <div className="twinkle-container footer-content-grid">
          {/* Brand & Misi */}
          <div className="footer-col-main">
            <div className="twinkle-brand">
              <span className="brand-dot-black">
                <QrCode size={15} strokeWidth={2.4} />
              </span>
              <span className="brand-title-text">
                kakao<span>pass</span>
              </span>
            </div>
            <p className="footer-desc-text">
              Sistem pencatatan fermentasi kotak kayu, standar uji belah SNI,
              dan pengolahan kompos kulit kakao kelompok tani.
            </p>
            <div className="footer-loc-item">
              <MapPin size={13} className="text-muted" />
              <span>Desa Karangan, Kec. Karangan, Kab. Kutai Timur</span>
            </div>
          </div>

          {/* Navigasi */}
          <div className="footer-col-links">
            <strong>Navigasi Menu</strong>
            <a href="#fitur">Standar Mutu</a>
            <a href="#video-panduan">Video Panduan</a>
            <a href="#zero-waste">Olah Kompos</a>
            <a href="#alur">Alur Kerja</a>
          </div>

          {/* Portal Akses */}
          <div className="footer-col-links">
            <strong>Portal Sistem</strong>
            <Link href="/login">Masuk Petani (Pak Budi)</Link>
            <Link href="/login">Masuk Penyuluh (Bu Sari)</Link>
          </div>

          {/* Kontak Resmi */}
          <div className="footer-col-contact">
            <strong>Sekretariat &amp; Kontak</strong>
            <p>Kelompok Tani Karangan Mandiri</p>
            <div className="footer-contact-row">
              <Phone size={13} className="text-muted" />
              <span>WhatsApp: 0812-5820-2026</span>
            </div>
            <span className="footer-formika-chip">
              Karya Inovasi FORMIKA 2026
            </span>
          </div>
        </div>

        <div className="twinkle-container footer-bottom-strip">
          <span>&copy; 2026 KakaoPass Indonesia</span>
          <span>Kelompok Tani Karangan Mandiri · Kutai Timur</span>
        </div>
      </footer>
    </main>
  );
}
