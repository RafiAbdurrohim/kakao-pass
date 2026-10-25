import type { Metadata } from "next";
import "./globals.css";
import "./kp.css";

export const metadata: Metadata = {
  title: "KakaoPass — Paspor Digital Kakao Indonesia",
  description:
    "Buktikan mutu fermentasi dan jejak sirkular kakao dalam satu scan QR.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
