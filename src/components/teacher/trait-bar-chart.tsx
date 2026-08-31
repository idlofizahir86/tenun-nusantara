"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TraitBarDatum {
  key: string;
  label: string;
  emoji: string;
  value: number;
}

// Grafik batang horizontal sebaran/jumlah per dimensi bakat.
// Dipakai di Sebaran Karakter & Ringkasan (rata-rata skor).
export function TraitBarChart({
  data,
  height = 320,
}: {
  data: TraitBarDatum[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
        <XAxis
          type="number"
          stroke="#8DA2A6"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#1B4450" }}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={130}
          stroke="#E2ECEF"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(label: string) => label}
        />
        <Tooltip
          cursor={{ fill: "#144955" }}
          contentStyle={{
            background: "#0F3943",
            border: "1px solid #FFB319",
            borderRadius: 10,
            fontFamily: "Manrope",
            fontSize: 12,
          }}
          labelStyle={{ color: "#FFB319", fontWeight: 700 }}
          formatter={(value: number | string | Array<number | string>) =>
            [String(value), "siswa"]
          }
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={22}>
          {data.map((d) => (
            <Cell key={d.key} fill="#FFB319" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
