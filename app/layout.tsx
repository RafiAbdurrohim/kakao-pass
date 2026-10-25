import type { Metadata } from "next";
import "./globals.css";
import "./kp.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kakaopass.web.id"),
  title: {
    default: "KakaoPass — Paspor Digital & Pemantauan Mutu Kakao Indonesia",
    template: "%s · KakaoPass",
  },
  description:
    "Platform digital pemantauan fermentasi IoT realtime, standardisasi uji belah SNI, dan paspor mutu ketertelusuran kakao mandiri. Kelompok Tani Karangan Mandiri, Kutai Timur.",
  keywords: [
    "KakaoPass",
    "kakao pass",
    "kakaopass",
    "kakao-pass",
    "paspor digital kakao",
    "pemantauan fermentasi kakao",
    "monitoring IoT kakao",
    "uji belah kakao SNI",
    "kelompok tani karangan mandiri",
    "kutai timur",
    "hilirisasi kakao",
    "pupuk kompos kulit kakao",
    "formika 2026",
  ],
  authors: [{ name: "Tim KakaoPass", url: "https://www.kakaopass.web.id" }],
  creator: "Tim KakaoPass",
  publisher: "Kelompok Tani Karangan Mandiri",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.kakaopass.web.id",
  },
  openGraph: {
    title: "KakaoPass — Paspor Digital & Pemantauan Mutu Kakao Indonesia",
    description:
      "Buktikan mutu fermentasi, standar uji belah SNI, dan jejak sirkular kakao dalam satu scan QR. Dari kebun Karangan Mandiri Kutai Timur.",
    url: "https://www.kakaopass.web.id",
    siteName: "KakaoPass",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KakaoPass — Paspor Digital & Pemantauan Mutu Kakao",
    description:
      "Sistem pemantauan fermentasi IoT & paspor ketertelusuran mutu kakao terintegrasi SNI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
