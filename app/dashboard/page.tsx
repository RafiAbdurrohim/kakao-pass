"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KakaoPassLogo } from "@/components/KakaoPassLogo";
import { onValue, ref, push, set, update } from "firebase/database";
import {
  LogOut,
  Plus,
  QrCode,
  Thermometer,
  Droplets,
  ChevronRight,
  X,
  Package,
  Sprout,
  CheckCircle2,
  Clock,
  ExternalLink,
  Printer,
  MessageCircle,
  AlertTriangle,
  Sun,
  Flame,
  ArrowRight,
  TrendingUp,
  Menu,
  Activity,
  Layers,
  BarChart3,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Chart from "../components/Chart";
import {
  db,
  getUser,
  setUser,
  ago,
  fmtDate,
  STATUS_LABEL,
  DAY,
  loadReadings,
  type User,
  type Batch,
  type Reading,
} from "@/lib/fb";

type Live = {
  suhu_biji?: number;
  suhu_ruang?: number;
  kelembapan?: number;
  timestamp?: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setU] = useState<User | null>(null);
  const [live, setLive] = useState<Live | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [origin, setOrigin] = useState("");

  // Navigation Tabs: Overview, Kakao, Kompos
  const [mainTab, setMainTab] = useState<"overview" | "kakao" | "kompos">("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sub-filters inside Kakao Tab
  const [batchTab, setBatchTab] = useState<"semua" | "aktif" | "selesai">("semua");
  const [actPage, setActPage] = useState(1);

  // Modals
  const [openNewBatch, setOpenNewBatch] = useState(false);
  const [startCompostTarget, setStartCompostTarget] = useState<Batch | null>(null);
  const [finishCompostTarget, setFinishCompostTarget] = useState<Batch | null>(null);

  // Telemetry Chart readings for active/latest batch
  const [chartReadings, setChartReadings] = useState<Reading[]>([]);
  const [chartBatchId, setChartBatchId] = useState<string>("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    if (u.role === "admin") {
      router.replace("/admin");
      return;
    }
    setU(u);

    const a = onValue(ref(db, "kakao_pass/terbaru"), (s) => setLive(s.val()));
    const b = onValue(ref(db, "web/batches"), (s) => {
      const all = (s.val() || {}) as Record<string, Batch>;
      const userBatches = Object.entries(all)
        .map(([id, v]) => ({ ...v, id }))
        .filter((x) => x.ownerId === u.id)
        .sort((x, y) => y.createdAt - x.createdAt);
      setBatches(userBatches);
      setLoaded(true);
    });

    const tk = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      a();
      b();
      clearInterval(tk);
    };
  }, [router]);

  // Aggregate Metrics
  const verifiedBatches = useMemo(
    () => batches.filter((b) => b.status === "selesai"),
    [batches]
  );
  const activeBatches = useMemo(
    () => batches.filter((b) => b.status !== "selesai"),
    [batches]
  );

  const totalBasah = useMemo(
    () => batches.reduce((acc, b) => acc + (b.beratBasah || 0), 0),
    [batches]
  );
  const totalKering = useMemo(
    () => verifiedBatches.reduce((acc, b) => acc + (b.kering?.beratKering || 0), 0),
    [verifiedBatches]
  );

  // Compost Collections
  const compostBatches = useMemo(() => {
    return batches.filter(
      (b) => (b.beratKulit && b.beratKulit > 0) || (b.kompos && b.kompos.status !== "belum")
    );
  }, [batches]);

  const verifiedCompostBatches = useMemo(() => {
    return batches.filter((b) => b.kompos?.status === "terverifikasi");
  }, [batches]);

  const totalKulit = useMemo(
    () => batches.reduce((acc, b) => acc + (b.beratKulit || 0), 0),
    [batches]
  );

  const totalKompos = useMemo(
    () =>
      verifiedCompostBatches.reduce(
        (acc, b) => acc + (b.kompos?.beratKompos || 0),
        0
      ),
    [verifiedCompostBatches]
  );

  const avgMutu = useMemo(() => {
    const list = batches.filter((b) => typeof b.mutu?.baik === "number");
    if (!list.length) return 0;
    const sum = list.reduce((acc, b) => acc + (b.mutu?.baik || 0), 0);
    return Math.round((sum / list.length) * 10) / 10;
  }, [batches]);

  // Most prominent active batch for telemetry & hero
  const primaryActiveBatch = useMemo(() => {
    return (
      batches.find((b) => b.status === "fermentasi") ||
      batches.find((b) => b.status === "pengeringan") ||
      batches.find((b) => b.status === "uji_mutu" || b.status === "revisi") ||
      batches.find((b) => b.status === "verifikasi") ||
      batches[0] ||
      null
    );
  }, [batches]);

  // Load telemetry chart data for the primary or selected batch
  useEffect(() => {
    const target = primaryActiveBatch;
    if (!target) return;
    setChartBatchId(target.kode);
    let active = true;
    loadReadings(target.mulaiFerm, target.selesaiFerm ?? Date.now())
      .then((data) => {
        if (active) setChartReadings(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [primaryActiveBatch]);

  // Filtered cocoa batches
  const filteredBatches = useMemo(() => {
    if (batchTab === "aktif") return activeBatches;
    if (batchTab === "selesai") return verifiedBatches;
    return batches;
  }, [batchTab, batches, activeBatches, verifiedBatches]);

  // Chronological Activity Feed
  const activityFeed = useMemo(() => {
    type ActivityItem = {
      id: string;
      title: string;
      desc: string;
      time: number;
      type: "fermentasi" | "verifikasi" | "kompos" | "panen";
    };

    const items: ActivityItem[] = [];

    batches.forEach((b) => {
      // 1. Creation / Harvest
      items.push({
        id: `${b.id}-panen`,
        title: `Batch Baru: ${b.kode}`,
        desc: `Panen ${b.beratBasah} kg basah (${b.varietas}) dari ${b.kebun}`,
        time: b.createdAt,
        type: "panen",
      });

      // 2. Turning events
      if (b.balik) {
        Object.values(b.balik).forEach((t, idx) => {
          items.push({
            id: `${b.id}-balik-${idx}`,
            title: `Pembalikan ${idx + 1}×: ${b.kode}`,
            desc: `SOP pembalikan kotak fermentasi dicatat`,
            time: t,
            type: "fermentasi",
          });
        });
      }

      // 3. Batch Verification
      if (b.status === "selesai" && b.verif?.tgl) {
        items.push({
          id: `${b.id}-verif-kakao`,
          title: `Paspor Terbit: ${b.kode}`,
          desc: `Diverifikasi oleh ${b.verif.oleh} (Mutu Baik: ${b.mutu?.baik ?? 0}%)`,
          time: b.verif.tgl,
          type: "verifikasi",
        });
      }

      // 4. Compost Verification
      if (b.kompos?.status === "terverifikasi" && b.kompos.verif?.tgl) {
        items.push({
          id: `${b.id}-verif-kompos`,
          title: `Paspor Kompos Terbit: ${b.kode}`,
          desc: `${b.kompos.beratKompos} kg pupuk organik diverifikasi oleh ${b.kompos.verif.oleh}`,
          time: b.kompos.verif.tgl,
          type: "kompos",
        });
      }
    });

    return items.sort((a, b) => b.time - a.time);
  }, [batches]);

  const ACT_PER_PAGE = 5;
  const totalActPages = Math.max(1, Math.ceil(activityFeed.length / ACT_PER_PAGE));
  const pagedActivities = useMemo(() => {
    const start = (actPage - 1) * ACT_PER_PAGE;
    return activityFeed.slice(start, start + ACT_PER_PAGE);
  }, [activityFeed, actPage]);

  if (!user) return null;

  const online = !!live?.timestamp && now - live.timestamp < 75 * 60000;
  const suhuBiji = live?.suhu_biji;

  // Temperature Zone Evaluation
  const getTempZone = (temp?: number) => {
    if (temp === undefined) return null;
    if (temp < 38) {
      return {
        label: "Suhu Rendah (<38°C)",
        cls: "kp-zone-cool",
        advice: "Tutup rapat kotak fermentasi dengan karung goni agar panas mikroba terjaga.",
      };
    }
    if (temp <= 49) {
      return {
        label: "Suhu Optimal (42–49°C)",
        cls: "kp-zone-opt",
        advice: "Kondisi ideal. Bakteri asam asetat bekerja maksimal membentuk prekursor aroma cokelat.",
      };
    }
    return {
      label: "Suhu Tinggi (>50°C)",
      cls: "kp-zone-hot",
      advice: "Suhu sangat panas. Lakukan pembalikan biji untuk aerasi merata.",
    };
  };

  const tempZone = primaryActiveBatch?.status === "fermentasi" ? getTempZone(suhuBiji) : null;

  return (
    <div className="kp">
      {/* Top Header */}
      <header className="kp-top">
        <div>
          <Link href="/" className="compact-brand">
            <span className="brand-mark-small">
              <KakaoPassLogo size={20} />
            </span>
            <span className="brand-name-text">
              kakao<span>pass</span>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="kp-user">
              <span>
                <b>{user.name}</b> · {user.group}
              </span>
              <button
                className="kp-btn s sm"
                onClick={() => {
                  setUser(null);
                  router.push("/login");
                }}
              >
                <LogOut size={14} />
                Keluar
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="btn-concept-hamburger"
              style={{ display: "none" }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation Subnav Bar */}
      <div className="kp-subnav-bar">
        <div className="kp-subnav-inner">
          <nav className="kp-subnav-tabs" aria-label="Navigasi Menu Dashboard">
            <button
              type="button"
              className={`kp-nav-tab ${mainTab === "overview" ? "active" : ""}`}
              onClick={() => setMainTab("overview")}
            >
              <Activity size={16} />
              <span>Dashboard Utama</span>
            </button>

            <button
              type="button"
              className={`kp-nav-tab ${mainTab === "kakao" ? "active" : ""}`}
              onClick={() => setMainTab("kakao")}
            >
              <Package size={16} />
              <span>Batch Biji Kakao</span>
              <span className="kp-nav-badge">{batches.length}</span>
            </button>

            <button
              type="button"
              className={`kp-nav-tab ${mainTab === "kompos" ? "active" : ""}`}
              onClick={() => setMainTab("kompos")}
            >
              <Sprout size={16} />
              <span>Olah Kompos Kulit</span>
              <span className="kp-nav-badge g">{compostBatches.length}</span>
            </button>
          </nav>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className="kp-btn sm"
              onClick={() => setOpenNewBatch(true)}
              style={{ whiteSpace: "nowrap" }}
            >
              <Plus size={15} />
              Batch Baru
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="kp-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="kp-drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div className="compact-brand">
                  <span className="brand-mark-small">
                    <KakaoPassLogo size={18} />
                  </span>
                  <span className="brand-name-text">
                    kakao<span>pass</span>
                  </span>
                </div>
                <button
                  type="button"
                  className="kp-btn s sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ marginBottom: 20, padding: "12px", background: "#f8fafc", borderRadius: 12 }}>
                <b style={{ display: "block", color: "#0f172a", fontSize: 14 }}>{user.name}</b>
                <span style={{ fontSize: 12, color: "#64748b" }}>{user.group}</span>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <button
                  className={`kp-nav-tab ${mainTab === "overview" ? "active" : ""}`}
                  style={{ width: "100%", justifyContent: "flex-start", borderRadius: 10, border: "none" }}
                  onClick={() => {
                    setMainTab("overview");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Activity size={16} /> Dashboard Utama
                </button>
                <button
                  className={`kp-nav-tab ${mainTab === "kakao" ? "active" : ""}`}
                  style={{ width: "100%", justifyContent: "space-between", borderRadius: 10, border: "none" }}
                  onClick={() => {
                    setMainTab("kakao");
                    setMobileMenuOpen(false);
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Package size={16} /> Batch Biji Kakao
                  </span>
                  <span className="kp-nav-badge">{batches.length}</span>
                </button>
                <button
                  className={`kp-nav-tab ${mainTab === "kompos" ? "active" : ""}`}
                  style={{ width: "100%", justifyContent: "space-between", borderRadius: 10, border: "none" }}
                  onClick={() => {
                    setMainTab("kompos");
                    setMobileMenuOpen(false);
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Sprout size={16} /> Olah Kompos Kulit
                  </span>
                  <span className="kp-nav-badge g">{compostBatches.length}</span>
                </button>
              </div>
            </div>

            <button
              className="kp-btn s sm"
              style={{ width: "100%" }}
              onClick={() => {
                setUser(null);
                router.push("/login");
              }}
            >
              <LogOut size={14} /> Keluar Akun
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="kp-wrap">
        {/* =========================================================================
            TAB 1: DASHBOARD UTAMA (OVERVIEW, GRAFIK SUHU IOT & RIWAYAT DATA)
            ========================================================================= */}
        {mainTab === "overview" && (
          <div>
            {/* Header Greeting */}
            <div className="kp-row" style={{ marginBottom: 16 }}>
              <div>
                <h1 style={{ margin: "0 0 4px" }}>Dashboard Petani · {user.name}</h1>
                <p className="kp-sub" style={{ marginBottom: 0 }}>
                  {user.group} · Karangan Mandiri, Kutai Timur
                </p>
              </div>
              <button className="kp-btn sm" onClick={() => setOpenNewBatch(true)}>
                <Plus size={16} /> Mulai Batch Baru
              </button>
            </div>

            {/* Production KPI Metrics */}
            <div className="kp-kpi">
              <div className="kp-kpi-item">
                <div className="kp-kpi-label">
                  <Package size={14} /> Biji Kering Siap Paspor
                </div>
                <div className="kp-kpi-val">
                  {totalKering} <small style={{ fontSize: 13, fontWeight: 500 }}>kg</small>
                </div>
              </div>

              <div className="kp-kpi-item">
                <div className="kp-kpi-label">
                  <TrendingUp size={14} /> Nilai Mutu Kakao SNI
                </div>
                <div className="kp-kpi-val" style={{ color: "var(--rust)" }}>
                  ~Rp 130rb<small style={{ fontSize: 12, fontWeight: 500 }}>/kg</small>
                </div>
              </div>

              <div className="kp-kpi-item">
                <div className="kp-kpi-label">
                  <CheckCircle2 size={14} /> Rata-rata Biji Baik
                </div>
                <div className="kp-kpi-val" style={{ color: "var(--green-dark)" }}>
                  {avgMutu > 0 ? `${avgMutu}%` : "--"}
                </div>
              </div>

              <div className="kp-kpi-item">
                <div className="kp-kpi-label">
                  <Sprout size={14} /> Kompos Kulit Terolah
                </div>
                <div className="kp-kpi-val">
                  {totalKompos} <small style={{ fontSize: 13, fontWeight: 500 }}>kg</small>
                </div>
              </div>
            </div>

            {/* Telemetry Row: IoT Historical Graph + Live Sensor Dock */}
            <div className="kp-grid" style={{ marginBottom: 20 }}>
              {/* Left Column: Temperature History Chart */}
              <section className="kp-card kp-c8">
                <div className="kp-row" style={{ marginBottom: 14 }}>
                  <div>
                    <h2 style={{ margin: "0 0 2px" }}>Riwayat Suhu Fermentasi IoT</h2>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
                      Telemetri rekaman suhu massa biji vs. suhu ruang ({chartBatchId ? `Batch ${chartBatchId}` : "Sensor Kebun"})
                    </p>
                  </div>
                  {primaryActiveBatch && (
                    <Link href={`/batch/${primaryActiveBatch.id}`} className="kp-btn s sm">
                      Buka Batch Aktif <ChevronRight size={14} />
                    </Link>
                  )}
                </div>

                {/* Real-time & Historical Chart */}
                <Chart data={chartReadings} />

                {tempZone && (
                  <div style={{ marginTop: 14, padding: "10px 14px", background: "#faf8f2", borderRadius: 12, border: "1px solid #ddd8cc", fontSize: 13 }}>
                    <b>Panduan Teknis:</b> {tempZone.advice}
                  </div>
                )}
              </section>

              {/* Right Column: Live Sensor & Contact */}
              <section className="kp-c4" style={{ display: "grid", gap: 16 }}>
                {/* Live Sensor Card */}
                <div className="kp-card kp-live">
                  <div className="kp-row">
                    <h2 style={{ margin: 0 }}>Sensor Kotak Fermentasi</h2>
                    <span className="kp-chip o">
                      <span className={"kp-dot" + (online ? " on" : "")} />
                      {online ? "Online" : "Offline"}
                    </span>
                  </div>
                  <div style={{ margin: "20px 0 4px", opacity: 0.8, fontSize: 13 }}>
                    Suhu Massa Biji Terkini
                  </div>
                  <div className="kp-big">
                    {live?.suhu_biji !== undefined ? live.suhu_biji.toFixed(1) : "--"}
                    <small> °C</small>
                  </div>
                  <div className="kp-mini">
                    <span>
                      <Thermometer size={14} style={{ verticalAlign: -2 }} /> Ruang:{" "}
                      {live?.suhu_ruang?.toFixed(1) ?? "--"}°C
                    </span>
                    <span>
                      <Droplets size={14} style={{ verticalAlign: -2 }} /> RH:{" "}
                      {live?.kelembapan?.toFixed(0) ?? "--"}%
                    </span>
                  </div>
                  <div style={{ marginTop: 14, fontSize: 12, opacity: 0.7 }}>
                    {live?.timestamp
                      ? `Sinkron ${ago(live.timestamp, now)}`
                      : "Menunggu transmisi alat..."}
                  </div>
                </div>

                {/* Field Assistance */}
                <div className="kp-card">
                  <h2 style={{ margin: "0 0 6px", fontSize: 15 }}>Bantuan Pendamping Lapangan</h2>
                  <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.45 }}>
                    Konsultasikan kendala fermentasi, sensor alat, atau jadwal uji belah mutu:
                  </p>
                  <div style={{ background: "#faf8f2", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px", marginBottom: 12 }}>
                    <b style={{ display: "block", color: "var(--cocoa-dark)", fontSize: 13.5 }}>
                      Bu Sari (PPL Pendamping)
                    </b>
                    <span style={{ fontSize: 11.5, color: "var(--muted)" }}>
                      Dinas Perkebunan &amp; Tim KakaoPass
                    </span>
                  </div>
                  <a
                    href="https://wa.me/6281200000001?text=Halo%20Bu%20Sari,%20saya%20petani%20KakaoPass%20butuh%20panduan%20lapangan."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kp-btn g sm"
                    style={{ width: "100%", textDecoration: "none" }}
                  >
                    <MessageCircle size={15} /> Hubungi via WhatsApp
                  </a>
                </div>
              </section>
            </div>

            {/* Riwayat Data & Log Lapangan */}
            <section className="kp-activity-card">
              <div className="kp-row" style={{ marginBottom: 12 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16 }}>Riwayat Data &amp; Aktivitas Terkini</h2>
                </div>
                <span className="kp-nav-badge">{activityFeed.length} Total</span>
              </div>

              {activityFeed.length === 0 ? (
                <div className="kp-empty">Belum ada riwayat aktivitas tercatat.</div>
              ) : (
                <>
                  <div style={{ display: "grid", gap: 0 }}>
                    {pagedActivities.map((act) => (
                      <div key={act.id} className="kp-activity-item">
                        <div
                          className={`kp-activity-icon ${
                            act.type === "fermentasi"
                              ? "rust"
                              : act.type === "kompos"
                              ? "green"
                              : "blue"
                          }`}
                        >
                          {act.type === "fermentasi" ? (
                            <Flame size={16} />
                          ) : act.type === "kompos" ? (
                            <Sprout size={16} />
                          ) : act.type === "verifikasi" ? (
                            <ShieldCheck size={16} />
                          ) : (
                            <Package size={16} />
                          )}
                        </div>
                        <div className="kp-activity-content">
                          <div className="kp-activity-title">{act.title}</div>
                          <div className="kp-activity-desc">{act.desc}</div>
                        </div>
                        <div className="kp-activity-time">{ago(act.time, now)}</div>
                      </div>
                    ))}
                  </div>

                  {totalActPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        Halaman {actPage} dari {totalActPages}
                      </span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          className="kp-btn s sm"
                          disabled={actPage <= 1}
                          onClick={() => setActPage((p) => Math.max(1, p - 1))}
                        >
                          Sebelumnya
                        </button>
                        <button
                          type="button"
                          className="kp-btn s sm"
                          disabled={actPage >= totalActPages}
                          onClick={() => setActPage((p) => Math.min(totalActPages, p + 1))}
                        >
                          Selanjutnya
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {/* =========================================================================
            TAB 2: BATCH BIJI KAKAO (PENGELOLAAN FERMENTASI, PENJEMURAN, UJI MUTU & STIKER)
            ========================================================================= */}
        {mainTab === "kakao" && (
          <div>
            {/* Header Toolbar */}
            <div className="kp-row" style={{ marginBottom: 16 }}>
              <div>
                <h1 style={{ margin: "0 0 4px" }}>Batch Biji Kakao</h1>
                <p className="kp-sub" style={{ marginBottom: 0 }}>
                  Siklus fermentasi, penjemuran, uji belah SNI, dan paspor mutu biji
                </p>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div className="kp-pills">
                  <button
                    type="button"
                    className={`kp-pill-btn ${batchTab === "semua" ? "active" : ""}`}
                    onClick={() => setBatchTab("semua")}
                  >
                    Semua ({batches.length})
                  </button>
                  <button
                    type="button"
                    className={`kp-pill-btn ${batchTab === "aktif" ? "active" : ""}`}
                    onClick={() => setBatchTab("aktif")}
                  >
                    Aktif ({activeBatches.length})
                  </button>
                  <button
                    type="button"
                    className={`kp-pill-btn ${batchTab === "selesai" ? "active" : ""}`}
                    onClick={() => setBatchTab("selesai")}
                  >
                    Berpaspor ({verifiedBatches.length})
                  </button>
                </div>

                <button className="kp-btn sm" onClick={() => setOpenNewBatch(true)}>
                  <Plus size={15} /> Batch Baru
                </button>
              </div>
            </div>

            {/* Active Batch Assistant (if active) */}
            {primaryActiveBatch && primaryActiveBatch.status !== "selesai" && (
              <div className="kp-focus-card">
                <div className="kp-row" style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span className="kp-chip o" style={{ background: "var(--rust)", color: "#fff" }}>
                      Siklus Aktif
                    </span>
                    <b style={{ fontSize: 17, color: "var(--cocoa-dark)" }}>
                      {primaryActiveBatch.kode}
                    </b>
                    <span className="kp-chip r">
                      {STATUS_LABEL[primaryActiveBatch.status]}
                    </span>
                  </div>

                  <Link href={`/batch/${primaryActiveBatch.id}`} className="kp-btn sm">
                    Buka Pengendali Batch <ArrowRight size={14} />
                  </Link>
                </div>

                <p style={{ margin: "0 0 10px", fontSize: 13.5, color: "var(--cocoa)" }}>
                  {primaryActiveBatch.varietas} · {primaryActiveBatch.kebun} · {primaryActiveBatch.beratBasah} kg basah · Panen {primaryActiveBatch.tglPanen}
                </p>

                {primaryActiveBatch.status === "fermentasi" && (
                  <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: "12px", display: "grid", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>
                        <Flame size={16} style={{ color: "var(--rust)" }} />
                        Hari ke-{Math.floor((now - primaryActiveBatch.mulaiFerm) / DAY) + 1} Fermentasi
                      </span>
                      {tempZone && (
                        <span className={`kp-zone-pill ${tempZone.cls}`}>{tempZone.label}</span>
                      )}
                    </div>
                    <div className="kp-kv">
                      <div>
                        <span>Suhu Massa Biji</span>
                        <b>{suhuBiji !== undefined ? `${suhuBiji.toFixed(1)}°C` : "--"}</b>
                      </div>
                      <div>
                        <span>Riwayat Dibalik</span>
                        <b>{Object.keys(primaryActiveBatch.balik || {}).length}× dibalik</b>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Batch List */}
            <div className="kp-card" style={{ marginBottom: 24 }}>
              <h2 style={{ margin: "0 0 14px", fontSize: 16 }}>Daftar Batch Biji Kakao</h2>

              {!loaded ? (
                <div className="kp-empty">Memuat daftar batch...</div>
              ) : filteredBatches.length === 0 ? (
                <div className="kp-empty">
                  {batchTab === "selesai"
                    ? "Belum ada batch yang selesai diverifikasi admin PPL. Setelah disetujui, paspor dan tombol cetak stiker QR akan muncul."
                    : "Belum ada batch kakao pada kategori ini."}
                </div>
              ) : (
                <div className="kp-list">
                  {filteredBatches.map((b) => (
                    <div key={b.id} className="kp-batch">
                      <div className="kp-row" style={{ marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <b>{b.kode}</b>
                          <span
                            className={
                              "kp-chip " +
                              (b.status === "selesai"
                                ? "g"
                                : b.status === "fermentasi" || b.status === "revisi"
                                ? "r"
                                : "")
                            }
                          >
                            {STATUS_LABEL[b.status]}
                          </span>
                        </div>

                        {/* Action buttons: Sticker QR only appears when approved by admin */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {b.status === "selesai" ? (
                            <>
                              <Link href={`/p/${b.id}`} target="_blank" className="kp-btn s sm">
                                <ExternalLink size={13} /> Paspor QR
                              </Link>
                              <Link href={`/cetak/${b.id}/biji`} className="kp-btn sm">
                                <Printer size={13} /> Cetak Stiker QR
                              </Link>
                            </>
                          ) : (
                            <Link href={`/batch/${b.id}`} className="kp-btn s sm">
                              Buka Detail <ChevronRight size={14} />
                            </Link>
                          )}
                        </div>
                      </div>

                      <p style={{ margin: "4px 0" }}>
                        {b.varietas} · {b.kebun} · {b.beratBasah} kg basah
                        {b.kering?.beratKering ? ` → ${b.kering.beratKering} kg kering` : ""}
                        {b.status === "fermentasi"
                          ? ` · Hari ke-${Math.floor((now - b.mulaiFerm) / DAY) + 1}`
                          : ""}
                      </p>

                      <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 12, color: "var(--muted)", flexWrap: "wrap" }}>
                        <span>Dibuat {fmtDate(b.createdAt)}</span>
                        {b.mutu?.baik !== undefined && (
                          <span>
                            Mutu Baik: <strong>{b.mutu.baik}%</strong>
                          </span>
                        )}
                        {b.verif?.oleh && (
                          <span>
                            Diverifikasi: <strong>{b.verif.oleh}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Riwayat Stiker Biji yang Sudah Terbit */}
            <div className="kp-card">
              <div className="kp-row" style={{ marginBottom: 8 }}>
                <div>
                  <h2 style={{ margin: "0 0 2px", fontSize: 16 }}>Riwayat Stiker QR Biji yang Sudah Terbit</h2>
                  <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)" }}>
                    Batch kakao yang telah disetujui admin PPL dan siap cetak label kemasan
                  </p>
                </div>
                <span className="kp-nav-badge g">{verifiedBatches.length} Stiker Sah</span>
              </div>

              {verifiedBatches.length === 0 ? (
                <div className="kp-empty">
                  Belum ada stiker QR biji yang terbit. Stiker QR diterbitkan otomatis setelah verifikasi admin PPL.
                </div>
              ) : (
                <div className="kp-sticker-grid">
                  {verifiedBatches.map((b) => (
                    <div key={b.id} className="kp-sticker-card">
                      <div className="kp-sticker-head">
                        <div>
                          <span className="kp-chip g" style={{ fontSize: 11, padding: "2px 8px" }}>
                            Paspor Biji Sah
                          </span>
                          <b style={{ display: "block", marginTop: 4, fontSize: 15, color: "var(--cocoa-dark)" }}>
                            {b.kode}
                          </b>
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>
                            {b.varietas} · {b.kering?.beratKering} kg kering
                          </span>
                        </div>

                        <div className="kp-sticker-qr-thumb">
                          <QRCodeSVG value={`${origin}/p/${b.id}`} size={50} />
                        </div>
                      </div>

                      <div style={{ fontSize: 11.5, color: "#64748b", borderTop: "1px solid #f1f5f9", paddingTop: 8 }}>
                        <span>Diverifikasi: {b.verif?.oleh} ({fmtDate(b.verif?.tgl)})</span>
                      </div>

                      <div style={{ display: "flex", gap: 6 }}>
                        <Link href={`/cetak/${b.id}/biji`} className="kp-btn sm" style={{ flex: 1 }}>
                          <Printer size={13} /> Cetak Stiker
                        </Link>
                        <Link href={`/p/${b.id}`} target="_blank" className="kp-btn s sm">
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: OLAH KOMPOS KULIT (ZERO WASTE SIRKULAR & STIKER KOMPOS)
            ========================================================================= */}
        {mainTab === "kompos" && (
          <div>
            {/* Header */}
            <div className="kp-row" style={{ marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--green-dark)", letterSpacing: ".06em", textTransform: "uppercase" }}>
                  ZERO WASTE SIRKULAR KEBUN KAKAO
                </span>
                <h1 style={{ margin: "2px 0 0" }}>Pengolahan Kompos Kulit Kakao</h1>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="kp-chip g">
                  <Sprout size={14} /> Terpisah dari Paspor Biji
                </span>
              </div>
            </div>

            {/* Compost KPI Summary */}
            <div className="kp-kpi" style={{ marginBottom: 20 }}>
              <div className="kp-kpi-item">
                <div className="kp-kpi-label">
                  <Sprout size={14} /> Total Kulit Terkumpul
                </div>
                <div className="kp-kpi-val">
                  {totalKulit} <small style={{ fontSize: 13, fontWeight: 500 }}>kg</small>
                </div>
              </div>

              <div className="kp-kpi-item">
                <div className="kp-kpi-label">
                  <CheckCircle2 size={14} /> Kompos Jadi Terverifikasi
                </div>
                <div className="kp-kpi-val" style={{ color: "var(--green-dark)" }}>
                  {totalKompos} <small style={{ fontSize: 13, fontWeight: 500 }}>kg</small>
                </div>
              </div>

              <div className="kp-kpi-item">
                <div className="kp-kpi-label">
                  <ShieldCheck size={14} /> Paspor &amp; Stiker Kompos
                </div>
                <div className="kp-kpi-val" style={{ color: "var(--cocoa-dark)" }}>
                  {verifiedCompostBatches.length} <small style={{ fontSize: 13, fontWeight: 500 }}>lot</small>
                </div>
              </div>
            </div>

            {/* Compost Management List */}
            <div className="kp-card" style={{ marginBottom: 24 }}>
              <div className="kp-row" style={{ marginBottom: 12 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16 }}>Daftar Olahan Kompos Kulit Buah</h2>
                </div>
              </div>

              {compostBatches.length === 0 ? (
                <div className="kp-empty">
                  Belum ada catatan kulit buah kakao. Saat membuat batch baru, masukkan perkiraan berat kulit buah untuk memulai jalur kompos zero waste.
                </div>
              ) : (
                <div className="kp-compost-grid">
                  {compostBatches.map((b) => {
                    const k = b.kompos || { status: "belum" };
                    const isVerified = k.status === "terverifikasi";
                    const isWaiting = k.status === "menunggu";
                    const isProcessing = k.status === "diolah";

                    return (
                      <div key={b.id} className="kp-compost-item">
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <span
                              className={`kp-chip ${
                                isVerified ? "g" : isWaiting || isProcessing ? "r" : ""
                              }`}
                            >
                              {isVerified
                                ? "Terverifikasi"
                                : isWaiting
                                ? "Menunggu Verifikasi"
                                : isProcessing
                                ? "Sedang Diolah"
                                : "Belum Diolah"}
                            </span>
                            <span style={{ fontSize: 12, color: "var(--muted)" }}>
                              Kulit: <b>{b.beratKulit || 0} kg</b>
                            </span>
                          </div>

                          <b style={{ fontSize: 16, color: "var(--cocoa-dark)", display: "block" }}>
                            Limbah Batch {b.kode}
                          </b>
                          <p style={{ margin: "4px 0 10px", fontSize: 13, color: "var(--muted)" }}>
                            {b.kebun} · Panen {b.tglPanen}
                          </p>

                          {k.campuran && (
                            <div style={{ fontSize: 12, color: "#475569", background: "#f8fafc", padding: "8px 10px", borderRadius: 8, marginBottom: 10 }}>
                              Campuran: <b>{k.campuran}</b>
                            </div>
                          )}

                          {isWaiting && (
                            <div className="kp-warn" style={{ fontSize: 12, padding: "8px 10px", margin: "8px 0" }}>
                              <Clock size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
                              {k.beratKompos} kg kompos dikirim, menunggu persetujuan admin PPL.
                            </div>
                          )}

                          {isVerified && (
                            <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px", borderRadius: 12, margin: "10px 0" }}>
                              <div style={{ background: "#fff", padding: 4, borderRadius: 6, border: "1px solid #bbf7d0" }}>
                                <QRCodeSVG value={`${origin}/k/${b.id}`} size={56} />
                              </div>
                              <div>
                                <b style={{ fontSize: 14, color: "#166534", display: "block" }}>
                                  {k.beratKompos} kg Kompos Jadi
                                </b>
                                <span style={{ fontSize: 11.5, color: "#15803d" }}>
                                  Diverifikasi {k.verif?.oleh}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Compost Action Buttons */}
                        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                          {k.status === "belum" && (
                            <button
                              type="button"
                              className="kp-btn g sm"
                              style={{ width: "100%" }}
                              onClick={() => setStartCompostTarget(b)}
                            >
                              <Sprout size={14} /> Mulai Olah Jadi Kompos
                            </button>
                          )}

                          {isProcessing && (
                            <button
                              type="button"
                              className="kp-btn g sm"
                              style={{ width: "100%" }}
                              onClick={() => setFinishCompostTarget(b)}
                            >
                              Catat Timbangan Kompos Jadi
                            </button>
                          )}

                          {isWaiting && (
                            <span style={{ fontSize: 12, color: "var(--muted)", display: "block", textAlign: "center" }}>
                              Stiker QR terbit setelah disetujui admin
                            </span>
                          )}

                          {isVerified && (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6 }}>
                              <Link href={`/cetak/${b.id}/kompos`} className="kp-btn g sm">
                                <Printer size={13} /> Cetak Stiker QR
                              </Link>
                              <Link href={`/k/${b.id}`} target="_blank" className="kp-btn s sm">
                                <ExternalLink size={13} />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Riwayat Stiker Kompos yang Sudah Terbit */}
            <div className="kp-card">
              <div className="kp-row" style={{ marginBottom: 8 }}>
                <div>
                  <h2 style={{ margin: "0 0 2px", fontSize: 16 }}>Riwayat Stiker QR Kompos yang Sudah Terbit</h2>
                  <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)" }}>
                    Pupuk kompos kulit kakao yang telah diverifikasi dan siap edar berlabel QR
                  </p>
                </div>
                <span className="kp-nav-badge g">{verifiedCompostBatches.length} Lot Siap Stiker</span>
              </div>

              {verifiedCompostBatches.length === 0 ? (
                <div className="kp-empty">
                  Belum ada lot kompos yang diverifikasi admin. Selesaikan pengolahan dan ajukan verifikasi untuk menerbitkan stiker QR kompos.
                </div>
              ) : (
                <div className="kp-sticker-grid">
                  {verifiedCompostBatches.map((b) => (
                    <div key={b.id} className="kp-sticker-card" style={{ borderColor: "#bbf7d0" }}>
                      <div className="kp-sticker-head">
                        <div>
                          <span className="kp-chip g" style={{ fontSize: 11, padding: "2px 8px" }}>
                            Kompos Kulit Sah
                          </span>
                          <b style={{ display: "block", marginTop: 4, fontSize: 15, color: "var(--cocoa-dark)" }}>
                            {b.kode}
                          </b>
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>
                            Produk: <b>{b.kompos?.beratKompos} kg</b>
                          </span>
                        </div>

                        <div className="kp-sticker-qr-thumb">
                          <QRCodeSVG value={`${origin}/k/${b.id}`} size={50} />
                        </div>
                      </div>

                      <div style={{ fontSize: 11.5, color: "#15803d", borderTop: "1px solid #f1f5f9", paddingTop: 8 }}>
                        <span>Diverifikasi: {b.kompos?.verif?.oleh} ({fmtDate(b.kompos?.verif?.tgl)})</span>
                      </div>

                      <div style={{ display: "flex", gap: 6 }}>
                        <Link href={`/cetak/${b.id}/kompos`} className="kp-btn g sm" style={{ flex: 1 }}>
                          <Printer size={13} /> Cetak Stiker QR
                        </Link>
                        <Link href={`/k/${b.id}`} target="_blank" className="kp-btn s sm">
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal: New Batch */}
      {openNewBatch && (
        <NewBatch
          user={user}
          hasActive={!!primaryActiveBatch && primaryActiveBatch.status === "fermentasi"}
          onClose={() => setOpenNewBatch(false)}
          onDone={(id) => {
            setOpenNewBatch(false);
            setMainTab("kakao");
            router.push(`/batch/${id}`);
          }}
        />
      )}

      {/* Modal: Start Compost */}
      {startCompostTarget && (
        <StartCompostModal
          batch={startCompostTarget}
          onClose={() => setStartCompostTarget(null)}
          onSuccess={() => setStartCompostTarget(null)}
        />
      )}

      {/* Modal: Finish Compost */}
      {finishCompostTarget && (
        <FinishCompostModal
          batch={finishCompostTarget}
          onClose={() => setFinishCompostTarget(null)}
          onSuccess={() => setFinishCompostTarget(null)}
        />
      )}
    </div>
  );
}

// Modal 1: New Batch
function NewBatch({
  user,
  hasActive,
  onClose,
  onDone,
}: {
  user: User;
  hasActive: boolean;
  onClose: () => void;
  onDone: (id: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    varietas: "Forastero",
    kebun: "",
    tglPanen: today,
    beratBasah: "",
    beratKulit: "",
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set1 = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const bb = Number(f.beratBasah),
      bk = Number(f.beratKulit || 0);
    if (!f.kebun.trim()) return setErr("Isi nama atau blok kebun.");
    if (!(bb > 0)) return setErr("Berat biji basah harus lebih dari 0 kg.");
    if (bk < 0) return setErr("Berat kulit tidak boleh bernilai negatif.");
    setBusy(true);

    try {
      const pad = (n: number) => String(n).padStart(2, "0");
      const d = new Date();
      const kode = `KP-${d.getFullYear().toString().slice(-2)}${pad(d.getMonth() + 1)}${pad(
        d.getDate()
      )}-${Math.floor(100 + Math.random() * 900)}`;

      const data: Omit<Batch, "id"> = {
        ownerId: user.id,
        ownerName: user.name,
        group: user.group,
        kode,
        varietas: f.varietas,
        kebun: f.kebun.trim(),
        tglPanen: f.tglPanen,
        beratBasah: bb,
        beratKulit: bk,
        status: "fermentasi",
        createdAt: Date.now(),
        mulaiFerm: Date.now(),
        kompos: { status: "belum" },
      };

      const refNew = push(ref(db, "web/batches"));
      await set(refNew, data);
      await set(ref(db, "web/device/activeBatchId"), refNew.key);
      onDone(refNew.key!);
    } catch {
      setErr("Gagal menyimpan data batch. Periksa koneksi.");
      setBusy(false);
    }
  }

  return (
    <div className="kp-modal" onClick={onClose}>
      <form
        className="kp-sheet"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="kp-row" style={{ marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 17 }}>Mulai Fermentasi Batch Baru</h2>
          <button
            type="button"
            className="kp-btn s sm"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {hasActive && (
          <div className="kp-warn">
            Sensor IoT di kotak fermentasi sedang merekam batch aktif lain.
          </div>
        )}

        {err && <div className="kp-err" role="alert">{err}</div>}

        <div className="kp-f">
          <label>Varietas Biji Kakao</label>
          <select
            value={f.varietas}
            onChange={(e) => set1("varietas", e.target.value)}
          >
            {["Forastero", "Trinitario", "Criollo", "Klon Lindak / Lokal"].map(
              (v) => (
                <option key={v}>{v}</option>
              )
            )}
          </select>
        </div>

        <div className="kp-f">
          <label>Nama / Blok Asal Kebun</label>
          <input
            value={f.kebun}
            onChange={(e) => set1("kebun", e.target.value)}
            placeholder="Blok A Karangan"
          />
        </div>

        <div className="kp-f2">
          <div className="kp-f">
            <label>Tanggal Panen</label>
            <input
              type="date"
              value={f.tglPanen}
              onChange={(e) => set1("tglPanen", e.target.value)}
            />
          </div>
          <div className="kp-f">
            <label>Berat Biji Basah (kg)</label>
            <input
              inputMode="decimal"
              value={f.beratBasah}
              onChange={(e) => set1("beratBasah", e.target.value)}
              placeholder="35"
            />
          </div>
        </div>

        <div className="kp-f">
          <label>Perkiraan Kulit Buah (kg) — Untuk Kompos</label>
          <input
            inputMode="decimal"
            value={f.beratKulit}
            onChange={(e) => set1("beratKulit", e.target.value)}
            placeholder="50"
          />
        </div>

        <button
          className="kp-btn"
          style={{ width: "100%" }}
          disabled={busy || hasActive}
        >
          {busy ? "Menyimpan data..." : "Mulai Rekam Fermentasi"}
        </button>
      </form>
    </div>
  );
}

// Modal 2: Start Compost
function StartCompostModal({
  batch,
  onClose,
  onSuccess,
}: {
  batch: Batch;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [campuran, setCampuran] = useState("Kulit kakao + kotoran ternak + EM4");
  const [busy, setBusy] = useState(false);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await update(ref(db, `web/batches/${batch.id}`), {
        kompos: {
          status: "diolah",
          mulai: Date.now(),
          campuran: campuran.trim() || "Kulit kakao + dekomposer",
        },
      });
      onSuccess();
    } catch {
      alert("Gagal memperbarui status kompos.");
      setBusy(false);
    }
  };

  return (
    <div className="kp-modal" onClick={onClose}>
      <form className="kp-sheet" onClick={(e) => e.stopPropagation()} onSubmit={handleStart}>
        <div className="kp-row" style={{ marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 17 }}>Mulai Pengolahan Kompos Kulit</h2>
          <button type="button" className="kp-btn s sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--muted)" }}>
          Limbah kulit kakao dari <b>Batch {batch.kode}</b> ({batch.beratKulit || 0} kg) akan dimasukkan ke dalam pencatatan fermentasi kompos.
        </p>

        <div className="kp-f">
          <label>Bahan Campuran Dekomposisi</label>
          <input
            value={campuran}
            onChange={(e) => setCampuran(e.target.value)}
            placeholder="Kulit kakao + kotoran sapi + dekomposer"
            required
          />
        </div>

        <button className="kp-btn g" style={{ width: "100%" }} disabled={busy}>
          {busy ? "Menyimpan..." : "Mulai Proses Pengolahan Kompos"}
        </button>
      </form>
    </div>
  );
}

// Modal 3: Finish Compost & Submit to Admin
function FinishCompostModal({
  batch,
  onClose,
  onSuccess,
}: {
  batch: Batch;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [beratKompos, setBeratKompos] = useState("");
  const [busy, setBusy] = useState(false);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    const bk = Number(beratKompos);
    if (!(bk > 0)) {
      alert("Masukkan berat kompos jadi yang valid (> 0 kg).");
      return;
    }
    setBusy(true);

    try {
      await update(ref(db, `web/batches/${batch.id}/kompos`), {
        status: "menunggu",
        beratKompos: bk,
        selesai: Date.now(),
        kirim: Date.now(),
        catatan: null,
      });
      onSuccess();
    } catch {
      alert("Gagal mengirim data kompos.");
      setBusy(false);
    }
  };

  return (
    <div className="kp-modal" onClick={onClose}>
      <form className="kp-sheet" onClick={(e) => e.stopPropagation()} onSubmit={handleFinish}>
        <div className="kp-row" style={{ marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 17 }}>Catat Hasil Kompos Jadi</h2>
          <button type="button" className="kp-btn s sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--muted)" }}>
          Masukkan berat hasil kompos matang dari <b>Batch {batch.kode}</b> untuk diverifikasi oleh admin PPL.
        </p>

        <div className="kp-f">
          <label>Berat Kompos Jadi (kg)</label>
          <input
            inputMode="decimal"
            value={beratKompos}
            onChange={(e) => setBeratKompos(e.target.value)}
            placeholder="Contoh: 15"
            required
          />
        </div>

        <button className="kp-btn g" style={{ width: "100%" }} disabled={busy}>
          {busy ? "Mengirim..." : "Kirim untuk Verifikasi Admin PPL"}
        </button>
      </form>
    </div>
  );
}
