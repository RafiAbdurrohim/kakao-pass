# KakaoPass 🍫🌱
> **Sistem Pemantauan Fermentasi Berbasis IoT & Paspor Mutu Digital Kakao**  
> *Inovasi Hilirisasi Kakao Mandiri Berkelanjutan · Kelompok Tani Karangan Mandiri, Kutai Timur*

---

## 📌 Tentang Proyek
**KakaoPass** adalah platform digital komprehensif yang dirancang untuk mendampingi petani kakao lokal dalam:
1. **Monitoring Fermentasi Realtime IoT**: Memantau suhu (*probe* kotak kayu 3 lapis) dan kelembapan secara live untuk mencegah fermentasi gagal (*slaty/purple beans*).
2. **Standardisasi Uji Belah Mutu (SNI 2323:2008)**: Pencatatan rasio biji fermentasi baik, cacat, dan kadar air untuk menentukan grade mutu kakao.
3. **Paspor Mutu Digital (QR Traceability)**: Label ketertelusuran rantai pasok dari kebun hingga pabrik cokelat / off-taker, memverifikasi keaslian dan mutu batch.
4. **Ekonomi Sirkular Limbah Kulit Kakao**: Pencatatan konversi biomassa limbah kulit buah kakao menjadi pupuk kompos organik bersertifikat.
5. **Portal Admin & Pendamping Lapangan (PPL)**: Verifikasi dokumen panen, validasi paspor QR, monitoring petani binaan, dan kontrol sensor lapangan.

---

## 🚀 Fitur Utama
- **Landing Page Interaktif**: Visualisasi bento grid solusi, grafik termal IoT dinamis, kalkulator rasio sirkular, dan simulasi paspor QR.
- **Portal Masuk Dual Persona (1-Klik Demo Juri)**:
  - *Petani* (Pak Budi - Kelompok Tani Karangan Mandiri)
  - *Admin / Verifikator PPL* (Bu Sari - PPL & Admin Mutu)
- **Dashboard Petani**: Input batch baru, pemantauan status fermentasi live, panduan tahapan proses, dan riwayat panen.
- **Dashboard Admin**: Verifikasi antrean panen, monitoring agregat produksi, direktori petani binaan, dan telemetry sensor.
- **Verifikasi Publik Paspor QR (`/p/[id]`)**: Halaman ketertelusuran terbuka untuk pemindai konsumen/industri.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: Vanilla CSS murni dengan sistem variabel tema kakao premium (*DM Sans* & *Manrope*)
- **Animasi**: [Motion](https://motion.dev/) (Framer Motion v14)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database / IoT Telemetry**: [Firebase Realtime Database / Firestore](https://firebase.google.com/)
- **QR Code Engine**: `qrcode.react`

---

## 💻 Cara Menjalankan Lokal

1. **Clone repository**:
   ```bash
   git clone https://github.com/RafiAbdurrohim/kakao-pass.git
   cd kakao-pass
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan development server**:
   ```bash
   npm run dev
   ```

4. Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 📄 Lisensi
Dikembangkan untuk kompetisi **FORMIKA 2026**. Hak Cipta © 2026 Tim KakaoPass.
