"use client";
import type { Reading } from "@/lib/fb";

export default function Chart({ data }: { data: Reading[] }) {
  const pts = data.filter((d) => d.biji !== undefined || d.ruang !== undefined);
  if (pts.length < 2)
    return <div className="kp-empty">Grafik muncul setelah alat mengirim minimal 2 data pada rentang batch ini.</div>;
  const W = 720, H = 300, pl = 38, pr = 12, pt = 14, pb = 30;
  const t0 = pts[0].t, t1 = pts[pts.length - 1].t;
  const vals = pts.flatMap((d) => [d.biji, d.ruang]).filter((v): v is number => v !== undefined);
  const lo = Math.floor(Math.min(20, ...vals) / 5) * 5;
  const hi = Math.ceil(Math.max(55, ...vals) / 5) * 5;
  const x = (t: number) => pl + ((t - t0) / (t1 - t0 || 1)) * (W - pl - pr);
  const y = (v: number) => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
  const line = (k: "biji" | "ruang") =>
    pts.filter((d) => d[k] !== undefined)
      .map((d, i) => `${i ? "L" : "M"}${x(d.t).toFixed(1)},${y(d[k] as number).toFixed(1)}`).join("");
  const yt: number[] = [];
  for (let v = lo; v <= hi; v += 10) yt.push(v);
  const span = (t1 - t0) / 86400000;
  const xt = Array.from({ length: 5 }, (_, i) => t0 + ((t1 - t0) * i) / 4);
  return (
    <div className="kp-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafik suhu fermentasi">
        <rect x={pl} y={y(50)} width={W - pl - pr} height={y(40) - y(50)} fill="#738461" opacity=".14" />
        <text x={W - pr - 4} y={y(50) + 13} textAnchor="end" fontSize="11" fill="#596b4c">Zona fermentasi 40–50°C</text>
        {yt.map((v) => (
          <g key={v}>
            <line x1={pl} x2={W - pr} y1={y(v)} y2={y(v)} stroke="#eae6dd" />
            <text x={pl - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#77736a">{v}°</text>
          </g>
        ))}
        {xt.map((t, i) => (
          <text key={i} x={x(t)} y={H - 8} textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"} fontSize="11" fill="#77736a">
            {span < 1 ? new Date(t).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : `Hari ${((t - t0) / 86400000).toFixed(1)}`}
          </text>
        ))}
        <path d={line("ruang")} fill="none" stroke="#9a948a" strokeWidth="2" strokeDasharray="5 4" />
        <path d={line("biji")} fill="none" stroke="#b7653e" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <div className="kp-legend">
        <span><i style={{ background: "#b7653e" }} />Suhu massa biji</span>
        <span><i style={{ background: "#9a948a" }} />Suhu ruang</span>
      </div>
    </div>
  );
}
