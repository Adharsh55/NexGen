import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: ReactNode;
  accentColor?: 'red' | 'orange' | 'green' | 'accent';
}

const accentMap = {
  red: 'text-sentinel-red',
  orange: 'text-sentinel-orange',
  green: 'text-sentinel-green',
  accent: 'text-sentinel-accent',
};

const trendColorMap = {
  red: { up: 'text-sentinel-red', down: 'text-sentinel-green' },
  orange: { up: 'text-sentinel-orange', down: 'text-sentinel-green' },
  green: { up: 'text-sentinel-green', down: 'text-sentinel-red' },
  accent: { up: 'text-sentinel-accent', down: 'text-sentinel-accent' },
};

export default function MetricCard({
  label,
  value,
  trend,
  trendUp,
  icon,
  accentColor = 'accent',
}: MetricCardProps) {
  const accent = accentMap[accentColor];
  const trendColor = trendUp
    ? trendColorMap[accentColor].up
    : trendColorMap[accentColor].down;

  return (
    <motion.div
      className="panel p-4 flex flex-col gap-3 hover:border-border-default transition-all duration-200 cursor-default group"
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-center justify-between">
        <span className="label-mono">{label}</span>
        <span className={`${accent} opacity-60 group-hover:opacity-100 transition-opacity duration-200`}>
          {icon}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className={`font-mono text-2xl font-semibold ${accent} tracking-tight`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trend && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span className="font-mono text-xs">{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
