import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import type { TimelineStep } from '../../data/mockData';

interface ThreatTimelineProps {
  steps: TimelineStep[];
  running: boolean;
}

export default function ThreatTimeline({ steps, running }: ThreatTimelineProps) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!running) {
      setCompletedCount(0);
      return;
    }
    setCompletedCount(0);
    steps.forEach((step) => {
      const timer = setTimeout(() => {
        setCompletedCount((c) => Math.max(c, step.id));
      }, step.duration);
      return () => clearTimeout(timer);
    });
  }, [running, steps]);

  return (
    <div className="panel p-4 h-full">
      <div className="label-section mb-4">Analysis Pipeline</div>
      <div className="flex flex-col gap-0">
        {steps.map((step, i) => {
          const isDone = completedCount >= step.id;
          const isActive = running && completedCount === step.id - 1;

          return (
            <div key={step.id} className="flex gap-3">
              {/* Indicator column */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-sentinel-green/10 border-sentinel-green'
                      : isActive
                      ? 'bg-sentinel-orange/10 border-sentinel-orange'
                      : 'bg-bg-surface border-border-default'
                  }`}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {isDone ? (
                    <Check size={10} className="text-sentinel-green" />
                  ) : isActive ? (
                    <Loader2 size={10} className="text-sentinel-orange animate-spin" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-border-default" />
                  )}
                </motion.div>
                {i < steps.length - 1 && (
                  <div className={`w-px flex-1 my-1 min-h-[16px] ${isDone ? 'bg-sentinel-green/30' : 'bg-border-subtle'}`} />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 flex-1 min-w-0">
                <div className={`font-mono text-xs tracking-wider font-medium ${isDone ? 'text-text-primary' : isActive ? 'text-sentinel-orange' : 'text-text-muted'}`}>
                  {step.label}
                </div>
                {isDone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-[10px] text-text-muted mt-0.5"
                  >
                    {step.sublabel}
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
