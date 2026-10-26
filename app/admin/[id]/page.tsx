"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { onValue, ref, set, update } from "firebase/database";
import { ArrowLeft, Check, X } from "lucide-react";
import { usePhotos } from "../../components/Camera";
import { db, getUser, loadReadings, fmtDate, stats, downsample, type Batch, type User, type Photo } from "@/lib/fb";

const NAMA: Record<string, string> = { timbanganKering: "Timbangan berat kering", kadarAir: "Alat ukur kadar air", ujiBelah: "Uji belah", timbanganKompos: "Timbangan kompos", produkKompos: "Produk kompos" };
const SRC = { ocr: "dibaca otomatis (OCR)", manual: "diketik manual" };

export default function Review() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const photos = usePhotos(id);
  const [u, setU] = useState<User | null>(null);
  const [b, setB] = useState<Batch | null | undefined>(undefined);
  const [cat, setCat] = useState({ biji: "", kompos: "" });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [zoom, setZoom] = useState("");
  const [maxT, setMaxT] = useState<number | null>(null);

  useEffect(() => {
    const x = getUser();
    if (!x || x.role !== "admin") { router.replace("/login"); return; }
    setU(x);
    return onValue(ref(db, `web/batches/${id}`), (s) => setB(s.val() ? { ...s.val(), id } : null));
  }, [id, router]);
  useEffect(() => { if (b) loadReadings(b.mulaiFerm, b.selesaiFerm ?? Date.now()).then((r) => setMaxT(r.length ? stats(r).max : null)).catch(() => setMaxT(null)); }, [b?.mulaiFerm, b?.selesaiFerm]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!u || b === undefined) return <div className="kp"><div className="kp-wrap"><div className="kp-empty">Memuat…</div></div></div>;
  if (b === null) return <div className="kp"><div className="kp-wrap"><Link href="/admin" className="kp-back"><ArrowLeft size={16} />Antrean</Link><div className="kp-empty">Batch tidak ditemukan.</div></div></div>;

  const own = b.ownerId === u.id;
  const base = `web/batches/${b.id}`;
  const run = async (fn: () => Promise<void>) => { setErr(""); setMsg(""); try { await fn(); } catch { setErr("Gagal menyimpan. Coba lagi."); } };
  const verif = { oleh: u.name, tgl: Date.now() };

  const approveBiji = () => run(async () => {
    if (own) return setErr("Admin tidak boleh memverifikasi batch miliknya sendiri.");
    const rd = await loadReadings(b.mulaiFerm, b.selesaiFerm ?? Date.now());
    const st = stats(rd);
    await update(ref(db, base), { status: "selesai", verif, catatan: null });
    await set(ref(db, `web/passports/${b.id}`), {
      kode: b.kode, ownerName: b.ownerName, group: b.group, varietas: b.varietas, kebun: b.kebun, tglPanen: b.tglPanen,
      beratBasah: b.beratBasah, beratKering: b.kering?.beratKering ?? null, mulaiFerm: b.mulaiFerm, selesaiFerm: b.selesaiFerm ?? null,
      jumlahBalik: Object.keys(b.balik || {}).length, suhuMax: Math.round(st.max * 10) / 10, suhuRata: Math.round(st.avg * 10) / 10,
      series: downsample(rd).map((r) => ({ t: r.t, v: r.biji ?? null })), mutu: b.mutu, sumber: b.sumber ?? {}, verif, terbit: Date.now(),
      komposAktif: b.kompos?.status === "terverifikasi",
    });
    setMsg("Biji disetujui. QR paspor terbit.");
  });
  const rejectBiji = () => run(async () => {
    if (!cat.biji.trim()) return setErr("Tulis catatan alasan penolakan.");
    await update(ref(db, base), { status: "revisi", catatan: cat.biji.trim() });
    setMsg("Dikembalikan ke petani untuk revisi.");
  });
  const approveKompos = () => run(async () => {
    if (own) return setErr("Admin tidak boleh memverifikasi batch miliknya sendiri.");
    const k = b.kompos!;
    await update(ref(db, base), { "kompos/status": "terverifikasi", "kompos/verif": verif, "kompos/catatan": null });
    await set(ref(db, `web/passports_kompos/${b.id}`), {
      kode: b.kode, ownerName: b.ownerName, group: b.group, kebun: b.kebun, beratKulit: b.beratKulit, beratKompos: k.beratKompos,
      mulai: k.mulai ?? null, selesai: k.selesai ?? null, campuran: k.campuran ?? "Kulit kakao", sumber: b.sumber?.beratKompos ?? "manual", verif, terbit: Date.now(),
    });
    if (b.status === "selesai") await update(ref(db, `web/passports/${b.id}`), { komposAktif: true });
    setMsg("Kompos disetujui. QR kompos terbit.");
  });
  const rejectKompos = () => run(async () => {
    if (!cat.kompos.trim()) return setErr("Tulis catatan alasan penolakan.");
    await update(ref(db, base), { "kompos/status": "diolah", "kompos/catatan": cat.kompos.trim() });
    setMsg("Kompos dikembalikan ke petani.");
  });

  const Gal = ({ keys }: { keys: string[] }) => (
    <div className="kp-gal">{keys.map((k) => { const p: Photo | undefined = photos[k]; return (
      <figure key={k}>{p ? <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.d} alt={NAMA[k]} onClick={() => setZoom(p.d)} /></> : <div className="kp-ph" style={{ width: "100%", height: 110 }}>Tidak ada foto</div>}
        <figcaption>{NAMA[k]}{p && <> · <b>{p.m === "kamera" ? "kamera web" : "unggah"}</b> · {fmtDate(p.t)}</>}</figcaption></figure>); })}</div>
  );

  return (
    <div className="kp"><main className="kp-wrap">
      <Link href="/admin" className="kp-back"><ArrowLeft size={16} />Antrean</Link>
      <h1>{b.kode}</h1><p className="kp-sub">{b.ownerName} · {b.group} · {b.varietas} · {b.kebun}</p>
      {own && <div className="kp-warn">Batch ini milik akun Anda. Verifikasi dinonaktifkan karena konflik kepentingan.</div>}
      {err && <div className="kp-err" role="alert">{err}</div>}{msg && <div className="kp-ok">{msg}</div>}
      <div className="kp-grid">
        <section className="kp-card kp-c6"><h2>Data biji</h2>
          <div className="kp-kv">
            <div><span>Biji basah</span><b>{b.beratBasah} kg</b></div>
            <div><span>Biji kering</span><b>{b.kering?.beratKering ?? "-"} kg</b></div>
            <div><span>Suhu maks sensor</span><b>{maxT ? maxT.toFixed(1) + "°C" : "-"}</b></div>
            <div><span>Dibalik</span><b>{Object.keys(b.balik || {}).length}×</b></div>
            <div><span>Kadar air</span><b>{b.mutu?.kadarAir ?? "-"}%</b></div>
            <div><span>Baik / Ungu / Slaty / Jamur</span><b style={{ fontSize: 14 }}>{b.mutu ? `${b.mutu.baik} / ${b.mutu.ungu} / ${b.mutu.slaty} / ${b.mutu.jamur}%` : "-"}</b></div></div>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Berat kering: {b.sumber?.beratKering ? SRC[b.sumber.beratKering] : "-"} · Kadar air: {b.sumber?.kadarAir ? SRC[b.sumber.kadarAir] : "-"}. Cocokkan angka dengan foto.</p>
          {maxT !== null && maxT < 40 && <div className="kp-warn">Sensor tidak pernah mencatat suhu 40°C atau lebih selama batch ini. Periksa apakah fermentasi benar-benar berjalan.</div>}
          <Gal keys={["timbanganKering", "kadarAir", "ujiBelah"]} />
          {b.status === "verifikasi" && <div style={{ marginTop: 14 }}>
            <div className="kp-f"><label>Catatan (wajib jika menolak)</label><textarea rows={2} value={cat.biji} onChange={(e) => setCat({ ...cat, biji: e.target.value })} /></div>
            <div className="kp-row"><button className="kp-btn s" onClick={rejectBiji}><X size={16} />Tolak</button><button className="kp-btn g" onClick={approveBiji} disabled={own}><Check size={16} />Setujui & terbitkan QR</button></div></div>}
          {b.status === "selesai" && <div className="kp-ok" style={{ marginTop: 12 }}>Terverifikasi {b.verif?.oleh} · {fmtDate(b.verif?.tgl)} · <Link href={`/cetak/${b.id}/biji`}>Cetak stiker</Link></div>}
          {b.status === "revisi" && <div className="kp-warn" style={{ marginTop: 12 }}>Menunggu petani memperbaiki: {b.catatan}</div>}
        </section>
        <section className="kp-card kp-c6"><h2>Data kompos</h2>
          {!b.kompos || b.kompos.status === "belum" ? <div className="kp-empty">Belum ada pengolahan kompos.</div> : <>
            <div className="kp-kv"><div><span>Kulit awal</span><b>{b.beratKulit || 0} kg</b></div><div><span>Kompos jadi</span><b>{b.kompos.beratKompos ?? "-"} kg</b></div><div><span>Campuran</span><b style={{ fontSize: 14 }}>{b.kompos.campuran}</b></div></div>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Berat kompos: {b.sumber?.beratKompos ? SRC[b.sumber.beratKompos] : (b.kompos?.beratKompos ? "diketik manual" : "-")}</p>
            <Gal keys={["timbanganKompos", "produkKompos"]} />
            {b.kompos.status === "menunggu" && <div style={{ marginTop: 14 }}>
              <div className="kp-f"><label>Catatan (wajib jika menolak)</label><textarea rows={2} value={cat.kompos} onChange={(e) => setCat({ ...cat, kompos: e.target.value })} /></div>
              <div className="kp-row"><button className="kp-btn s" onClick={rejectKompos}><X size={16} />Tolak</button><button className="kp-btn g" onClick={approveKompos} disabled={own}><Check size={16} />Setujui & terbitkan QR</button></div></div>}
            {b.kompos.status === "terverifikasi" && <div className="kp-ok" style={{ marginTop: 12 }}>Terverifikasi {b.kompos.verif?.oleh} · <Link href={`/cetak/${b.id}/kompos`}>Cetak stiker</Link></div>}
            {b.kompos.status === "diolah" && b.kompos.catatan && (
              <div className="kp-warn" style={{ marginTop: 12 }}>
                <b>Menunggu petani memperbaiki kompos:</b> {b.kompos.catatan}
              </div>
            )}
          </>}
        </section>
      </div>
      {zoom && <div className="kp-light" onClick={() => setZoom("")}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={zoom} alt="Foto bukti" /></div>}
    </main></div>
  );
}
