"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { onValue, ref } from "firebase/database";
import { ArrowLeft, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { db, getUser, fmtDate, type Batch } from "@/lib/fb";

export default function Cetak() {
  const { id, t } = useParams<{ id: string; t: string }>();
  const router = useRouter();
  const [b, setB] = useState<Batch | null | undefined>(undefined);
  const [n, setN] = useState(4);
  const [origin, setOrigin] = useState("");
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace("/login"); return; }
    setOrigin(window.location.origin);
    return onValue(ref(db, `web/batches/${id}`), (s) => {
      const v = s.val();
      setAllowed(!!v && (u.role === "admin" || v.ownerId === u.id));
      setB(v ? { ...v, id } : null);
    });
  }, [id, router]);

  const kompos = t === "kompos";
  const verified = b ? (kompos ? b.kompos?.status === "terverifikasi" : b.status === "selesai") : false;
  const back = getUserBack();
  if (b === undefined) return <div className="kp"><div className="kp-wrap"><div className="kp-empty">Memuat…</div></div></div>;
  if (!b || !allowed || !verified) return <div className="kp"><div className="kp-wrap"><Link href={back} className="kp-back"><ArrowLeft size={16} />Kembali</Link><div className="kp-empty">Stiker hanya bisa dicetak setelah data diverifikasi admin.</div></div></div>;

  const col = kompos ? "#596b4c" : "#995335";
  const url = `${origin}/${kompos ? "k" : "p"}/${b.id}`;
  const v = kompos ? b.kompos?.verif : b.verif;
  return (
    <div className="kp"><main className="kp-wrap">
      <div className="no-print">
        <Link href={back} className="kp-back"><ArrowLeft size={16} />Kembali</Link>
        <h1>Cetak stiker {kompos ? "kompos" : "biji kakao"}</h1>
        <p className="kp-sub">Satu kode untuk satu batch. Cetak di kertas label atau kertas biasa, lalu gunting. Pilih “Simpan sebagai PDF” di dialog cetak bila perlu.</p>
        <div className="kp-row" style={{ marginBottom: 18 }}>
          <div className="kp-f" style={{ margin: 0, width: 160 }}><label>Jumlah stiker</label><input type="number" min={1} max={24} value={n} onChange={(e) => setN(Math.max(1, Math.min(24, Number(e.target.value) || 1)))} /></div>
          <button className="kp-btn" onClick={() => window.print()}><Printer size={18} />Cetak / Simpan PDF</button></div>
      </div>
      <div className="kp-sheetgrid">{Array.from({ length: n }, (_, i) => (
        <div className="kp-sticker" key={i} style={{ borderColor: col }}>
          <div className="qr"><QRCodeSVG value={url} size={118} level="M" /><small style={{ fontSize: "7pt" }}>Scan untuk lihat jejaknya</small></div>
          <div>
            <span className="tag" style={{ background: col }}>{kompos ? "KOMPOS KULIT KAKAO" : "BIJI KAKAO FERMENTASI"}</span>
            <h4>{b.kode}</h4>
            <small>{b.group}</small>
            <small>Berat bersih: <b>{kompos ? b.kompos?.beratKompos : b.kering?.beratKering} kg</b></small>
            <small>{kompos ? "Selesai" : "Panen"}: {kompos ? fmtDate(b.kompos?.selesai) : b.tglPanen}</small>
            <small style={{ color: col, fontWeight: 700, marginTop: "1mm" }}>✓ Terverifikasi {v?.oleh}</small>
            <small style={{ fontSize: "7pt", opacity: .7 }}>kakaopass · Kutai Timur</small>
          </div></div>))}</div>
    </main></div>
  );
}
function getUserBack() { const u = getUser(); return u?.role === "admin" ? "/admin" : "/dashboard"; }
