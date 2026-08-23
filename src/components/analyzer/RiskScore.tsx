import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RiskScoreProps {
  score: number;
  classification: string;
  confidence: number;
  analysisId: string;
  target: string;
  animate?: boolean;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getColor(score: number) {
  if (score >= 70) return '#ef4444';
  if (score >= 40) return '#f97316';
  return '#22c55e';
}

function getLabel(score: number) {
  if (score >= 70) return 'HIGH RISK';
  if (score >= 40) return 'SUSPICIOUS';
  return 'SAFE';
}

export default function RiskScore({ score, classification, confidence, analysisId, target, animate = true }: RiskScoreProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : score);
  const color = getColor(score);
  const label = getLabel(score);

  useEffect(() => {
    if (!animate) { setDisplayed(score); return; }
    let frame = 0;
    const duration = 60; // frames ~1.5s
    const timer = setInterval(() => {
      frame++;
      setDisplayed(Math.round(Math.min(score, (score / duration) * frame)));
      if (frame >= duration) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [score, animate]);

  const pct = displayed / 100;
  const dashOffset = CIRCUMFERENCE * (1 - pct);

  return (
    <div className="panel p-5 flex flex-col gap-5">
      {/* Score ring */}
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          {/* Background ring */}
          <svg width="128" height="128" className="rotate-[-90deg]">
            <circle cx="64" cy="64" r={RADIUS} fill="none" stroke="#1e2330" strokeWidth="6" />
            <motion.circle
              cx="64"
              cy="64"
              r={RADIUS}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
              initial={animate ? { strokeDashoffset: CIRCUMFERENCE } : undefined}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-bold leading-none" style={{ color }}>
              {displayed}
            </span>
            <span className="font-mono text-[10px] text-text-muted">/100</span>
          </div>
        </div>

        {/* Classification */}
        <div className="flex flex-col gap-3">
          <div>
            <div className="label-mono mb-1">Risk Score</div>
            <div className="font-mono text-lg font-semibold" style={{ color, textShadow: `0 0 16px ${color}50` }}>
              {label}
            </div>
          </div>
          <div className="h-px bg-border-subtle w-full" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <div className="label-mono text-[9px] mb-0.5">Confidence</div>
              <div className="font-mono text-sm text-text-primary">{confidence}%</div>
            </div>
            <div>
              <div className="label-mono text-[9px] mb-0.5">Analysis ID</div>
              <div className="font-mono text-sm text-sentinel-accent">{analysisId}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Target */}
      <div className="bg-bg-surface border border-border-subtle rounded-sm px-3 py-2">
        <div className="label-mono text-[9px] mb-1">Target</div>
        <div className="font-mono text-xs text-text-primary break-all">{target}</div>
      </div>

      {/* Threat classification */}
      <div>
        <div className="label-mono mb-2">Threat Classification</div>
        <div
          className="border rounded-sm px-3 py-2 font-mono text-sm font-medium tracking-wider"
          style={{ color, borderColor: `${color}30`, backgroundColor: `${color}08` }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
