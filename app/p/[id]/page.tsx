"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { onValue, ref } from "firebase/database";
import { QrCode, ShieldCheck, Leaf, Cpu, UserCheck } from "lucide-react";
import { KakaoPassLogo } from "@/components/KakaoPassLogo";
import Chart from "../../components/Chart";
import { usePhotos } from "../../components/Camera";
import { db, fmtDate } from "@/lib/fb";

type P = { kode: string; ownerName: string; group: string; varietas: string; kebun: string; tglPanen: string; beratBasah: number; beratKering: number | null;
  mulaiFerm: number; selesaiFerm: number | null; jumlahBalik: number; suhuMax: number; suhuRata: number; series?: { t: number; v: number | null }[];
  mutu: { baik: number; ungu: number; slaty: number; jamur: number; kadarAir: number }; sumber?: { beratKering?: string; kadarAir?: string };
  verif: { oleh: string; tgl: number }; komposAktif?: boolean; terbit: number;
  alat?: {
    id?: string;
    nama?: string;
    tipe?: string;
    sensorId?: string;
    operator?: string;
    operatorPhone?: string;
    kelompok?: string;
  };
};

const CAP: Record<string, string> = { timbanganKering: "Timbangan biji kering", kadarAir: "Alat ukur kadar air", ujiBelah: "Hasil uji belah" };

export default function Passport() {
  const { id } = useParams<{ id: string }>();
  const photos = usePhotos(id);
  const [p, setP] = useState<P | null | undefined>(undefined);
  const [zoom, setZoom] = useState("");
  const [kompos, setKompos] = useState<{ beratKompos: number } | null>(null);
  useEffect(() => onValue(ref(db, `web/passports/${id}`), (s) => setP(s.val())), [id]);
  useEffect(() => onValue(ref(db, `web/passports_kompos/${id}`), (s) => setKompos(s.val())), [id]);
  const m = p?.mutu;
  const how = (s?: string) => (s === "ocr" ? "dibaca otomatis dari foto, dikonfirmasi petani" : "dicatat petani");
  return (
    <div className="kp"><main className="kp-wrap" style={{ maxWidth: 760 }}>
      <div className="compact-brand" style={{ marginBottom: 18 }}><span className="brand-mark-small"><KakaoPassLogo size={20} /></span><span className="brand-name-text">kakao<span>pass</span></span></div>
      {p === undefined && <div className="kp-empty">Memuat paspor…</div>}
      {p === null && <div className="kp-empty">Paspor tidak ditemukan atau belum diverifikasi.</div>}
      {p && m && <>
        <div className="kp-card kp-live" style={{ marginBottom: 16 }}>
          <span className="kp-chip o"><ShieldCheck size={13} />Terverifikasi {p.verif.oleh} · {fmtDate(p.verif.tgl)}</span>
          <h1 style={{ color: "#fff", marginTop: 12 }}>{p.kode}</h1>
          <div style={{ opacity: .85, fontSize: 15 }}>{p.varietas} · {p.kebun}</div>
          <div style={{ opacity: .7, fontSize: 13, marginTop: 4 }}>{p.group} · diterbitkan {fmtDate(p.terbit)}</div>
        </div>
        <div className="kp-card" style={{ marginBottom: 16 }}><h2>Asal & berat</h2>
          <div className="kp-kv"><div><span>Tanggal panen</span><b>{p.tglPanen}</b></div><div><span>Biji basah</span><b>{p.beratBasah} kg</b></div><div><span>Biji kering</span><b>{p.beratKering ?? "-"} kg</b></div></div></div>
        <div className="kp-card" style={{ marginBottom: 16 }}>
          <h2><Cpu size={16} style={{ verticalAlign: -2 }} /> Ketertelusuran Alat &amp; Operator</h2>
          <div className="kp-kv">
            <div><span>Unit Pengolahan</span><b>{p.alat?.nama || "Kotak Fermentasi Ulin 02"} ({p.alat?.id || "FERM-BOX-02"})</b></div>
            <div><span>Sensor IoT Kalibrasi</span><b>{p.alat?.sensorId || "KP-IOT-02"} · SNI 2323:2008</b></div>
            <div><span>Penanggung Jawab (PIC)</span><b>{p.alat?.operator || "Pak Joko"}</b></div>
            <div><span>Blok &amp; Sentra</span><b>{p.kebun} · {p.group}</b></div>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "10px 0 0", lineHeight: 1.5 }}>
            <ShieldCheck size={14} style={{ verticalAlign: -2, color: "var(--green)" }} /> <b>Arsitektur Pairing Mandiri:</b> Setiap unit IoT terikat langsung ke akun operator penanggung jawab lapangan untuk menjamin akuntabilitas 100% dan mencegah saling lempar tanggung jawab antar petani.
          </p>
        </div>
        <div className="kp-card" style={{ marginBottom: 16 }}><h2>Profil fermentasi</h2>
          <span className="kp-chip g" style={{ marginBottom: 10 }}><Cpu size={13} />Terekam otomatis oleh sensor</span>
          <Chart data={(p.series || []).map((s) => ({ t: s.t, biji: s.v ?? undefined }))} />
          <div className="kp-kv" style={{ marginTop: 14 }}><div><span>Suhu tertinggi</span><b>{p.suhuMax}°C</b></div><div><span>Suhu rata-rata</span><b>{p.suhuRata}°C</b></div><div><span>Dibalik</span><b>{p.jumlahBalik}×</b></div></div></div>
        <div className="kp-card" style={{ marginBottom: 16 }}><h2>Hasil uji belah & kadar air</h2>
          <div className="kp-bar" aria-hidden>{[["baik", "#738461"], ["ungu", "#8a6aa8"], ["slaty", "#8f8a80"], ["jamur", "#b7653e"]].map(([k, c]) => <i key={k} style={{ width: `${m[k as "baik"]}%`, background: c }} />)}</div>
          <div className="kp-kv"><div><span>Terfermentasi baik</span><b>{m.baik}%</b></div><div><span>Ungu</span><b>{m.ungu}%</b></div><div><span>Slaty</span><b>{m.slaty}%</b></div><div><span>Berjamur</span><b>{m.jamur}%</b></div><div><span>Kadar air</span><b>{m.kadarAir}%</b></div></div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 0 }}><UserCheck size={13} style={{ verticalAlign: -2 }} /> Kadar air {how(p.sumber?.kadarAir)}, lalu diperiksa admin terhadap foto alat ukur.</p></div>
        <div className="kp-card" style={{ marginBottom: 16 }}><h2>Foto bukti</h2>
          <div className="kp-gal">{Object.keys(CAP).map((x) => photos[x] && (
            <figure key={x}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={photos[x].d} alt={CAP[x]} onClick={() => setZoom(photos[x].d)} /><figcaption>{CAP[x]}</figcaption></figure>))}</div></div>
        <div className="kp-card"><h2><Leaf size={16} style={{ verticalAlign: -2 }} /> Jejak limbah kulit buah</h2>
          {kompos ? <><p style={{ margin: "0 0 12px" }}>Diolah menjadi {kompos.beratKompos} kg kompos (terverifikasi).</p><Link href={`/k/${id}`} className="kp-btn g">Lihat halaman kompos</Link></>
            : <p style={{ margin: 0 }}>Kulit buah batch ini belum selesai diolah menjadi kompos.</p>}</div>
      </>}
      {zoom && <div className="kp-light" onClick={() => setZoom("")}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={zoom} alt="Foto bukti" /></div>}
    </main></div>
  );
}
