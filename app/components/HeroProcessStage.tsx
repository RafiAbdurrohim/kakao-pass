"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  CheckCircle2,
  Droplets,
  Layers,
  Leaf,
  Maximize2,
  Pause,
  Play,
  QrCode,
  Radio,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Thermometer,
  Wifi,
  Wind,
} from "lucide-react";

interface StageInfo {
  id: number;
  label: string;
  tag: string;
  title: string;
  desc: string;
  badge: string;
}

const STAGES: StageInfo[] = [
  {
    id: 0,
    label: "01 Kebun",
    tag: "HULU · PANEN SELEKTIF",
    title: "Petani Memetik Buah Matang Optimal",
    desc: "Petani memetik buah kakao dengan kematangan 100% di perkebunan Karangan, Kutai Timur untuk menjamin kadar gula pulpa terbaik.",
    badge: "Kematangan 100%",
  },
  {
    id: 1,
    label: "02 IoT Sensor",
    tag: "FERMENTASI TERKONTROL",
    title: "Pemasangan Probe Sensor DS18B20",
    desc: "Petani menancapkan sensor probe langsung ke tengah tumpukan biji kakao. Modul ESP32 memantau suhu mikroba menuju target 45-50°C.",
    badge: "Suhu Inti Real-Time",
  },
  {
    id: 2,
    label: "03 Sinkron HP",
    tag: "APLIKASI PETANI",
    title: "Pencatatan Kurva & Alarm Pembalikan",
    desc: "Data suhu terkirim otomatis ke HP petani. Aplikasi memberi alarm pembalikan biji di jam ke-48 dan mengunci data batch ke cloud.",
    badge: "Data Terkunci",
  },
  {
    id: 3,
    label: "04 Paspor QR",
    tag: "HILIR · VERIFIKASI PEMBELI",
    title: "Pindai QR Karung & Stempel Mutu I",
    desc: "Karung 60 kg siap kirim dengan label paspor digital. Pembeli memindai QR code dan instan memvalidasi sertifikasi Mutu I SNI.",
    badge: "Terverifikasi Mutu I",
  },
];

const STAGE_DURATION_MS = 6800;

export default function HeroProcessStage() {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [tempValue, setTempValue] = useState(28.4);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play timer & progress animation
  useEffect(() => {
    if (!isPlaying) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / STAGE_DURATION_MS) * 100, 100);
      setProgress(pct);

      if (elapsed >= STAGE_DURATION_MS) {
        setActiveStage((prev) => (prev + 1) % STAGES.length);
        setProgress(0);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isPlaying, activeStage]);

  // Dynamic simulated IoT temperature fluctuation based on stage
  useEffect(() => {
    let target = 28.5;
    if (activeStage === 0) target = 28.2;
    else if (activeStage === 1) target = 48.6;
    else if (activeStage === 2) target = 49.4;
    else if (activeStage === 3) target = 46.8;

    const interval = setInterval(() => {
      setTempValue((prev) => {
        const delta = (target - prev) * 0.15;
        const jitter = (Math.random() - 0.5) * 0.2;
        return Number((prev + delta + jitter).toFixed(1));
      });
    }, 250);

    return () => clearInterval(interval);
  }, [activeStage]);

  // Handle manual stage selection
  const handleSelectStage = (idx: number) => {
    setActiveStage(idx);
    setProgress(0);
  };

  // 3D Mouse Parallax Tilt (active on non-touch devices)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    if (window.innerWidth <= 768) return; // Disable on mobile to prevent jitter
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / (rect.width / 2)) * 4.5;
    const rotateX = -(y / (rect.height / 2)) * 4.5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const stage = STAGES[activeStage];

  return (
    <div
      className="hero-stage-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Ambient background glow */}
      <div className="stage-glow stage-glow-emerald" />
      <div className="stage-glow stage-glow-amber" />

      {/* Main Glass Stage Deck */}
      <div className="stage-deck">
        {/* Top Control Bar */}
        <div className="stage-topbar">
          <div className="stage-status-chip">
            <span className="live-dot" />
            <span className="live-text">SIMULASI ALUR IOT</span>
            <span className="stage-chip-divider">·</span>
            <span className="stage-chip-step">{stage.tag}</span>
          </div>

          <div className="stage-top-actions">
            <button
              type="button"
              className="stage-ctrl-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Jeda simulasi" : "Lanjutkan simulasi"}
              aria-label={isPlaying ? "Jeda simulasi" : "Lanjutkan simulasi"}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? "Jeda" : "Putar"}</span>
            </button>
            <button
              type="button"
              className="stage-ctrl-btn icon-only"
              onClick={() => handleSelectStage((activeStage + 1) % STAGES.length)}
              title="Tahap berikutnya"
              aria-label="Tahap berikutnya"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* 2.5D Animated Visual Canvas */}
        <div className="stage-canvas">
          {/* Subtle Isometric Background Grid */}
          <div className="canvas-grid" />

          {/* Floating Live Telemetry Badge (Across all stages) */}
          <div className="stage-telemetry-pill">
            <div className="telemetry-icon">
              <Radio size={14} className="pulse-icon" />
            </div>
            <div className="telemetry-data">
              <span className="telemetry-lbl">PROBE DS18B20</span>
              <strong className="telemetry-val">
                {tempValue.toFixed(1)}°C
                <small className="telemetry-sub">
                  {tempValue >= 45 ? "Optimal" : "Suhu Awal"}
                </small>
              </strong>
            </div>
          </div>

          {/* AnimatePresence for Smooth Cinematic Transitions */}
          <AnimatePresence mode="wait">
            {/* ========================================================= */}
            {/* STAGE 0: KEBUN KAKAO (Matahari, Burung, Angin, Petik)    */}
            {/* ========================================================= */}
            {activeStage === 0 && (
              <motion.div
                key="stage-kebun"
                className="stage-motion-wrap"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <svg
                  viewBox="0 0 460 270"
                  className="scene-svg"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4a3022" />
                      <stop offset="100%" stopColor="#2c1a12" />
                    </linearGradient>
                    <linearGradient id="leafGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f733f" />
                      <stop offset="100%" stopColor="#2f4a24" />
                    </linearGradient>
                    <linearGradient id="leafGrad2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#678a53" />
                      <stop offset="100%" stopColor="#3d5d30" />
                    </linearGradient>
                    <linearGradient id="podGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f5b82e" />
                      <stop offset="60%" stopColor="#de8f12" />
                      <stop offset="100%" stopColor="#965207" />
                    </linearGradient>
                    <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="60%" stopColor="#fde047" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                    <filter id="shadow3d" x="-10%" y="-10%" width="130%" height="130%">
                      <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.22" />
                    </filter>
                    <filter id="sunGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* 1. ATMOSFER ALAM: Matahari Pagi Karangan */}
                  <g transform="translate(52, 45)">
                    {/* Sun Rays Corona */}
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="32"
                      fill="#fef08a"
                      opacity="0.3"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Sun Core */}
                    <circle cx="0" cy="0" r="22" fill="url(#sunGrad)" filter="url(#sunGlow)" />
                  </g>

                  {/* 2. ATMOSFER ALAM: Awan Berarak Melintasi Langit */}
                  <motion.g
                    initial={{ x: -60 }}
                    animate={{ x: [ -60, 480 ] }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                    transform="translate(0, 36)"
                    opacity="0.65"
                  >
                    <ellipse cx="40" cy="14" rx="28" ry="11" fill="#ffffff" />
                    <ellipse cx="60" cy="8" rx="20" ry="10" fill="#ffffff" />
                    <ellipse cx="22" cy="16" rx="14" ry="7" fill="#ffffff" />
                  </motion.g>

                  <motion.g
                    initial={{ x: -100 }}
                    animate={{ x: [ -100, 480 ] }}
                    transition={{ duration: 32, repeat: Infinity, ease: "linear", delay: 8 }}
                    transform="translate(0, 65)"
                    opacity="0.45"
                  >
                    <ellipse cx="50" cy="12" rx="22" ry="8" fill="#ffffff" />
                    <ellipse cx="66" cy="7" rx="16" ry="7" fill="#ffffff" />
                  </motion.g>

                  {/* 3. ATMOSFER ALAM: Burung Mengepakkan Sayap Melintas */}
                  <motion.g
                    initial={{ x: -20, y: 70 }}
                    animate={{ x: [ -20, 480 ], y: [ 70, 42, 60 ] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Bird 1 */}
                    <g transform="translate(0, 0)">
                      <motion.path
                        d="M0 4 Q6 -3 12 4 Q18 -3 24 4"
                        stroke="#2c1a12"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        fill="none"
                        animate={{ scaleY: [1, 0.2, 1] }}
                        transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </g>
                    {/* Bird 2 (Companion behind) */}
                    <g transform="translate(-16, 10) scale(0.75)">
                      <motion.path
                        d="M0 4 Q6 -3 12 4 Q18 -3 24 4"
                        stroke="#2c1a12"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        fill="none"
                        animate={{ scaleY: [1, 0.2, 1] }}
                        transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                      />
                    </g>
                  </motion.g>

                  {/* 4. ATMOSFER ALAM: Sepoi Angin Lembap (Wind Breeze Lines) */}
                  <motion.path
                    d="M30 115 Q140 90 220 120 T350 100"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="25 60"
                    opacity="0.4"
                    animate={{ strokeDashoffset: [170, -170] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                    fill="none"
                  />
                  <motion.path
                    d="M80 145 Q180 130 260 150 T400 135"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeDasharray="20 50"
                    opacity="0.3"
                    animate={{ strokeDashoffset: [140, -140] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "linear", delay: 0.8 }}
                    fill="none"
                  />

                  {/* Ground Shadow & Plantation Hills */}
                  <ellipse cx="230" cy="245" rx="195" ry="18" fill="#35251f" opacity="0.12" />
                  <path
                    d="M30 250 Q160 220 280 235 T430 250 L430 270 L30 270 Z"
                    fill="#dcedcf"
                    opacity="0.6"
                  />

                  {/* Cocoa Tree Trunk & Branches */}
                  <g filter="url(#shadow3d)">
                    <path
                      d="M125 245 C130 185, 115 145, 110 105 C108 85, 126 75, 136 92 C146 115, 144 175, 150 245 Z"
                      fill="url(#trunkGrad)"
                    />
                    <path
                      d="M120 140 C90 115, 65 120, 45 135 C65 148, 95 152, 120 155 Z"
                      fill="url(#trunkGrad)"
                      opacity="0.9"
                    />
                    <path
                      d="M135 120 C170 100, 200 105, 220 118 C200 132, 170 130, 135 135 Z"
                      fill="url(#trunkGrad)"
                      opacity="0.9"
                    />

                    {/* Lush Cocoa Canopy (Animated with wind sway) */}
                    <motion.g
                      animate={{ rotate: [0, 1.2, 0] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{ transformOrigin: "140px 140px" }}
                    >
                      <path
                        d="M55 110 C20 65, 90 30, 145 55 C185 25, 255 55, 230 110 C255 150, 195 175, 155 160 C110 180, 45 155, 55 110 Z"
                        fill="url(#leafGrad1)"
                      />
                      <ellipse cx="95" cy="90" rx="45" ry="28" fill="url(#leafGrad2)" />
                      <ellipse cx="185" cy="85" rx="50" ry="32" fill="url(#leafGrad2)" />
                      <ellipse cx="140" cy="115" rx="40" ry="24" fill="#446636" />
                    </motion.g>

                    {/* Hanging Cocoa Pods on Trunk (Static ones) */}
                    <g filter="url(#shadow3d)">
                      <path
                        d="M105 142 C100 162, 105 182, 113 190 C122 182, 126 162, 121 142 Z"
                        fill="url(#podGrad)"
                      />
                      <line x1="113" y1="142" x2="113" y2="190" stroke="#fce28b" strokeWidth="1.2" opacity="0.6" />
                    </g>
                    <g filter="url(#shadow3d)">
                      <path
                        d="M142 152 C138 170, 142 184, 148 190 C155 184, 158 170, 154 152 Z"
                        fill="url(#podGrad)"
                      />
                    </g>
                  </g>

                  {/* 5. ATMOSFER ALAM: Daun Kecil Melayang Tertiup Angin */}
                  <motion.g
                    initial={{ x: 140, y: 110, rotate: 0, opacity: 0 }}
                    animate={{
                      x: [140, 190, 240],
                      y: [110, 150, 215],
                      rotate: [0, 90, 190],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: "easeIn", delay: 1 }}
                  >
                    <path d="M0 0 Q4 -3 8 0 Q4 3 0 0 Z" fill="#678a53" />
                  </motion.g>

                  {/* Harvest Rattan Basket with Fresh Pods */}
                  <g transform="translate(200, 195)" filter="url(#shadow3d)">
                    <path
                      d="M8 12 L6 45 Q35 52 64 45 L62 12 Z"
                      fill="#9c6e3b"
                      stroke="#66431e"
                      strokeWidth="2"
                    />
                    <ellipse cx="35" cy="14" rx="27" ry="8" fill="#5c3818" />
                    {/* Fresh pods inside basket */}
                    <ellipse cx="26" cy="11" rx="10" ry="6" fill="#f5b82e" />
                    <ellipse cx="44" cy="12" rx="11" ry="6" fill="#de8f12" />
                    <ellipse cx="35" cy="7" rx="8" ry="5" fill="#f5b82e" />
                  </g>

                  {/* THE RIPE POD BEING HARVESTED */}
                  {/* Stable Anchor wrapper at the branch: (185, 125) */}
                  <g transform="translate(185, 125)">
                    <motion.g
                      initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
                      animate={{
                        y: [0, 0, 15, 72, 72, 0],
                        x: [0, 0, 10, 32, 32, 0],
                        rotate: [0, 0, 15, 45, 45, 0],
                        opacity: [1, 1, 1, 0, 0, 1],
                      }}
                      transition={{
                        duration: 4.8,
                        repeat: Infinity,
                        times: [0, 0.35, 0.5, 0.7, 0.9, 1],
                        ease: "easeInOut",
                      }}
                      filter="url(#shadow3d)"
                    >
                      <path
                        d="M0 0 C-6 16, -2 34, 6 40 C14 34, 17 16, 12 0 Z"
                        fill="url(#podGrad)"
                      />
                      <line x1="6" y1="0" x2="6" y2="40" stroke="#fce28b" strokeWidth="1.2" opacity="0.6" />
                    </motion.g>
                  </g>

                  {/* Snip Sparkle Indicator right at the stem (191, 125) */}
                  <g transform="translate(191, 125)">
                    <motion.g
                      initial={{ opacity: 0, scale: 0.2 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.2, 1.4, 0] }}
                      transition={{
                        duration: 4.8,
                        repeat: Infinity,
                        times: [0.32, 0.38, 0.44],
                      }}
                    >
                      <circle cx="0" cy="0" r="7" fill="#fef08a" opacity="0.9" />
                      <line x1="-9" y1="0" x2="9" y2="0" stroke="#f59e0b" strokeWidth="2" />
                      <line x1="0" y1="-9" x2="0" y2="9" stroke="#f59e0b" strokeWidth="2" />
                    </motion.g>
                  </g>

                  {/* INDONESIAN FARMER CHARACTER (Standing next to tree at x=235, y=85) */}
                  <g transform="translate(235, 85)" filter="url(#shadow3d)">
                    {/* Legs */}
                    <rect x="22" y="112" width="12" height="44" rx="4" fill="#2d3748" />
                    <rect x="38" y="112" width="12" height="44" rx="4" fill="#2d3748" />
                    <ellipse cx="28" cy="156" rx="8" ry="4" fill="#1a202c" />
                    <ellipse cx="44" cy="156" rx="8" ry="4" fill="#1a202c" />

                    {/* Torso & Field Vest */}
                    <rect x="16" y="48" width="40" height="68" rx="9" fill="#3b5936" />
                    <path d="M26 48 L36 68 L46 48 Z" fill="#e2e8f0" />
                    <rect x="20" y="76" width="13" height="13" rx="2" fill="#2e462a" />
                    <rect x="39" y="76" width="13" height="13" rx="2" fill="#2e462a" />

                    {/* Right resting arm */}
                    <rect x="52" y="52" width="11" height="42" rx="5" fill="#3b5936" />
                    <ellipse cx="57" cy="96" rx="5" ry="5" fill="#d99a6c" />

                    {/* Head & Straw Sunhat (Caping) */}
                    <circle cx="36" cy="30" r="13" fill="#d99a6c" />
                    <path d="M4 28 Q36 -2 68 28 Z" fill="#d4a373" stroke="#b07d4f" strokeWidth="1.5" />
                    <ellipse cx="36" cy="28" rx="34" ry="6" fill="#c4905d" />

                    {/* Left Arm Attached to Shoulder (x=18, y=54) Reaching to the Pod */}
                    <g transform="translate(18, 54)">
                      <motion.g
                        animate={{
                          rotate: [0, -10, 0],
                          x: [0, -4, 0],
                          y: [0, -2, 0],
                        }}
                        transition={{
                          duration: 4.8,
                          repeat: Infinity,
                          times: [0, 0.35, 1],
                          ease: "easeInOut",
                        }}
                        style={{ transformOrigin: "0px 0px" }}
                      >
                        {/* Upper arm stretching left */}
                        <path
                          d="M0 0 L-26 -8 Q-38 -10 -46 -5"
                          stroke="#3b5936"
                          strokeWidth="13"
                          strokeLinecap="round"
                        />
                        {/* Hand holding shears */}
                        <ellipse cx="-48" cy="-5" rx="6" ry="5.5" fill="#d99a6c" />
                        {/* Pruning shears touching pod stem */}
                        <path
                          d="M-52 -7 L-62 -12 M-52 -3 L-62 2"
                          stroke="#94a3b8"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </motion.g>
                    </g>
                  </g>
                </svg>

                <div className="scene-float-card card-bottom-left">
                  <span className="float-icon green">
                    <Leaf size={14} />
                  </span>
                  <div>
                    <strong>Varietas Trinitario</strong>
                    <small>Petik selektif · 100% matang</small>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* STAGE 1: KOTAK FERMENTASI & GUDANG KAYU TEDUH            */}
            {/* ========================================================= */}
            {activeStage === 1 && (
              <motion.div
                key="stage-fermentasi"
                className="stage-motion-wrap"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <svg
                  viewBox="0 0 460 270"
                  className="scene-svg"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="woodFront" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8d5c38" />
                      <stop offset="100%" stopColor="#55341c" />
                    </linearGradient>
                    <linearGradient id="woodSide" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6e4324" />
                      <stop offset="100%" stopColor="#442512" />
                    </linearGradient>
                    <linearGradient id="beanBed" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4f2018" />
                      <stop offset="50%" stopColor="#3d1812" />
                      <stop offset="100%" stopColor="#240c08" />
                    </linearGradient>
                    <linearGradient id="probeMetal" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f1f5f9" />
                      <stop offset="50%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                    <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    {/* Depth clipping path that hides the submerged part of the probe */}
                    <clipPath id="probeIntoBeansClip">
                      <rect x="0" y="0" width="460" height="154" />
                    </clipPath>
                  </defs>

                  {/* 1. SUASANA RUMAH FERMENTASI: Siluet Tiang Gudang Kayu Petani */}
                  <g opacity="0.35">
                    {/* Horizontal rafter beam */}
                    <rect x="30" y="32" width="400" height="8" rx="2" fill="#8d6e53" />
                    {/* Vertical posts */}
                    <rect x="65" y="36" width="10" height="210" fill="#7a5b42" />
                    <rect x="385" y="36" width="10" height="210" fill="#7a5b42" />
                    {/* Bamboo ventilation slat lines in shed background */}
                    <line x1="85" y1="65" x2="375" y2="65" stroke="#9d836b" strokeWidth="1.5" strokeDasharray="14 10" />
                    <line x1="85" y1="85" x2="375" y2="85" stroke="#9d836b" strokeWidth="1.5" strokeDasharray="14 10" />
                  </g>

                  {/* Floating Micro-sparkles (Thermal energy particles) */}
                  <motion.circle
                    cx="195"
                    cy="120"
                    r="2"
                    fill="#f59e0b"
                    animate={{ y: [0, -35], opacity: [0, 0.7, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.circle
                    cx="255"
                    cy="115"
                    r="2.2"
                    fill="#f59e0b"
                    animate={{ y: [0, -40], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 1 }}
                  />

                  {/* Ground Shadow */}
                  <ellipse cx="225" cy="245" rx="180" ry="20" fill="#35251f" opacity="0.14" />

                  {/* 3D Isometric Wooden Sweatbox */}
                  {/* Cocoa Beans Bed in Box */}
                  <path d="M105 155 L225 110 L345 155 L225 200 Z" fill="url(#beanBed)" />

                  {/* Glistening Wet Cocoa Beans (Background layer) */}
                  <g fill="#7b3e2b">
                    <ellipse cx="205" cy="140" rx="9" ry="5" />
                    <ellipse cx="235" cy="135" rx="10" ry="5.5" fill="#8e4632" />
                    <ellipse cx="170" cy="145" rx="10" ry="5.5" />
                    <ellipse cx="265" cy="145" rx="10" ry="5" />
                    <ellipse cx="185" cy="130" rx="8" ry="4" />
                    <ellipse cx="250" cy="132" rx="9" ry="5" />
                  </g>

                  {/* Rising Thermal Microbial Steam Wisps */}
                  <g className="steam-container">
                    <path
                      d="M185 135 Q175 105 190 80 T180 50"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="steam-wisp steam-1"
                    />
                    <path
                      d="M225 130 Q235 100 220 75 T230 45"
                      stroke="#ffffff"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="steam-wisp steam-2"
                    />
                    <path
                      d="M265 140 Q255 110 270 85 T260 55"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="steam-wisp steam-3"
                    />
                  </g>

                  {/* FARMER'S HAND INSERTING THE DS18B20 PROBE INTO CORE OF BEANS */}
                  {/* Clipped at y=154 so as probe descends, it enters INSIDE the beans */}
                  <g clipPath="url(#probeIntoBeansClip)">
                    <g transform="translate(225, 55)">
                      <motion.g
                        initial={{ y: -30 }}
                        animate={{ y: [-30, 24, 24, -30] }}
                        transition={{
                          duration: 4.5,
                          repeat: Infinity,
                          times: [0, 0.35, 0.8, 1],
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        filter="url(#shadow3d)"
                      >
                        {/* Farmer Sleeve & Hand */}
                        <rect x="-14" y="0" width="28" height="42" rx="8" fill="#3b5936" />
                        <ellipse cx="0" cy="44" rx="11" ry="8" fill="#d99a6c" />
                        {/* Hand grip around probe rubber handle */}
                        <rect x="-7" y="44" width="14" height="15" rx="3" fill="#c78659" />

                        {/* DS18B20 Stainless Steel Probe Shaft */}
                        <rect x="-3" y="59" width="6" height="55" rx="2" fill="url(#probeMetal)" />
                        {/* Metal probe tip */}
                        <polygon points="-3,114 3,114 0,120" fill="#64748b" />
                      </motion.g>
                    </g>
                  </g>

                  {/* Insertion Hole & Foreground Cocoa Beans that cover the probe entry */}
                  {/* Dark penetration hole in bean mass */}
                  <ellipse cx="225" cy="154" rx="10" ry="4.5" fill="#1b0805" />
                  {/* Foreground Beans around the hole (covering the probe's submerged part) */}
                  <g fill="#7b3e2b">
                    <ellipse cx="216" cy="157" rx="10" ry="5.5" fill="#8e4632" />
                    <ellipse cx="234" cy="156" rx="9" ry="5" />
                    <ellipse cx="220" cy="172" rx="12" ry="6.5" fill="#8e4632" />
                    <ellipse cx="240" cy="168" rx="11" ry="6" />
                    <ellipse cx="195" cy="165" rx="11" ry="6" />
                  </g>
                  {/* Wet specular highlights on foreground beans */}
                  <g fill="#fff" opacity="0.35">
                    <circle cx="217" cy="156" r="1.5" />
                    <circle cx="235" cy="155" r="1.6" />
                    <circle cx="221" cy="171" r="2" />
                  </g>

                  {/* Ripple pulse at probe insertion point in center of bean bed (225, 154) */}
                  <motion.circle
                    cx="225"
                    cy="154"
                    r="12"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.2"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 2.2], opacity: [0.9, 0] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    filter="url(#glowGreen)"
                  />

                  {/* Wooden Box Outer Front Walls */}
                  {/* Left Facet with Aeration Slats */}
                  <path
                    d="M105 155 L225 200 L225 245 L105 200 Z"
                    fill="url(#woodFront)"
                    stroke="#2e1a0d"
                    strokeWidth="2"
                  />
                  <line x1="105" y1="170" x2="225" y2="215" stroke="#251307" strokeWidth="2.5" />
                  <line x1="105" y1="185" x2="225" y2="230" stroke="#251307" strokeWidth="2.5" />

                  {/* Right Facet with Aeration Slats */}
                  <path
                    d="M225 200 L345 155 L345 200 L225 245 Z"
                    fill="url(#woodSide)"
                    stroke="#2e1a0d"
                    strokeWidth="2"
                  />
                  <line x1="225" y1="215" x2="345" y2="170" stroke="#1f0f05" strokeWidth="2.5" />
                  <line x1="225" y1="230" x2="345" y2="185" stroke="#1f0f05" strokeWidth="2.5" />

                  {/* Top Wooden Lip Framing */}
                  <path
                    d="M100 152 L225 105 L350 152 L345 157 L225 110 L105 157 Z"
                    fill="#9c673e"
                    stroke="#2e1a0d"
                    strokeWidth="1.5"
                  />

                  {/* IoT Waterproof Module Box (ESP32) Mounted on Box Rim (x=90, y=175) */}
                  <g transform="translate(90, 175)" filter="url(#shadow3d)">
                    <rect x="0" y="0" width="36" height="42" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                    {/* Blinking Live LED */}
                    <circle cx="10" cy="14" r="3.5" fill="#10b981" className="led-pulse" />
                    <circle cx="22" cy="14" r="3" fill="#f59e0b" />
                    {/* OLED Screen mini indicator */}
                    <rect x="6" y="24" width="24" height="12" rx="2" fill="#0f172a" />
                    <text x="18" y="33" textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="bold">
                      {tempValue.toFixed(0)}°C
                    </text>
                    {/* Antenna & WiFi Wave */}
                    <line x1="18" y1="0" x2="18" y2="-12" stroke="#475569" strokeWidth="2.5" />
                    <circle cx="18" cy="-12" r="2.5" fill="#10b981" />
                    <path
                      d="M22 -18 A8 8 0 0 1 22 -6"
                      stroke="#10b981"
                      strokeWidth="1.8"
                      fill="none"
                      className="wifi-wave"
                    />
                    <path
                      d="M26 -22 A14 14 0 0 1 26 -2"
                      stroke="#10b981"
                      strokeWidth="1.8"
                      fill="none"
                      className="wifi-wave wave-delay"
                    />
                  </g>

                  {/* Flexible Insulated Cable from ESP32 to Hand-held Probe */}
                  <path
                    d="M108 175 Q150 115 220 75"
                    stroke="#1e293b"
                    strokeWidth="3.2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="scene-float-card card-bottom-left">
                  <span className="float-icon amber">
                    <Thermometer size={14} />
                  </span>
                  <div>
                    <strong>Suhu Inti Fermentasi</strong>
                    <small>Probe DS18B20 tertanam akurat</small>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* STAGE 2: SMARTPHONE 3D MOCKUP & LIVE APLIKASI PETANI     */}
            {/* ========================================================= */}
            {activeStage === 2 && (
              <motion.div
                key="stage-mobile"
                className="stage-motion-wrap"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* 3D Angled Smartphone Showcase with Touch Ripple & Animated Chart */}
                <div className="smartphone-isometric-wrap">
                  <div className="phone-bezel">
                    <div className="phone-screen">
                      {/* Phone App Header */}
                      <div className="phone-header">
                        <span className="phone-batch">BATCH #KTIM-KRG-024</span>
                        <span className="phone-wifi">
                          <Wifi size={11} />
                          LIVE CLOUD
                        </span>
                      </div>

                      {/* Animated Real-time Temperature Curve Chart */}
                      <div className="phone-chart-wrap">
                        <div className="phone-chart-meta">
                          <span>PROFIL SUHU (120 JAM)</span>
                          <strong className="text-green">{tempValue.toFixed(1)}°C</strong>
                        </div>

                        <svg
                          viewBox="0 0 160 55"
                          className="phone-curve-svg"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <linearGradient id="chartGradLive" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Safe target zone (40-50°C) */}
                          <rect x="0" y="8" width="160" height="25" fill="#22c55e" opacity="0.12" rx="3" />

                          {/* Dynamic Curve Line */}
                          <motion.path
                            d="M0 48 Q25 44 45 35 T85 14 T125 18 T160 22"
                            stroke="#15803d"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                          />
                          <path
                            d="M0 48 Q25 44 45 35 T85 14 T125 18 T160 22 L160 55 L0 55 Z"
                            fill="url(#chartGradLive)"
                          />

                          {/* Pulse Radar Marker at 48 hr flip point */}
                          <motion.circle
                            cx="85"
                            cy="14"
                            r="5"
                            fill="#f59e0b"
                            stroke="#ffffff"
                            strokeWidth="2"
                            animate={{ scale: [1, 1.35, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                          />
                        </svg>
                      </div>

                      {/* Phone Metric Pills */}
                      <div className="phone-stats-row">
                        <div className="p-stat">
                          <span className="p-stat-lbl">Uji Belah</span>
                          <strong className="p-stat-val text-green">94%</strong>
                        </div>
                        <div className="p-stat">
                          <span className="p-stat-lbl">Kadar Air</span>
                          <strong className="p-stat-val text-cocoa">7.2%</strong>
                        </div>
                      </div>

                      {/* Interactive Button with Touch Click Simulation */}
                      <div className="phone-cta-wrapper">
                        <motion.div
                          className="phone-cta-btn"
                          animate={{ scale: [1, 0.94, 1] }}
                          transition={{
                            duration: 3.2,
                            repeat: Infinity,
                            times: [0.65, 0.72, 0.8],
                          }}
                        >
                          <CheckCircle2 size={13} />
                          <span>Kunci Data & Cetak Paspor</span>
                        </motion.div>

                        {/* Animated Finger Touch Ripple */}
                        <motion.div
                          className="touch-ripple-circle"
                          animate={{
                            opacity: [0, 0.8, 0],
                            scale: [0.2, 1.8, 2.4],
                          }}
                          transition={{
                            duration: 3.2,
                            repeat: Infinity,
                            times: [0.68, 0.75, 0.88],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alarm Notification Toast Floating */}
                <div className="scene-float-card card-bottom-left">
                  <span className="float-icon emerald">
                    <Check size={14} />
                  </span>
                  <div>
                    <strong>Pemberitahuan Jam ke-48</strong>
                    <small>Waktunya pembalikan biji kakao</small>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* STAGE 3: KARUNG SIAP EKSPOR & SMARTPHONE SCAN QR         */}
            {/* ========================================================= */}
            {activeStage === 3 && (
              <motion.div
                key="stage-qr"
                className="stage-motion-wrap"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <svg
                  viewBox="0 0 460 270"
                  className="scene-svg"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="sackBodyGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#cbb085" />
                      <stop offset="40%" stopColor="#b49364" />
                      <stop offset="100%" stopColor="#7a5b32" />
                    </linearGradient>
                    <linearGradient id="laserGlowBeam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.0" />
                      <stop offset="60%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.95" />
                    </linearGradient>
                    <filter id="laserLineGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Ground Shadow */}
                  <ellipse cx="205" cy="245" rx="165" ry="18" fill="#35251f" opacity="0.16" />

                  {/* Realistic Proportional Burlap Sack (Karung Goni 60 KG) */}
                  <g filter="url(#shadow3d)">
                    {/* Sack Body with natural contours */}
                    <path
                      d="M120 105 C140 92, 230 92, 260 105 C290 155, 280 215, 265 240 C235 248, 145 248, 115 240 C100 215, 90 155, 120 105 Z"
                      fill="url(#sackBodyGrad)"
                      stroke="#573e20"
                      strokeWidth="2"
                    />

                    {/* Tied top bunch with jute rope */}
                    <path
                      d="M130 106 Q190 85 250 106 L260 85 Q190 72 120 85 Z"
                      fill="#9a7749"
                      stroke="#573e20"
                      strokeWidth="1.5"
                    />
                    {/* Jute Rope Knot */}
                    <ellipse cx="190" cy="104" rx="65" ry="9" fill="#dfc6a3" stroke="#7a5526" strokeWidth="2" />
                    <line x1="145" y1="104" x2="235" y2="104" stroke="#7a5526" strokeWidth="2.5" strokeDasharray="5 3" />

                    {/* Authentic Stenciled Export Stamp on Sack */}
                    <text
                      x="190"
                      y="135"
                      textAnchor="middle"
                      fill="#3d2711"
                      fontFamily="Manrope, sans-serif"
                      fontWeight="800"
                      fontSize="11"
                      letterSpacing="2"
                      opacity="0.85"
                    >
                      KUTAI TIMUR · 60 KG
                    </text>
                    <text
                      x="190"
                      y="148"
                      textAnchor="middle"
                      fill="#4a3118"
                      fontFamily="Manrope, sans-serif"
                      fontWeight="700"
                      fontSize="8"
                      letterSpacing="1"
                      opacity="0.75"
                    >
                      INDONESIA SPECIALTY COCOA
                    </text>
                  </g>

                  {/* High-Tech Passport Tag Mounted on Sack (x=135, y=155) */}
                  <g transform="translate(135, 155)" filter="url(#shadow3d)">
                    <rect
                      x="0"
                      y="0"
                      width="110"
                      height="80"
                      rx="8"
                      fill="#ffffff"
                      stroke="#dcd2c0"
                      strokeWidth="1.8"
                    />
                    {/* Tag Top Header */}
                    <rect x="0" y="0" width="110" height="18" rx="8" fill="#35251f" />
                    <rect x="0" y="10" width="110" height="8" fill="#35251f" />
                    <text
                      x="55"
                      y="12"
                      textAnchor="middle"
                      fill="#fff8ec"
                      fontSize="7.5"
                      fontFamily="Manrope, sans-serif"
                      fontWeight="800"
                      letterSpacing="0.8"
                    >
                      KAKAOPASS · DIGITAL
                    </text>

                    {/* QR Code Matrix */}
                    <g transform="translate(14, 24)">
                      {/* 3 Corner Finder Patterns */}
                      <rect x="0" y="0" width="15" height="15" rx="2" fill="#28251f" />
                      <rect x="3" y="3" width="9" height="9" fill="#ffffff" />
                      <rect x="5" y="5" width="5" height="5" fill="#28251f" />

                      <rect x="67" y="0" width="15" height="15" rx="2" fill="#28251f" />
                      <rect x="70" y="3" width="9" height="9" fill="#ffffff" />
                      <rect x="72" y="5" width="5" height="5" fill="#28251f" />

                      <rect x="0" y="35" width="15" height="15" rx="2" fill="#28251f" />
                      <rect x="3" y="38" width="9" height="9" fill="#ffffff" />
                      <rect x="5" y="40" width="5" height="5" fill="#28251f" />

                      {/* Random Data Pattern Dots */}
                      <g fill="#28251f">
                        <rect x="22" y="3" width="5" height="5" />
                        <rect x="32" y="3" width="5" height="5" />
                        <rect x="45" y="3" width="5" height="5" />
                        <rect x="55" y="3" width="5" height="5" />
                        <rect x="22" y="14" width="5" height="5" />
                        <rect x="38" y="14" width="5" height="5" />
                        <rect x="52" y="14" width="5" height="5" />
                        <rect x="22" y="25" width="5" height="5" />
                        <rect x="34" y="25" width="5" height="5" />
                        <rect x="48" y="25" width="5" height="5" />
                        <rect x="62" y="25" width="5" height="5" />
                        <rect x="22" y="36" width="5" height="5" />
                        <rect x="38" y="36" width="5" height="5" />
                        <rect x="55" y="36" width="5" height="5" />
                        <rect x="70" y="36" width="5" height="5" />
                      </g>

                      {/* Sweeping Laser Scanner Beam */}
                      <g>
                        <motion.g
                          animate={{ y: [0, 48, 0] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                          filter="url(#laserLineGlow)"
                        >
                          <line x1="-8" y1="0" x2="90" y2="0" stroke="#10b981" strokeWidth="2.5" />
                          <polygon points="-8,-12 90,-12 90,0 -8,0" fill="url(#laserGlowBeam)" />
                        </motion.g>
                      </g>
                    </g>
                  </g>

                  {/* BUYER'S SMARTPHONE SCANNING IN THE FOREGROUND */}
                  <g transform="translate(295, 105)" filter="url(#shadow3d)">
                    {/* Angled Phone Bezel */}
                    <rect x="0" y="0" width="85" height="125" rx="14" fill="#1e1b18" stroke="#332a22" strokeWidth="2" />
                    {/* Screen Viewfinder with Scanner Frame */}
                    <rect x="5" y="6" width="75" height="113" rx="10" fill="#0f172a" />
                    {/* Viewfinder Reticle */}
                    <path
                      d="M20 30 L15 30 L15 35 M65 30 L70 30 L70 35 M20 85 L15 85 L15 80 M65 85 L70 85 L70 80"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    {/* Scan Match Badge in Phone */}
                    <rect x="12" y="48" width="60" height="22" rx="4" fill="#10b981" opacity="0.9" />
                    <text x="42" y="62" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                      MATCH 100%
                    </text>
                    <text x="42" y="98" textAnchor="middle" fill="#94a3b8" fontSize="6.5">
                      KTIM-KRG-024
                    </text>
                  </g>

                  {/* STAMPED VERIFICATION IMPACT SEAL: MUTU I */}
                  {/* Static Anchor wrapper on the tag right corner: (200, 180) */}
                  <g transform="translate(200, 180)">
                    <motion.g
                      initial={{ scale: 1.5, opacity: 0, rotate: -18 }}
                      animate={{
                        scale: [1.5, 1, 1],
                        opacity: [0, 1, 1],
                        rotate: [-18, -10, -10],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        times: [0, 0.25, 1],
                        ease: "easeOut",
                      }}
                      filter="url(#shadow3d)"
                    >
                      <rect
                        x="0"
                        y="0"
                        width="92"
                        height="36"
                        rx="6"
                        fill="#ffffff"
                        stroke="#15803d"
                        strokeWidth="2.8"
                        strokeDasharray="80 3"
                      />
                      <text
                        x="46"
                        y="23"
                        textAnchor="middle"
                        fill="#15803d"
                        fontFamily="Manrope, sans-serif"
                        fontWeight="800"
                        fontSize="15"
                        letterSpacing="1"
                      >
                        MUTU I
                      </text>
                    </motion.g>
                  </g>
                </svg>

                <div className="scene-float-card card-bottom-left">
                  <span className="float-icon green">
                    <ShieldCheck size={14} />
                  </span>
                  <div>
                    <strong>Sertifikasi SNI 2323:2008</strong>
                    <small>Uji belah 94% · Siap ekspor</small>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Narrative & Stage Controller Bottom Bar */}
        <div className="stage-bottom-panel">
          {/* Active Stage Description */}
          <div className="stage-caption-box" style={{ minHeight: 64 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <h4 className="stage-caption-title">{stage.title}</h4>
                <p className="stage-caption-desc">{stage.desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Segmented Interactive Stepper (Mobile 2x2 Grid / Desktop 1x4 Row) */}
          <div className="stage-stepper" role="tablist">
            {STAGES.map((s, idx) => {
              const isActive = activeStage === idx;
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`stepper-tab ${isActive ? "tab-active" : ""}`}
                  onClick={() => handleSelectStage(idx)}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  style={{ position: "relative" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeHeroStepperPill"
                      className="tab-active-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "#ffffff",
                        borderRadius: 8,
                        border: "1.5px solid #718263",
                        boxShadow: "0 2px 10px rgba(53, 37, 31, 0.1)",
                        zIndex: 1,
                      }}
                    />
                  )}
                  <span className="tab-progress-bg" style={{ zIndex: 2 }}>
                    {isActive && (
                      <span
                        className="tab-progress-bar"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </span>
                  <span
                    className="tab-label"
                    style={{
                      position: "relative",
                      zIndex: 3,
                      fontWeight: isActive ? 800 : 600,
                    }}
                  >
                    {s.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
