import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get, set, update, query, orderByKey, startAt, serverTimestamp } from "firebase/database";

const cfg = {
  apiKey: "AIzaSyDl5yXE16No57kRghvFDsOm1g43zyZ7flE",
  authDomain: "kakaopass.firebaseapp.com",
  databaseURL: "https://kakaopass-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kakaopass",
  appId: "1:1006483842091:web:f14a9234d559210a34b66e",
};
export const db = getDatabase(getApps()[0] ?? initializeApp(cfg));

export type Role = "petani" | "admin";
export type User = { id: string; name: string; group: string; role: Role; phone?: string; pin?: string };
export type Status = "fermentasi" | "pengeringan" | "uji_mutu" | "verifikasi" | "revisi" | "selesai";
export type FotoKey = "timbanganKering" | "kadarAir" | "ujiBelah" | "timbanganKompos" | "produkKompos";
export type Photo = { d: string; m: "kamera" | "unggah"; t: number };
export type Verif = { oleh: string; tgl: number };

export type DeviceType = "fermentasi" | "pengeringan" | "gudang";
export type DeviceStatus = "idle" | "aktif" | "maintenance";

export type Device = {
  id: string;
  name: string;
  type: DeviceType;
  lokasi: string;
  kapasitas: string;
  status: DeviceStatus;
  operatorId: string;
  operatorName: string;
  operatorPhone: string;
  currentBatchId?: string;
  registeredAt: number;
  lastPing?: number;
  terbaru?: {
    suhu_biji?: number;
    suhu_ruang?: number;
    kelembapan?: number;
    timestamp?: number;
  };
};

export type Batch = {
  id: string; ownerId: string; ownerName: string; group: string; kode: string;
  varietas: string; kebun: string; tglPanen: string; beratBasah: number; beratKulit: number;
  status: Status; createdAt: number; mulaiFerm: number; selesaiFerm?: number;
  balik?: Record<string, number>;
  kering?: { mulai: number; kadarAir?: number; beratKering?: number; selesai?: number };
  mutu?: { baik: number; ungu: number; slaty: number; jamur: number; kadarAir: number };
  kompos?: { status: "belum" | "diolah" | "menunggu" | "terverifikasi"; mulai?: number; selesai?: number; beratKompos?: number; campuran?: string; kirim?: number; catatan?: string | null; verif?: Verif };
  fotoOk?: Partial<Record<FotoKey, boolean>>;
  sumber?: Partial<Record<"beratKering" | "kadarAir" | "beratKompos", "ocr" | "manual">>;
  kirim?: number; catatan?: string | null; verif?: Verif;
  deviceId?: string;
  deviceName?: string;
  deviceType?: string;
  operatorId?: string;
  operatorName?: string;
  operatorPhone?: string;
};
export type Reading = { t: number; biji?: number; ruang?: number; rh?: number };

export const STATUS_LABEL: Record<Status, string> = {
  fermentasi: "Fermentasi", pengeringan: "Pengeringan", uji_mutu: "Uji mutu", verifikasi: "Menunggu verifikasi", revisi: "Perlu revisi", selesai: "Terverifikasi",
};
export const DAY = 86400000;

export const getUser = (): User | null => {
  try { return JSON.parse(localStorage.getItem("kp_user") || "null"); } catch { return null; }
};
export const setUser = (u: User | null) => {
  if (u) localStorage.setItem("kp_user", JSON.stringify(u)); else localStorage.removeItem("kp_user");
};
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const SEEDS = {
  "KTIM-024": { name: "Pak Budi", group: "Kelompok Tani Karangan Mandiri", phone: "081258202026", pin: "202601", role: "petani" },
  "KTIM-025": { name: "Pak Joko", group: "Kelompok Tani Karangan Mandiri", phone: "081277889900", pin: "202603", role: "petani" },
  "ADM-001": { name: "Bu Sari", group: "Pendamping Lapangan", phone: "081200000001", pin: "202602", role: "admin" },
} as const;

export const DEFAULT_DEVICES: Record<string, Device> = {
  "FERM-BOX-01": {
    id: "FERM-BOX-01",
    name: "Kotak Fermentasi Ulin 01",
    type: "fermentasi",
    lokasi: "Sentra Karangan Mandiri Blok A",
    kapasitas: "500 kg",
    status: "aktif",
    operatorId: "KTIM-024",
    operatorName: "Pak Budi",
    operatorPhone: "081258202026",
    registeredAt: 1729000000000,
    lastPing: Date.now(),
    terbaru: { suhu_biji: 46.8, suhu_ruang: 33.4, kelembapan: 82, timestamp: Date.now() },
  },
  "FERM-BOX-02": {
    id: "FERM-BOX-02",
    name: "Kotak Fermentasi Ulin 02",
    type: "fermentasi",
    lokasi: "Sentra Karangan Mandiri Blok B",
    kapasitas: "500 kg",
    status: "idle",
    operatorId: "KTIM-025",
    operatorName: "Pak Joko",
    operatorPhone: "081277889900",
    registeredAt: 1729500000000,
    lastPing: Date.now(),
    terbaru: { suhu_biji: 29.2, suhu_ruang: 28.5, kelembapan: 74, timestamp: Date.now() },
  },
  "SOLAR-DRY-01": {
    id: "SOLAR-DRY-01",
    name: "Solar Dryer Dome Karangan 01",
    type: "pengeringan",
    lokasi: "Lantai Jemur Terpal UV Blok Utama",
    kapasitas: "1.200 kg",
    status: "idle",
    operatorId: "KTIM-024",
    operatorName: "Pak Budi",
    operatorPhone: "081258202026",
    registeredAt: 1729500000000,
    lastPing: Date.now(),
    terbaru: { suhu_ruang: 38.5, kelembapan: 58, timestamp: Date.now() },
  },
};

export async function seedDevicesIfEmpty(): Promise<void> {
  const snap = await get(ref(db, "web/devices"));
  if (!snap.exists()) {
    for (const [id, dev] of Object.entries(DEFAULT_DEVICES)) {
      await set(ref(db, `web/devices/${id}`), dev);
    }
  }
}

export async function saveDevice(device: Device): Promise<void> {
  await set(ref(db, `web/devices/${device.id}`), device);
}

export async function deleteDevice(deviceId: string): Promise<void> {
  await set(ref(db, `web/devices/${deviceId}`), null);
}

export async function pairDeviceOperator(
  deviceId: string,
  operatorId: string,
  operatorName: string,
  operatorPhone: string
): Promise<void> {
  await update(ref(db, `web/devices/${deviceId}`), {
    operatorId,
    operatorName,
    operatorPhone,
  });
}

export async function registerOperatorUser(user: {
  id: string;
  name: string;
  group: string;
  phone: string;
  pin: string;
  role: Role;
}): Promise<void> {
  await set(ref(db, `web/users/${user.id}`), user);
}

// Login prototipe: tanpa keamanan, hanya mencocokkan ID/nomor HP dan PIN di database.
export async function login(idf: string, pin: string): Promise<User | null> {
  for (const [id, u] of Object.entries(SEEDS)) {
    if (!(await get(ref(db, `web/users/${id}`))).exists()) await set(ref(db, `web/users/${id}`), u);
  }
  const snap = await get(ref(db, "web/users"));
  const q = norm(idf);
  const qd = idf.replace(/\D/g, "");
  const all = (snap.val() || {}) as Record<string, { name: string; group: string; phone?: string; pin: string; role?: Role }>;
  for (const [id, u] of Object.entries(all)) {
    const byId = norm(id) === q;
    const byPhone = !!u.phone && qd.length >= 8 && u.phone.replace(/\D/g, "") === qd;
    if ((byId || byPhone) && u.pin === pin) return { id, name: u.name, group: u.group, role: u.role ?? "petani" };
  }
  return null;
}

export async function savePhoto(batchId: string, key: FotoKey, d: string, m: "kamera" | "unggah") {
  await set(ref(db, `web/photos/${batchId}/${key}`), { d, m, t: serverTimestamp() });
  await update(ref(db, `web/batches/${batchId}/fotoOk`), { [key]: true });
}

export async function loadReadings(from: number, to: number): Promise<Reading[]> {
  const s = await get(query(ref(db, "kakao_pass/riwayat"), orderByKey(), startAt("t" + from)));
  const out: Reading[] = [];
  s.forEach((c) => {
    const v = c.val();
    const t = Number(v.timestamp);
    if (t >= from && t <= to) out.push({ t, biji: v.suhu_biji, ruang: v.suhu_ruang, rh: v.kelembapan });
  });
  return out.sort((a, b) => a.t - b.t);
}

export const fmtDate = (ms?: number) =>
  ms ? new Date(ms).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "-";
export const ago = (ms: number, now = Date.now()) => {
  const m = Math.max(0, Math.round((now - ms) / 60000));
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  if (m < 1440) return `${Math.round(m / 60)} jam lalu`;
  return `${Math.round(m / 1440)} hari lalu`;
};
export const stats = (r: Reading[]) => {
  const v = r.map((x) => x.biji).filter((x): x is number => typeof x === "number");
  if (!v.length) return { max: 0, avg: 0, min: 0 };
  return { max: Math.max(...v), min: Math.min(...v), avg: v.reduce((a, b) => a + b, 0) / v.length };
};
export const downsample = (r: Reading[], n = 90) => {
  if (r.length <= n) return r;
  const step = r.length / n;
  return Array.from({ length: n }, (_, i) => r[Math.floor(i * step)]);
};
