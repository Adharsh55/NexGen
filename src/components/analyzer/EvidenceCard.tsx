import { motion } from 'framer-motion';
import type { EvidenceItem } from '../../data/mockData';
import StatusBadge from '../ui/StatusBadge';

interface EvidenceCardProps {
  item: EvidenceItem;
  index: number;
}

const contributionColor = (score: number) => {
  if (score >= 20) return 'text-sentinel-red';
  if (score >= 12) return 'text-sentinel-orange';
  return 'text-sentinel-yellow';
};

export default function EvidenceCard({ item, index }: EvidenceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-bg-surface border border-border-subtle rounded-sm p-4 hover:border-border-default transition-all duration-150"
    >
      <div className="flex items-start gap-3">
        <span className="font-mono text-xs text-text-muted shrink-0 pt-0.5 w-5 tabular-nums">
          {String(item.id).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={item.severity} />
              <span className="font-mono text-xs font-medium text-text-primary tracking-wide">{item.type}</span>
            </div>
            <div className="shrink-0 text-right">
              <div className="label-mono text-[9px] mb-0.5">Risk contrib.</div>
              <span className={`font-mono text-sm font-bold ${contributionColor(item.scoreContribution)}`}>
                +{item.scoreContribution}
              </span>
            </div>
          </div>
          <p className="font-mono text-xs text-text-secondary leading-relaxed mb-2">{item.description}</p>
          <p className="font-mono text-[10px] text-text-muted leading-relaxed">{item.detail}</p>

          {/* Score bar */}
          <div className="mt-3 flex items-center gap-2">
            <span className="label-mono text-[9px]">Contribution</span>
            <div className="flex-1 h-0.5 bg-bg-panel rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-sentinel-red"
                initial={{ width: 0 }}
                animate={{ width: `${(item.scoreContribution / 30) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              />
            </div>
            <span className="font-mono text-[10px] text-text-muted">{item.scoreContribution}/30</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
