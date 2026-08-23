import { motion } from 'framer-motion';
import { Download, FileText, Shield, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { mockAnalysisResult } from '../../data/mockData';
import StatusBadge from '../ui/StatusBadge';

function generateMockReport(result: typeof mockAnalysisResult): string {
  const lines = [
    '================================================================',
    '  SENTINEL-X THREAT ANALYSIS REPORT',
    '================================================================',
    '',
    `  Analysis ID   : ${result.analysisId}`,
    `  Target        : ${result.target}`,
    `  Risk Score    : ${result.riskScore}/100`,
    `  Classification: ${result.classification}`,
    `  Confidence    : ${result.confidence}%`,
    `  Generated     : ${new Date().toISOString()}`,
    '',
    '----------------------------------------------------------------',
    '  THREAT SUMMARY',
    '----------------------------------------------------------------',
    `  The target "${result.target}" has been classified as HIGH RISK`,
    `  with a confidence score of ${result.confidence}%.`,
    '',
    '  ${result.evidence.length} indicators of compromise were identified during analysis.',
    '',
    '----------------------------------------------------------------',
    '  EVIDENCE INDICATORS',
    '----------------------------------------------------------------',
    ...result.evidence.map((e, i) =>
      [
        `  ${String(i + 1).padStart(2, '0')}. ${e.type}`,
        `      Severity     : ${e.severity}`,
        `      Risk Contrib : +${e.scoreContribution}`,
        `      Description  : ${e.description}`,
        `      Detail       : ${e.detail}`,
        '',
      ].join('\n')
    ),
    '----------------------------------------------------------------',
    '  ANALYSIS TIMELINE',
    '----------------------------------------------------------------',
    ...result.timeline.map((s) => `  ✓ ${s.label}`),
    '',
    '----------------------------------------------------------------',
    '  RECOMMENDED ACTIONS',
    '----------------------------------------------------------------',
    '  1. Block all traffic to/from the identified target domain.',
    '  2. Inspect internal hosts that connected to this target.',
    '  3. Reset credentials for any users who interacted with this URL.',
    '  4. Report domain to abuse@registrar for takedown.',
    '  5. Update firewall rules to prevent re-connection attempts.',
    '',
    '================================================================',
    '  END OF REPORT — SENTINEL-X v1.0.0',
    '================================================================',
  ];
  return lines.join('\n');
}

export default function ReportView() {
  const result = mockAnalysisResult;

  const handleExport = () => {
    const content = generateMockReport(result);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SENTINELX-Report-${result.analysisId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scoreColor = '#ef4444';

  const sections = [
    { icon: <Shield size={14} />, title: 'Risk Score', value: `${result.riskScore}/100`, sub: result.classification, color: scoreColor },
    { icon: <AlertTriangle size={14} />, title: 'Classification', value: result.classification, sub: 'Threat level', color: scoreColor },
    { icon: <FileText size={14} />, title: 'Evidence', value: `${result.evidence.length} indicators`, sub: 'Corroborated', color: '#f97316' },
    { icon: <CheckCircle2 size={14} />, title: 'Confidence', value: `${result.confidence}%`, sub: 'Model accuracy', color: '#22c55e' },
  ];

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="panel p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="label-section mb-1">Threat Summary Report</div>
            <div className="font-mono text-xs text-text-muted">Analysis ID: {result.analysisId} · Target: {result.target}</div>
          </div>
          <motion.button
            onClick={handleExport}
            className="btn-primary flex items-center gap-2"
            whileTap={{ scale: 0.97 }}
            aria-label="Export report as text file"
          >
            <Download size={13} />
            EXPORT REPORT
          </motion.button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sections.map((s) => (
            <div key={s.title} className="bg-bg-surface border border-border-subtle rounded-sm p-3">
              <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>
                {s.icon}
                <span className="label-mono text-[10px]">{s.title}</span>
              </div>
              <div className="font-mono text-base font-semibold text-text-primary">{s.value}</div>
              <div className="font-mono text-[10px] text-text-muted mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detection Summary */}
      <div className="panel p-4">
        <div className="label-section mb-3">Detection Summary</div>
        <p className="font-mono text-xs text-text-secondary leading-relaxed">
          The target <span className="text-text-primary">{result.target}</span> was analyzed and classified as{' '}
          <span style={{ color: scoreColor }}>HIGH RISK</span> with a risk score of{' '}
          <span className="text-text-primary">{result.riskScore}/100</span> and{' '}
          <span className="text-text-primary">{result.confidence}%</span> model confidence.
          Analysis identified {result.evidence.length} corroborating indicators of compromise including credential harvesting infrastructure,
          suspicious URL structure, redirect anomalies, and domain registration anomalies.
        </p>
      </div>

      {/* Timeline */}
      <div className="panel p-4">
        <div className="label-section mb-3">Analysis Timeline</div>
        <div className="flex flex-col gap-2">
          {result.timeline.map((step) => (
            <div key={step.id} className="flex items-start gap-3">
              <CheckCircle2 size={13} className="text-sentinel-green shrink-0 mt-0.5" />
              <div>
                <div className="font-mono text-xs text-text-secondary">{step.label}</div>
                <div className="font-mono text-[10px] text-text-muted">{step.sublabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="panel p-4">
        <div className="label-section mb-3">Indicators of Compromise</div>
        <div className="flex flex-col gap-3">
          {result.evidence.map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-3 bg-bg-surface border border-border-subtle rounded-sm">
              <StatusBadge status={item.severity} />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-text-primary mb-1">{item.type}</div>
                <div className="font-mono text-[10px] text-text-muted leading-relaxed">{item.description}</div>
              </div>
              <span className="font-mono text-sm font-bold text-sentinel-red shrink-0">+{item.scoreContribution}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="panel p-4">
        <div className="label-section mb-3">Recommended Actions</div>
        {[
          'Block all traffic to/from the identified target domain at the network perimeter.',
          'Inspect all internal hosts that established connections to this target.',
          'Reset credentials for any users who interacted with this URL or domain.',
          'Submit domain to registrar abuse team for expedited takedown.',
          'Update IDS/IPS signatures to prevent re-connection attempts.',
          'Conduct threat hunt across environment for related IoCs.',
        ].map((action, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-border-subtle/40 last:border-0">
            <span className="font-mono text-[10px] text-text-muted shrink-0 w-5 tabular-nums pt-0.5">{String(i + 1).padStart(2, '0')}</span>
            <span className="font-mono text-xs text-text-secondary leading-relaxed">{action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
