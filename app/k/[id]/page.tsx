"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { onValue, ref } from "firebase/database";
import { QrCode, ShieldCheck, Sprout } from "lucide-react";
import { KakaoPassLogo } from "@/components/KakaoPassLogo";
import { usePhotos } from "../../components/Camera";
import { db, fmtDate, DAY } from "@/lib/fb";

type K = { kode: string; ownerName: string; group: string; kebun: string; beratKulit: number; beratKompos: number; mulai: number | null; selesai: number | null;
  campuran: string; sumber: "ocr" | "manual"; verif: { oleh: string; tgl: number }; terbit: number };

export default function PasporKompos() {
  const { id } = useParams<{ id: string }>();
  const photos = usePhotos(id);
  const [k, setK] = useState<K | null | undefined>(undefined);
  const [zoom, setZoom] = useState("");
  useEffect(() => onValue(ref(db, `web/passports_kompos/${id}`), (s) => setK(s.val())), [id]);
  const hari = k?.mulai && k.selesai ? Math.max(1, Math.round((k.selesai - k.mulai) / DAY)) : null;
  const rasio = k && k.beratKulit > 0 ? Math.round((k.beratKompos / k.beratKulit) * 100) : null;
  return (
    <div className="kp"><main className="kp-wrap" style={{ maxWidth: 760 }}>
      <div className="compact-brand" style={{ marginBottom: 18 }}><span className="brand-mark-small"><KakaoPassLogo size={20} /></span><span className="brand-name-text">kakao<span>pass</span></span></div>
      {k === undefined && <div className="kp-empty">Memuat…</div>}
      {k === null && <div className="kp-empty">Halaman kompos tidak ditemukan.</div>}
      {k && <>
        <div className="kp-card" style={{ marginBottom: 16, background: "linear-gradient(145deg,#596b4c,#3f4f35)", color: "#fff", border: 0 }}>
          <span className="kp-chip o"><ShieldCheck size={13} />Terverifikasi {k.verif.oleh} · {fmtDate(k.verif.tgl)}</span>
          <h1 style={{ color: "#fff", marginTop: 12 }}>Kompos kulit kakao</h1>
          <div style={{ opacity: .85 }}>{k.group} · {k.kebun}</div></div>
        <div className="kp-card" style={{ marginBottom: 16 }}><h2><Sprout size={16} style={{ verticalAlign: -2 }} /> Dari limbah jadi kompos</h2>
          <div className="kp-kv"><div><span>Kulit buah awal</span><b>{k.beratKulit || "-"} kg</b></div><div><span>Kompos jadi</span><b>{k.beratKompos} kg</b></div>
            {rasio !== null && <div><span>Rendemen</span><b>{rasio}%</b></div>}{hari && <div><span>Lama proses</span><b>{hari} hari</b></div>}</div>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>Bahan campuran: {k.campuran}. Berat kompos {k.sumber === "ocr" ? "dibaca otomatis dari foto timbangan dan dikonfirmasi petani" : "dicatat manual oleh petani"}, lalu diperiksa admin. Produk olahan kelompok tani.</p></div>
        <div className="kp-card" style={{ marginBottom: 16 }}><h2>Foto bukti</h2>
          <div className="kp-gal">{(["timbanganKompos", "produkKompos"] as const).map((x) => photos[x] && (
            <figure key={x}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={photos[x].d} alt={x} onClick={() => setZoom(photos[x].d)} /><figcaption>{x === "timbanganKompos" ? "Timbangan kompos" : "Produk kompos"}</figcaption></figure>))}</div></div>
        <div className="kp-card"><h2>Asal kakao</h2><p style={{ margin: "0 0 12px" }}>Kulit buah berasal dari batch kakao <b>{k.kode}</b>.</p>
          <Link href={`/p/${id}`} className="kp-btn s">Lihat paspor biji kakao</Link></div>
      </>}
      {zoom && <div className="kp-light" onClick={() => setZoom("")}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={zoom} alt="Foto bukti" /></div>}
    </main></div>
  );
}
