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
  MapPin,
  Menu,
  Phone,
  Play,
  QrCode,
  ShieldCheck,
  Thermometer,
  X,
} from "lucide-react";

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="landing-modern">
      {/* ====================================================================
          1. HEADER / NAVIGASI
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
            <a href="#solusi">Tentang</a>
            <a href="#video-edukasi">Video Panduan</a>
            <a href="#zero-waste">Olah Kompos</a>
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
              className="nav-mobile-dropdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <a href="#solusi" onClick={() => setMobileMenuOpen(false)}>Tentang</a>
              <a href="#video-edukasi" onClick={() => setMobileMenuOpen(false)}>Video Panduan</a>
              <a href="#zero-waste" onClick={() => setMobileMenuOpen(false)}>Olah Kompos</a>
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
                  <span className="video-modal-tag">PANDUAN LAPANGAN</span>
                  <h3>Video Praktik Fermentasi Mutu</h3>
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
                  title="Video Panduan Petani Kakao"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>

              <div className="video-modal-footer">
                <p>
                  Praktik pengisian kotak fermentasi kayu, pengecekan sensor suhu,
                  uji belah biji, dan pembuatan kompos dari kulit kakao.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          3. HERO SECTION (FOTO ASLI KAKAO & RINGKAS)
          ==================================================================== */}
      <section className="hero-section-clean">
        <div className="section-wrap hero-clean-grid">
          {/* Left Column: Headline Ringkas & Padat */}
          <div className="hero-clean-copy">
            <div className="hero-kicker-pill">
              <span>KELOMPOK TANI KARANGAN MANDIRI · KUTAI TIMUR</span>
            </div>

            <h1 className="hero-main-title">
              Pantau Mutu Fermentasi Kakao <span className="text-bronze">Lebih Pasti.</span>
            </h1>

            <p className="hero-lead-text">
              Pencatatan suhu kotak fermentasi kayu dan hasil uji belah biji kakao.
              Membantu kelompok tani menjaga mutu biji dan memudahkan verifikasi panen.
            </p>

            <div className="hero-cta-group">
              <Link href="/login" className="btn-solid-primary">
                <span>Masuk Portal Petani</span>
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

            {/* Poin Nyata & Singkat */}
            <div className="hero-trust-row">
              <div className="trust-item">
                <CheckCircle2 size={15} className="text-bronze" />
                <span>Pantau Suhu Real-Time</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={15} className="text-bronze" />
                <span>Standar Uji Belah SNI</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={15} className="text-bronze" />
                <span>Olah Kulit Jadi Kompos</span>
              </div>
            </div>
          </div>

          {/* Right Column: Foto Asli Biji Kakao */}
          <div className="hero-clean-visual">
            <div className="hero-photo-card">
              <div className="hero-img-wrap">
                <Image
                  src="/images/kakao-artisan.png"
                  alt="Biji kakao fermentasi dan buah kakao segar Karangan Mandiri"
                  width={640}
                  height={520}
                  priority
                  className="hero-photo"
                />
                <div className="hero-img-overlay" />
              </div>

              {/* Floating Metric 1 */}
              <div className="floating-badge badge-top-right">
                <div className="badge-icon-box green">
                  <Thermometer size={16} />
                </div>
                <div>
                  <div className="badge-label">
                    <span className="pulse-dot on" />
                    <span>Suhu Kotak Fermentasi</span>
                  </div>
                  <strong className="badge-value">48.6°C <small>Fase Panas</small></strong>
                </div>
              </div>

              {/* Floating Metric 2 */}
              <div className="floating-badge badge-bottom-left">
                <div className="badge-icon-box bronze">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="badge-label">Hasil Uji Belah</span>
                  <strong className="badge-value">Standar Mutu I <small>88% Biji Baik</small></strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. SECTION 1: APA ITU KAKAOPASS (FITUR UTAMA)
          ==================================================================== */}
      <section className="section-clean bg-alt" id="solusi">
        <div className="section-wrap">
          <div className="section-header-center">
            <span className="section-pretitle">TENTANG KAKAOPASS</span>
            <h2>Bantu Petani Jaga Kualitas Biji</h2>
            <p>
              Pencatatan suhu kotak kayu, uji belah biji, dan verifikasi panen dalam satu sistem praktis.
            </p>
          </div>

          <div className="grid-three-pillars">
            {/* Fitur 1 */}
            <div className="pillar-card">
              <div className="pillar-num-row">
                <span className="pillar-icon-box">
                  <Thermometer size={20} />
                </span>
                <span className="pillar-num">01</span>
              </div>
              <h3>Sensor Suhu Kotak Kayu</h3>
              <p>
                Sensor dipasang langsung di tengah tumpukan biji. Petani bisa cek kenaikan suhu fermentasi tanpa harus sering buka tutup kotak kayu.
              </p>
              <div className="pillar-footer-tag">
                <span>Pembalikan tiap 48 jam</span>
              </div>
            </div>

            {/* Fitur 2 */}
            <div className="pillar-card">
              <div className="pillar-num-row">
                <span className="pillar-icon-box">
                  <FileCheck2 size={20} />
                </span>
                <span className="pillar-num">02</span>
              </div>
              <h3>Pencatatan Uji Belah</h3>
              <p>
                Catat hasil belah 100 butir biji sampel. Sistem otomatis menghitung persentase biji fermentasi dan memastikan kadar air aman.
              </p>
              <div className="pillar-footer-tag">
                <span>Standar SNI 2323:2008</span>
              </div>
            </div>

            {/* Fitur 3 */}
            <div className="pillar-card">
              <div className="pillar-num-row">
                <span className="pillar-icon-box">
                  <ShieldCheck size={20} />
                </span>
                <span className="pillar-num">03</span>
              </div>
              <h3>Verifikasi Mutu Resmi</h3>
              <p>
                Data panen diperiksa oleh penyuluh (PPL). Karung yang memenuhi syarat mendapat stiker verifikasi untuk jaminan harga jual.
              </p>
              <div className="pillar-footer-tag">
                <span>Disetujui Penyuluh (PPL)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. SECTION 2: VIDEO EDUKASI PETANI
          ==================================================================== */}
      <section className="section-clean" id="video-edukasi">
        <div className="section-wrap">
          <div className="video-section-container">
            <div className="video-copy-side">
              <span className="section-pretitle">PANDUAN LAPANGAN</span>
              <h2>Video Praktik Fermentasi Mutu</h2>
              <p>
                Panduan praktis pengisian kotak fermentasi bertingkat, pemasangan sensor suhu, dan pengolahan kompos kulit kakao.
              </p>

              <div className="video-keypoints-list">
                <div className="keypoint-item">
                  <span className="keypoint-bullet">1</span>
                  <div>
                    <strong>Pasang Sensor di Bagian Tengah</strong>
                    <p>Tancapkan sensor sedalam 20 cm tepat di tengah tumpukan biji.</p>
                  </div>
                </div>

                <div className="keypoint-item">
                  <span className="keypoint-bullet">2</span>
                  <div>
                    <strong>Balik Biji Tiap 2 Hari</strong>
                    <p>Pindahkan biji ke kotak tingkat bawah agar panasnya merata.</p>
                  </div>
                </div>

                <div className="keypoint-item">
                  <span className="keypoint-bullet">3</span>
                  <div>
                    <strong>Uji Belah Sebelum Jual</strong>
                    <p>Belah 100 biji untuk memastikan warna cokelat merata.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="video-frame-side">
              <div className="video-player-wrapper">
                <iframe
                  src="https://drive.google.com/file/d/1-HeXo9qPBZi9DVmPxywXjNDp60gOKwBT/preview"
                  title="Video Panduan Petani Kakao"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="video-embedded-iframe"
                />
              </div>
              <div className="video-player-meta">
                <span>Praktik di Kebun Karangan Mandiri</span>
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
          6. SECTION 3: ZERO WASTE (KULIT KAKAO JADI KOMPOS)
          ==================================================================== */}
      <section className="section-clean bg-alt" id="zero-waste">
        <div className="section-wrap zero-waste-split">
          {/* Foto Asli Olah Kompos */}
          <div className="zero-waste-photo-wrap">
            <Image
              src="/images/kakao-flatlay.jpg"
              alt="Kulit buah kakao dan biji kakao diolah zero waste"
              width={620}
              height={460}
              className="zero-waste-photo"
            />
            <div className="zero-waste-stat-badge">
              <strong>70% Bobot Buah</strong>
              <span>Kulit kakao diolah jadi pupuk kompos organik</span>
            </div>
          </div>

          {/* Penjelasan Singkat & Mudah Dipahami Petani */}
          <div className="zero-waste-copy">
            <span className="section-pretitle">PENGOLAHAN LIMBAH KULIT</span>
            <h2>Kulit Kakao Diolah Jadi Kompos</h2>
            <p>
              Kulit buah kakao jangan dibiarkan menumpuk di kebun karena bisa menjadi sarang hama dan memicu penyakit busuk buah.
            </p>
            <p>
              Di KakaoPass, limbah kulit dicatat untuk difermentasi jadi pupuk kompos organik. Kebun tetap bersih dan petani bisa hemat biaya pupuk.
            </p>

            <div className="zero-waste-points">
              <div className="zw-point-card">
                <CheckCircle2 size={18} className="text-forest" />
                <div>
                  <strong>Cegah Jamur &amp; Hama Buah</strong>
                  <p>Kebun bersih tanpa tumpukan kulit busuk di dekat pohon.</p>
                </div>
              </div>

              <div className="zw-point-card">
                <CheckCircle2 size={18} className="text-forest" />
                <div>
                  <strong>Hemat Biaya Pupuk</strong>
                  <p>Kompos dipakai kembali untuk menyuburkan tanah kebun sendiri.</p>
                </div>
              </div>

              <div className="zw-point-card">
                <CheckCircle2 size={18} className="text-forest" />
                <div>
                  <strong>Pencatatan Batch Kompos</strong>
                  <p>Setiap karung kompos yang siap pakai dicatat datanya.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. SECTION 4: ALUR KERJA DI LAPANGAN
          ==================================================================== */}
      <section className="section-clean" id="alur">
        <div className="section-wrap">
          <div className="section-header-center">
            <span className="section-pretitle">CARA KERJA</span>
            <h2>Alur Kerja di Lapangan</h2>
            <p>
              Pencatatan mudah untuk petani, verifikasi cepat oleh penyuluh, dan kepastian mutu bagi pembeli.
            </p>
          </div>

          <div className="workflow-three-cards">
            {/* Step 1 */}
            <div className="workflow-step-card">
              <div className="step-badge-row">
                <span className="step-role-badge">PETANI DI KEBUN</span>
                <span className="step-seq-num">01</span>
              </div>
              <h3>Catat Panen &amp; Suhu</h3>
              <p>
                Petani memasukkan berat panen, memantau suhu kotak fermentasi tiap hari, dan mencatat hasil uji belah biji.
              </p>
              <div className="step-action-note">
                Dashboard Petani
              </div>
            </div>

            {/* Step 2 */}
            <div className="workflow-step-card highlight">
              <div className="step-badge-row">
                <span className="step-role-badge bronze">PENYULUH &amp; PPL</span>
                <span className="step-seq-num">02</span>
              </div>
              <h3>Periksa &amp; Setujui Panen</h3>
              <p>
                Penyuluh mengecek grafik suhu fermentasi dan foto uji belah. Jika memenuhi syarat, batch panen disetujui.
              </p>
              <div className="step-action-note">
                Portal Admin PPL
              </div>
            </div>

            {/* Step 3 */}
            <div className="workflow-step-card">
              <div className="step-badge-row">
                <span className="step-role-badge green">PEMBELI DI PABRIK</span>
                <span className="step-seq-num">03</span>
              </div>
              <h3>Terima Biji Berstandar</h3>
              <p>
                Pembeli menerima karung berstiker resmi Karangan Mandiri dengan jaminan mutu dan riwayat panen yang jelas.
              </p>
              <div className="step-action-note">
                Label Mutu Karangan Mandiri
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. SECTION 5: CALL TO ACTION (MASUK PORTAL / KONTAK)
          ==================================================================== */}
      <section className="section-cta-dark">
        <div className="section-wrap cta-content-row">
          <div className="cta-copy">
            <span className="cta-kicker">PORTAL KELOMPOK TANI</span>
            <h2>Mulai Catat Panen &amp; Mutu Fermentasi</h2>
            <p>
              Gunakan KakaoPass untuk pencatatan suhu harian, uji mutu biji, dan pengolahan kompos kelompok tani.
            </p>
          </div>

          <div className="cta-actions">
            <Link href="/login" className="btn-cta-gold">
              <span>Masuk Portal Petani &amp; Admin</span>
              <ArrowRight size={15} />
            </Link>
            <a href="#kontak" className="btn-cta-subtle">
              Hubungi Penyuluh Lapangan
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. FOOTER & KONTAK
          ==================================================================== */}
      <footer className="site-footer-modern" id="kontak">
        <div className="section-wrap footer-modern-grid">
          {/* Brand & Misi Singkat */}
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
              Sistem pencatatan fermentasi kotak kayu, standar uji belah SNI,
              dan pengolahan kompos kulit kakao kelompok tani.
            </p>
            <div className="footer-origin-tag">
              <MapPin size={14} className="text-bronze" />
              <span>Desa Karangan, Kec. Karangan, Kab. Kutai Timur</span>
            </div>
          </div>

          {/* Navigasi */}
          <div className="footer-col-links">
            <strong>Navigasi Menu</strong>
            <a href="#solusi">Tentang KakaoPass</a>
            <a href="#video-edukasi">Video Panduan</a>
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
          <span>&copy; 2026 KakaoPass Indonesia</span>
          <span>Kelompok Tani Karangan Mandiri · Kutai Timur</span>
        </div>
      </footer>
    </main>
  );
}
