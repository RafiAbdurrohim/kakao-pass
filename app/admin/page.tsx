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
  Cpu,
  PlusCircle,
  Link as LinkIcon,
  Check,
  X,
  Smartphone,
  Layers,
  Settings2,
  Trash2,
  Boxes,
} from "lucide-react";
import {
  db,
  getUser,
  setUser,
  fmtDate,
  ago,
  DAY,
  STATUS_LABEL,
  seedDevicesIfEmpty,
  saveDevice,
  deleteDevice,
  pairDeviceOperator,
  registerOperatorUser,
  type Batch,
  type User,
  type Status,
  type Device,
  type DeviceType,
  type DeviceStatus,
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
  const [devices, setDevices] = useState<Record<string, Device>>({});
  const [now, setNow] = useState(Date.now());

  // Filter & Tab states
  const [activeTab, setActiveTab] = useState<"antrean" | "semua" | "onboarding" | "petani" | "sensor">("antrean");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");

  // Onboarding Wizard states
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [onboardStep, setOnboardStep] = useState<1 | 2 | 3>(1);
  const [onboardSuccessMsg, setOnboardSuccessMsg] = useState("");
  const [isSubmittingOnboard, setIsSubmittingOnboard] = useState(false);

  // Form Step 1: Device Info
  const [formDevice, setFormDevice] = useState<{
    id: string;
    name: string;
    type: DeviceType;
    lokasi: string;
    kapasitas: string;
  }>({
    id: "FERM-BOX-03",
    name: "Kotak Fermentasi Ulin 03",
    type: "fermentasi",
    lokasi: "Sentra Karangan Mandiri Blok C",
    kapasitas: "500 kg",
  });

  // Form Step 2: Operator PIC Info
  const [picMode, setPicMode] = useState<"existing" | "new">("existing");
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("KTIM-024");
  const [formOperator, setFormOperator] = useState({
    id: "KTIM-026",
    name: "Pak Suryono",
    group: "Kelompok Tani Karangan Mandiri",
    phone: "081234567890",
    pin: "202604",
  });

  // Re-Pairing Target
  const [pairingTarget, setPairingTarget] = useState<Device | null>(null);
  const [repairingOperatorId, setRepairingOperatorId] = useState<string>("");

  useEffect(() => {
    const x = getUser();
    if (!x || x.role !== "admin") {
      router.replace("/login");
      return;
    }
    setU(x);

    // Seed default devices if empty
    seedDevicesIfEmpty().catch(() => {});

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

    // Subscribe to devices
    const unsubDevices = onValue(ref(db, "web/devices"), (snap) => {
      setDevices((snap.val() || {}) as Record<string, Device>);
    });

    // Subscribe to live IoT sensor
    const unsubSensor = onValue(ref(db, "kakao_pass/terbaru"), (snap) => {
      setLive(snap.val());
    });

    const timer = setInterval(() => setNow(Date.now()), 30000);

    return () => {
      unsubBatches();
      unsubUsers();
      unsubDevices();
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

  const devicesList = useMemo(() => {
    return Object.values(devices).sort((a, b) => (b.registeredAt || 0) - (a.registeredAt || 0));
  }, [devices]);

  const handleCompleteOnboarding = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmittingOnboard(true);
    try {
      let finalOperatorId = "";
      let finalOperatorName = "";
      let finalOperatorPhone = "";

      if (picMode === "existing") {
        const picked = users[selectedOperatorId] || Object.entries(users).find(([id]) => id === selectedOperatorId)?.[1];
        finalOperatorId = selectedOperatorId || "KTIM-024";
        finalOperatorName = picked?.name || "Pak Budi";
        finalOperatorPhone = picked?.phone || "081258202026";
      } else {
        const newOpId = formOperator.id.trim() || `KTIM-${String(Date.now()).slice(-3)}`;
        await registerOperatorUser({
          id: newOpId,
          name: formOperator.name.trim(),
          group: formOperator.group.trim() || "Kelompok Tani Karangan Mandiri",
          phone: formOperator.phone.trim(),
          pin: formOperator.pin.trim() || "202601",
          role: "petani",
        });
        finalOperatorId = newOpId;
        finalOperatorName = formOperator.name.trim();
        finalOperatorPhone = formOperator.phone.trim();
      }

      const newDevId = formDevice.id.trim().toUpperCase() || `FERM-BOX-${devicesList.length + 1}`;
      const newDevice: Device = {
        id: newDevId,
        name: formDevice.name.trim() || `Kotak Fermentasi ${newDevId}`,
        type: formDevice.type,
        lokasi: formDevice.lokasi.trim() || "Sentra Karangan Mandiri",
        kapasitas: formDevice.kapasitas.trim() || "500 kg",
        status: "idle",
        operatorId: finalOperatorId,
        operatorName: finalOperatorName,
        operatorPhone: finalOperatorPhone,
        registeredAt: Date.now(),
        lastPing: Date.now(),
        terbaru: formDevice.type === "fermentasi"
          ? { suhu_biji: 28.5, suhu_ruang: 28.0, kelembapan: 75, timestamp: Date.now() }
          : { suhu_ruang: 36.0, kelembapan: 60, timestamp: Date.now() },
      };

      await saveDevice(newDevice);
      setOnboardSuccessMsg(`Unit ${newDevId} (${newDevice.name}) berhasil dipasangkan ke ${finalOperatorName}!`);
      setTimeout(() => setOnboardSuccessMsg(""), 6000);
      setShowOnboardModal(false);
      setOnboardStep(1);
    } catch {
      alert("Gagal menyimpan onboarding. Periksa koneksi.");
    } finally {
      setIsSubmittingOnboard(false);
    }
  };

  const handleRePair = async (deviceId: string) => {
    if (!repairingOperatorId) return;
    const picked = users[repairingOperatorId];
    if (!picked) return;
    await pairDeviceOperator(deviceId, repairingOperatorId, picked.name, picked.phone || "");
    setPairingTarget(null);
    setRepairingOperatorId("");
    setOnboardSuccessMsg(`Penanggung Jawab unit ${deviceId} berhasil dialihkan ke ${picked.name}.`);
    setTimeout(() => setOnboardSuccessMsg(""), 5000);
  };

  const handleDeleteDev = async (deviceId: string, devName: string) => {
    if (confirm(`Yakin ingin menonaktifkan dan menghapus ${devName} (${deviceId})?`)) {
      await deleteDevice(deviceId);
      setOnboardSuccessMsg(`Unit ${deviceId} berhasil dinonaktifkan.`);
      setTimeout(() => setOnboardSuccessMsg(""), 5000);
    }
  };

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
            className={`kp-tab ${activeTab === "onboarding" ? "active" : ""}`}
            onClick={() => setActiveTab("onboarding")}
          >
            <Cpu size={16} />
            <span>Onboarding Alat &amp; Operator</span>
            <span className="badge">{devicesList.length} Unit</span>
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

        {onboardSuccessMsg && (
          <div className="kp-ok" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <CheckCircle2 size={18} />
            <span>{onboardSuccessMsg}</span>
          </div>
        )}

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

        {/* TAB 3: ONBOARDING ALAT & OPERATOR (MODULAR MULTI-DEVICE) */}
        {activeTab === "onboarding" && (
          <div>
            {/* Header Callout: Value Proposition & Onboarding CTA */}
            <div
              className="kp-card"
              style={{
                marginBottom: 20,
                background: "linear-gradient(135deg, rgba(34,20,13,0.02), rgba(154,52,18,0.06))",
                border: "1.5px solid rgba(154,52,18,0.22)",
                borderRadius: 20,
                padding: 24,
              }}
            >
              <div className="kp-row" style={{ alignItems: "flex-start", gap: 16 }}>
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      borderRadius: 99,
                      background: "#fae3d9",
                      color: "#a8381b",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      marginBottom: 8,
                    }}
                  >
                    <Cpu size={13} /> Arsitektur Modular Multi-Device · Formika 2026
                  </div>
                  <h2 style={{ margin: "0 0 6px", fontSize: 20, color: "var(--cocoa-dark)" }}>
                    Onboarding Perangkat IoT &amp; Penugasan Operator (PIC)
                  </h2>
                  <p style={{ margin: 0, fontSize: 13.5, color: "var(--cocoa)", lineHeight: 1.5, maxWidth: 760 }}>
                    Skalabilitas mandiri untuk sentra kelompok tani: daftarkan kotak fermentasi atau solar dryer baru, buat akun operator lapangan di blok kebun terkait, dan lakukan pemasangan (*pairing*) tanpa perlu koding ulang.
                  </p>
                </div>
                <button
                  type="button"
                  className="kp-btn"
                  onClick={() => {
                    setOnboardStep(1);
                    setShowOnboardModal(true);
                  }}
                  style={{
                    background: "var(--cocoa-dark)",
                    color: "#fff",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    gap: 8,
                  }}
                >
                  <PlusCircle size={16} /> + Onboarding Alat Baru
                </button>
              </div>

              {/* 3 Langkah Alur Mandiri (Sesuai Skrip Juri) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 14,
                  marginTop: 20,
                  paddingTop: 18,
                  borderTop: "1px dashed #d5cdbf",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "var(--cocoa-dark)",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    1
                  </span>
                  <div>
                    <b style={{ fontSize: 13.5, color: "var(--cocoa-dark)", display: "block" }}>
                      1. Registrasi Aset IoT
                    </b>
                    <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                      Daftarkan ID alat unik (misal <code>FERM-BOX-02</code>) &amp; tipe fungsional kotak kayu / solar dryer.
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "var(--cocoa-dark)",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    2
                  </span>
                  <div>
                    <b style={{ fontSize: 13.5, color: "var(--cocoa-dark)", display: "block" }}>
                      2. Akun Penanggung Jawab
                    </b>
                    <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                      Tunjuk atau daftarkan akun operator lapangan lengkap dengan WhatsApp untuk alert anomali suhu.
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "var(--rust)",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    3
                  </span>
                  <div>
                    <b style={{ fontSize: 13.5, color: "var(--rust)", display: "block" }}>
                      3. Device-Operator Pairing
                    </b>
                    <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                      Kunci akuntabilitas: telemetri sensor &amp; Paspor QR otomatis mengikat nama operator tanpa kompromi.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Daftar Perangkat Terdaftar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: "var(--cocoa-dark)" }}>
                Armada Perangkat Terdaftar ({devicesList.length} Unit)
              </h3>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
                Kelompok Tani Karangan Mandiri · Kutai Timur
              </span>
            </div>

            {devicesList.length === 0 ? (
              <div className="kp-card kp-empty">Belum ada unit IoT yang terdaftar. Klik tombol Onboarding di atas untuk memulai.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                {devicesList.map((dev) => {
                  const isFerm = dev.type === "fermentasi";
                  const statusLabel =
                    dev.status === "aktif"
                      ? "Sedang Digunakan"
                      : dev.status === "idle"
                      ? "Standby / Tersedia"
                      : "Pemeliharaan";
                  const statusClass =
                    dev.status === "aktif" ? "g" : dev.status === "idle" ? "o" : "";

                  const phoneClean = (dev.operatorPhone || "").replace(/\D/g, "");
                  const waNumber = phoneClean.startsWith("0") ? "62" + phoneClean.slice(1) : phoneClean;

                  return (
                    <div
                      key={dev.id}
                      className="kp-card"
                      style={{
                        padding: 20,
                        border: "1px solid var(--line)",
                        borderRadius: 18,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: 16,
                      }}
                    >
                      <div>
                        {/* Card Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                          <div>
                            <span
                              style={{
                                display: "inline-block",
                                fontFamily: "monospace",
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: "#efece4",
                                color: "var(--cocoa-dark)",
                                marginBottom: 4,
                              }}
                            >
                              {dev.id}
                            </span>
                            <h4 style={{ margin: 0, fontSize: 16, color: "var(--cocoa-dark)" }}>
                              {dev.name}
                            </h4>
                          </div>
                          <span className={`kp-chip ${statusClass}`} style={{ fontSize: 11 }}>
                            <span className={`kp-dot ${dev.status === "aktif" ? "on" : ""}`} />
                            {statusLabel}
                          </span>
                        </div>

                        {/* Telemetri Live Mini-Box */}
                        <div
                          style={{
                            marginTop: 14,
                            padding: "10px 14px",
                            borderRadius: 12,
                            background: "var(--paper)",
                            border: "1px solid var(--line)",
                            display: "flex",
                            justifyContent: "space-around",
                            textAlign: "center",
                          }}
                        >
                          {isFerm ? (
                            <>
                              <div>
                                <span style={{ fontSize: 11, color: "var(--muted)", display: "block" }}>Suhu Biji</span>
                                <b style={{ fontSize: 16, color: "var(--rust)" }}>
                                  {dev.terbaru?.suhu_biji ? `${dev.terbaru.suhu_biji.toFixed(1)}°C` : "--"}
                                </b>
                              </div>
                              <div style={{ width: 1, background: "var(--line)" }} />
                              <div>
                                <span style={{ fontSize: 11, color: "var(--muted)", display: "block" }}>Suhu Ruang</span>
                                <b style={{ fontSize: 16, color: "var(--cocoa-dark)" }}>
                                  {dev.terbaru?.suhu_ruang ? `${dev.terbaru.suhu_ruang.toFixed(1)}°C` : "--"}
                                </b>
                              </div>
                              <div style={{ width: 1, background: "var(--line)" }} />
                              <div>
                                <span style={{ fontSize: 11, color: "var(--muted)", display: "block" }}>Kelembapan</span>
                                <b style={{ fontSize: 16, color: "var(--cocoa-dark)" }}>
                                  {dev.terbaru?.kelembapan ? `${dev.terbaru.kelembapan.toFixed(0)}%` : "--"}
                                </b>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <span style={{ fontSize: 11, color: "var(--muted)", display: "block" }}>Suhu Pengering</span>
                                <b style={{ fontSize: 16, color: "var(--rust)" }}>
                                  {dev.terbaru?.suhu_ruang ? `${dev.terbaru.suhu_ruang.toFixed(1)}°C` : "36.5°C"}
                                </b>
                              </div>
                              <div style={{ width: 1, background: "var(--line)" }} />
                              <div>
                                <span style={{ fontSize: 11, color: "var(--muted)", display: "block" }}>Kelembapan RH</span>
                                <b style={{ fontSize: 16, color: "var(--cocoa-dark)" }}>
                                  {dev.terbaru?.kelembapan ? `${dev.terbaru.kelembapan.toFixed(0)}%` : "58%"}
                                </b>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Specs & Location */}
                        <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 3 }}>
                          <div>
                            Tipe: <b style={{ color: "var(--ink)" }}>{isFerm ? "Kotak Fermentasi Kayu Ulin" : "Solar Dryer / Penjemuran"}</b> · Kapasitas: <b style={{ color: "var(--ink)" }}>{dev.kapasitas}</b>
                          </div>
                          <div>
                            Pos: <b style={{ color: "var(--ink)" }}>{dev.lokasi}</b>
                          </div>
                        </div>

                        {/* PIC Operator Pairing Box */}
                        <div
                          style={{
                            marginTop: 14,
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: "rgba(183, 101, 62, 0.05)",
                            border: "1px dashed rgba(183, 101, 62, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                background: "#fae3d9",
                                color: "var(--rust-dark)",
                                display: "grid",
                                placeItems: "center",
                                fontWeight: 700,
                                fontSize: 14,
                                flexShrink: 0,
                              }}
                            >
                              {dev.operatorName.charAt(0)}
                            </div>
                            <div>
                              <span style={{ fontSize: 10.5, textTransform: "uppercase", fontWeight: 700, color: "var(--rust)" }}>
                                PIC Penanggung Jawab
                              </span>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--cocoa-dark)" }}>
                                {dev.operatorName}{" "}
                                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)" }}>
                                  ({dev.operatorId})
                                </span>
                              </div>
                            </div>
                          </div>

                          {dev.operatorPhone && (
                            <a
                              href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(
                                dev.operatorName
                              )},%20ini%20Bu%20Sari%20Pendamping%20KakaoPass%20terkait%20unit%20${encodeURIComponent(
                                dev.name
                              )}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="kp-btn g sm"
                              style={{ padding: "4px 8px", fontSize: 11, textDecoration: "none" }}
                              title="Kirim pesan WhatsApp ke PIC"
                            >
                              <MessageCircle size={12} /> WA
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                        <button
                          type="button"
                          className="kp-btn s sm"
                          onClick={() => {
                            setPairingTarget(dev);
                            setRepairingOperatorId(dev.operatorId || "");
                          }}
                          style={{ flex: 1, justifyContent: "center" }}
                        >
                          <LinkIcon size={13} /> Ganti PIC
                        </button>
                        <button
                          type="button"
                          className="kp-btn s sm"
                          onClick={() => handleDeleteDev(dev.id, dev.name)}
                          style={{ color: "var(--rust)", padding: "6px 10px" }}
                          title="Hapus / Nonaktifkan Unit"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DIREKTORI PETANI */}
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

      {/* MODAL 1: WIZARD ONBOARDING 3-LANGKAH MANDIRI */}
      {showOnboardModal && (
        <div className="kp-modal" onClick={() => setShowOnboardModal(false)}>
          <div
            className="kp-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 540 }}
          >
            {/* Modal Header */}
            <div className="kp-row" style={{ marginBottom: 14 }}>
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: "var(--rust)",
                  }}
                >
                  Onboarding Mandiri
                </span>
                <h2 style={{ margin: "2px 0 0", fontSize: 18, color: "var(--cocoa-dark)" }}>
                  Registrasi Alat &amp; Penugasan PIC
                </h2>
              </div>
              <button
                type="button"
                className="kp-btn s sm"
                onClick={() => setShowOnboardModal(false)}
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="kp-steps">
              <div className={`kp-step ${onboardStep > 1 ? "done" : "cur"}`}>
                <i />
                <span>1. Aset IoT</span>
              </div>
              <div className={`kp-step ${onboardStep === 2 ? "cur" : onboardStep > 2 ? "done" : ""}`}>
                <i />
                <span>2. Akun PIC</span>
              </div>
              <div className={`kp-step ${onboardStep === 3 ? "cur" : ""}`}>
                <i />
                <span>3. Pairing</span>
              </div>
            </div>

            {/* STEP 1: REGISTRASI ASET IOT (HARDWARE) */}
            {onboardStep === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="kp-guide-box">
                  <b>Langkah 1: Registrasi Aset Fisik IoT</b>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>
                    Daftarkan nomor identifikasi unik hardware dan jenis unit pascapanen di lapangan.
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                    ID Perangkat IoT (Hardware ID)
                  </label>
                  <input
                    type="text"
                    value={formDevice.id}
                    onChange={(e) => setFormDevice({ ...formDevice, id: e.target.value.toUpperCase() })}
                    placeholder="Contoh: FERM-BOX-02, SOLAR-DRY-01"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      fontSize: 14,
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                    required
                  />
                  <small style={{ color: "var(--muted)", fontSize: 11 }}>
                    Gunakan ID unik yang akan diprogram ke mikrokontroler ESP32 alat.
                  </small>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                    Nama Unit / Penanda Fisik
                  </label>
                  <input
                    type="text"
                    value={formDevice.name}
                    onChange={(e) => setFormDevice({ ...formDevice, name: e.target.value })}
                    placeholder="Contoh: Kotak Fermentasi Ulin Blok B"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      fontSize: 14,
                    }}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                      Tipe Fungsional
                    </label>
                    <select
                      value={formDevice.type}
                      onChange={(e) => setFormDevice({ ...formDevice, type: e.target.value as DeviceType })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid var(--line)",
                        fontSize: 13,
                        background: "#fff",
                      }}
                    >
                      <option value="fermentasi">Kotak Fermentasi</option>
                      <option value="pengeringan">Solar Dryer / Penjemuran</option>
                      <option value="gudang">Gudang Penyimpanan</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                      Kapasitas Tampung
                    </label>
                    <input
                      type="text"
                      value={formDevice.kapasitas}
                      onChange={(e) => setFormDevice({ ...formDevice, kapasitas: e.target.value })}
                      placeholder="Contoh: 500 kg"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid var(--line)",
                        fontSize: 13,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                    Lokasi / Pos Lapangan
                  </label>
                  <input
                    type="text"
                    value={formDevice.lokasi}
                    onChange={(e) => setFormDevice({ ...formDevice, lokasi: e.target.value })}
                    placeholder="Contoh: Sentra Karangan Mandiri Blok B"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      fontSize: 13,
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    className="kp-btn s"
                    onClick={() => setShowOnboardModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="kp-btn"
                    onClick={() => {
                      if (!formDevice.id.trim() || !formDevice.name.trim()) {
                        alert("Harap isi ID Perangkat dan Nama Unit.");
                        return;
                      }
                      setOnboardStep(2);
                    }}
                  >
                    Lanjut: Akun PIC <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: AKUN PENANGGUNG JAWAB (PIC) */}
            {onboardStep === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="kp-guide-box">
                  <b>Langkah 2: Tunjuk / Buat Akun Operator (PIC)</b>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>
                    Setiap unit fisik wajib memiliki penanggung jawab manusia untuk mengawal protokol SNI dan menerima alert anomali.
                  </p>
                </div>

                {/* Mode Selector */}
                <div className="kp-pills" style={{ marginBottom: 4 }}>
                  <button
                    type="button"
                    className={`kp-pill-btn ${picMode === "existing" ? "active" : ""}`}
                    onClick={() => setPicMode("existing")}
                  >
                    <Users size={14} /> Pilih Petani Terdaftar
                  </button>
                  <button
                    type="button"
                    className={`kp-pill-btn ${picMode === "new" ? "active" : ""}`}
                    onClick={() => setPicMode("new")}
                  >
                    <PlusCircle size={14} /> + Buat Akun Operator Baru
                  </button>
                </div>

                {picMode === "existing" ? (
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                      Pilih Operator dari Direktori
                    </label>
                    <select
                      value={selectedOperatorId}
                      onChange={(e) => setSelectedOperatorId(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1px solid var(--line)",
                        fontSize: 14,
                        background: "#fff",
                      }}
                    >
                      {farmerUsers.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.id}) — {f.phone || "Tanpa No HP"}
                        </option>
                      ))}
                    </select>
                    <small style={{ color: "var(--muted)", fontSize: 11, marginTop: 4, display: "block" }}>
                      Operator ini akan bertindak sebagai PIC utama untuk unit {formDevice.id}.
                    </small>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                          ID Anggota Petani
                        </label>
                        <input
                          type="text"
                          value={formOperator.id}
                          onChange={(e) => setFormOperator({ ...formOperator, id: e.target.value.toUpperCase() })}
                          placeholder="KTIM-026"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid var(--line)",
                            fontSize: 13,
                            fontFamily: "monospace",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={formOperator.name}
                          onChange={(e) => setFormOperator({ ...formOperator, name: e.target.value })}
                          placeholder="Pak Joko"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid var(--line)",
                            fontSize: 13,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                        Kelompok Tani / Afdeling
                      </label>
                      <input
                        type="text"
                        value={formOperator.group}
                        onChange={(e) => setFormOperator({ ...formOperator, group: e.target.value })}
                        placeholder="Kelompok Tani Karangan Mandiri"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1px solid var(--line)",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                          No. WhatsApp (Alert Alerting)
                        </label>
                        <input
                          type="text"
                          value={formOperator.phone}
                          onChange={(e) => setFormOperator({ ...formOperator, phone: e.target.value })}
                          placeholder="081277889900"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid var(--line)",
                            fontSize: 13,
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                          PIN Akses (6 Angka)
                        </label>
                        <input
                          type="password"
                          value={formOperator.pin}
                          onChange={(e) => setFormOperator({ ...formOperator, pin: e.target.value })}
                          placeholder="202603"
                          maxLength={6}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid var(--line)",
                            fontSize: 13,
                            letterSpacing: 2,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    className="kp-btn s"
                    onClick={() => setOnboardStep(1)}
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    className="kp-btn"
                    onClick={() => {
                      if (picMode === "new" && (!formOperator.name.trim() || !formOperator.phone.trim())) {
                        alert("Harap lengkapi nama dan nomor WhatsApp operator baru.");
                        return;
                      }
                      setOnboardStep(3);
                    }}
                  >
                    Lanjut: Konfirmasi Pairing <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DEVICE-OPERATOR PAIRING (KONFIRMASI AKUNTABILITAS) */}
            {onboardStep === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="kp-guide-box">
                  <b>Langkah 3: Konfirmasi Pairing &amp; Otorisasi Mutu</b>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>
                    Sistem akan mengikat unit hardware ke penanggung jawab lapangan terpilih.
                  </p>
                </div>

                {/* Visual Pairing Card */}
                <div
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, rgba(34,20,13,0.03), rgba(154,52,18,0.05))",
                    border: "1.5px solid rgba(154,52,18,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 10.5, textTransform: "uppercase", fontWeight: 700, color: "var(--muted)" }}>
                      Perangkat Fisik IoT
                    </span>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--cocoa-dark)" }}>
                      {formDevice.name}
                    </div>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--rust)" }}>
                      {formDevice.id} · {formDevice.kapasitas}
                    </span>
                  </div>

                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--rust)",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                    title="Hubungan Terkunci (Paired)"
                  >
                    <LinkIcon size={16} />
                  </div>

                  <div style={{ flex: 1, textAlign: "right" }}>
                    <span style={{ fontSize: 10.5, textTransform: "uppercase", fontWeight: 700, color: "var(--muted)" }}>
                      Operator PIC Lapangan
                    </span>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--cocoa-dark)" }}>
                      {picMode === "existing"
                        ? users[selectedOperatorId]?.name || "Pak Budi"
                        : formOperator.name}
                    </div>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>
                      {picMode === "existing"
                        ? users[selectedOperatorId]?.phone || "WhatsApp Aktif"
                        : formOperator.phone}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "#e8f0e4",
                    color: "var(--green-dark)",
                    fontSize: 12.5,
                    lineHeight: 1.45,
                  }}
                >
                  <ShieldCheck size={14} style={{ verticalAlign: -2, marginRight: 4 }} />
                  <b>Jaminan Audit SNI:</b> Setiap telemetri IoT dan sertifikat Paspor QR dari batch di unit ini akan mencantumkan nama operator di atas secara transparan. Mencegah saling lempar tanggung jawab antar petani.
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    className="kp-btn s"
                    onClick={() => setOnboardStep(2)}
                    disabled={isSubmittingOnboard}
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    className="kp-btn rust"
                    onClick={handleCompleteOnboarding}
                    disabled={isSubmittingOnboard}
                    style={{ gap: 6 }}
                  >
                    {isSubmittingOnboard ? "Menyimpan..." : "Aktifkan Pairing Alat ✓"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: GANTI PENANGGUNG JAWAB (RE-PAIRING) */}
      {pairingTarget && (
        <div className="kp-modal" onClick={() => setPairingTarget(null)}>
          <div
            className="kp-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 440 }}
          >
            <div className="kp-row" style={{ marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 17, color: "var(--cocoa-dark)" }}>
                Alihkan PIC Penanggung Jawab
              </h2>
              <button
                type="button"
                className="kp-btn s sm"
                onClick={() => setPairingTarget(null)}
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--muted)" }}>
              Alihkan tanggung jawab unit <b>{pairingTarget.name} ({pairingTarget.id})</b> ke operator lain.
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Pilih Operator Baru
              </label>
              <select
                value={repairingOperatorId}
                onChange={(e) => setRepairingOperatorId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--line)",
                  fontSize: 14,
                  background: "#fff",
                }}
              >
                <option value="">-- Pilih Operator --</option>
                {farmerUsers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.id}) — {f.phone || "Tanpa No HP"}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="kp-btn s"
                onClick={() => setPairingTarget(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="kp-btn rust"
                onClick={() => handleRePair(pairingTarget.id)}
                disabled={!repairingOperatorId}
              >
                Simpan Alih Tanggung Jawab
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
