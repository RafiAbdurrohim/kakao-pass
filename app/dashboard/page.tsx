"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KakaoPassLogo } from "@/components/KakaoPassLogo";
import { onValue, ref, push, set } from "firebase/database";
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
  HelpCircle,
  AlertTriangle,
  Sun,
  Flame,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import {
  db,
  getUser,
  setUser,
  ago,
  fmtDate,
  STATUS_LABEL,
  DAY,
  type User,
  type Batch,
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
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [batchTab, setBatchTab] = useState<"semua" | "aktif" | "selesai">("semua");

  useEffect(() => {
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
  const totalKompos = useMemo(
    () =>
      batches
        .filter((b) => b.kompos?.status === "terverifikasi")
        .reduce((acc, b) => acc + (b.kompos?.beratKompos || 0), 0),
    [batches]
  );

  const avgMutu = useMemo(() => {
    const list = batches.filter((b) => typeof b.mutu?.baik === "number");
    if (!list.length) return 0;
    const sum = list.reduce((acc, b) => acc + (b.mutu?.baik || 0), 0);
    return Math.round((sum / list.length) * 10) / 10;
  }, [batches]);

  // Most prominent active batch for Hero Card
  const primaryActiveBatch = useMemo(() => {
    return (
      batches.find((b) => b.status === "fermentasi") ||
      batches.find((b) => b.status === "pengeringan") ||
      batches.find((b) => b.status === "uji_mutu" || b.status === "revisi") ||
      batches.find((b) => b.status === "verifikasi")
    );
  }, [batches]);

  // Filtered batch list
  const filteredBatches = useMemo(() => {
    if (batchTab === "aktif") return activeBatches;
    if (batchTab === "selesai") return verifiedBatches;
    return batches;
  }, [batchTab, batches, activeBatches, verifiedBatches]);

  if (!user) return null;

  const online = !!live?.timestamp && now - live.timestamp < 75 * 60000;
  const suhuBiji = live?.suhu_biji;

  // Temperature Zone Evaluation for Active Fermentation
  const getTempZone = (temp?: number) => {
    if (temp === undefined) return null;
    if (temp < 38) {
      return {
        label: "Suhu Dingin (<38°C)",
        cls: "kp-zone-cool",
        advice: "Tutup rapat kotak fermentasi dengan karung goni agar panas ragi terjaga.",
      };
    }
    if (temp <= 49) {
      return {
        label: "Suhu Fermentasi Optimal (42–49°C)",
        cls: "kp-zone-opt",
        advice: "Kondisi sangat ideal. Bakteri asam asetat bekerja maksimal membentuk prekursor aroma cokelat.",
      };
    }
    return {
      label: "Suhu Panas (>50°C)",
      cls: "kp-zone-hot",
      advice: "Suhu sangat tinggi. Pertimbangkan membalik biji agar mikroba tidak kepanasan.",
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
        </div>
      </header>

      {/* Main Container */}
      <main className="kp-wrap">
        {/* Farmer Greeting Title */}
        <div className="kp-row" style={{ marginBottom: 12 }}>
          <div>
            <h1>Halo, {user.name} 👋</h1>
            <p className="kp-sub" style={{ marginBottom: 0 }}>
              {user.group} · Pantau alat IoT, proses fermentasi, dan paspor mutu kakao Anda.
            </p>
          </div>
          <button className="kp-btn" onClick={() => setOpen(true)}>
            <Plus size={18} />
            Mulai Batch Baru
          </button>
        </div>

        {/* Farmer Production KPI Metrics */}
        <div className="kp-kpi" style={{ marginTop: 14 }}>
          <div className="kp-kpi-item">
            <div className="kp-kpi-label">
              <Package size={14} />
              Biji Kering Tersertifikasi
            </div>
            <div className="kp-kpi-val">
              {totalKering} <small style={{ fontSize: 13, fontWeight: 500 }}>kg</small>
            </div>
            <div className="kp-kpi-sub">
              Siap jual dari {totalBasah} kg panen basah ({verifiedBatches.length} paspor sah)
            </div>
          </div>

          <div className="kp-kpi-item">
            <div className="kp-kpi-label">
              <TrendingUp size={14} />
              Nilai Mutu Kakao SNI
            </div>
            <div className="kp-kpi-val" style={{ color: "var(--rust)" }}>
              ~Rp 130rb<small style={{ fontSize: 12, fontWeight: 500 }}>/kg</small>
            </div>
            <div className="kp-kpi-sub">Estimasi harga biji fermentasi terstandar paspor QR</div>
          </div>

          <div className="kp-kpi-item">
            <div className="kp-kpi-label">
              <CheckCircle2 size={14} />
              Rata-rata Biji Baik
            </div>
            <div className="kp-kpi-val" style={{ color: "var(--green-dark)" }}>
              {avgMutu > 0 ? `${avgMutu}%` : "--"}
            </div>
            <div className="kp-kpi-sub">Standar mutu uji belah biji terfermentasi</div>
          </div>

          <div className="kp-kpi-item">
            <div className="kp-kpi-label">
              <Sprout size={14} />
              Kompos Kulit Kakao
            </div>
            <div className="kp-kpi-val">
              {totalKompos} <small style={{ fontSize: 13, fontWeight: 500 }}>kg</small>
            </div>
            <div className="kp-kpi-sub">Pupuk organik sirkular dari limbah kulit buah</div>
          </div>
        </div>

        {/* HERO FOCUS CARD: Active Batch Assistant */}
        {primaryActiveBatch ? (
          <div className="kp-focus-card">
            <div className="kp-row" style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span className="kp-chip o" style={{ background: "var(--rust)", color: "#fff" }}>
                  Siklus Aktif Saat Ini
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

            <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--cocoa)" }}>
              {primaryActiveBatch.varietas} · {primaryActiveBatch.kebun} · {primaryActiveBatch.beratBasah} kg basah · Panen {primaryActiveBatch.tglPanen}
            </p>

            {/* Dynamic Assistance per Phase */}
            {primaryActiveBatch.status === "fermentasi" && (
              <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: "14px", display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Flame size={18} style={{ color: "var(--rust)" }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>
                      Hari ke-{Math.floor((now - primaryActiveBatch.mulaiFerm) / DAY) + 1} Fermentasi
                    </span>
                  </div>
                  {tempZone && (
                    <span className={`kp-zone-pill ${tempZone.cls}`}>
                      {tempZone.label}
                    </span>
                  )}
                </div>

                <div className="kp-kv" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
                  <div>
                    <span>Suhu Massa Biji</span>
                    <b>{suhuBiji !== undefined ? `${suhuBiji.toFixed(1)}°C` : "--"}</b>
                  </div>
                  <div>
                    <span>Riwayat Dibalik</span>
                    <b>{Object.keys(primaryActiveBatch.balik || {}).length}× dibalik</b>
                  </div>
                  <div>
                    <span>Target Panas SNI</span>
                    <b>&gt; 45°C</b>
                  </div>
                </div>

                {tempZone && (
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
                    💡 <strong>Panduan Petani:</strong> {tempZone.advice}
                  </p>
                )}
              </div>
            )}

            {primaryActiveBatch.status === "pengeringan" && (
              <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Sun size={18} style={{ color: "#d97706" }} />
                  <b style={{ fontSize: 14 }}>
                    Fase Penjemuran Matahari (Hari ke-
                    {primaryActiveBatch.kering?.mulai
                      ? Math.floor((now - primaryActiveBatch.kering.mulai) / DAY) + 1
                      : 1}
                    )
                  </b>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.45 }}>
                  Ratakan biji dengan ketebalan 3–5 cm di atas lantai jemur atau para-para. Aduk perlahan setiap 2 jam. Setelah biji kering renyah (kadar air &le; 7.5%), timbang dan foto hasilnya untuk lanjut ke uji mutu.
                </p>
              </div>
            )}

            {(primaryActiveBatch.status === "uji_mutu" || primaryActiveBatch.status === "revisi") && (
              <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: "14px" }}>
                <b style={{ display: "block", marginBottom: 6, fontSize: 14, color: "var(--rust)" }}>
                  Tahap Uji Belah Mutu (Cut Test 100 Butir)
                </b>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
                  Biji telah kering. Silakan ambil sampel 100 butir biji, belah dua membujur, dan masukkan hasil perhitungan biji baik untuk sertifikasi paspor.
                </p>
              </div>
            )}

            {primaryActiveBatch.status === "verifikasi" && (
              <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={16} style={{ color: "var(--rust)" }} />
                  <b style={{ fontSize: 14 }}>Menunggu Verifikasi Pendamping Lapangan</b>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>
                  Data dan foto timbangan serta uji belah Anda sedang diperiksa oleh Bu Sari. Paspor digital dan stiker QR akan langsung terbit begitu disetujui.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="kp-card" style={{ marginBottom: 22, background: "#faf8f2", borderColor: "#ddd8cc" }}>
            <div className="kp-row">
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 17 }}>Tidak Ada Siklus Fermentasi yang Aktif</h2>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
                  Mulai batch baru untuk merekam suhu fermentasi otomatis dari alat sensor IoT di kebun Anda.
                </p>
              </div>
              <button className="kp-btn sm" onClick={() => setOpen(true)}>
                <Plus size={16} /> Buat Batch Baru
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Main Grid: Batches & Side IoT Panel */}
        <div className="kp-grid">
          {/* Left Column: Batch History & Management */}
          <section className="kp-card kp-c8">
            <div className="kp-row" style={{ marginBottom: 14 }}>
              <h2 style={{ margin: 0 }}>Batch Kakao Saya</h2>
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
            </div>

            {!loaded ? (
              <div className="kp-empty">Memuat daftar batch...</div>
            ) : filteredBatches.length === 0 ? (
              <div className="kp-empty">
                {batchTab === "selesai"
                  ? "Belum ada batch yang selesai diverifikasi. Selesaikan siklus fermentasi dan uji mutu untuk menerbitkan paspor QR pertama Anda."
                  : "Belum ada batch pada kategori ini. Tekan tombol “Mulai Batch Baru” untuk memulai."}
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
                        {b.kompos?.status === "terverifikasi" && (
                          <span className="kp-chip g">Kompos Tersertifikasi</span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 6 }}>
                        {b.status === "selesai" ? (
                          <>
                            <Link href={`/p/${b.id}`} target="_blank" className="kp-btn s sm">
                              <ExternalLink size={13} /> Paspor QR
                            </Link>
                            <Link href={`/cetak/${b.id}/biji`} className="kp-btn s sm">
                              <Printer size={13} /> Cetak Stiker
                            </Link>
                          </>
                        ) : (
                          <Link href={`/batch/${b.id}`} className="kp-btn sm">
                            Buka Detail <ChevronRight size={14} />
                          </Link>
                        )}
                      </div>
                    </div>

                    <p style={{ margin: "4px 0" }}>
                      {b.varietas} · {b.kebun} · {b.beratBasah} kg basah
                      {b.kering?.beratKering ? ` &rarr; ${b.kering.beratKering} kg kering` : ""}
                      {b.status === "fermentasi"
                        ? ` · Hari ke-${Math.floor((now - b.mulaiFerm) / DAY) + 1}`
                        : ""}
                    </p>

                    <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 12, color: "var(--muted)", flexWrap: "wrap" }}>
                      <span>Dibuat {fmtDate(b.createdAt)}</span>
                      {b.mutu?.baik && (
                        <span>
                          Mutu Baik: <strong>{b.mutu.baik}%</strong>
                        </span>
                      )}
                      {b.kompos?.beratKompos && (
                        <span>
                          Kompos: <strong>{b.kompos.beratKompos} kg</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Right Column: Live IoT Sensor & Assistance */}
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
                  : "Menunggu data transmisi alat..."}
              </div>
            </div>

            {/* Assistance Card */}
            <div className="kp-card">
              <h2 style={{ margin: "0 0 8px", fontSize: 16 }}>Bantuan Lapangan</h2>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--muted)", lineHeight: 1.45 }}>
                Ada kendala fermentasi, alat sensor offline, atau persiapan uji belah? Hubungi pendamping lapangan binaan Anda:
              </p>

              <div style={{ background: "#faf8f2", border: "1px solid var(--line)", borderRadius: 12, padding: "12px", marginBottom: 12 }}>
                <b style={{ display: "block", color: "var(--cocoa-dark)", fontSize: 14 }}>
                  Bu Sari (PPL Pendamping)
                </b>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  Dinas Perkebunan &amp; Tim KakaoPass
                </span>
              </div>

              <a
                href="https://wa.me/6281200000001?text=Halo%20Bu%20Sari,%20saya%20Pak%20Budi%20petani%20KakaoPass%20butuh%20bantuan%20lapangan."
                target="_blank"
                rel="noopener noreferrer"
                className="kp-btn g sm"
                style={{ width: "100%", textDecoration: "none" }}
              >
                <MessageCircle size={15} /> Chat via WhatsApp
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Modal New Batch */}
      {open && (
        <NewBatch
          user={user}
          hasActive={!!primaryActiveBatch && primaryActiveBatch.status === "fermentasi"}
          onClose={() => setOpen(false)}
          onDone={(id) => router.push(`/batch/${id}`)}
        />
      )}
    </div>
  );
}

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
    if (!f.kebun.trim()) return setErr("Isi nama/asal kebun.");
    if (!(bb > 0)) return setErr("Berat biji basah harus lebih dari 0 kg.");
    if (bk < 0) return setErr("Berat kulit tidak boleh negatif.");
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
      setErr("Gagal menyimpan. Periksa koneksi dan aturan database.");
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
          <h2 style={{ margin: 0 }}>Mulai Fermentasi Batch Baru</h2>
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
            Ada batch yang sedang dalam proses fermentasi aktif. Alat sensor IoT di kotak fermentasi hanya bisa dipakai untuk satu batch pada satu waktu.
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
            placeholder="Contoh: Kebun Blok A, Karangan"
          />
        </div>
        <div className="kp-f2">
          <div className="kp-f">
            <label>Tanggal Panen Biji</label>
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
              placeholder="Contoh: 35"
            />
          </div>
        </div>
        <div className="kp-f">
          <label>Perkiraan Berat Kulit Buah (kg) — Opsional</label>
          <input
            inputMode="decimal"
            value={f.beratKulit}
            onChange={(e) => set1("beratKulit", e.target.value)}
            placeholder="Contoh: 50 (untuk diolah jadi kompos)"
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
