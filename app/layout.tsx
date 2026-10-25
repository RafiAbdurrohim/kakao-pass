import type { Metadata } from "next";
import "./globals.css";
import "./kp.css";

export const metadata: Metadata = {
  title: "KakaoPass — Paspor Digital Kakao Indonesia",
  description:
    "Buktikan mutu fermentasi dan jejak sirkular kakao dalam satu scan QR.",
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
