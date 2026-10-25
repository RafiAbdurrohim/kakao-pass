"use client";

import Image from "next/image";

interface KakaoPassLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function KakaoPassLogo({ size = 22, className = "", style }: KakaoPassLogoProps) {
  return (
    <Image
      src="/images/kakao-pass-logo.png"
      alt="KakaoPass Logo"
      width={Math.round(size * 0.85)}
      height={Math.round(size * 1.15)}
      className={`object-contain ${className}`}
      style={{
        width: "auto",
        height: `${size}px`,
        maxHeight: "100%",
        display: "block",
        ...style,
      }}
      priority
    />
  );
}

export default KakaoPassLogo;
