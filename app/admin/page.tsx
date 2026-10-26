"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KakaoPassLogo } from "@/components/KakaoPassLogo";
import { onValue, ref } from "firebase/database";
import {
  LogOut,
  QrCode,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Users,
  Package,
  Sprout,
  Thermometer,
  Droplets,
  ExternalLink,
  Printer,
  MessageCircle,
  ShieldCheck,
  Radio,
  FileCheck2,
  RotateCw,
} from "lucide-react";
import {
  db,
  getUser,
  setUser,
  fmtDate,
  ago,
  DAY,
  STATUS_LABEL,
  type Batch,
  type User,
  type Status,
} from "@/lib/fb";

type LiveSensor = {
  suhu_biji?: number;
  suhu_ruang?: number;
  kelembapan?: number;
  timestamp?: number;
};

type UserData = {
  name: string;
  group: string;
  phone?: string;
  pin?: string;
  role?: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [u, setU] = useState<User | null>(null);
  const [all, setAll] = useState<Batch[] | null>(null);
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [live, setLive] = useState<LiveSensor | null>(null);
  const [now, setNow] = useState(Date.now());

  // Filter & Tab states
  const [activeTab, setActiveTab] = useState<"antrean" | "semua" | "petani" | "sensor">("antrean");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");

  useEffect(() => {
    const x = getUser();
    if (!x || x.role !== "admin") {
      router.replace("/login");
      return;
    }
    setU(x);

    // Subscribe to batches
    const unsubBatches = onValue(ref(db, "web/batches"), (snap) => {
      const val = (snap.val() || {}) as Record<string, Batch>;
      const list = Object.entries(val).map(([id, v]) => ({ ...v, id }));
      setAll(list.sort((a, b) => b.createdAt - a.createdAt));
    });

    // Subscribe to users
    const unsubUsers = onValue(ref(db, "web/users"), (snap) => {
      setUsers((snap.val() || {}) as Record<string, UserData>);
    });

    // Subscribe to live IoT sensor
    const unsubSensor = onValue(ref(db, "kakao_pass/terbaru"), (snap) => {
      setLive(snap.val());
    });

    const timer = setInterval(() => setNow(Date.now()), 30000);

    return () => {
      unsubBatches();
      unsubUsers();
      unsubSensor();
      clearInterval(timer);
    };
  }, [router]);

  // Aggregate Calculations
  const wait = (b: Batch) =>
    Math.min(
      b.status === "verifikasi" ? b.kirim ?? now : now,
      b.kompos?.status === "menunggu" ? b.kompos.kirim ?? now : now
    );

  const pending = useMemo(() => {
    return (all || [])
      .filter((b) => b.status === "verifikasi" || b.kompos?.status === "menunggu")
      .sort((a, b) => wait(a) - wait(b));
  }, [all, now]);

  const verifiedBatches = useMemo(() => {
    return (all || []).filter((b) => b.status === "selesai");
  }, [all]);

  const totalBasah = useMemo(() => {
    return (all || []).reduce((acc, b) => acc + (b.beratBasah || 0), 0);
  }, [all]);

  const totalKering = useMemo(() => {
    return verifiedBatches.reduce((acc, b) => acc + (b.kering?.beratKering || 0), 0);
  }, [verifiedBatches]);

  const verifiedKompos = useMemo(() => {
    return (all || []).filter((b) => b.kompos?.status === "terverifikasi");
  }, [all]);

  const totalKompos = useMemo(() => {
    return verifiedKompos.reduce((acc, b) => acc + (b.kompos?.beratKompos || 0), 0);
  }, [verifiedKompos]);

  const avgMutuBaik = useMemo(() => {
    const list = (all || []).filter((b) => typeof b.mutu?.baik === "number");
    if (!list.length) return 0;
    const sum = list.reduce((acc, b) => acc + (b.mutu?.baik || 0), 0);
    return Math.round((sum / list.length) * 10) / 10;
  }, [all]);

  const farmerUsers = useMemo(() => {
    return Object.entries(users)
      .filter(([, usr]) => usr.role !== "admin")
      .map(([id, usr]) => ({ id, ...usr }));
  }, [users]);

  // Filtered Batches for "Semua Batch" tab
  const filteredBatches = useMemo(() => {
    return (all || []).filter((b) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        b.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.kebun.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.varietas.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "semua" ||
        (statusFilter === "verifikasi" && (b.status === "verifikasi" || b.kompos?.status === "menunggu")) ||
        b.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [all, searchQuery, statusFilter]);

  if (!u) return null;

  const isSensorOnline = !!live?.timestamp && now - live.timestamp < 75 * 60000;
  const activeFermentingBatch = (all || []).find((b) => b.status === "fermentasi");

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
          <div className="kp-user">
            <span>
              <b>{u.name}</b> · Pendamping Lapangan / Admin
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
        </div>
      </header>

      {/* Main Content Area */}
      <main className="kp-wrap">
        <div className="kp-row" style={{ marginBottom: 8 }}>
          <div>
            <h1>Portal Pendamping &amp; Admin</h1>
            <p className="kp-sub" style={{ marginBottom: 0 }}>
              Kelompok Tani Karangan Mandiri · Monitoring IoT &amp; Verifikasi Mutu Kakao
            </p>
          </div>
          <span className="kp-chip g">
            <ShieldCheck size={14} style={{ verticalAlign: -2 }} />
            Otoritas Sertifikasi QR
          </span>
        </div>

        {/* Aggregate KPI Metric Cards */}
        <div className="kp-kpi kp-kpi-admin">
          <div className="kp-kpi-item">
            <div className="kp-kpi-label">
              <Clock size={14} />
              Perlu Verifikasi
            </div>
            <div className="kp-kpi-val" style={{ color: pending.length > 0 ? "var(--rust)" : "var(--cocoa-dark)" }}>
              {pending.length} <small style={{ fontSize: 13, fontWeight: 500 }}>batch</small>
            </div>
          </div>

          <div className="kp-kpi-item">
            <div className="kp-kpi-label">
              <Package size={14} />
              Biji Kering Tersertifikasi
            </div>
            <div className="kp-kpi-val">
              {totalKering} <small style={{ fontSize: 13, fontWeight: 500 }}>kg</small>
            </div>
          </div>

          <div className="kp-kpi-item">
            <div className="kp-kpi-label">
              <FileCheck2 size={14} />
              Rata-rata Biji Baik
            </div>
            <div className="kp-kpi-val" style={{ color: "var(--green-dark)" }}>
              {avgMutuBaik}%
            </div>
          </div>

          <div className="kp-kpi-item">
            <div className="kp-kpi-label">
              <Sprout size={14} />
              Kompos Kulit Kakao
            </div>
            <div className="kp-kpi-val">
              {totalKompos} <small style={{ fontSize: 13, fontWeight: 500 }}>kg</small>
            </div>
          </div>

          <div className="kp-kpi-item">
            <div className="kp-kpi-label">
              <Users size={14} />
              Petani Binaan
            </div>
            <div className="kp-kpi-val">
              {farmerUsers.length} <small style={{ fontSize: 13, fontWeight: 500 }}>orang</small>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="kp-tabs">
          <button
            type="button"
            className={`kp-tab ${activeTab === "antrean" ? "active" : ""}`}
            onClick={() => setActiveTab("antrean")}
          >
            <Clock size={16} />
            <span>Antrean Verifikasi</span>
            {pending.length > 0 ? (
              <span className="badge">{pending.length}</span>
            ) : (
              <span className="badge g">0</span>
            )}
          </button>

          <button
            type="button"
            className={`kp-tab ${activeTab === "semua" ? "active" : ""}`}
            onClick={() => setActiveTab("semua")}
          >
            <Package size={16} />
            <span>Semua Batch Kakao</span>
            <span className="badge muted">{all?.length ?? 0}</span>
          </button>

          <button
            type="button"
            className={`kp-tab ${activeTab === "petani" ? "active" : ""}`}
            onClick={() => setActiveTab("petani")}
          >
            <Users size={16} />
            <span>Direktori Petani</span>
            <span className="badge muted">{farmerUsers.length}</span>
          </button>

          <button
            type="button"
            className={`kp-tab ${activeTab === "sensor" ? "active" : ""}`}
            onClick={() => setActiveTab("sensor")}
          >
            <Radio size={16} />
            <span>Status Sensor Lapangan</span>
            <span className={`kp-dot ${isSensorOnline ? "on" : ""}`} />
          </button>
        </div>

        {/* TAB 1: ANTREAN VERIFIKASI */}
        {activeTab === "antrean" && (
          <div className="kp-card">
            <div className="kp-row" style={{ marginBottom: 16 }}>
              <div>
                <h2 style={{ margin: 0 }}>Antrean Menunggu Verifikasi</h2>
                <p className="kp-sub" style={{ margin: "4px 0 0", fontSize: 13 }}>
                  Periksa data timbangan, uji belah, kadar air, dan foto bukti petani sebelum paspor QR disahkan.
                </p>
              </div>
            </div>

            {all === null ? (
              <div className="kp-empty">Memuat data antrean...</div>
            ) : pending.length === 0 ? (
              <div className="kp-empty">
                <CheckCircle2 size={32} style={{ color: "var(--green)", marginBottom: 8 }} />
                <p style={{ margin: 0, fontWeight: 600, color: "var(--cocoa-dark)" }}>
                  Semua antrean telah diverifikasi!
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>
                  Tidak ada batch kakao atau kompos yang menunggu tindakan verifikasi saat ini.
                </p>
              </div>
            ) : (
              <div className="kp-list">
                {pending.map((b) => {
                  const waitingTime = now - wait(b);
                  const isLate = waitingTime > 2 * DAY;

                  return (
                    <Link key={b.id} href={`/admin/${b.id}`} className="kp-batch">
                      <div className="kp-row">
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <b>{b.kode}</b>
                          {b.status === "verifikasi" && <span className="kp-chip r">Verifikasi Biji</span>}
                          {b.kompos?.status === "menunggu" && <span className="kp-chip g">Verifikasi Kompos</span>}
                          {isLate && (
                            <span className="kp-chip r">
                              <AlertTriangle size={12} />
                              &gt; 2 hari
                            </span>
                          )}
                        </div>
                        <span className="kp-btn s sm">
                          Periksa Berkas &amp; Foto <ChevronRight size={14} />
                        </span>
                      </div>
                      <p>
                        Petani: <b>{b.ownerName}</b> · {b.group} · Kebun: {b.kebun} · {b.varietas}
                      </p>
                      <p style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>
                        Dikirim {fmtDate(wait(b))} ({ago(wait(b), now)})
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SEMUA BATCH KAKAO (MONITORING & ARSIP) */}
        {activeTab === "semua" && (
          <div className="kp-card">
            {/* Search & Filter Toolbar */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <div className="kp-search-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Cari kode batch, nama petani, kebun, varietas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter Pills */}
              <div className="kp-pills">
                {[
                  { k: "semua", l: "Semua" },
                  { k: "verifikasi", l: "Antrean" },
                  { k: "fermentasi", l: "Fermentasi" },
                  { k: "pengeringan", l: "Pengeringan" },
                  { k: "uji_mutu", l: "Uji Mutu" },
                  { k: "selesai", l: "Terverifikasi" },
                ].map(({ k, l }) => (
                  <button
                    key={k}
                    type="button"
                    className={`kp-pill-btn ${statusFilter === k ? "active" : ""}`}
                    onClick={() => setStatusFilter(k)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Batches */}
            {all === null ? (
              <div className="kp-empty">Memuat data batch...</div>
            ) : filteredBatches.length === 0 ? (
              <div className="kp-empty">
                Tidak ada batch yang cocok dengan pencarian atau filter yang dipilih.
              </div>
            ) : (
              <div className="kp-list">
                {filteredBatches.map((b) => {
                  return (
                    <div
                      key={b.id}
                      className="kp-batch"
                      style={{ cursor: "default" }}
                    >
                      <div className="kp-row" style={{ marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <b>{b.kode}</b>
                          <span
                            className={
                              "kp-chip " +
                              (b.status === "selesai"
                                ? "g"
                                : b.status === "fermentasi" || b.status === "verifikasi"
                                ? "r"
                                : "")
                            }
                          >
                            {STATUS_LABEL[b.status]}
                          </span>
                          {b.kompos?.status === "terverifikasi" && (
                            <span className="kp-chip g">Kompos Sah</span>
                          )}
                          {b.kompos?.status === "menunggu" && (
                            <span className="kp-chip r">Kompos Antrean</span>
                          )}
                        </div>

                        {/* Direct Action Link */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {(b.status === "verifikasi" || b.kompos?.status === "menunggu") && (
                            <Link href={`/admin/${b.id}`} className="kp-btn sm">
                              Verifikasi <ChevronRight size={14} />
                            </Link>
                          )}
                          {b.status === "selesai" && (
                            <>
                              <Link href={`/p/${b.id}`} target="_blank" className="kp-btn s sm">
                                <ExternalLink size={13} /> Paspor QR
                              </Link>
                              <Link href={`/cetak/${b.id}/biji`} className="kp-btn s sm">
                                <Printer size={13} /> Cetak Label
                              </Link>
                            </>
                          )}
                          {b.status === "fermentasi" && (
                            <Link href={`/batch/${b.id}`} className="kp-btn s sm">
                              Pantau IoT <ChevronRight size={14} />
                            </Link>
                          )}
                        </div>
                      </div>

                      <p style={{ margin: "4px 0" }}>
                        <strong>{b.ownerName}</strong> · Kebun: {b.kebun} · Varietas: {b.varietas} · Panen: {b.tglPanen}
                      </p>

                      <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 13, color: "var(--muted)", flexWrap: "wrap" }}>
                        <span>
                          Basah: <b>{b.beratBasah} kg</b>
                        </span>
                        <span>
                          Kering: <b>{b.kering?.beratKering ? `${b.kering.beratKering} kg` : "--"}</b>
                        </span>
                        {b.mutu && (
                          <span>
                            Mutu Baik: <b>{b.mutu.baik}%</b> (KA: {b.mutu.kadarAir}%)
                          </span>
                        )}
                        {b.kompos?.beratKompos && (
                          <span>
                            Kompos: <b>{b.kompos.beratKompos} kg</b>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DIREKTORI PETANI */}
        {activeTab === "petani" && (
          <div className="kp-card">
            <div className="kp-row" style={{ marginBottom: 16 }}>
              <div>
                <h2 style={{ margin: 0 }}>Direktori Petani Terdaftar</h2>
                <p className="kp-sub" style={{ margin: "4px 0 0", fontSize: 13 }}>
                  Daftar petani anggota binaan, data produksi, dan kontak pendampingan lapangan.
                </p>
              </div>
            </div>

            {farmerUsers.length === 0 ? (
              <div className="kp-empty">Belum ada akun petani yang terdaftar.</div>
            ) : (
              <div className="kp-list">
                {farmerUsers.map((f) => {
                  const farmerBatches = (all || []).filter(
                    (b) => b.ownerId === f.id || b.ownerName.toLowerCase() === f.name.toLowerCase()
                  );
                  const farmerKering = farmerBatches
                    .filter((b) => b.status === "selesai")
                    .reduce((acc, b) => acc + (b.kering?.beratKering || 0), 0);
                  const farmerBasah = farmerBatches.reduce((acc, b) => acc + (b.beratBasah || 0), 0);

                  const phoneClean = (f.phone || "").replace(/\D/g, "");
                  const waNumber = phoneClean.startsWith("0")
                    ? "62" + phoneClean.slice(1)
                    : phoneClean;

                  return (
                    <div key={f.id} className="kp-farmer-card">
                      <div className="kp-farmer-meta">
                        <div className="kp-farmer-avatar">{f.name.charAt(0)}</div>
                        <div className="kp-farmer-info">
                          <h3 style={{ margin: 0, fontSize: 16, color: "var(--cocoa-dark)" }}>
                            {f.name}{" "}
                            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>
                              ({f.id})
                            </span>
                          </h3>
                          <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--muted)" }}>
                            {f.group}
                          </p>
                          {f.phone && (
                            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--cocoa)" }}>
                              WhatsApp: {f.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="kp-farmer-stats">
                        <div>
                          <span>Total Batch</span>
                          <b>{farmerBatches.length} siklus</b>
                        </div>
                        <div>
                          <span>Biji Kering</span>
                          <b>{farmerKering} kg</b>
                        </div>
                        <div>
                          <span>Total Panen</span>
                          <b>{farmerBasah} kg</b>
                        </div>

                        {f.phone && (
                          <a
                            href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(
                              f.name
                            )},%20ini%20Bu%20Sari%20Pendamping%20KakaoPass.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="kp-btn g sm"
                            style={{ textDecoration: "none" }}
                          >
                            <MessageCircle size={14} /> Hubungi Petani
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STATUS SENSOR IOT LAPANGAN */}
        {activeTab === "sensor" && (
          <div className="kp-grid">
            <section className="kp-card kp-c6 kp-live">
              <div className="kp-row">
                <h2 style={{ margin: 0, color: "#fff" }}>Sensor Lapangan Realtime</h2>
                <span className="kp-chip o">
                  <span className={`kp-dot ${isSensorOnline ? "on" : ""}`} />
                  {isSensorOnline ? "Alat Online" : "Alat Offline"}
                </span>
              </div>

              <div style={{ margin: "24px 0 6px", opacity: 0.8, fontSize: 13 }}>
                Suhu Massa Biji Fermentasi
              </div>
              <div className="kp-big">
                {live?.suhu_biji !== undefined ? live.suhu_biji.toFixed(1) : "--"}
                <small> °C</small>
              </div>

              <div className="kp-mini">
                <span>
                  <Thermometer size={15} style={{ verticalAlign: -2 }} /> Ruang:{" "}
                  {live?.suhu_ruang?.toFixed(1) ?? "--"}°C
                </span>
                <span>
                  <Droplets size={15} style={{ verticalAlign: -2 }} /> Kelembapan:{" "}
                  {live?.kelembapan?.toFixed(0) ?? "--"}%
                </span>
              </div>

              <div style={{ marginTop: 16, fontSize: 12, opacity: 0.75 }}>
                {live?.timestamp
                  ? `Terakhir disinkronkan ${ago(live.timestamp, now)} (${fmtDate(live.timestamp)})`
                  : "Menunggu sinyal data dari alat ESP32..."}
              </div>
            </section>

            <section className="kp-card kp-c6">
              <h2 style={{ margin: "0 0 12px" }}>Batch Aktif yang Sedang Dipantau</h2>
              {activeFermentingBatch ? (
                <div>
                  <div className="kp-warn" style={{ marginBottom: 14 }}>
                    <b>Alat sedang bertugas:</b> Kotak fermentasi terhubung dengan batch berikut.
                  </div>
                  <div className="kp-kv" style={{ marginBottom: 14 }}>
                    <div>
                      <span>Kode Batch</span>
                      <b>{activeFermentingBatch.kode}</b>
                    </div>
                    <div>
                      <span>Petani</span>
                      <b>{activeFermentingBatch.ownerName}</b>
                    </div>
                    <div>
                      <span>Kebun</span>
                      <b>{activeFermentingBatch.kebun}</b>
                    </div>
                    <div>
                      <span>Hari Fermentasi</span>
                      <b>
                        Hari ke-
                        {Math.floor((now - activeFermentingBatch.mulaiFerm) / DAY) + 1}
                      </b>
                    </div>
                  </div>
                  <Link href={`/batch/${activeFermentingBatch.id}`} className="kp-btn" style={{ width: "100%" }}>
                    Buka Grafik &amp; Kontrol Batch <ChevronRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="kp-empty">
                  Tidak ada batch yang sedang dalam proses fermentasi aktif saat ini. Alat IoT dalam keadaan *standby*.
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
