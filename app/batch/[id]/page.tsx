"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { onValue, ref, set, push, update } from "firebase/database";
import { ArrowLeft, RotateCw, CheckCircle2, ExternalLink, Printer, Clock, AlertTriangle, X, ShieldAlert, Info, Sun, Flame, Award, Sparkles } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Chart from "../../components/Chart";
import { PhotoField, usePhotos } from "../../components/Camera";
import { db, getUser, loadReadings, fmtDate, stats, DAY, STATUS_LABEL, type Batch, type Reading, type Status } from "@/lib/fb";

type Live = { suhu_biji?: number; suhu_ruang?: number; kelembapan?: number; timestamp?: number };
const ORDER: Status[] = ["fermentasi", "pengeringan", "uji_mutu", "verifikasi", "selesai"];
const num = (s: string) => (s.trim() === "" ? NaN : Number(s.replace(",", ".")));

export default function BatchPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const photos = usePhotos(id);
  const [b, setB] = useState<Batch | null | undefined>(undefined);
  const [live, setLive] = useState<Live | null>(null);
  const [rd, setRd] = useState<Reading[]>([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [origin, setOrigin] = useState("");
  const [bk, setBk] = useState("");
  const [mt, setMt] = useState({ baik: "", ungu: "", slaty: "", jamur: "", kadarAir: "" });
  const [ocr, setOcr] = useState<{ beratKering?: string; kadarAir?: string; beratKompos?: string }>({});
  const [kp, setKp] = useState("");
  const [camp, setCamp] = useState("Kulit kakao + dekomposer");
  const [showBalikModal, setShowBalikModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [balikNote, setBalikNote] = useState({ warna: "Mulai kecokelatan", aroma: "Asam buah segar (asetat)" });

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace("/login"); return; }
    setOrigin(window.location.origin);
    const a = onValue(ref(db, `web/batches/${id}`), (s) => {
      const v = s.val();
      setB(v && v.ownerId === u.id ? { ...v, id } : null);
    });
    const c = onValue(ref(db, "kakao_pass/terbaru"), (s) => setLive(s.val()));
    return () => { a(); c(); };
  }, [id, router]);

  useEffect(() => { if (b?.kering?.beratKering) setBk((p) => p || String(b.kering?.beratKering)); }, [b?.kering?.beratKering]);

  const refresh = useCallback(async () => {
    if (!b) return;
    try { setRd(await loadReadings(b.mulaiFerm, b.selesaiFerm ?? Date.now())); } catch { /* abaikan */ }
  }, [b?.mulaiFerm, b?.selesaiFerm]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { refresh(); const t = setInterval(refresh, 60000); return () => clearInterval(t); }, [refresh]);

  if (b === undefined) return <div className="kp"><div className="kp-wrap"><div className="kp-empty">Memuat…</div></div></div>;
  if (b === null) return <div className="kp"><div className="kp-wrap"><Link href="/dashboard" className="kp-back"><ArrowLeft size={16} />Dashboard</Link><div className="kp-empty">Batch tidak ditemukan atau bukan milik Anda.</div></div></div>;

  const base = `web/batches/${b.id}`;
  const nowMs = b.selesaiFerm ?? Date.now();
  const hoursElapsed = Math.max(0, Math.floor((nowMs - b.mulaiFerm) / 3600000));
  const day = Math.floor((nowMs - b.mulaiFerm) / DAY) + 1;
  const balik = Object.values(b.balik || {}).sort();
  const lastBalik = balik.length > 0 ? balik[balik.length - 1] : 0;
  const hoursSinceLastBalik = lastBalik ? Math.floor((Date.now() - lastBalik) / 3600000) : 999;
  const isPrematureBalik = (day < 2 && hoursElapsed < 36) || (balik.length > 0 && hoursSinceLastBalik < 20);
  const maxTemp = stats(rd).max;
  const isPrematureFinish = day < 4 || balik.length === 0;
  const cur = ORDER.indexOf(b.status === "revisi" ? "uji_mutu" : b.status);
  const suhuNow = live?.suhu_biji;
  const kompos = b.kompos ?? { status: "belum" as const };
  const ok = b.fotoOk || {};

  const nBaik = num(mt.baik) || 0;
  const nUngu = num(mt.ungu) || 0;
  const nSlaty = num(mt.slaty) || 0;
  const nJamur = num(mt.jamur) || 0;
  const totSampel = nBaik + nUngu + nSlaty + nJamur;
  const kaNum = num(mt.kadarAir);
  const dayKering = b.kering?.mulai ? Math.floor((Date.now() - b.kering.mulai) / DAY) + 1 : 1;

  const gradeEstimate = (() => {
    if (totSampel === 0) return null;
    const pBaik = (nBaik / totSampel) * 100;
    const pSlaty = (nSlaty / totSampel) * 100;
    const pJamur = (nJamur / totSampel) * 100;

    if (pBaik >= 70 && pSlaty <= 3 && pJamur <= 2 && (!kaNum || kaNum <= 7.5)) {
      return {
        title: "Estimasi SNI Mutu I (Super Quality)",
        cls: "kp-grade-g1",
        desc: "Memenuhi standar ekspor & cokelat specialty. Potensi harga jual tertinggi pasar.",
      };
    }
    if (pBaik >= 60 && pSlaty <= 6 && pJamur <= 4 && (!kaNum || kaNum <= 8.5)) {
      return {
        title: "Estimasi SNI Mutu II (Standar Nasional)",
        cls: "kp-grade-g2",
        desc: "Standar mutu industri kakao nasional. Diterima oleh pabrik pengolahan.",
      };
    }
    return {
      title: "Estimasi Sub-Standar (Tingkat Fermentasi Rendah)",
      cls: "kp-grade-sub",
      desc: "Persentase biji slaty/ungu masih dominan. Disarankan perbaiki durasi fermentasi.",
    };
  })();
  const run = async (fn: () => Promise<void>) => { setErr(""); setMsg(""); try { await fn(); } catch { setErr("Gagal menyimpan. Coba lagi."); } };
  const fail = (m: string) => { setErr(m); return false; };

  const alerts: string[] = [];
  if (b.status === "fermentasi") {
    if (day >= 3 && balik.length === 0) alerts.push("Sudah hari ke-3 tetapi belum ada catatan pembalikan. Biasanya biji dibalik sekitar jam ke-48.");
    if (suhuNow !== undefined && suhuNow > 50) alerts.push("Suhu di atas 50°C. Pertimbangkan membalik biji agar tidak terlalu panas.");
    if (day >= 3 && suhuNow !== undefined && suhuNow < 38) alerts.push("Suhu masih rendah setelah 2 hari. Cek isolasi wadah dan jumlah biji.");
    if (day >= 6) alerts.push("Sudah hari ke-6 atau lebih. Cek apakah fermentasi bisa diakhiri.");
  }

  const handleBalikClick = () => {
    if (isPrematureBalik) {
      setShowBalikModal(true);
    } else {
      void executeBalik();
    }
  };

  const executeBalik = () => run(async () => {
    await set(push(ref(db, `${base}/balik`)), Date.now());
    setMsg("Pembalikan biji berhasil dicatat.");
    setShowBalikModal(false);
  });

  const handleFinishClick = () => {
    setShowFinishModal(true);
  };

  const executeFinish = () => run(async () => {
    const now = Date.now();
    await update(ref(db, base), { status: "pengeringan", selesaiFerm: now, kering: { mulai: now } });
    await set(ref(db, "web/device/activeBatchId"), null);
    setShowFinishModal(false);
  });

  const checkKering = () => {
    const v = num(bk);
    if (!(v > 0)) return fail("Isi berat kering (kg).");
    if (v >= b.beratBasah) return fail("Berat kering harus lebih kecil dari berat basah.");
    if (!ok.timbanganKering) return fail("Ambil foto timbangan berat kering dulu.");
    return true;
  };
  const toMutu = () => run(async () => { if (!checkKering()) return; await update(ref(db, base), { status: "uji_mutu", kering: { mulai: b.kering?.mulai ?? Date.now(), beratKering: num(bk), selesai: Date.now() }, "sumber/beratKering": ocr.beratKering === bk ? "ocr" : "manual" }); });

  const send = () => run(async () => {
    if (!checkKering()) return;
    const n = { baik: num(mt.baik), ungu: num(mt.ungu), slaty: num(mt.slaty), jamur: num(mt.jamur) };
    if (Object.values(n).some((v) => !(v >= 0))) return setErr("Isi semua hasil uji belah (boleh 0).");
    const tot = n.baik + n.ungu + n.slaty + n.jamur;
    if (tot <= 0) return setErr("Jumlah biji yang diuji harus lebih dari 0.");
    const ka = num(mt.kadarAir);
    if (!(ka > 0 && ka <= 100)) return setErr("Kadar air harus antara 0–100%.");
    if (!ok.kadarAir) return setErr("Ambil foto alat ukur kadar air (nomor seri dan kode batch terlihat).");
    if (!ok.ujiBelah) return setErr("Ambil foto hasil uji belah.");
    const pct = (v: number) => Math.round((v / tot) * 1000) / 10;
    await update(ref(db, base), {
      status: "verifikasi", kirim: Date.now(), catatan: null,
      mutu: { baik: pct(n.baik), ungu: pct(n.ungu), slaty: pct(n.slaty), jamur: pct(n.jamur), kadarAir: ka },
      kering: { mulai: b.kering?.mulai ?? Date.now(), beratKering: num(bk), selesai: Date.now() },
      "sumber/beratKering": ocr.beratKering === bk ? "ocr" : (b.sumber?.beratKering ?? "manual"),
      "sumber/kadarAir": ocr.kadarAir === mt.kadarAir ? "ocr" : "manual",
    });
    setMsg("Terkirim ke admin untuk diverifikasi.");
  });

  const sendKompos = () => run(async () => {
    const v = num(kp);
    if (!(v > 0)) return setErr("Isi berat kompos jadi (kg).");
    if (!ok.timbanganKompos || !ok.produkKompos) return setErr("Ambil foto timbangan kompos dan foto produk.");
    await update(ref(db, base), { kompos: { ...kompos, status: "menunggu", beratKompos: v, selesai: Date.now(), kirim: Date.now(), catatan: null }, "sumber/beratKompos": ocr.beratKompos === kp ? "ocr" : "manual" });
    setMsg("Kompos terkirim ke admin untuk diverifikasi.");
  });

  const keringForm = (
    <>
      <div className="kp-f"><label>Berat kering (kg)</label><input inputMode="decimal" value={bk} onChange={(e) => setBk(e.target.value)} /></div>
      <PhotoField batchId={b.id} k="timbanganKering" label="Foto timbangan (angka terlihat)" photo={photos.timbanganKering}
        hint="Arahkan angka timbangan ke kotak putus-putus. Sertakan kertas berisi kode batch di dalam frame." onText={(v) => { if (v) { setBk(v); setOcr((o) => ({ ...o, beratKering: v })); } }} />
    </>
  );
  const steps = ORDER.map((s, i) => <div key={s} className={"kp-step" + (i < cur || b.status === "selesai" ? " done" : i === cur ? " cur" : "")}><i />{s === "selesai" ? "Terverifikasi" : s === "verifikasi" ? "Verifikasi" : STATUS_LABEL[s]}</div>);

  return (
    <div className="kp"><main className="kp-wrap">
      <Link href="/dashboard" className="kp-back"><ArrowLeft size={16} />Dashboard</Link>
      <div className="kp-row"><div><h1>{b.kode}</h1><p className="kp-sub" style={{ marginBottom: 0 }}>{b.varietas} · {b.kebun} · panen {b.tglPanen} · {b.beratBasah} kg basah</p></div>
        <span className={"kp-chip " + (b.status === "selesai" ? "g" : b.status === "fermentasi" || b.status === "revisi" ? "r" : "")}>{STATUS_LABEL[b.status]}</span></div>
      <div className="kp-steps">{steps}</div>
      <div style={{ marginTop: -6 }} />
      {err && <div className="kp-err" role="alert">{err}</div>}{msg && <div className="kp-ok">{msg}</div>}
      <div className="kp-grid">
        <section className="kp-card kp-c8">
          <div className="kp-row" style={{ marginBottom: 12 }}><h2 style={{ margin: 0 }}>Profil suhu fermentasi</h2>
            <button className="kp-btn s sm" onClick={refresh}><RotateCw size={14} />Segarkan</button></div>
          <Chart data={rd} />
          <div className="kp-kv" style={{ marginTop: 14 }}>
            <div><span>Hari ke-</span><b>{day}</b></div>
            <div><span>Suhu biji sekarang</span><b>{b.status === "fermentasi" ? (suhuNow?.toFixed(1) ?? "--") : (rd[rd.length - 1]?.biji?.toFixed(1) ?? "--")}°C</b></div>
            <div><span>Suhu tertinggi</span><b>{stats(rd).max ? stats(rd).max.toFixed(1) : "--"}°C</b></div>
            <div><span>Dibalik</span><b>{balik.length}×</b></div>
          </div>
        </section>

        <section className="kp-card kp-c4">
          {b.status === "fermentasi" && <>
            <h2>Fermentasi</h2>
            {alerts.map((a) => <div key={a} className="kp-warn">{a}</div>)}

            <div style={{ background: "#faf8f2", border: "1px solid var(--line)", borderRadius: 14, padding: "10px 12px", marginBottom: 12, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "var(--muted)" }}>Jadwal SOP:</span>
                <b style={{ color: "var(--cocoa-dark)" }}>
                  {day < 2 ? "Jam ke-48 (Pembalikan ke-1)" : day < 4 ? "Jam ke-96 (Pembalikan ke-2)" : "Pematangan (Siap dijemur)"}
                </b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "var(--muted)" }}>Status Pembalikan:</span>
                <span>{balik.length === 0 ? "Belum dibalik" : `Sudah ${balik.length}× dibalik`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Zona Suhu Biji:</span>
                <span style={{ fontWeight: 600, color: suhuNow && suhuNow >= 42 && suhuNow <= 49 ? "var(--green-dark)" : suhuNow && suhuNow > 49 ? "var(--rust)" : "var(--muted)" }}>
                  {suhuNow ? (suhuNow >= 42 && suhuNow <= 49 ? "🟢 Optimal (42–49°C)" : suhuNow > 49 ? "🔴 Terlalu Panas (>50°C)" : "🔵 Rendah (<38°C)") : "Belum terbaca"}
                </span>
              </div>
            </div>

            {rd.length === 0 && (
              <div className="kp-warn" style={{ fontSize: 12, marginBottom: 10 }}>
                <Clock size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
                Menunggu data sensor pertama dari alat IoT di kotak fermentasi.
              </div>
            )}

            <button
              type="button"
              className="kp-btn g"
              style={{ width: "100%", marginBottom: 10 }}
              onClick={handleBalikClick}
            >
              Sudah dibalik (Catat Jam &amp; Kondisi)
            </button>
            {balik.length > 0 && <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 12px" }}>Terakhir dibalik: {fmtDate(balik[balik.length - 1])}</p>}
            <button
              type="button"
              className="kp-btn"
              style={{ width: "100%" }}
              onClick={handleFinishClick}
            >
              Fermentasi selesai (Lanjut Penjemuran)
            </button>
          </>}

          {b.status === "pengeringan" && <>
            <h2>Pengeringan &amp; Penjemuran</h2>
            <div className="kp-guide-box">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Sun size={17} style={{ color: "#d97706" }} />
                <b>Penjemuran Hari ke-{dayKering}</b>
              </div>
              <p style={{ margin: "0 0 6px", fontSize: 13, color: "var(--muted)" }}>
                Dimulai sejak {fmtDate(b.kering?.mulai)}.
              </p>
              <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: "var(--cocoa-dark)", lineHeight: 1.5 }}>
                <li>Tebal hamparan ideal 3–5 cm di atas para-para / lantai jemur.</li>
                <li>Aduk biji setiap 2 jam agar penguapan kadar air merata.</li>
                <li>Target kering SNI: kadar air &le; 7.5% (biji berderik renyah saat diremas).</li>
              </ul>
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: "14px", marginBottom: 12 }}>
              <h3 style={{ margin: "0 0 6px", fontSize: 15, color: "var(--cocoa-dark)" }}>Timbang Hasil Biji Kering</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 12px" }}>
                Jika biji sudah kering optimal, timbang total berat kering dan ambil foto timbangan.
              </p>
              {keringForm}
            </div>

            <button className="kp-btn" style={{ width: "100%" }} onClick={toMutu}>
              Lanjut ke Uji Mutu 100 Butir &rarr;
            </button>
          </>}

          {(b.status === "uji_mutu" || b.status === "revisi") && <>
            <h2>{b.status === "revisi" ? "Perbaiki Data Uji Mutu" : "Uji Mutu (Cut Test 100 Butir)"}</h2>
            {b.status === "revisi" && <div className="kp-warn"><b>Catatan admin:</b> {b.catatan || "-"}</div>}

            <div className="kp-guide-box">
              <b>Standar Uji Belah SNI 2323:2008:</b>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>
                Ambil sampel acak <b>100 butir biji</b>, belah dua membujur dengan pisau. Masukkan jumlah butir per kondisi fisik berikut:
              </p>
            </div>

            <div className="kp-f2">
              {([["baik", "Terfermentasi baik (Cokelat)"], ["ungu", "Ungu (Separuh matang)"], ["slaty", "Slaty (Keabuan/mentah)"], ["jamur", "Berjamur / Cacat"]] as const).map(([k, l]) =>
                <div className="kp-f" key={k}>
                  <label>{l}</label>
                  <input inputMode="numeric" value={mt[k]} onChange={(e) => setMt({ ...mt, [k]: e.target.value })} placeholder="0" />
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10, padding: "8px 12px", background: "#faf8f2", borderRadius: 10 }}>
              <span style={{ color: "var(--muted)" }}>Total Sampel Dihitung:</span>
              <b style={{ color: totSampel === 100 ? "var(--green-dark)" : totSampel > 0 ? "var(--rust)" : "var(--muted)" }}>
                {totSampel} / 100 butir {totSampel === 100 ? "✅ Pas 100 Butir" : totSampel > 100 ? "⚠️ Lebih dari 100" : ""}
              </b>
            </div>

            {gradeEstimate && (
              <div className={`kp-grade-box ${gradeEstimate.cls}`}>
                <div>
                  <b style={{ fontSize: 13 }}>{gradeEstimate.title}</b>
                  <p style={{ margin: "2px 0 0", fontSize: 12, opacity: .9 }}>{gradeEstimate.desc}</p>
                </div>
                <Award size={22} style={{ flexShrink: 0 }} />
              </div>
            )}

            <PhotoField batchId={b.id} k="ujiBelah" label="Foto biji yang dibelah" photo={photos.ujiBelah} hint="Tata biji belah per kategori. Sertakan kertas kode batch di dalam frame." />
            <div className="kp-f"><label>Kadar air (%) — Standar SNI &le; 7.5%</label><input inputMode="decimal" value={mt.kadarAir} onChange={(e) => setMt({ ...mt, kadarAir: e.target.value })} placeholder="Contoh: 7.2" /></div>
            <PhotoField batchId={b.id} k="kadarAir" label="Foto alat ukur kadar air" photo={photos.kadarAir} hint="Layar angka di kotak putus-putus; nomor seri alat dan kertas kode batch ikut terlihat." onText={(v) => { if (v) { setMt((m) => ({ ...m, kadarAir: v })); setOcr((o) => ({ ...o, kadarAir: v })); } }} />
            {b.status === "revisi" && keringForm}
            <button className="kp-btn" style={{ width: "100%" }} onClick={send}>Kirim untuk verifikasi admin</button>
          </>}
          {b.status === "verifikasi" && <><h2>Menunggu verifikasi</h2><div className="kp-warn"><Clock size={14} style={{ verticalAlign: -2 }} /> Dikirim {fmtDate(b.kirim)}. Admin sedang memeriksa data dan foto. QR terbit setelah disetujui.</div></>}
          {b.status === "selesai" && <>
            <h2>Paspor biji</h2>
            <div className="kp-qr"><QRCodeSVG value={`${origin}/p/${b.id}`} size={140} /></div>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>Diverifikasi {b.verif?.oleh} · {fmtDate(b.verif?.tgl)}</p>
            <div className="kp-list">
              <Link href={`/cetak/${b.id}/biji`} className="kp-btn"><Printer size={16} />Cetak stiker QR</Link>
              <Link href={`/p/${b.id}`} target="_blank" className="kp-btn s"><ExternalLink size={16} />Buka paspor</Link></div>
          </>}
        </section>

        <section className="kp-card kp-c12">
          <div className="kp-row"><h2 style={{ margin: 0 }}>Limbah kulit → kompos</h2>
            <span className={"kp-chip " + (kompos.status === "terverifikasi" ? "g" : kompos.status === "belum" ? "" : "r")}>{{ belum: "Belum diolah", diolah: "Sedang diolah", menunggu: "Menunggu verifikasi", terverifikasi: "Terverifikasi" }[kompos.status]}</span></div>
          <p className="kp-sub" style={{ fontSize: 13, margin: "8px 0 14px" }}>Perkiraan kulit buah: {b.beratKulit || 0} kg. Jalur ini terpisah dan tidak menghalangi paspor biji.</p>
          {kompos.status === "belum" && <>
            <div className="kp-f" style={{ maxWidth: 420 }}><label>Bahan campuran</label><input value={camp} onChange={(e) => setCamp(e.target.value)} /></div>
            <button className="kp-btn g" onClick={() => run(async () => { await update(ref(db, base), { kompos: { status: "diolah", mulai: Date.now(), campuran: camp.trim() || "Kulit kakao" } }); })}>Mulai olah jadi kompos</button></>}
          {kompos.status === "diolah" && <div style={{ maxWidth: 480 }}>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Mulai {fmtDate(kompos.mulai)} · {kompos.campuran}</p>
            {kompos.catatan && <div className="kp-warn"><b>Catatan admin:</b> {kompos.catatan}</div>}
            <div className="kp-f"><label>Berat kompos jadi (kg)</label><input inputMode="decimal" value={kp} onChange={(e) => setKp(e.target.value)} /></div>
            <PhotoField batchId={b.id} k="timbanganKompos" label="Foto timbangan kompos" photo={photos.timbanganKompos} hint="Angka timbangan di kotak putus-putus, dengan kertas kode batch di frame." onText={(v) => { if (v) { setKp(v); setOcr((o) => ({ ...o, beratKompos: v })); } }} />
            <PhotoField batchId={b.id} k="produkKompos" label="Foto produk kompos" photo={photos.produkKompos} hint="Foto kompos yang sudah jadi, kode batch terlihat." />
            <button className="kp-btn g" onClick={sendKompos}>Kirim kompos untuk verifikasi</button></div>}
          {kompos.status === "menunggu" && <div className="kp-warn" style={{ margin: 0 }}><Clock size={14} style={{ verticalAlign: -2 }} /> {kompos.beratKompos} kg kompos dikirim {fmtDate(kompos.kirim)}, menunggu admin.</div>}
          {kompos.status === "terverifikasi" && <div className="kp-qr">
            <QRCodeSVG value={`${origin}/k/${b.id}`} size={120} />
            <div><div className="kp-ok" style={{ margin: "0 0 10px" }}><CheckCircle2 size={14} style={{ verticalAlign: -2 }} /> {kompos.beratKompos} kg kompos · diverifikasi {kompos.verif?.oleh}</div>
              <div className="kp-list"><Link href={`/cetak/${b.id}/kompos`} className="kp-btn g"><Printer size={16} />Cetak stiker QR kompos</Link>
                <Link href={`/k/${b.id}`} target="_blank" className="kp-btn s"><ExternalLink size={16} />Buka halaman kompos</Link></div></div></div>}
        </section>
      </div>
    </main>

    {showBalikModal && (
      <div className="kp-modal" onClick={() => setShowBalikModal(false)}>
        <div className="kp-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
          <div className="kp-row" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#fbf0d8", color: "#7a5410", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={18} />
              </div>
              <h2 style={{ margin: 0, fontSize: 17 }}>Validasi SOP Pembalikan</h2>
            </div>
            <button type="button" className="kp-btn s sm" onClick={() => setShowBalikModal(false)} aria-label="Tutup"><X size={16} /></button>
          </div>

          <div className="kp-warn" style={{ marginBottom: 14 }}>
            <b>Peringatan Jadwal SOP:</b>
            <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: 1.45 }}>
              {balik.length === 0
                ? `Fermentasi baru berjalan ${hoursElapsed} jam (Hari ke-${day}). Rekomendasi SNI adalah pembalikan ke-1 pada jam ke-48 agar fase ragi anaerobik bekerja optimal.`
                : `Pembalikan terakhir baru ${hoursSinceLastBalik} jam lalu. Pembalikan berikutnya direkomendasikan berjarak minimal 24 jam (biasanya jam ke-96).`}
            </p>
          </div>

          <div className="kp-kv" style={{ marginBottom: 14 }}>
            <div><span>Suhu biji saat ini</span><b>{suhuNow !== undefined ? `${suhuNow.toFixed(1)}°C` : "--"}</b></div>
            <div><span>Riwayat pembalikan</span><b>{balik.length}×</b></div>
          </div>

          {suhuNow !== undefined && suhuNow > 48 && (
            <div className="kp-ok" style={{ fontSize: 13, marginBottom: 14 }}>
              💡 Suhu massa biji sudah cukup panas (&gt;48°C). Pembalikan awal diperbolehkan untuk aerasi dan pemerataan suhu.
            </div>
          )}

          <div style={{ background: "#faf8f2", border: "1px solid var(--line)", borderRadius: 12, padding: "12px", marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--cocoa)", display: "block", marginBottom: 8, textTransform: "uppercase" }}>
              Pengamatan Fisik Biji Saat Dibalik:
            </span>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>Warna Lapisan Pulp:</span>
                <select
                  value={balikNote.warna}
                  onChange={(e) => setBalikNote({ ...balikNote, warna: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd8cc", fontSize: 13 }}
                >
                  <option>Mulai kecokelatan (Fermentasi aktif)</option>
                  <option>Masih putih berlendir (Awal fermentasi)</option>
                  <option>Cokelat pekat merata (Fermentasi matang)</option>
                </select>
              </div>
              <div style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>Aroma Massa Biji:</span>
                <select
                  value={balikNote.aroma}
                  onChange={(e) => setBalikNote({ ...balikNote, aroma: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd8cc", fontSize: 13 }}
                >
                  <option>Asam buah segar (Asetat - Normal)</option>
                  <option>Alkohol / ragi manis (Fase awal)</option>
                  <option>Aroma khas cokelat fermentasi</option>
                </select>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.4 }}>
            Apakah Anda tetap ingin mencatat pembalikan manual sekarang?
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button type="button" className="kp-btn s" onClick={() => setShowBalikModal(false)}>
              Batal (Ikuti SOP)
            </button>
            <button type="button" className="kp-btn g" onClick={executeBalik}>
              Ya, Catat Balik
            </button>
          </div>
        </div>
      </div>
    )}

    {showFinishModal && (
      <div className="kp-modal" onClick={() => setShowFinishModal(false)}>
        <div className="kp-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
          <div className="kp-row" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: isPrematureFinish ? "#fbf0d8" : "#e3ead9", color: isPrematureFinish ? "#7a5410" : "var(--green-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {isPrematureFinish ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              </div>
              <h2 style={{ margin: 0, fontSize: 17 }}>Konfirmasi Pengakhiran Fermentasi</h2>
            </div>
            <button type="button" className="kp-btn s sm" onClick={() => setShowFinishModal(false)} aria-label="Tutup"><X size={16} /></button>
          </div>

          <div style={{ background: "#faf8f2", border: "1px solid var(--line)", borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--cocoa)", textTransform: "uppercase", letterSpacing: ".04em" }}>Checklist Standar Mutu SNI:</span>
            <div style={{ display: "grid", gap: 8, marginTop: 8, fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Durasi Fermentasi:</span>
                <b style={{ color: day >= 4 ? "var(--green-dark)" : "#b7653e" }}>
                  {day >= 4 ? `✅ Hari ke-${day} (Target ≥4 hari)` : `⚠️ Hari ke-${day} (Target 4–6 hari)`}
                </b>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Catatan Pembalikan:</span>
                <b style={{ color: balik.length >= 1 ? "var(--green-dark)" : "#b7653e" }}>
                  {balik.length >= 1 ? `✅ Sudah dibalik ${balik.length}×` : `⚠️ Belum pernah dibalik`}
                </b>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Suhu Puncak Tercapai:</span>
                <b style={{ color: maxTemp && maxTemp >= 45 ? "var(--green-dark)" : "var(--muted)" }}>
                  {maxTemp && maxTemp >= 45 ? `✅ ${maxTemp.toFixed(1)}°C (Puncak >45°C)` : maxTemp ? `${maxTemp.toFixed(1)}°C` : "--"}
                </b>
              </div>
            </div>
          </div>

          {isPrematureFinish ? (
            <div className="kp-warn" style={{ fontSize: 13, lineHeight: 1.45, marginBottom: 16 }}>
              <b>Perhatian Risiko Mutu:</b> Mengakhiri fermentasi terlalu dini dapat menyebabkan biji <i>slaty</i> (mentah tidak beraroma cokelat) dan kadar asam tinggi, yang menurunkan nilai jual grade kakao.
            </div>
          ) : (
            <div className="kp-ok" style={{ fontSize: 13, lineHeight: 1.45, marginBottom: 16 }}>
              <b>SOP Terpenuhi:</b> Biji siap dipindahkan ke lantai jemur untuk proses pengeringan kadar air.
            </div>
          )}

          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.4 }}>
            Setelah diakhiri, pemantauan sensor pada batch ini akan ditutup dan status beralih ke <b>Tahap Pengeringan</b>.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button type="button" className="kp-btn s" onClick={() => setShowFinishModal(false)}>
              Kembali Pantau
            </button>
            <button type="button" className="kp-btn" onClick={executeFinish}>
              Akhiri &amp; Lanjut
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}
