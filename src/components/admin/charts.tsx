"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface ChartProps {
  data: Array<{ date: string; revenue: number; orders: number }>;
  height?: number;
}

export function RevenueAreaChart({ data, height = 220 }: ChartProps) {
  const max = Math.max(...data.map((d) => d.revenue));
  const min = Math.min(...data.map((d) => d.revenue));
  const range = max - min || 1;
  const w = 800;
  const h = height;
  const padX = 30;
  const padY = 20;

  const pts = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * (w - padX * 2);
    const y = padY + (1 - (d.revenue - min) / range) * (h - padY * 2);
    return { x, y, d };
  });

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${h - padY} L ${pts[0].x.toFixed(1)} ${h - padY} Z`;

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const v = min + (range * i) / (tickCount - 1);
    const y = padY + (1 - (v - min) / range) * (h - padY * 2);
    return { y, v };
  });

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
      >
        <defs>
          <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#007AFF" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#007AFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rev-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#007AFF" />
            <stop offset="100%" stopColor="#5856D6" />
          </linearGradient>
        </defs>

        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={padX}
              x2={w - padX}
              y1={t.y}
              y2={t.y}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeDasharray="3 4"
            />
            <text
              x={padX - 8}
              y={t.y + 3}
              textAnchor="end"
              fontSize="10"
              fill="currentColor"
              fillOpacity="0.5"
              className="font-mono"
            >
              ${(t.v / 1000).toFixed(1)}k
            </text>
          </g>
        ))}

        <motion.path
          d={areaPath}
          fill="url(#rev-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#rev-line)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {pts.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#fff"
            stroke="#007AFF"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.04 }}
          />
        ))}

        {data.map((d, i) => (
          <text
            key={i}
            x={pts[i].x}
            y={h - 4}
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            fillOpacity="0.5"
            className="font-mono"
          >
            {d.date}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function BarChart({
  data,
  height = 200,
}: {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <div className="w-28 sm:w-36 text-xs text-neutral-600 dark:text-neutral-400 shrink-0">
            {d.label}
          </div>
          <div className="flex-1 h-7 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
              className="h-full rounded-lg flex items-center justify-end px-2 text-[11px] font-semibold text-white"
              style={{ background: d.color ?? "#007AFF" }}
            >
              {d.value.toLocaleString()}
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({
  data,
  size = 200,
}: {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = size / 2;
  const innerR = radius * 0.62;
  const cx = radius;
  const cy = radius;

  const segments = useMemo(() => {
    let cursor = -Math.PI / 2;
    return data.map((d) => {
      const angle = (d.value / total) * Math.PI * 2;
      const start = cursor;
      const end = cursor + angle;
      cursor = end;

      const x1 = cx + Math.cos(start) * radius;
      const y1 = cy + Math.sin(start) * radius;
      const x2 = cx + Math.cos(end) * radius;
      const y2 = cy + Math.sin(end) * radius;
      const x3 = cx + Math.cos(end) * innerR;
      const y3 = cy + Math.sin(end) * innerR;
      const x4 = cx + Math.cos(start) * innerR;
      const y4 = cy + Math.sin(start) * innerR;
      const large = angle > Math.PI ? 1 : 0;

      const dPath = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4}`,
        "Z",
      ].join(" ");

      return { ...d, dPath, percentage: ((d.value / total) * 100).toFixed(1) };
    });
  }, [data, total, cx, cy, radius, innerR]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width={size} height={size} className="shrink-0">
        {segments.map((s, i) => (
          <motion.path
            key={i}
            d={s.dPath}
            fill={s.color}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          />
        ))}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize="22"
          fontWeight="bold"
          fill="currentColor"
        >
          {(total / 1000).toFixed(1)}k
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fontSize="11"
          fill="currentColor"
          fillOpacity="0.6"
        >
          visits
        </text>
      </svg>
      <ul className="flex-1 space-y-2">
        {segments.map((s) => (
          <li
            key={s.label}
            className="flex items-center gap-3 text-sm"
          >
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: s.color }}
            />
            <span className="flex-1 text-neutral-700 dark:text-neutral-300">
              {s.label}
            </span>
            <span className="font-mono font-semibold tabular-nums text-neutral-900 dark:text-white">
              {s.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sparkline({
  values,
  color = "#007AFF",
  height = 32,
  width = 96,
}: {
  values: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  if (!values.length) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const path = values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="block">
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
    </svg>
  );
}