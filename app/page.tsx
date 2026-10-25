"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import HeroProcessStage from "./components/HeroProcessStage";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Droplets,
  Leaf,
  LockKeyhole,
  Menu,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sprout,
  Thermometer,
  X,
} from "lucide-react";

const solutions = [
  {
    number: "01",
    icon: Thermometer,
    title: "Sensor otomatis",
    description:
      "Pantau profil suhu dan kelembapan fermentasi secara real-time, tanpa catatan manual yang tercecer.",
    detail: "SUHU + KELEMBAPAN",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Paspor terverifikasi",
    description:
      "Hasil uji belah (cut test) dan kadar air tersimpan rapi, terverifikasi, dan terkunci dalam satu paspor.",
    detail: "MUTU TERCATAT",
  },
  {
    number: "03",
    icon: Leaf,
    title: "Jejak limbah sirkular",
    description:
      "Catat perjalanan kulit buah kakao yang diolah kembali menjadi kompos bernilai guna.",
    detail: "LIMBAH JADI MANFAAT",
  },
];

const farmerSteps = [
  {
    number: "01",
    title: "Buat batch",
    description: "Daftarkan hasil panen dan mulai catatan perjalanan kakao.",
    icon: Sprout,
  },
  {
    number: "02",
    title: "Pasang sensor",
    description: "Pantau suhu dan kelembapan selama proses fermentasi.",
    icon: Thermometer,
  },
  {
    number: "03",
    title: "Kunci & cetak QR",
    description: "Simpan data mutu, lalu tempelkan QR pada karung.",
    icon: LockKeyhole,
  },
];

const buyerSteps = [
  {
    number: "01",
    title: "Pindai QR karung",
    description: "Gunakan kamera ponsel untuk membuka paspor digital.",
    icon: ScanLine,
  },
  {
    number: "02",
    title: "Lihat riwayat mutu",
    description: "Periksa hasil uji belah dan kadar air batch.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Telusuri profil suhu",
    description: "Kenali proses fermentasi dan asal kakao dengan jelas.",
    icon: Thermometer,
  },
];

const bentoContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const bentoCardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

function Brand() {
  return (
    <a className="brand" href="#beranda" aria-label="KakaoPass, beranda">
      <span className="brand-mark">
        <QrCode size={22} strokeWidth={2.1} />
      </span>
      <span className="brand-name">
        kakao<span>pass</span>
        <small>INDONESIA</small>
      </span>
    </a>
  );
}

function DemoQr() {
  return (
    <div className="qr-art" aria-label="Ilustrasi kode QR demo">
      <span className="qr-corner qr-corner-tl" />
      <span className="qr-corner qr-corner-tr" />
      <span className="qr-corner qr-corner-bl" />
      <span className="qr-dots" />
      <span className="qr-center">
        <Leaf size={19} fill="currentColor" />
      </span>
    </div>
  );
}

export default function Home() {
  const [activeFlow, setActiveFlow] = useState<"petani" | "pembeli">("petani");
  const [menuOpen, setMenuOpen] = useState(false);
  const steps = activeFlow === "petani" ? farmerSteps : buyerSteps;

  return (
    <main id="beranda">
      <header className="site-header">
        <div className="nav-wrap">
          <Brand />
          <button
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav className={menuOpen ? "main-nav nav-open" : "main-nav"}>
            <a href="#solusi" onClick={() => setMenuOpen(false)}>
              Solusi
            </a>
            <a href="#cara-kerja" onClick={() => setMenuOpen(false)}>
              Cara kerja
            </a>
            <a href="#paspor" onClick={() => setMenuOpen(false)}>
              Paspor digital
            </a>
          </nav>
          <a className="nav-cta" href="/login">
            Login <ArrowUpRight size={16} />
          </a>
        </div>
      </header>

      <section className="hero-section" aria-labelledby="hero-title">
        <motion.div
          className="hero-glow hero-glow-one"
          animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="hero-glow hero-glow-two"
          animate={{ x: [0, -16, 0], y: [0, 14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating Subtle Botanical Drift */}
        <motion.svg
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
          animate={{
            opacity: [0.08, 0.16, 0.08],
            y: [0, -14, 0],
            rotate: [0, 6, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "12%",
            right: "5%",
            width: "140px",
            height: "140px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <path
            d="M20 80 C20 40 50 15 85 15 C85 55 55 80 20 80 Z"
            fill="#718263"
          />
          <path
            d="M20 80 C45 55 65 35 85 15"
            stroke="#587b47"
            strokeWidth="2.5"
          />
        </motion.svg>

        <div className="hero-wrap">
          <motion.div
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.06,
                },
              },
            }}
          >
            <motion.div
              className="eyebrow"
              variants={{
                hidden: { opacity: 0, y: -12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <motion.span
                className="eyebrow-dot"
                animate={{ scale: [1, 1.45, 1], opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              DARI KEBUN, TERHUBUNG KE DUNIA
            </motion.div>

            <motion.h1
              id="hero-title"
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              Paspor Digital
              <br />
              Kakao <span>Indonesia.</span>
            </motion.h1>

            <motion.p
              className="hero-description"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              Buktikan mutu fermentasi dan jejak sirkular kakao dalam satu scan
              QR.
            </motion.p>

            <motion.div
              className="hero-actions"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <motion.a
                className="button button-primary"
                href="#paspor"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <QrCode size={18} />
                Pindai Demo QR
              </motion.a>
              <motion.a
                className="button button-outline"
                href="/login"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Masuk ke Platform <ArrowRight size={17} />
              </motion.a>
            </motion.div>

            <motion.div
              className="hero-proof"
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <span>
                <CheckCircle2 size={16} /> Data transparan
              </span>
              <span>
                <CheckCircle2 size={16} /> Mudah dipindai
              </span>
              <span>
                <CheckCircle2 size={16} /> Berdayakan petani
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            aria-label="Simulasi alur proses KakaoPass dari kebun hingga paspor digital"
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <HeroProcessStage />
          </motion.div>
        </div>

        <motion.a
          className="scroll-cue"
          href="#solusi"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("solusi")?.scrollIntoView({ behavior: "smooth" });
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          whileHover={{ y: 3, scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>JELAJAHI SOLUSI</span>
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "inline-flex" }}
          >
            <ArrowDown size={15} />
          </motion.span>
        </motion.a>
      </section>

      <section className="solutions-section section-pad" id="solusi">
        <div className="section-wrap">
          <motion.div
            className="section-heading"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="section-kicker">SATU PASPOR, DAMPAK LEBIH LUAS</p>
              <h2>Bukan Sekadar Catatan.<br /><span>Ini Ekosistem Mutu Kakao Terpadu.</span></h2>
            </div>
          </motion.div>

          <motion.div
            className="bento-grid"
            variants={bentoContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {/* Card 1: Live IoT Thermal Telemetry (Span 7) */}
            <motion.article
              className="bento-card bento-col-7"
              variants={bentoCardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div>
                <div className="bento-header">
                  <span className="bento-tag">
                    <Thermometer size={14} /> Telemetri IoT 24/7
                  </span>
                  <span className="bento-badge g">
                    <span className="kp-dot on" style={{ width: 6, height: 6 }} /> Sensor Aktif
                  </span>
                </div>
                <h3 className="bento-title">Pemantauan Suhu Tanpa Tebak-tebakan</h3>
                <p className="bento-desc">
                  Sensor probe merekam suhu fermentasi 28°C–50°C otomatis secara realtime.
                </p>
              </div>

              {/* Micro-Widget 1: Live Thermal Wave */}
              <div className="bento-widget">
                <div className="bento-telemetry-top">
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Suhu Inti Fermentasi</span>
                    <div className="bento-telemetry-temp">
                      48.8<small style={{ fontSize: 16, fontWeight: 500, color: "var(--rust)" }}> °C</small>
                    </div>
                  </div>
                  <span className="kp-zone-pill kp-zone-opt">
                    🟢 Zona Optimal Bakteri Asetat
                  </span>
                </div>

                {/* Animated Mini SVG Thermal Wave */}
                <div style={{ width: "100%", height: 54, position: "relative", overflow: "hidden" }}>
                  <svg viewBox="0 0 320 54" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="bentoWaveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#b7653e" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#b7653e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0 48 Q 40 45, 80 34 T 160 16 T 240 10 T 320 22 L 320 54 L 0 54 Z"
                      fill="url(#bentoWaveGrad)"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                    <motion.path
                      d="M0 48 Q 40 45, 80 34 T 160 16 T 240 10 T 320 22"
                      fill="none"
                      stroke="#b7653e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.1, ease: "easeInOut" }}
                    />
                    <motion.circle
                      cx="240"
                      cy="10"
                      r="4.5"
                      fill="#8a3b1f"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.9, type: "spring", stiffness: 400 }}
                    />
                    <motion.circle
                      cx="240"
                      cy="10"
                      r="8"
                      fill="#b7653e"
                      animate={{ scale: [1, 1.45, 1], opacity: [0.35, 0.1, 0.35] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </svg>
                </div>

                <div className="bento-telemetry-sub">
                  <span>Ruang: <b>31.4°C</b></span>
                  <span>Kelembapan: <b>86% RH</b></span>
                  <span>Pembalikan: <b>Jam ke-48</b></span>
                </div>
              </div>
            </motion.article>

            {/* Card 2: Uji Belah Mutu (Cut Test 100 Butir) (Span 5) */}
            <motion.article
              className="bento-card bento-col-5"
              variants={bentoCardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div>
                <div className="bento-header">
                  <span className="bento-tag">
                    <ShieldCheck size={14} /> Standar SNI 2323:2008
                  </span>
                  <span className="bento-badge g">
                    🏆 Grade 1 Super
                  </span>
                </div>
                <h3 className="bento-title">Kepastian Mutu Uji Belah 100 Butir</h3>
                <p className="bento-desc">
                  Validasi kematangan fermentasi dan eliminasi biji mentah (slaty) berbasis standar SNI.
                </p>
              </div>

              {/* Micro-Widget 2: Cut Test Breakdown Bar */}
              <div className="bento-widget">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <b style={{ fontSize: 13, color: "var(--cocoa-dark)" }}>Hasil Sampling 100 Butir Belah</b>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green-dark)" }}>Kadar Air: 7.1%</span>
                </div>

                <div className="bento-cut-bars">
                  <div className="bento-cut-bar-item">
                    <span style={{ color: "var(--cocoa-dark)", fontWeight: 600 }}>Cokelat Berongga</span>
                    <div className="bento-cut-progress">
                      <motion.div
                        className="bento-cut-fill"
                        style={{ background: "var(--green-dark)" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: "88%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <b>88%</b>
                  </div>

                  <div className="bento-cut-bar-item">
                    <span style={{ color: "var(--muted)" }}>Ungu (Setengah)</span>
                    <div className="bento-cut-progress">
                      <motion.div
                        className="bento-cut-fill"
                        style={{ background: "#d97706" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: "8%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <b>8%</b>
                  </div>

                  <div className="bento-cut-bar-item">
                    <span style={{ color: "var(--muted)" }}>Slaty (Mentah)</span>
                    <div className="bento-cut-progress">
                      <motion.div
                        className="bento-cut-fill"
                        style={{ background: "#a8381b" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: "2%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <b>2%</b>
                  </div>

                  <div className="bento-cut-bar-item">
                    <span style={{ color: "var(--muted)" }}>Jamur / Cacat</span>
                    <div className="bento-cut-progress">
                      <motion.div
                        className="bento-cut-fill"
                        style={{ background: "#a8381b" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: "2%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <b>2%</b>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Card 3: Zero-Waste Circular Economy (Span 5) */}
            <motion.article
              className="bento-card bento-col-5"
              variants={bentoCardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div>
                <div className="bento-header">
                  <span className="bento-tag">
                    <Leaf size={14} /> Jejak Sirkular &amp; ESG
                  </span>
                  <span className="bento-badge g">
                    ♻️ 100% Zero Waste
                  </span>
                </div>
                <h3 className="bento-title">Limbah Kulit Jadi Pupuk Berkah</h3>
                <p className="bento-desc">
                  Olah 70% limbah kulit buah jadi kompos organik bernilai guna, cegah sarang jamur di kebun.
                </p>
              </div>

              {/* Micro-Widget 3: Circular Ratio Flow */}
              <div className="bento-widget">
                <div className="bento-ratio-box">
                  <motion.div
                    className="bento-ratio-node"
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <b>30 kg</b>
                    <span>Biji Kering Super</span>
                  </motion.div>
                  <span style={{ fontSize: 16, color: "var(--rust)", fontWeight: 700 }}>+</span>
                  <motion.div
                    className="bento-ratio-node"
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35, type: "spring", stiffness: 350, damping: 20 }}
                  >
                    <b style={{ color: "var(--green-dark)" }}>70 kg</b>
                    <span>Pupuk Kompos Organik</span>
                  </motion.div>
                </div>
                <div style={{ marginTop: 8, padding: "6px 10px", background: "#e3ead9", borderRadius: 8, textAlign: "center", fontSize: 11, fontWeight: 700, color: "var(--green-dark)" }}>
                  🌱 0% Limbah Dibuang ke Lingkungan Kebun
                </div>
              </div>
            </motion.article>

            {/* Card 4: 1-Scan Public QR Transparency (Span 7) */}
            <motion.article
              className="bento-card bento-col-7"
              variants={bentoCardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div>
                <div className="bento-header">
                  <span className="bento-tag">
                    <ScanLine size={14} /> Transparansi Pembeli &amp; Buyer
                  </span>
                  <span className="bento-badge o">
                    ⚡ 1-Scan Tanpa Aplikasi
                  </span>
                </div>
                <h3 className="bento-title">Kepercayaan Pembeli Dalam Satu Scan QR</h3>
                <p className="bento-desc">
                  Scan QR pada karung untuk lacak riwayat fermentasi, asal kebun, dan profil petani secara instan.
                </p>
              </div>

              {/* Micro-Widget 4: Mini Passport Simulation */}
              <div className="bento-widget">
                <div className="bento-passport-sim" style={{ position: "relative", overflow: "hidden" }}>
                  <motion.div
                    initial={{ x: "-100%", opacity: 0 }}
                    whileInView={{ x: "260%", opacity: [0, 0.7, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      width: "35%",
                      background: "linear-gradient(90deg, transparent, rgba(88,123,71,0.22), transparent)",
                      pointerEvents: "none",
                    }}
                  />
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "#fff", border: "1px solid #ddd8cc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <QrCode size={26} style={{ color: "var(--cocoa-dark)" }} />
                    </div>
                    <div>
                      <b style={{ fontSize: 14, color: "var(--cocoa-dark)", display: "block" }}>Batch KP-261025-464</b>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>Pak Budi · Kebun Karangan Mandiri</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="kp-chip g" style={{ fontSize: 11 }}>
                      <Check size={12} /> Terverifikasi SNI
                    </span>
                    <a href="/p/demo" target="_blank" className="kp-btn sm" style={{ textDecoration: "none" }}>
                      Buka Paspor Demo <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </section>

      <section className="workflow-section section-pad" id="cara-kerja">
        <div className="section-wrap">
          <div className="workflow-heading">
            <p className="section-kicker">DARI PANEN KE PEMBELI</p>
            <h2>Alur sederhana,<br /><span>percaya lebih mudah.</span></h2>
            <p>Pilih peran untuk melihat bagaimana KakaoPass bekerja.</p>
            <div className="flow-switch" role="tablist" aria-label="Pilih alur">
              <button
                aria-selected={activeFlow === "petani"}
                className={activeFlow === "petani" ? "flow-tab active" : "flow-tab"}
                onClick={() => setActiveFlow("petani")}
                role="tab"
                type="button"
              >
                <Sprout size={16} /> Untuk petani
              </button>
              <button
                aria-selected={activeFlow === "pembeli"}
                className={activeFlow === "pembeli" ? "flow-tab active" : "flow-tab"}
                onClick={() => setActiveFlow("pembeli")}
                role="tab"
                type="button"
              >
                <ScanLine size={16} /> Untuk pembeli
              </button>
            </div>
          </div>
          <div className="steps-grid" role="tabpanel">
            {steps.map(({ number, title, description, icon: Icon }, index) => (
              <article className="step-card" key={`${activeFlow}-${number}`}>
                <div className="step-top">
                  <span className="step-icon"><Icon size={20} /></span>
                  <span className="step-number">{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="step-arrow" size={18} />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="passport-section section-pad" id="paspor">
        <div className="section-wrap passport-wrap">
          <div className="passport-copy">
            <p className="section-kicker">SATU SCAN, SEMUA CERITA</p>
            <h2>Kenali kakao<br />sebelum <span>mencicipi.</span></h2>
            <p>
              Inilah yang dilihat pembeli saat memindai QR pada karung. Riwayat
              fermentasi, hasil uji mutu, dan asal batch tersaji dalam satu
              halaman publik.
            </p>
            <ul className="passport-checks">
              <li><CheckCircle2 size={17} /> Profil suhu dan kelembapan</li>
              <li><CheckCircle2 size={17} /> Hasil cut test dan kadar air</li>
              <li><CheckCircle2 size={17} /> Catatan perjalanan batch</li>
            </ul>
            <a className="text-link" href="#contoh-paspor">
              Jelajahi contoh paspor <ArrowRight size={17} />
            </a>
          </div>
          <div className="public-passport" id="contoh-paspor">
            <div className="public-passport-head">
              <div>
                <span className="public-label"><ShieldCheck size={14} /> PASPOR PUBLIK</span>
                <h3>Kakao Fermentasi<br />Kutai Timur</h3>
                <p>Kelompok Tani Karangan · Kalimantan Timur</p>
              </div>
              <DemoQr />
            </div>
            <div className="public-batch">
              <span>ID BATCH</span>
              <strong>KTIM-KRG-2026-B01</strong>
              <span className="batch-status"><Check size={13} /> DATA TERKUNCI</span>
            </div>
            <div className="quality-row">
              <div className="quality-card">
                <span>UJI BELAH</span>
                <strong>94<small>%</small></strong>
                <em>Terfermentasi · Grade A</em>
              </div>
              <div className="quality-card">
                <span>KADAR AIR</span>
                <strong>7.2<small>%</small></strong>
                <em>Sesuai standar mutu</em>
              </div>
            </div>
            <div className="temperature-card">
              <div className="chart-title">
                <span><Thermometer size={15} /> PROFIL SUHU FERMENTASI</span>
                <strong>120 jam</strong>
              </div>
              <div className="chart" aria-label="Grafik suhu fermentasi contoh">
                <span className="chart-y-label y-top">50°</span>
                <span className="chart-y-label y-mid">35°</span>
                <span className="chart-y-label y-bottom">20°</span>
                <svg viewBox="0 0 440 112" preserveAspectRatio="none" role="img" aria-label="Suhu meningkat dan stabil selama fermentasi">
                  <defs>
                    <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#bd6b42" stopOpacity=".24" />
                      <stop offset="100%" stopColor="#bd6b42" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 91 C25 84 38 76 60 73 S96 68 120 57 S154 45 180 40 S216 30 240 26 S280 20 310 22 S351 16 380 19 S416 14 440 12 L440 112 L0 112Z" fill="url(#chart-fill)" />
                  <path d="M0 91 C25 84 38 76 60 73 S96 68 120 57 S154 45 180 40 S216 30 240 26 S280 20 310 22 S351 16 380 19 S416 14 440 12" fill="none" stroke="#b7653e" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                  <circle cx="440" cy="12" r="4" fill="#b7653e" />
                </svg>
                <div className="chart-x-labels"><span>0 jam</span><span>40 jam</span><span>80 jam</span><span>120 jam</span></div>
              </div>
            </div>
            <div className="public-footer">
              <span><LockKeyhole size={13} /> Data batch diverifikasi</span>
              <span>kakaopass.id <ArrowUpRight size={12} /></span>
            </div>
          </div>
        </div>
      </section>

      <section className="closing-section" id="tentang">
        {/* Subtle Ambient Light Glow */}
        <div className="closing-glow-gold" />

        {/* Cocoa Pod Silhouette Watermark in Corner */}
        <svg
          viewBox="0 0 200 200"
          className="closing-silh"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden="true"
        >
          <path d="M40 160 C20 120, 30 60, 90 30 C150 0, 185 50, 175 110 C165 170, 90 195, 40 160 Z" />
          <path d="M90 30 C100 80, 105 130, 40 160" strokeDasharray="4 4" />
          <path d="M125 55 C135 95, 130 140, 100 180" strokeDasharray="4 4" />
        </svg>

        <motion.div
          className="closing-inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.05,
              },
            },
          }}
        >
          {/* Left Column: Story Copy */}
          <div className="closing-copy">
            <motion.div
              className="closing-meta"
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <span className="closing-icon">
                <Leaf size={15} />
              </span>
              <p>Setiap kakao punya cerita.</p>
            </motion.div>

            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 300, damping: 24 },
                },
              }}
            >
              Saatnya cerita itu{" "}
              <span className="closing-break">bisa <span className="closing-highlight">dibuktikan.</span></span>
            </motion.h2>
          </div>

          {/* Right Column: Action CTA */}
          <motion.div
            className="closing-action"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.08 } },
            }}
          >
            <motion.a
              className="closing-btn"
              href="#paspor"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Soft Shimmer Light Glare Sweep */}
              <motion.div
                className="closing-shimmer"
                animate={{ left: ["-100%", "200%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  repeatDelay: 3.5,
                  ease: "easeInOut",
                }}
              />
              <QrCode size={16} />
              <span>Pindai Demo QR</span>
              <ArrowRight size={15} />
            </motion.a>
            <span className="closing-hint">
              <ShieldCheck size={13} style={{ color: "var(--green)" }} /> Terbuka untuk umum · Standar SNI
            </span>
          </motion.div>
        </motion.div>
      </section>

      <footer className="site-footer" id="kontak">
        {/* Main Sleek Footer Bar */}
        <div className="footer-main">
          <div className="footer-brand-block">
            <Brand />
            <p>
              Paspor digital kakao Indonesia: memadukan sensor IoT fermentasi, standar uji belah SNI 2323, dan jejak sirkular 0% limbah.
            </p>
          </div>

          <div className="footer-links">
            <a href="#solusi">Solusi IoT</a>
            <a href="#cara-kerja">Alur Proses</a>
            <a href="#paspor">Paspor Demo</a>
            <a href="/login">Portal Petani</a>
            <a href="#tentang">Tentang Kami</a>
          </div>
        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="footer-bottom">
          <span>© 2026 KakaoPass Indonesia · Karangan, Kutai Timur</span>
          <span className="footer-sub-note">
            🌱 Menjaga Mutu · Merawat Bumi · Berdayakan Petani
          </span>
        </div>
      </footer>
    </main>
  );
}
