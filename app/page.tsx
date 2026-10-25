"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileCheck2,
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="concept-page">
      {/* ====================================================================
          1. HEADER BERSIH & TRANSPARAN
          ==================================================================== */}
      <header className={`concept-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="concept-nav-wrap">
          <Link href="/" className="concept-brand">
            <span className="brand-badge-dark">
              <QrCode size={16} strokeWidth={2.4} />
            </span>
            <span className="brand-text-logo">
              kakao<span>pass</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="concept-nav-links">
            <a href="#fitur">Standar Mutu</a>
            <a href="#video-panduan">Video Panduan</a>
            <a href="#zero-waste">Olah Kompos</a>
            <a href="#alur">Alur Kerja</a>
            <a href="#kontak">Kontak</a>
          </nav>

          {/* Action Button: Black Pill */}
          <div className="concept-nav-actions">
            <Link href="/login" className="btn-concept-login">
              <span>Masuk Portal</span>
              <ArrowUpRight size={14} />
            </Link>

            <button
              type="button"
              className="btn-concept-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="concept-mobile-dropdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <a href="#fitur" onClick={() => setMobileMenuOpen(false)}>Standar Mutu</a>
              <a href="#video-panduan" onClick={() => setMobileMenuOpen(false)}>Video Panduan</a>
              <a href="#zero-waste" onClick={() => setMobileMenuOpen(false)}>Olah Kompos</a>
              <a href="#alur" onClick={() => setMobileMenuOpen(false)}>Alur Kerja</a>
              <a href="#kontak" onClick={() => setMobileMenuOpen(false)}>Kontak</a>
              <Link href="/login" className="btn-concept-login mobile" onClick={() => setMobileMenuOpen(false)}>
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
            className="concept-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              className="concept-modal-dialog"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="concept-modal-header">
                <div>
                  <span className="modal-kicker-tag">DOKUMENTASI LAPANGAN</span>
                  <h3>Video Panduan Fermentasi Mutu</h3>
                </div>
                <button
                  type="button"
                  className="concept-modal-close"
                  onClick={() => setVideoOpen(false)}
                  aria-label="Tutup video"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="concept-modal-frame">
                <iframe
                  src="https://drive.google.com/file/d/1-HeXo9qPBZi9DVmPxywXjNDp60gOKwBT/preview"
                  title="Video Panduan Petani Kakao"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>

              <div className="concept-modal-footer">
                <p>
                  Praktik lapangan: pengisian kotak fermentasi kayu 3 lapis, pemantauan sensor suhu IoT,
                  uji belah standar SNI 2323:2008, dan pengolahan kompos kulit kakao.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          3. HERO SECTION (FULL WIDTH, KANAN POHON KAKAO CUTOUT TRANSPARAN)
          ==================================================================== */}
      <section className="concept-hero-section">
        {/* Pohon Kakao Hasil Cutout Transparan di Sisi Kanan */}
        <div className="concept-hero-tree-frame" aria-hidden="true">
          <Image
            src="/images/pohon-kakao-kanan-hd.png"
            alt="Pohon Kakao Berbuah Lebat Kelompok Tani Karangan Mandiri"
            width={1338}
            height={746}
            priority
            className="concept-hero-tree-render"
          />
        </div>

        <div className="concept-hero-inner">
          {/* Left Content Area (Teks, Kicker, Badge, Button) */}
          <div className="concept-hero-left-copy">
            {/* Title Berkelas */}
            <h1 className="concept-main-title">
              Standar Mutu Kakao<br />
              Dari Kebun Hingga Pabrik
            </h1>

            {/* Tulisan Kecil Deskripsi Singkat */}
            <p className="concept-lead-text">
              Pencatatan suhu kotak fermentasi berbasis sensor IoT dan uji belah SNI
              untuk jaminan mutu panen kelompok tani.
            </p>

            {/* Provenance Badge Kelompok Tani */}
            <div className="concept-origin-badge">
              <span className="origin-live-dot" />
              <span>KELOMPOK TANI KARANGAN MANDIRI · KUTAI TIMUR</span>
            </div>

            {/* Action Buttons */}
            <div className="concept-hero-btn-row">
              <Link href="/login" className="btn-primary-black-pill">
                <span>Buka Portal Petani</span>
                <ArrowRight size={15} />
              </Link>

              <button
                type="button"
                className="btn-outline-clean-pill"
                onClick={() => setVideoOpen(true)}
              >
                <Play size={12} fill="currentColor" />
                <span>Tonton Video Panduan</span>
              </button>
            </div>
          </div>

          {/* Bottom Docked Floating Bar (Persis Dock Conceptzilla) */}
          <div className="concept-docked-bar">
            {/* Dock Item 1 */}
            <div className="dock-cell">
              <div className="dock-icon-box green">
                <Thermometer size={14} />
              </div>
              <div>
                <span className="dock-label">Sensor IoT 20 cm</span>
                <strong className="dock-val">48.6°C <small>Fase Panas</small></strong>
              </div>
            </div>

            <div className="dock-divider" />

            {/* Dock Item 2 */}
            <div className="dock-cell">
              <div className="dock-icon-box amber">
                <ShieldCheck size={14} />
              </div>
              <div>
                <span className="dock-label">Standar SNI 2323</span>
                <strong className="dock-val">88% <small>Mutu I</small></strong>
              </div>
            </div>

            <div className="dock-divider" />

            {/* Dock Item 3 */}
            <div className="dock-cell">
              <div className="dock-icon-box green">
                <Leaf size={14} />
              </div>
              <div>
                <span className="dock-label">Zero Waste</span>
                <strong className="dock-val">70% <small>Kompos Kulit</small></strong>
              </div>
            </div>

            {/* Dock Fast Action */}
            <Link href="/login" className="dock-cta-btn">
              <span>Kelola Batch</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. TIGA KOTAK STATISTIK BESAR ABU-ABU TERANG
          ==================================================================== */}
      <section className="concept-stats-section">
        <div className="concept-container">
          <div className="concept-three-stats-grid">
            <div className="concept-stat-box">
              <span className="stat-giant-num">48.6°C</span>
              <strong className="stat-heading-label">SUHU INTI FERMENTASI (IOT)</strong>
              <p className="stat-desc-label">Probe 20 cm mencatat panas tanpa buka kotak</p>
            </div>

            <div className="concept-stat-box">
              <span className="stat-giant-num">88%</span>
              <strong className="stat-heading-label">BIJI MUTU I STANDAR SNI 2323</strong>
              <p className="stat-desc-label">Uji belah 100 butir biji sampel kelompok tani</p>
            </div>

            <div className="concept-stat-box">
              <span className="stat-giant-num">70%</span>
              <strong className="stat-heading-label">LIMBAH KULIT DIOLAH JADI KOMPOS</strong>
              <p className="stat-desc-label">Cegah jamur busuk buah di sekitar pohon</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. SECTION: FITUR STANDAR MUTU TERPADU
          ==================================================================== */}
      <section className="concept-section bg-light" id="fitur">
        <div className="concept-container">
          <div className="concept-section-header">
            <span className="concept-kicker">STANDAR PASCAPANEN</span>
            <h2>Fitur Standar Dari Kebun ke Pabrik</h2>
            <p>
              Pencatatan suhu kotak kayu, uji belah fisik, dan pemanfaatan biomassa limbah dalam satu sistem.
            </p>
          </div>

          <div className="concept-feature-grid">
            {/* Fitur 1 */}
            <div className="concept-feature-card">
              <div className="feature-icon-wrapper green">
                <Thermometer size={22} />
              </div>
              <h3>Sensor Suhu Kotak Kayu</h3>
              <p>
                Probe sensor merekam kenaikan suhu fermentasi 28°C–50°C secara otomatis
                tanpa perlu membuka tutup kotak kayu yang bisa mengganggu panas alami.
              </p>
              <div className="feature-foot-pill">
                <span>Pembalikan tiap 48 jam</span>
              </div>
            </div>

            {/* Fitur 2 */}
            <div className="concept-feature-card">
              <div className="feature-icon-wrapper amber">
                <FileCheck2 size={22} />
              </div>
              <h3>Pencatatan Uji Belah SNI</h3>
              <p>
                Catat hasil potong 100 butir biji sampel. Sistem otomatis mengklasifikasikan
                persentase biji fermentasi dan memastikan kadar air aman di bawah 7.5%.
              </p>
              <div className="feature-foot-pill">
                <span>Standar SNI 2323:2008</span>
              </div>
            </div>

            {/* Fitur 3 */}
            <div className="concept-feature-card">
              <div className="feature-icon-wrapper green">
                <Leaf size={22} />
              </div>
              <h3>Pengolahan Kompos Kulit</h3>
              <p>
                Kulit buah kakao dicacah dan difermentasi menjadi pupuk kompos organik.
                Kebun menjadi bersih dari sarang jamur dan petani menghemat biaya pupuk.
              </p>
              <div className="feature-foot-pill">
                <span>Ekonomi Sirkular 0% Limbah</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. SECTION: VIDEO PANDUAN LAPANGAN
          ==================================================================== */}
      <section className="concept-section" id="video-panduan">
        <div className="concept-container">
          <div className="concept-section-header">
            <span className="concept-kicker">PANDUAN PRAKTIK KEBUN</span>
            <h2>Video Panduan Petani Kakao</h2>
            <p>
              Panduan pengisian kotak bertingkat, pemantauan sensor suhu, dan pengolahan kompos kulit kakao.
            </p>
          </div>

          <div className="concept-video-box">
            <div className="concept-iframe-holder">
              <iframe
                src="https://drive.google.com/file/d/1-HeXo9qPBZi9DVmPxywXjNDp60gOKwBT/preview"
                title="Video Panduan Petani Kakao"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="concept-video-iframe"
              />
            </div>

            {/* Timeline Bar */}
            <div className="concept-timeline-bar">
              <div className="timeline-item-chip">
                <span className="time-badge">01:15</span>
                <span>Pemasangan Sensor Probe di Kotak Kayu</span>
              </div>
              <div className="timeline-item-chip">
                <span className="time-badge">03:40</span>
                <span>Pembalikan Kotak Tiap 48 Jam</span>
              </div>
              <div className="timeline-item-chip">
                <span className="time-badge">06:20</span>
                <span>Pengolahan Kompos Kulit Kakao</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. SECTION: ZERO WASTE (KULIT KAKAO JADI KOMPOS)
          ==================================================================== */}
      <section className="concept-section bg-light" id="zero-waste">
        <div className="concept-container zero-waste-concept-split">
          {/* Foto Asli Kompos */}
          <div className="zw-concept-photo-wrap">
            <Image
              src="/images/kakao-flatlay.jpg"
              alt="Kulit buah kakao dan pupuk kompos"
              width={600}
              height={440}
              className="zw-concept-img"
            />
            <div className="zw-concept-badge">
              <strong>70% Bobot Buah</strong>
              <span>Biomassa kulit diolah jadi pupuk kompos organik</span>
            </div>
          </div>

          {/* Manfaat Praktis Petani */}
          <div className="zw-concept-copy">
            <span className="concept-kicker">PENGOLAHAN LIMBAH KULIT</span>
            <h2>Kebun Lebih Bersih, Hemat Biaya Pupuk</h2>
            <p className="zw-concept-lead">
              Kulit buah kakao jangan dibiarkan menumpuk di dekat pohon karena dapat memicu jamur busuk buah.
              Di KakaoPass, limbah kulit dicatat untuk diolah menjadi pupuk organik kebun sendiri.
            </p>

            <div className="zw-point-list">
              <div className="zw-point-row">
                <CheckCircle2 size={18} className="text-green" />
                <div>
                  <strong>Cegah Jamur &amp; Penyakit Buah</strong>
                  <p>Kebun bersih tanpa tumpukan kulit busuk di dekat pohon.</p>
                </div>
              </div>

              <div className="zw-point-row">
                <CheckCircle2 size={18} className="text-green" />
                <div>
                  <strong>Hemat Pengeluaran Pupuk Kimia</strong>
                  <p>Kompos dipakai kembali untuk menyuburkan kebun kakao sendiri.</p>
                </div>
              </div>

              <div className="zw-point-row">
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
          8. SECTION: ALUR KERJA LAPANGAN
          ==================================================================== */}
      <section className="concept-section" id="alur">
        <div className="concept-container">
          <div className="concept-section-header">
            <span className="concept-kicker">INTEGRASI TIGA PERAN</span>
            <h2>Alur Kerja Lapangan</h2>
            <p>
              Pencatatan mudah untuk petani, verifikasi cepat oleh penyuluh, dan kepastian mutu bagi pembeli.
            </p>
          </div>

          <div className="concept-stepper-grid">
            {/* Step 1 */}
            <div className="stepper-item-card">
              <div className="stepper-item-head">
                <span className="stepper-role-tag">PETANI DI KEBUN</span>
                <span className="stepper-index-num">01</span>
              </div>
              <h3>Catat Panen &amp; Suhu</h3>
              <p>
                Petani memasukkan berat panen, memantau suhu sensor fermentasi harian, dan mencatat foto uji belah.
              </p>
              <div className="stepper-foot-note">Dashboard Petani</div>
            </div>

            {/* Step 2 */}
            <div className="stepper-item-card highlight">
              <div className="stepper-item-head">
                <span className="stepper-role-tag green">PENYULUH (PPL)</span>
                <span className="stepper-index-num">02</span>
              </div>
              <h3>Audit &amp; Setujui Mutu</h3>
              <p>
                Penyuluh memeriksa kurva suhu telemetri dan foto belah biji. Setelah memenuhi syarat, batch disetujui.
              </p>
              <div className="stepper-foot-note">Portal Admin PPL</div>
            </div>

            {/* Step 3 */}
            <div className="stepper-item-card">
              <div className="stepper-item-head">
                <span className="stepper-role-tag">PEMBELI PABRIK</span>
                <span className="stepper-index-num">03</span>
              </div>
              <h3>Terima Biji Terstandar</h3>
              <p>
                Pembeli menerima karung dengan stiker resmi Karangan Mandiri yang memuat riwayat mutu jelas.
              </p>
              <div className="stepper-foot-note">Jaminan Mutu Terstandar</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. CTA BANNER
          ==================================================================== */}
      <section className="concept-cta-wrap">
        <div className="concept-container">
          <div className="concept-cta-card">
            <div className="cta-copy-side">
              <span className="concept-kicker">PORTAL KELOMPOK TANI</span>
              <h2>Mulai Kelola Panen &amp; Fermentasi Hari Ini</h2>
              <p>
                Pencatatan suhu kotak kayu dan sertifikasi panen kelompok tani Karangan Mandiri.
              </p>
            </div>

            <div className="cta-actions-side">
              <Link href="/login" className="btn-primary-black-pill">
                <span>Buka Portal Petani</span>
                <ArrowRight size={15} />
              </Link>
              <a href="#kontak" className="btn-outline-clean-pill">
                Hubungi Penyuluh Lapangan
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          10. FOOTER BERSIH & PUTIH
          ==================================================================== */}
      <footer className="concept-footer" id="kontak">
        <div className="concept-container footer-grid-layout">
          {/* Brand & Misi */}
          <div className="footer-lead-col">
            <div className="concept-brand">
              <span className="brand-badge-dark">
                <QrCode size={15} strokeWidth={2.4} />
              </span>
              <span className="brand-text-logo">
                kakao<span>pass</span>
              </span>
            </div>
            <p className="footer-mission-desc">
              Sistem pencatatan fermentasi kotak kayu, standar uji belah SNI,
              dan pengolahan kompos kulit kakao kelompok tani.
            </p>
            <div className="footer-location-row">
              <MapPin size={13} className="text-muted" />
              <span>Desa Karangan, Kec. Karangan, Kab. Kutai Timur</span>
            </div>
          </div>

          {/* Navigasi */}
          <div className="footer-links-col">
            <strong>Navigasi Menu</strong>
            <a href="#fitur">Standar Mutu</a>
            <a href="#video-panduan">Video Panduan</a>
            <a href="#zero-waste">Olah Kompos</a>
            <a href="#alur">Alur Kerja</a>
          </div>

          {/* Portal Akses */}
          <div className="footer-links-col">
            <strong>Portal Sistem</strong>
            <Link href="/login">Masuk Petani (Pak Budi)</Link>
            <Link href="/login">Masuk Penyuluh (Bu Sari)</Link>
          </div>

          {/* Kontak Resmi */}
          <div className="footer-contact-col">
            <strong>Sekretariat &amp; Kontak</strong>
            <p>Kelompok Tani Karangan Mandiri</p>
            <div className="footer-phone-row">
              <Phone size={13} className="text-muted" />
              <span>WhatsApp: 0812-5820-2026</span>
            </div>
            <span className="footer-badge-formika">
              Karya Inovasi FORMIKA 2026
            </span>
          </div>
        </div>

        <div className="concept-container footer-bottom-row">
          <span>&copy; 2026 KakaoPass Indonesia</span>
          <span>Kelompok Tani Karangan Mandiri · Kutai Timur</span>
        </div>
      </footer>
    </main>
  );
}
