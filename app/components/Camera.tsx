"use client";
import { useEffect, useRef, useState } from "react";
import { onValue, ref } from "firebase/database";
import { Camera as Cam, X, Loader2, RotateCcw } from "lucide-react";
import { db, savePhoto, type FotoKey, type Photo } from "@/lib/fb";
import { readNumber } from "@/lib/ocr";

type Result = { full: string; crop: string; dark: boolean; blur: boolean; m: "kamera" | "unggah" };

function process(src: CanvasImageSource, w: number, h: number, m: Result["m"]): Result {
  const s = Math.min(1, 1000 / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.round(w * s); c.height = Math.round(h * s);
  c.getContext("2d")!.drawImage(src, 0, 0, c.width, c.height);
  const cw = Math.round(w * 0.62), ch = Math.round(h * 0.34);
  const k = document.createElement("canvas");
  const ks = Math.min(2, 900 / cw);
  k.width = Math.round(cw * ks); k.height = Math.round(ch * ks);
  const kc = k.getContext("2d")!;
  kc.filter = "grayscale(1) contrast(1.5)";
  kc.drawImage(src, Math.round((w - cw) / 2), Math.round((h - ch) / 2), cw, ch, 0, 0, k.width, k.height);
  const q = document.createElement("canvas");
  q.width = 160; q.height = Math.max(3, Math.round((160 * h) / w));
  const qc = q.getContext("2d")!;
  qc.drawImage(src, 0, 0, q.width, q.height);
  const px = qc.getImageData(0, 0, q.width, q.height).data;
  const g: number[] = []; let sum = 0;
  for (let i = 0; i < px.length; i += 4) { const v = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]; g.push(v); sum += v; }
  let lap = 0, n = 0; const W = q.width;
  for (let yy = 1; yy < q.height - 1; yy++) for (let xx = 1; xx < W - 1; xx++) {
    const i = yy * W + xx; const l = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - W] - g[i + W]; lap += l * l; n++;
  }
  return { full: c.toDataURL("image/jpeg", 0.72), crop: k.toDataURL("image/png"), dark: sum / g.length < 45, blur: lap / Math.max(1, n) < 40, m };
}

function CameraModal({ hint, onDone, onClose }: { hint: string; onDone: (r: Result) => void; onClose: () => void }) {
  const vid = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [err, setErr] = useState("");
  const [shot, setShot] = useState<Result | null>(null);

  useEffect(() => {
    let dead = false;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } }).then((s) => {
      if (dead) { s.getTracks().forEach((t) => t.stop()); return; }
      stream.current = s;
      if (vid.current) { vid.current.srcObject = s; void vid.current.play(); }
    }).catch(() => setErr("Kamera tidak bisa dibuka (izin ditolak atau situs belum HTTPS)."));
    return () => { dead = true; stream.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const snap = () => { const v = vid.current; if (!v || !v.videoWidth) return; setShot(process(v, v.videoWidth, v.videoHeight, "kamera")); };
  const file = (f?: File) => {
    if (!f) return;
    const img = new Image();
    img.onload = () => setShot(process(img, img.naturalWidth, img.naturalHeight, "unggah"));
    img.src = URL.createObjectURL(f);
  };

  return (
    <div className="kp-modal" style={{ zIndex: 60 }}><div className="kp-sheet">
      <div className="kp-row" style={{ marginBottom: 12 }}><h2 style={{ margin: 0 }}>Ambil foto</h2>
        <button className="kp-btn s sm" onClick={onClose} aria-label="Tutup"><X size={16} /></button></div>
      {!shot ? <>
        <p className="kp-sub" style={{ fontSize: 13, marginBottom: 10 }}>{hint}</p>
        {!err && <div className="kp-cam"><video ref={vid} playsInline muted /><div className="kp-frame" /></div>}
        {err && <><div className="kp-warn">{err}</div>
          <div className="kp-f"><label>Pilih foto dari perangkat (ditandai “unggah” untuk admin)</label><input type="file" accept="image/*" onChange={(e) => file(e.target.files?.[0])} /></div></>}
        {!err && <button className="kp-btn" style={{ width: "100%", marginTop: 12 }} onClick={snap}><Cam size={18} />Ambil foto</button>}
      </> : <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.full} alt="Hasil foto" style={{ width: "100%", borderRadius: 14 }} />
        {(shot.dark || shot.blur) && <div className="kp-warn" style={{ marginTop: 10 }}>Foto tampak {shot.dark ? "terlalu gelap" : "kurang tajam"}. Sebaiknya ulangi agar angka terbaca jelas.</div>}
        <div className="kp-row" style={{ marginTop: 12 }}>
          <button className="kp-btn s" onClick={() => setShot(null)}><RotateCcw size={16} />Ulangi</button>
          <button className="kp-btn" onClick={() => onDone(shot)}>Pakai foto ini</button></div>
      </>}
    </div></div>
  );
}

export function usePhotos(id: string) {
  const [p, setP] = useState<Record<string, Photo>>({});
  useEffect(() => onValue(ref(db, `web/photos/${id}`), (s) => setP(s.val() || {})), [id]);
  return p;
}

export function PhotoField({ batchId, k, label, hint, photo, onText }: {
  batchId: string; k: FotoKey; label: string; hint: string; photo?: Photo; onText?: (v: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function done(r: Result) {
    setOpen(false); setBusy(true); setNote("");
    try {
      await savePhoto(batchId, k, r.full, r.m);
      if (onText) {
        setNote("Membaca angka dari foto…");
        const v = await readNumber(r.crop);
        onText(v);
        setNote(v ? `Terbaca: ${v}. Periksa kolom di atas dan ubah bila salah.` : "Angka tidak terbaca. Isi manual pada kolom di atas.");
      }
    } catch { setNote("Foto gagal disimpan. Coba lagi."); }
    setBusy(false);
  }

  return (
    <div className="kp-f"><label>{label}</label>
      <div className="kp-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {photo ? <img src={photo.d} alt={label} /> : <div className="kp-ph">Belum ada foto</div>}
        <div><button type="button" className="kp-btn s sm" onClick={() => setOpen(true)} disabled={busy}>
          {busy ? <Loader2 size={14} className="kp-spin" /> : <Cam size={14} />}{photo ? "Ganti foto" : "Ambil foto"}</button>
          {photo && <span className={"kp-chip " + (photo.m === "kamera" ? "g" : "r")} style={{ marginLeft: 8 }}>{photo.m === "kamera" ? "Kamera web" : "Unggah"}</span>}</div>
      </div>
      {note && <small style={{ color: "var(--muted)" }}>{note}</small>}
      {open && <CameraModal hint={hint} onDone={done} onClose={() => setOpen(false)} />}
    </div>
  );
}
