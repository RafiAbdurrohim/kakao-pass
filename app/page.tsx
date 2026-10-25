"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { KakaoPassLogo } from "@/components/KakaoPassLogo";
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
              <KakaoPassLogo size={20} />
            </span>
            <span className="brand-text-logo">
              kakao<span>pass</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="concept-nav-links">
            <a href="#fitur">Fitur Unggulan</a>
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
              <a href="#fitur" onClick={() => setMobileMenuOpen(false)}>Fitur Unggulan</a>
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
            width={938}
            height={746}
            priority
            className="concept-hero-tree-render"
          />
        </div>

        <div className="concept-hero-inner">
          {/* Left Content Area (Teks, Kicker, Badge, Button) */}
          <div className="concept-hero-left-copy">
            {/* Title Berkelas: 2 Warna (Hitam & Coklat Kakao) */}
            <h1 className="concept-main-title">
              Standar Mutu <span className="title-cocoa-accent">Kakao</span><br />
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
        </div>
      </section>

      {/* ====================================================================
          4. SECTION: FITUR STANDAR MUTU TERPADU (FULL WIDTH & ANIMATED)
          ==================================================================== */}
      <section className="concept-features-full-section" id="fitur">
        {/* Top Dock Bar: Warna sama dengan Section Bawah (#f8fafc) & Animasi Masuk */}
        <div className="concept-features-dock-wrap">
          <motion.div
            className="concept-stepped-dock"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.div>
        </div>

        {/* Inner Content Grid */}
        <div className="concept-container">
          <motion.div
            className="concept-section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="concept-kicker">FITUR UNGGULAN SISTEM</span>
            <h2>Fitur Unggulan Dari Kebun ke Pabrik</h2>
            <p>
              Sensor suhu fermentasi IoT, sertifikasi uji belah SNI, dan pemanfaatan zero waste kompos kulit kakao.
            </p>
          </motion.div>

          <div className="concept-feature-grid">
            {/* Fitur 1 */}
            <motion.div
              className="concept-feature-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="feature-card-top-row">
                <div className="feature-icon-wrapper green">
                  <Thermometer size={20} />
                </div>
                <span className="feature-category-badge green">IOT REAL-TIME</span>
              </div>
              <h3>Sensor Suhu Kotak Kayu</h3>
              <div className="feature-metric-strip">
                <span className="metric-giant-text">48.6°C</span>
                <span className="metric-status-sub">Suhu Inti Fermentasi</span>
              </div>
              <p>
                Monitoring suhu 28°C–50°C otomatis via probe 20 cm tanpa buka tutup kotak.
              </p>
              <div className="feature-foot-pill">
                <span>Pembalikan tiap 48 jam</span>
              </div>
            </motion.div>

            {/* Fitur 2 */}
            <motion.div
              className="concept-feature-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="feature-card-top-row">
                <div className="feature-icon-wrapper amber">
                  <FileCheck2 size={20} />
                </div>
                <span className="feature-category-badge amber">STANDAR SNI</span>
              </div>
              <h3>Pencatatan Uji Belah SNI</h3>
              <div className="feature-metric-strip">
                <span className="metric-giant-text">Mutu I</span>
                <span className="metric-status-sub">Kadar Air &le; 7.5%</span>
              </div>
              <p>
                Verifikasi 100 butir biji sampel kelompok tani sesuai standar SNI 2323:2008.
              </p>
              <div className="feature-foot-pill">
                <span>Standar SNI 2323:2008</span>
              </div>
            </motion.div>

            {/* Fitur 3 */}
            <motion.div
              className="concept-feature-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="feature-card-top-row">
                <div className="feature-icon-wrapper green">
                  <Leaf size={20} />
                </div>
                <span className="feature-category-badge green">CIRCULAR ZERO WASTE</span>
              </div>
              <h3>Pengolahan Kompos Kulit</h3>
              <div className="feature-metric-strip">
                <span className="metric-giant-text">70%</span>
                <span className="metric-status-sub">Biomassa Kulit Kakao</span>
              </div>
              <p>
                Fermentasi limbah kulit kakao jadi pupuk organik untuk cegah jamur busuk buah.
              </p>
              <div className="feature-foot-pill">
                <span>Zero Waste Kebun Mandiri</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. SECTION: VIDEO PANDUAN LAPANGAN (2 Kolom: Tulisan Kiri, Video Kanan)
          ==================================================================== */}
      <section className="concept-section" id="video-panduan">
        <div className="concept-container">
          <div className="concept-video-split">
            {/* Sisi Kiri: Tulisan & Langkah Praktik */}
            <motion.div
              className="concept-video-copy"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="concept-kicker">PANDUAN PRAKTIK KEBUN</span>
              <h2>Video Panduan Petani Kakao</h2>
              <p className="concept-video-lead">
                Panduan lapangan pengisian kotak bertingkat, pemantauan sensor suhu telemetri, dan fermentasi kompos kulit kakao.
              </p>

              <div className="concept-video-steps">
                <motion.div
                  className="video-step-item"
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  <span className="time-badge">00:49</span>
                  <div>
                    <strong>Pemasangan Sensor Probe di Kotak Kayu</strong>
                    <p>Sensor suhu probe ditancapkan 20 cm ke tengah tumpukan biji untuk pantau suhu 28°C–50°C.</p>
                  </div>
                </motion.div>

                <motion.div
                  className="video-step-item"
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  <span className="time-badge">01:15</span>
                  <div>
                    <strong>Pembalikan Kotak Tiap 48 Jam</strong>
                    <p>Biji dipindahkan ke kotak bertingkat bawah untuk meratakan aerasi oksigen dan panas alami.</p>
                  </div>
                </motion.div>

                <motion.div
                  className="video-step-item"
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  <span className="time-badge">01:44</span>
                  <div>
                    <strong>Pengolahan Kompos Kulit Kakao</strong>
                    <p>Limbah kulit buah dicacah dan difermentasi menjadi pupuk organik penyubur kebun.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Sisi Kanan: Video Box */}
            <motion.div
              className="concept-video-wrap"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
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
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. SECTION: ZERO WASTE (KULIT KAKAO JADI KOMPOS)
          ==================================================================== */}
      <section className="concept-section bg-light" id="zero-waste">
        <div className="concept-container">
          <div className="zero-waste-concept-split">
            {/* Foto Asli Kompos */}
            <motion.div
              className="zw-concept-photo-wrap"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/images/kakao-flatlay.jpg"
                alt="Kulit buah kakao dan pupuk kompos"
                width={640}
                height={460}
                className="zw-concept-img"
              />
              <div className="zw-concept-badge">
                <div className="zw-badge-icon">
                  <Leaf size={16} />
                </div>
                <div className="zw-badge-text">
                  <strong>70% Bobot Buah Kakao</strong>
                  <span>Biomassa kulit diolah jadi pupuk kompos organik</span>
                </div>
              </div>
            </motion.div>

            {/* Manfaat Praktis Petani */}
            <motion.div
              className="zw-concept-copy"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="concept-kicker">PENGOLAHAN LIMBAH KULIT</span>
              <h2>Kebun Lebih Bersih, Hemat Biaya Pupuk</h2>
              <p className="zw-concept-lead">
                Kulit buah kakao jangan dibiarkan menumpuk di dekat pohon karena dapat memicu jamur busuk buah.
                Di KakaoPass, limbah kulit dicatat untuk diolah menjadi pupuk organik kebun sendiri.
              </p>

              <div className="zw-point-list">
                <motion.div
                  className="zw-point-row"
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  <div className="zw-point-icon-box">
                    <CheckCircle2 size={18} className="text-green" />
                  </div>
                  <div>
                    <strong>Cegah Jamur &amp; Penyakit Buah</strong>
                    <p>Kebun bersih tanpa tumpukan kulit busuk di dekat pohon.</p>
                  </div>
                </motion.div>

                <motion.div
                  className="zw-point-row"
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  <div className="zw-point-icon-box">
                    <CheckCircle2 size={18} className="text-green" />
                  </div>
                  <div>
                    <strong>Hemat Pengeluaran Pupuk Kimia</strong>
                    <p>Kompos dipakai kembali untuk menyuburkan kebun kakao sendiri.</p>
                  </div>
                </motion.div>

                <motion.div
                  className="zw-point-row"
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  <div className="zw-point-icon-box">
                    <CheckCircle2 size={18} className="text-green" />
                  </div>
                  <div>
                    <strong>Pencatatan Karung Kompos Mandiri</strong>
                    <p>Setiap batch kompos yang siap pakai dicatat datanya di portal.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. SECTION: ALUR KERJA LAPANGAN (Open Connected Flowline)
          ==================================================================== */}
      <section className="concept-section" id="alur">
        <div className="concept-container">
          <motion.div
            className="concept-section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="concept-kicker">INTEGRASI TIGA PERAN</span>
            <h2>Alur Kerja Lapangan</h2>
            <p>
              Pencatatan mudah untuk petani, verifikasi cepat oleh penyuluh, dan kepastian mutu bagi pembeli.
            </p>
          </motion.div>

          <div className="concept-flowline-wrap">
            {/* Guide track line */}
            <div className="flowline-track-line" aria-hidden="true" />

            {/* Step 1 */}
            <motion.div
              className="flowline-step-item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flowline-node-circle">
                <span>01</span>
              </div>
              <div className="flowline-step-body">
                <span className="flowline-role-tag">PETANI DI KEBUN</span>
                <h3>Catat Panen &amp; Suhu</h3>
                <p>
                  Petani memasukkan berat panen, memantau kurva suhu probe fermentasi tiap 48 jam, dan mencatat foto uji belah.
                </p>
                <span className="flowline-platform-note">Dashboard Petani</span>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="flowline-step-item highlight"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flowline-node-circle highlight">
                <span>02</span>
              </div>
              <div className="flowline-step-body">
                <span className="flowline-role-tag green">PENYULUH (PPL)</span>
                <h3>Audit &amp; Setujui Mutu</h3>
                <p>
                  Penyuluh memeriksa kurva suhu telemetri dan foto belah biji. Setelah memenuhi syarat SNI, batch disetujui.
                </p>
                <span className="flowline-platform-note green">Portal Admin PPL</span>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="flowline-step-item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flowline-node-circle">
                <span>03</span>
              </div>
              <div className="flowline-step-body">
                <span className="flowline-role-tag">PEMBELI PABRIK</span>
                <h3>Terima Biji Terstandar</h3>
                <p>
                  Pembeli menerima karung dengan stiker barcode resmi yang memuat riwayat fermentasi jelas dan sertifikasi mutu SNI.
                </p>
                <span className="flowline-platform-note">Jaminan Mutu Terstandar</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. CTA BANNER
          ==================================================================== */}
      <section className="concept-cta-wrap">
        <div className="concept-container">
          <motion.div
            className="concept-cta-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.div>
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
                <KakaoPassLogo size={20} />
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
            <a href="#fitur">Fitur Unggulan</a>
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
