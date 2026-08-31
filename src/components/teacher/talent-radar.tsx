"use client";

export interface RadarTrait {
  key: string;
  label: string;
  score: number;
  emoji?: string;
}

// Radar chart N-titik (SVG murni, tanpa lib) — profil bakat siswa.
export function TalentRadar({ traits, size = 280 }: { traits: RadarTrait[]; size?: number }) {
  const N = traits.length;
  const cx = 140;
  const cy = 140;
  const R = 105;

  const point = (i: number, r: number) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const dataPts = traits.map((t, i) => point(i, (R * t.score) / 100));
  const dataPoly = dataPts.map((p) => `${p.x},${p.y}`).join(" ");

  const rings = [0.33, 0.66, 1.0].map((f) =>
    traits
      .map((_, i) => {
        const p = point(i, R * f);
        return `${p.x},${p.y}`;
      })
      .join(" ")
  );

  return (
    <svg viewBox="0 0 280 280" style={{ width: size, height: size }}>
      {rings.map((poly, idx) => (
        <polygon
          key={idx}
          points={poly}
          fill="rgba(15,57,67,0.2)"
          stroke="#124B56"
          strokeWidth="1"
          strokeDasharray="4"
        />
      ))}
      {traits.map((_, i) => {
        const p = point(i, R);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#124B56" strokeWidth="1.2" />;
      })}
      <polygon points={dataPoly} fill="rgba(255,179,25,0.25)" stroke="#FFB319" strokeWidth="2.5" />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill="#FFB319" stroke="#fff" strokeWidth="1.5" />
      ))}
      {traits.map((t, i) => {
        const p = point(i, R + 26);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white/80"
            fontSize="10"
            fontWeight="700"
          >
            {t.emoji}
          </text>
        );
      })}
    </svg>
  );
}
