import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyzerInput from '../components/analyzer/AnalyzerInput';
import RiskScore from '../components/analyzer/RiskScore';
import EvidenceCard from '../components/analyzer/EvidenceCard';
import ThreatTimeline from '../components/analyzer/ThreatTimeline';
import InvestigationGraph from '../components/analyzer/InvestigationGraph';
import { mockAnalysisResult, analysisTimeline } from '../data/mockData';
import type { AnalysisTab } from '../data/mockData';

type State = 'idle' | 'analyzing' | 'done';

const ANALYSIS_DURATION = 3200;

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export default function ThreatAnalyzer() {
  const [state, setState] = useState<State>('idle');
  const [target, setTarget] = useState('');

  const handleAnalyze = (tab: AnalysisTab, value: string) => {
    setTarget(value || 'example-login.com');
    setState('analyzing');
    setTimeout(() => setState('done'), ANALYSIS_DURATION);
  };

  const result = { ...mockAnalysisResult, target: target || mockAnalysisResult.target };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar"
    >
      {/* Header */}
      <div className="shrink-0">
        <div className="label-section mb-1">Threat Analyzer</div>
        <h1 className="font-mono text-lg font-semibold text-text-primary tracking-wide">
          Inspect Suspicious Digital Artifacts
        </h1>
        <p className="font-mono text-xs text-text-muted mt-1">
          Submit a URL, message, IP address, or file for deep threat analysis.
        </p>
      </div>

      {/* Input */}
      <div className="shrink-0">
        <AnalyzerInput onAnalyze={handleAnalyze} isAnalyzing={state === 'analyzing'} />
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {(state === 'analyzing' || state === 'done') && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {/* Top row: Score + Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Risk Score */}
              <div className="md:col-span-1">
                <RiskScore
                  score={state === 'done' ? result.riskScore : 0}
                  classification={result.classification}
                  confidence={result.confidence}
                  analysisId={result.analysisId}
                  target={result.target}
                  animate={state === 'done'}
                />
              </div>

              {/* Timeline */}
              <div className="md:col-span-1">
                <ThreatTimeline steps={analysisTimeline} running={state !== 'idle'} />
              </div>

              {/* Investigation graph (compact) */}
              <div className="md:col-span-1">
                <InvestigationGraph compact={true} />
              </div>
            </div>

            {/* Evidence panel */}
            {state === 'done' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="panel p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="label-section mb-0.5">Why Was This Flagged?</div>
                      <div className="font-mono text-xs text-text-muted">
                        {result.evidence.length} indicators of compromise identified
                      </div>
                    </div>
                    <div className="panel-surface px-3 py-1.5">
                      <span className="font-mono text-xs text-text-muted">Total risk contribution: </span>
                      <span className="font-mono text-sm font-bold text-sentinel-red">
                        +{result.evidence.reduce((s, e) => s + e.scoreContribution, 0)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.evidence.map((item, i) => (
                      <EvidenceCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle empty state */}
      {state === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-12">
          <div className="w-12 h-12 rounded-sm bg-bg-surface border border-border-subtle flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d="M12 2L4 6v6c0 5.1 3.4 9.9 8 11 4.6-1.1 8-5.9 8-11V6L12 2z" stroke="#475569" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <div className="font-mono text-xs text-text-muted">Submit an artifact above to begin analysis</div>
          <div className="font-mono text-[10px] text-text-muted opacity-60">
            Supports URL, message, IP address, and file hash
          </div>
        </div>
      )}
    </motion.div>
  );
}
