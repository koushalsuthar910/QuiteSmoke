'use client';
import { motion } from 'framer-motion';

interface Props {
  size?: number; stroke?: number; progress: number;
  color?: string; trackColor?: string;
  label?: string; sublabel?: string; animate?: boolean;
}

export function ProgressRing({
  size = 180, stroke = 12, progress,
  color = 'stroke-emerald-500',
  trackColor = 'stroke-emerald-100 dark:stroke-emerald-900/30',
  label, sublabel, animate = true,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (1 - Math.min(100, Math.max(0, progress)) / 100);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" className={trackColor} strokeLinecap="round" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" strokeLinecap="round"
          className={color}
          initial={animate ? { strokeDasharray: c, strokeDashoffset: c } : false}
          animate={{ strokeDasharray: c, strokeDashoffset: dash }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <div className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-white">{label}</div>}
        {sublabel && <div className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">{sublabel}</div>}
      </div>
    </div>
  );
}
