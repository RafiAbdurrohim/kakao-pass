"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { KakaoPassLogo } from "@/components/KakaoPassLogo";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
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

const SECTIONS = [
  { id: "hero", label: "Standar Mutu", num: "01" },
  { id: "fitur", label: "Fitur Unggulan", num: "02" },
  { id: "video-panduan", label: "Video Panduan", num: "03" },
  { id: "zero-waste", label: "Zero Waste", num: "04" },
  { id: "alur", label: "Alur Kerja", num: "05" },
];

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const videoRef = useRef<HTMLVideoElement>(null);

  const seekVideo = (seconds: number, chapterIdx: number) => {
    setActiveChapter(chapterIdx);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    if (t >= 104) setActiveChapter(2);
    else if (t >= 75) setActiveChapter(1);
    else if (t >= 49) setActiveChapter(0);
    else setActiveChapter(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToNext = () => {
    const idx = SECTIONS.findIndex((s) => s.id === activeSection);
    if (idx !== -1 && idx < SECTIONS.length - 1) {
      scrollToSection(SECTIONS[idx + 1].id);
    } else {
      scrollToSection(SECTIONS[0].id);
    }
  };

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
                <video
                  src="/videos/panduan-petani.mp4"
                  controls
                  autoPlay
                  playsInline
                  className="concept-modal-video"
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

      {/* Floating Section Navigator Dock (Desktop / Tablet) */}
      <nav className="concept-section-nav" aria-label="Navigasi Cepat Section">
        <div className="section-nav-inner">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                className={`section-nav-dot-item ${isActive ? "is-active" : ""}`}
                onClick={() => scrollToSection(sec.id)}
                aria-label={`Lompat ke section ${sec.label}`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="dot-tooltip">{sec.num} · {sec.label}</span>
                <span className="dot-shape" />
              </button>
            );
          })}
          <div className="section-nav-divider" />
          <button
            type="button"
            className="section-nav-next-btn"
            onClick={scrollToNext}
            aria-label="Lompat ke section berikutnya"
          >
            <ChevronDown size={13} />
          </button>
        </div>
      </nav>

      {/* ====================================================================
          3. HERO SECTION (FULL WIDTH, ORCHESTRATED CINEMATIC ENTRANCE)
          ==================================================================== */}
      <section className="concept-hero-section" id="hero">
        {/* Pohon Kakao Hasil Cutout Transparan di Sisi Kanan (Smooth Glide Entrance) */}
        <motion.div
          className="concept-hero-tree-frame"
          aria-hidden="true"
          initial={{ opacity: 0, x: 30, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/images/pohon-kakao-kanan-hd.png"
            alt="Pohon Kakao Berbuah Lebat Kelompok Tani Karangan Mandiri"
            width={938}
            height={746}
            priority
            className="concept-hero-tree-render"
          />
        </motion.div>

        <div className="concept-hero-inner">
          {/* Left Content Area (Teks, Kicker, Badge, Button) */}
          <div className="concept-hero-left-copy">
            {/* Title Berkelas: 2 Warna (Hitam & Coklat Kakao) */}
            <motion.h1
              className="concept-main-title"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              Standar Mutu <span className="title-cocoa-accent">Kakao</span><br />
              Dari Kebun Hingga Pabrik
            </motion.h1>

            {/* Tulisan Kecil Deskripsi Singkat */}
            <motion.p
              className="concept-lead-text"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              Pencatatan suhu kotak fermentasi berbasis sensor IoT dan uji belah SNI
              untuk jaminan mutu panen kelompok tani.
            </motion.p>

            {/* Provenance Badge Kelompok Tani */}
            <motion.div
              className="concept-origin-badge"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="origin-live-dot" />
              <span>KELOMPOK TANI KARANGAN MANDIRI · KUTAI TIMUR</span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="concept-hero-btn-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
          </div>

          {/* Centered Stepped Telemetry Dock (Tengah Bawah Naik ~25%) */}
          <div className="concept-hero-dock-wrap">
            <motion.div
              className="concept-stepped-dock"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Dock Item 1 */}
              <div className="dock-cell">
                <div className="dock-icon-box green">
                  <Thermometer size={15} />
                </div>
                <div className="dock-text-group">
                  <span className="dock-label">Sensor IoT 20 cm</span>
                  <strong className="dock-val">48.6°C <small>Fase Panas</small></strong>
                </div>
              </div>

              <div className="dock-divider" />

              {/* Dock Item 2 */}
              <div className="dock-cell">
                <div className="dock-icon-box amber">
                  <ShieldCheck size={15} />
                </div>
                <div className="dock-text-group">
                  <span className="dock-label">Standar SNI 2323</span>
                  <strong className="dock-val">88% <small>Mutu I</small></strong>
                </div>
              </div>

              <div className="dock-divider" />

              {/* Dock Item 3 */}
              <div className="dock-cell">
                <div className="dock-icon-box green">
                  <Leaf size={15} />
                </div>
                <div className="dock-text-group">
                  <span className="dock-label">Zero Waste</span>
                  <strong className="dock-val">70% <small>Kompos Kulit</small></strong>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. SECTION: FITUR STANDAR MUTU TERPADU (BERSIH, VISUAL-FIRST, ZERO PENGULANGAN)
          ==================================================================== */}
      <section className="concept-features-full-section" id="fitur">
        <div className="concept-container">
          <motion.div
            className="concept-section-header"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="concept-kicker">FITUR UNGGULAN</span>
            <h2>Tiga Standar Dari Kebun ke Pabrik</h2>
            <p>
              Pencatatan presisi untuk menjaga mutu fermentasi biji dan pemanfaatan biomassa kebun.
            </p>
          </motion.div>

          <div className="concept-feature-grid">
            {/* Fitur 1 */}
            <motion.div
              className="concept-feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="feature-visual-frame">
                <Image
                  src="/images/feature-kotak-fermentasi.png"
                  alt="Kotak fermentasi kayu beralas daun pisang"
                  width={554}
                  height={554}
                  className="feature-photo-img"
                />
              </div>
              <div className="feature-card-content">
                <span className="feature-category-badge">TELEMETRI IOT</span>
                <h3>Monitoring Suhu Kotak Kayu</h3>
                <p>
                  Pantau suhu fermentasi otomatis via probe 20 cm tanpa membuka tutup kotak.
                </p>
              </div>
            </motion.div>

            {/* Fitur 2 */}
            <motion.div
              className="concept-feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="feature-visual-frame">
                <Image
                  src="/images/feature-uji-belah-sni.png"
                  alt="Uji belah standar mutu SNI biji kakao"
                  width={300}
                  height={164}
                  className="feature-photo-img"
                />
              </div>
              <div className="feature-card-content">
                <span className="feature-category-badge">STANDAR MUTU SNI</span>
                <h3>Pencatatan Uji Belah Biji</h3>
                <p>
                  Verifikasi visual 100 butir sampel untuk jaminan mutu fermentasi prima.
                </p>
              </div>
            </motion.div>

            {/* Fitur 3 */}
            <motion.div
              className="concept-feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="feature-visual-frame">
                <Image
                  src="/images/feature-kompos-kulit.jpg"
                  alt="Pengolahan pupuk organik dari limbah kulit kakao"
                  width={1024}
                  height={566}
                  className="feature-photo-img"
                />
              </div>
              <div className="feature-card-content">
                <span className="feature-category-badge">SIRKULAR ZERO WASTE</span>
                <h3>Pengolahan Kompos Kulit</h3>
                <p>
                  Limbah kulit panen difermentasi kembali menjadi pupuk organik kebun sendiri.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. SECTION: VIDEO PANDUAN LAPANGAN (CINEMA STUDIO & INTERACTIVE TIMECODE)
          ==================================================================== */}
      <section className="concept-section" id="video-panduan">
        <div className="concept-container">
          <div className="concept-video-split">
            {/* Header Block: Judul & Deskripsi */}
            <motion.div
              className="concept-video-header-block"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="concept-kicker">DOKUMENTASI LAPANGAN</span>
              <h2>Video Panduan Petani Kakao</h2>
              <p className="concept-video-lead">
                Praktik langsung pemasangan sensor probe di kotak bertingkat dan pembuatan kompos kulit buah.
              </p>
            </motion.div>

            {/* Video Box: Native Cinema Player */}
            <motion.div
              className="concept-video-wrap"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="concept-video-box">
                <div className="cinema-studio-bar">
                  <div className="cinema-bar-left">
                    <span className="cinema-live-dot" />
                    <span>DOKUMENTASI KEBUN · 1080p HD</span>
                  </div>
                  <span className="cinema-bar-tag">KUTAI TIMUR</span>
                </div>
                <video
                  ref={videoRef}
                  src="/videos/panduan-petani.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  onTimeUpdate={handleTimeUpdate}
                  className="concept-video-player"
                />
              </div>
            </motion.div>

            {/* Timestamp Steps: Detik & Tahapan Praktik */}
            <motion.div
              className="concept-video-steps-wrap"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="concept-video-steps">
                <button
                  type="button"
                  className={`video-step-item ${activeChapter === 0 ? "is-active" : ""}`}
                  onClick={() => seekVideo(49, 0)}
                >
                  <span className="time-badge">00:49</span>
                  <div>
                    <strong>Pemasangan Sensor Probe</strong>
                    <p>Penancapan probe 20 cm di tengah tumpukan biji kotak kayu.</p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`video-step-item ${activeChapter === 1 ? "is-active" : ""}`}
                  onClick={() => seekVideo(75, 1)}
                >
                  <span className="time-badge">01:15</span>
                  <div>
                    <strong>Pembalikan Tiap 48 Jam</strong>
                    <p>Perataan aerasi oksigen dan panas alami massa fermentasi.</p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`video-step-item ${activeChapter === 2 ? "is-active" : ""}`}
                  onClick={() => seekVideo(104, 2)}
                >
                  <span className="time-badge">01:44</span>
                  <div>
                    <strong>Zero Waste Kompos Kulit</strong>
                    <p>Pencacahan limbah kulit buah menjadi pupuk organik kebun.</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. SECTION: ZERO WASTE SIRKULAR (Desktop: Foto Kiri, Tulisan Kanan; Mobile: Header -> Foto -> Poin)
          ==================================================================== */}
      <section className="concept-section bg-light" id="zero-waste">
        <div className="concept-container">
          <div className="zero-waste-concept-split">
            {/* Header Block: Judul & Deskripsi */}
            <motion.div
              className="zw-concept-header-block"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="concept-kicker">SIRKULAR ZERO WASTE</span>
              <h2>Kebun Bersih, Nol Limbah Terbuang</h2>
              <p className="zw-concept-lead">
                Pemanfaatan 70% biomassa kulit buah menjadi pupuk organik mandiri untuk mencegah penyakit jamur busuk buah dan menyuburkan pohon.
              </p>
            </motion.div>

            {/* Foto Asli Kompos */}
            <motion.div
              className="zw-concept-photo-wrap"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/images/zero-waste-kulit-kebun.jpg"
                alt="Panen buah kakao dan pengolahan limbah kulit kebun zero waste"
                width={640}
                height={460}
                className="zw-concept-img"
              />
              <div className="zw-concept-badge">
                <div className="zw-badge-icon">
                  <Leaf size={16} />
                </div>
                <div className="zw-badge-text">
                  <strong>Zero Waste Kebun Mandiri</strong>
                  <span>100% pemanfaatan biomassa kulit jadi pupuk organik</span>
                </div>
              </div>
            </motion.div>

            {/* Manfaat Praktis Petani */}
            <div className="zw-point-list-wrap">
              <div className="zw-point-list">
                <motion.div
                  className="zw-point-row"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.42, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  <div className="zw-point-icon-box">
                    <CheckCircle2 size={18} className="text-green" />
                  </div>
                  <div>
                    <strong>Cegah Jamur Busuk Buah</strong>
                    <p>Kebun bersih tanpa tumpukan kulit busuk yang memicu jamur Phytophthora.</p>
                  </div>
                </motion.div>

                <motion.div
                  className="zw-point-row"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.42, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  <div className="zw-point-icon-box">
                    <CheckCircle2 size={18} className="text-green" />
                  </div>
                  <div>
                    <strong>Hemat Biaya Pupuk Kimia</strong>
                    <p>Kompos organik kaya hara dipakai kembali untuk menyuburkan kebun sendiri.</p>
                  </div>
                </motion.div>

                <motion.div
                  className="zw-point-row"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.42, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  <div className="zw-point-icon-box">
                    <CheckCircle2 size={18} className="text-green" />
                  </div>
                  <div>
                    <strong>Pencatatan Karung Mandiri</strong>
                    <p>Setiap batch kompos siap pakai tercatat rapi di portal kelompok tani.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. SECTION: ALUR KERJA LAPANGAN (INTEGRASI TIGA PERAN)
          ==================================================================== */}
      <section className="concept-section" id="alur">
        <div className="concept-container">
          <motion.div
            className="concept-section-header"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="concept-kicker">ALUR TERINTEGRASI</span>
            <h2>Tiga Langkah Menuju Standar Pabrik</h2>
          </motion.div>

          <div className="concept-flowline-grid">
            {/* Step 1 */}
            <motion.div
              className="flowline-column"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flowline-header-row">
                <div className="flowline-node-circle farmer">
                  <span>01</span>
                </div>
                <motion.div
                  className="flowline-connector-track line-farmer-to-ppl"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
              <div className="flowline-step-card role-farmer">
                <span className="flowline-role-tag farmer">PETANI DI KEBUN</span>
                <h3>Catat Panen &amp; Suhu Kotak</h3>
                <p>
                  Petani memasukkan berat panen basah dan memantau suhu probe kotak kayu via HP.
                </p>
                <span className="flowline-platform-note farmer">Portal Petani Mandiri</span>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="flowline-column"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flowline-header-row">
                <div className="flowline-node-circle ppl">
                  <span>02</span>
                </div>
                <motion.div
                  className="flowline-connector-track line-ppl-to-industry"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
              <div className="flowline-step-card role-ppl">
                <span className="flowline-role-tag ppl">PENYULUH LAPANGAN (PPL)</span>
                <h3>Audit &amp; Verifikasi Mutu SNI</h3>
                <p>
                  Penyuluh memeriksa kurva telemetri dan foto uji belah biji sebelum menerbitkan persetujuan.
                </p>
                <span className="flowline-platform-note ppl">Verifikasi Mutu I SNI</span>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="flowline-column"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flowline-header-row">
                <div className="flowline-node-circle industry">
                  <span>03</span>
                </div>
                <motion.div
                  className="flowline-connector-track line-industry-continuation"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
              <div className="flowline-step-card role-industry">
                <span className="flowline-role-tag industry">PEMBELI INDUSTRI</span>
                <h3>Penerimaan Biji Berpaspor QR</h3>
                <p>
                  Pabrik memindai QR paspor karung untuk melacak seluruh riwayat fermentasi dari kebun.
                </p>
                <span className="flowline-platform-note industry">Scan QR Ketertelusuran</span>
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="cta-copy-side"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="concept-kicker">PORTAL KELOMPOK TANI</span>
              <h2>Mulai Kelola Panen &amp; Fermentasi Hari Ini</h2>
              <p>
                Pencatatan suhu kotak kayu dan sertifikasi panen kelompok tani Karangan Mandiri.
              </p>
            </motion.div>

            <motion.div
              className="cta-actions-side"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href="/login" className="btn-primary-black-pill">
                <span>Buka Portal Petani</span>
                <ArrowRight size={15} />
              </Link>
              <a href="#kontak" className="btn-outline-clean-pill">
                Hubungi Penyuluh Lapangan
              </a>
            </motion.div>
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
