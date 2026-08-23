import type { Severity, AlertStatus } from '../../data/mockData';

interface StatusBadgeProps {
  status: Severity | AlertStatus | string;
  size?: 'xs' | 'sm';
}

const CONFIG: Record<string, string> = {
  HIGH: 'bg-sentinel-red/10 text-sentinel-red border border-sentinel-red/25',
  SUSPICIOUS: 'bg-sentinel-orange/10 text-sentinel-orange border border-sentinel-orange/25',
  SAFE: 'bg-sentinel-green/10 text-sentinel-green border border-sentinel-green/25',
  OPEN: 'bg-sentinel-red/10 text-sentinel-red border border-sentinel-red/20',
  INVESTIGATING: 'bg-sentinel-accent/10 text-sentinel-accent border border-sentinel-accent/20',
  RESOLVED: 'bg-slate-700/30 text-slate-400 border border-slate-700/40',
  ACTIVE: 'bg-sentinel-orange/10 text-sentinel-orange border border-sentinel-orange/20',
  PROCESSED: 'bg-slate-700/20 text-slate-500 border border-slate-700/30',
  NEUTRAL: 'bg-slate-700/20 text-slate-400 border border-slate-700/30',
};

export default function StatusBadge({ status, size = 'xs' }: StatusBadgeProps) {
  const cls = CONFIG[status] ?? CONFIG['NEUTRAL'];
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-xs';

  return (
    <span
      className={`inline-flex items-center font-mono ${textSize} px-1.5 py-0.5 rounded-sm tracking-widest uppercase ${cls}`}
    >
      {status}
    </span>
  );
}
