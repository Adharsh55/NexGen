// ============================================================
// SENTINEL-X — Mock Data Layer
// All data is local and realistic. No real API calls.
// ============================================================

export type Severity = 'HIGH' | 'SUSPICIOUS' | 'SAFE';
export type AlertStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
export type AnalysisTab = 'URL' | 'MESSAGE' | 'IP' | 'FILE';

// ─── Threat Events (Live Feed) ───────────────────────────────
export interface ThreatEvent {
  id: string;
  timestamp: string;
  severity: Severity;
  event: string;
  target: string;
  status: 'ACTIVE' | 'PROCESSED';
  category: string;
}

export const threatEvents: ThreatEvent[] = [
  {
    id: 'te-001',
    timestamp: '10:42:31',
    severity: 'HIGH',
    event: 'Credential harvesting pattern detected',
    target: 'login-secure-verify.com',
    status: 'ACTIVE',
    category: 'Credential Attack',
  },
  {
    id: 'te-002',
    timestamp: '10:41:18',
    severity: 'SUSPICIOUS',
    event: 'Unusual redirect chain identified',
    target: '203.0.113.47',
    status: 'ACTIVE',
    category: 'Suspicious IP',
  },
  {
    id: 'te-003',
    timestamp: '10:39:44',
    severity: 'SAFE',
    event: 'Domain reputation check completed',
    target: 'github.com',
    status: 'PROCESSED',
    category: 'Other',
  },
  {
    id: 'te-004',
    timestamp: '10:37:22',
    severity: 'HIGH',
    event: 'Malicious payload signature detected',
    target: 'payload-cdn.ru',
    status: 'ACTIVE',
    category: 'Malware',
  },
  {
    id: 'te-005',
    timestamp: '10:35:10',
    severity: 'SUSPICIOUS',
    event: 'Encoded parameter obfuscation in URL',
    target: 'bank-update-form.net',
    status: 'ACTIVE',
    category: 'Phishing',
  },
  {
    id: 'te-006',
    timestamp: '10:33:58',
    severity: 'HIGH',
    event: 'Known phishing domain fingerprint matched',
    target: 'secure-paypa1-login.com',
    status: 'PROCESSED',
    category: 'Phishing',
  },
  {
    id: 'te-007',
    timestamp: '10:31:02',
    severity: 'SAFE',
    event: 'Certificate validation passed',
    target: 'cloudflare.com',
    status: 'PROCESSED',
    category: 'Other',
  },
  {
    id: 'te-008',
    timestamp: '10:29:44',
    severity: 'SUSPICIOUS',
    event: 'Low domain age with high traffic volume',
    target: 'flash-deals-today.xyz',
    status: 'ACTIVE',
    category: 'Malicious URL',
  },
  {
    id: 'te-009',
    timestamp: '10:28:11',
    severity: 'HIGH',
    event: 'Trojan dropper behavior pattern detected',
    target: 'installer-update.exe',
    status: 'ACTIVE',
    category: 'Malware',
  },
  {
    id: 'te-010',
    timestamp: '10:26:33',
    severity: 'SUSPICIOUS',
    event: 'Irregular SSL certificate issuer',
    target: '198.51.100.22',
    status: 'PROCESSED',
    category: 'Suspicious IP',
  },
];

// ─── Chart Data (24h Threat Activity) ───────────────────────
export interface ThreatChartPoint {
  hour: string;
  high: number;
  suspicious: number;
  safe: number;
}

export const threatChartData: ThreatChartPoint[] = [
  { hour: '00:00', high: 2, suspicious: 8, safe: 34 },
  { hour: '01:00', high: 1, suspicious: 5, safe: 28 },
  { hour: '02:00', high: 0, suspicious: 3, safe: 22 },
  { hour: '03:00', high: 1, suspicious: 4, safe: 19 },
  { hour: '04:00', high: 3, suspicious: 7, safe: 31 },
  { hour: '05:00', high: 2, suspicious: 6, safe: 38 },
  { hour: '06:00', high: 4, suspicious: 12, safe: 52 },
  { hour: '07:00', high: 6, suspicious: 18, safe: 67 },
  { hour: '08:00', high: 8, suspicious: 22, safe: 89 },
  { hour: '09:00', high: 12, suspicious: 31, safe: 112 },
  { hour: '10:00', high: 15, suspicious: 28, safe: 98 },
  { hour: '11:00', high: 9, suspicious: 24, safe: 104 },
  { hour: '12:00', high: 11, suspicious: 19, safe: 87 },
  { hour: '13:00', high: 7, suspicious: 15, safe: 93 },
  { hour: '14:00', high: 13, suspicious: 26, safe: 78 },
  { hour: '15:00', high: 10, suspicious: 21, safe: 82 },
  { hour: '16:00', high: 14, suspicious: 33, safe: 71 },
  { hour: '17:00', high: 18, suspicious: 29, safe: 65 },
  { hour: '18:00', high: 16, suspicious: 25, safe: 74 },
  { hour: '19:00', high: 22, suspicious: 38, safe: 58 },
  { hour: '20:00', high: 19, suspicious: 42, safe: 61 },
  { hour: '21:00', high: 17, suspicious: 35, safe: 69 },
  { hour: '22:00', high: 21, suspicious: 31, safe: 55 },
  { hour: '23:00', high: 14, suspicious: 22, safe: 72 },
];

// ─── Threat Distribution ─────────────────────────────────────
export interface DistributionItem {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export const threatDistribution: DistributionItem[] = [
  { category: 'Phishing', count: 412, percentage: 32.1, color: '#ef4444' },
  { category: 'Malicious URL', count: 298, percentage: 23.2, color: '#f97316' },
  { category: 'Suspicious IP', count: 201, percentage: 15.7, color: '#eab308' },
  { category: 'Credential Attack', count: 178, percentage: 13.9, color: '#ef4444' },
  { category: 'Malware', count: 132, percentage: 10.3, color: '#dc2626' },
  { category: 'Other', count: 63, percentage: 4.9, color: '#475569' },
];

// ─── Alerts ──────────────────────────────────────────────────
export interface Alert {
  id: string;
  severity: Severity;
  target: string;
  detection: string;
  timeAgo: string;
  timestamp: string;
  status: AlertStatus;
  riskScore: number;
  analyst: string;
}

export const alerts: Alert[] = [
  {
    id: 'ALT-4821',
    severity: 'HIGH',
    target: 'login-example.com',
    detection: 'Credential harvesting pattern',
    timeAgo: '2 min ago',
    timestamp: '10:40:22',
    status: 'OPEN',
    riskScore: 87,
    analyst: 'Unassigned',
  },
  {
    id: 'ALT-4820',
    severity: 'SUSPICIOUS',
    target: '192.168.1.23',
    detection: 'Unusual outbound traffic volume',
    timeAgo: '8 min ago',
    timestamp: '10:34:11',
    status: 'INVESTIGATING',
    riskScore: 62,
    analyst: 'J. Martinez',
  },
  {
    id: 'ALT-4819',
    severity: 'HIGH',
    target: 'payload-example.ru',
    detection: 'Malware signature match — Trojan.Agent',
    timeAgo: '12 min ago',
    timestamp: '10:30:05',
    status: 'OPEN',
    riskScore: 94,
    analyst: 'Unassigned',
  },
  {
    id: 'ALT-4818',
    severity: 'SUSPICIOUS',
    target: '203.0.113.88',
    detection: 'Port scan from flagged IP range',
    timeAgo: '18 min ago',
    timestamp: '10:24:33',
    status: 'INVESTIGATING',
    riskScore: 58,
    analyst: 'A. Chen',
  },
  {
    id: 'ALT-4817',
    severity: 'HIGH',
    target: 'update-service.xyz',
    detection: 'Fake software update distribution',
    timeAgo: '25 min ago',
    timestamp: '10:17:04',
    status: 'OPEN',
    riskScore: 91,
    analyst: 'Unassigned',
  },
  {
    id: 'ALT-4816',
    severity: 'SUSPICIOUS',
    target: 'cdn-assets.ru',
    detection: 'JavaScript obfuscation detected',
    timeAgo: '31 min ago',
    timestamp: '10:11:22',
    status: 'INVESTIGATING',
    riskScore: 67,
    analyst: 'R. Okafor',
  },
  {
    id: 'ALT-4815',
    severity: 'HIGH',
    target: 'verify-account-now.net',
    detection: 'Domain typosquatting — financial institution',
    timeAgo: '44 min ago',
    timestamp: '09:58:14',
    status: 'RESOLVED',
    riskScore: 89,
    analyst: 'J. Martinez',
  },
  {
    id: 'ALT-4814',
    severity: 'SUSPICIOUS',
    target: '10.0.2.45',
    detection: 'Internal host beaconing to external IP',
    timeAgo: '1 hr ago',
    timestamp: '09:43:07',
    status: 'RESOLVED',
    riskScore: 55,
    analyst: 'A. Chen',
  },
  {
    id: 'ALT-4813',
    severity: 'HIGH',
    target: 'invoice-2024.zip',
    detection: 'Macro-enabled document with obfuscated VBA',
    timeAgo: '1.5 hr ago',
    timestamp: '09:12:44',
    status: 'RESOLVED',
    riskScore: 96,
    analyst: 'R. Okafor',
  },
  {
    id: 'ALT-4812',
    severity: 'SUSPICIOUS',
    target: '185.220.101.33',
    detection: 'Tor exit node connection attempt',
    timeAgo: '2 hr ago',
    timestamp: '08:41:29',
    status: 'RESOLVED',
    riskScore: 72,
    analyst: 'J. Martinez',
  },
];

// ─── Activity Records ─────────────────────────────────────────
export interface ActivityRecord {
  id: string;
  timestamp: string;
  analyst: string;
  target: string;
  type: string;
  risk: number;
  severity: Severity;
  result: string;
  action: string;
}

export const activityRecords: ActivityRecord[] = [
  {
    id: 'ACT-1091',
    timestamp: '10:42:31',
    analyst: 'System',
    target: 'login-secure-verify.com',
    type: 'URL Analysis',
    risk: 87,
    severity: 'HIGH',
    result: 'Credential harvesting confirmed',
    action: 'Alert Created',
  },
  {
    id: 'ACT-1090',
    timestamp: '10:40:12',
    analyst: 'J. Martinez',
    target: 'ALT-4820',
    type: 'Alert Review',
    risk: 62,
    severity: 'SUSPICIOUS',
    result: 'Marked for investigation',
    action: 'Status Updated',
  },
  {
    id: 'ACT-1089',
    timestamp: '10:38:55',
    analyst: 'System',
    target: 'payload-example.ru',
    type: 'URL Analysis',
    risk: 94,
    severity: 'HIGH',
    result: 'Malware signature detected',
    action: 'Alert Created',
  },
  {
    id: 'ACT-1088',
    timestamp: '10:35:20',
    analyst: 'A. Chen',
    target: '203.0.113.88',
    type: 'IP Analysis',
    risk: 58,
    severity: 'SUSPICIOUS',
    result: 'Flagged IP range confirmed',
    action: 'Investigating',
  },
  {
    id: 'ACT-1087',
    timestamp: '10:31:44',
    analyst: 'System',
    target: 'github.com',
    type: 'URL Analysis',
    risk: 4,
    severity: 'SAFE',
    result: 'Domain reputation clean',
    action: 'Logged',
  },
  {
    id: 'ACT-1086',
    timestamp: '10:28:11',
    analyst: 'R. Okafor',
    target: 'ALT-4815',
    type: 'Alert Review',
    risk: 89,
    severity: 'HIGH',
    result: 'Confirmed phishing site, blocked',
    action: 'Resolved',
  },
  {
    id: 'ACT-1085',
    timestamp: '10:22:09',
    analyst: 'System',
    target: 'update-service.xyz',
    type: 'URL Analysis',
    risk: 91,
    severity: 'HIGH',
    result: 'Fake update distribution confirmed',
    action: 'Alert Created',
  },
  {
    id: 'ACT-1084',
    timestamp: '10:18:37',
    analyst: 'J. Martinez',
    target: '192.168.1.23',
    type: 'IP Analysis',
    risk: 62,
    severity: 'SUSPICIOUS',
    result: 'Traffic pattern anomaly under review',
    action: 'Investigating',
  },
  {
    id: 'ACT-1083',
    timestamp: '10:14:02',
    analyst: 'System',
    target: 'invoice-2024.zip',
    type: 'File Analysis',
    risk: 96,
    severity: 'HIGH',
    result: 'Malicious macro payload extracted',
    action: 'Alert Created',
  },
  {
    id: 'ACT-1082',
    timestamp: '10:09:55',
    analyst: 'A. Chen',
    target: 'ALT-4814',
    type: 'Alert Review',
    risk: 55,
    severity: 'SUSPICIOUS',
    result: 'Beaconing traffic blocked',
    action: 'Resolved',
  },
  {
    id: 'ACT-1081',
    timestamp: '10:05:11',
    analyst: 'System',
    target: '185.220.101.33',
    type: 'IP Analysis',
    risk: 72,
    severity: 'SUSPICIOUS',
    result: 'Tor exit node identified',
    action: 'Flagged',
  },
  {
    id: 'ACT-1080',
    timestamp: '09:58:44',
    analyst: 'R. Okafor',
    target: 'cdn-assets.ru',
    type: 'URL Analysis',
    risk: 67,
    severity: 'SUSPICIOUS',
    result: 'Obfuscated JS confirmed, sandboxed',
    action: 'Investigating',
  },
];

// ─── Evidence Items ───────────────────────────────────────────
export interface EvidenceItem {
  id: number;
  type: string;
  description: string;
  detail: string;
  severity: Severity;
  scoreContribution: number;
}

export const defaultEvidenceItems: EvidenceItem[] = [
  {
    id: 1,
    type: 'SUSPICIOUS URL STRUCTURE',
    description: 'Unusual encoded parameters detected in URL path.',
    detail: 'URL contains base64-encoded redirect chains and obfuscated query parameters typical of credential harvesting infrastructure.',
    severity: 'SUSPICIOUS',
    scoreContribution: 18,
  },
  {
    id: 2,
    type: 'CREDENTIAL HARVESTING',
    description: 'Login-related phishing indicators present.',
    detail: 'Page contains password input fields and form action pointing to external collection endpoint. Input field naming matches known phishing templates.',
    severity: 'HIGH',
    scoreContribution: 24,
  },
  {
    id: 3,
    type: 'REDIRECT ANOMALY',
    description: 'Multiple external redirects detected.',
    detail: '3-hop redirect chain through 2 flagged domains before reaching final destination. Redirect pattern matches evasion technique catalogued in threat database.',
    severity: 'SUSPICIOUS',
    scoreContribution: 15,
  },
  {
    id: 4,
    type: 'DOMAIN ANOMALY',
    description: 'Recently registered domain with suspicious pattern.',
    detail: 'Domain registered 2 days ago. Registrar matches known bulk-registration abuse pattern. Domain name uses brand impersonation (typosquatting).',
    severity: 'HIGH',
    scoreContribution: 21,
  },
];

// ─── Analysis Timeline Steps ──────────────────────────────────
export interface TimelineStep {
  id: number;
  label: string;
  sublabel: string;
  duration: number; // ms delay
}

export const analysisTimeline: TimelineStep[] = [
  { id: 1, label: 'TARGET RECEIVED', sublabel: 'Input normalized and sanitized', duration: 200 },
  { id: 2, label: 'INPUT NORMALIZED', sublabel: 'URL decoded, scheme extracted', duration: 500 },
  { id: 3, label: 'FEATURES EXTRACTED', sublabel: '47 structural features identified', duration: 900 },
  { id: 4, label: 'SECURITY INDICATORS CHECKED', sublabel: 'Reputation databases queried', duration: 1400 },
  { id: 5, label: 'EVIDENCE CORRELATED', sublabel: '4 indicators matched', duration: 1900 },
  { id: 6, label: 'RISK CALCULATED', sublabel: 'Score: 87/100', duration: 2400 },
  { id: 7, label: 'CLASSIFICATION GENERATED', sublabel: 'HIGH RISK — 94.2% confidence', duration: 2900 },
];

// ─── Investigation Graph Nodes & Edges ────────────────────────
export interface GraphNode {
  id: string;
  type: 'target' | 'domain' | 'url' | 'ip' | 'indicator' | 'risk';
  label: string;
  sublabel: string;
  severity: Severity | 'NEUTRAL';
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export const investigationNodes: GraphNode[] = [
  { id: 'target', type: 'target', label: 'TARGET', sublabel: 'example-login.com', severity: 'HIGH', position: { x: 320, y: 40 } },
  { id: 'domain', type: 'domain', label: 'DOMAIN', sublabel: 'Age: 2 days', severity: 'HIGH', position: { x: 80, y: 180 } },
  { id: 'url', type: 'url', label: 'URL ENTROPY', sublabel: 'Score: 4.8 bits', severity: 'SUSPICIOUS', position: { x: 320, y: 180 } },
  { id: 'ip', type: 'ip', label: 'IP ADDRESS', sublabel: '185.220.101.47', severity: 'HIGH', position: { x: 560, y: 180 } },
  { id: 'redirect', type: 'indicator', label: 'REDIRECTS', sublabel: '3 hops detected', severity: 'SUSPICIOUS', position: { x: 170, y: 320 } },
  { id: 'creds', type: 'indicator', label: 'CRED HARVEST', sublabel: 'Form collector', severity: 'HIGH', position: { x: 380, y: 320 } },
  { id: 'geo', type: 'indicator', label: 'GEO ANOMALY', sublabel: 'RU/CN infra', severity: 'SUSPICIOUS', position: { x: 560, y: 320 } },
  { id: 'risk', type: 'risk', label: 'RISK SCORE', sublabel: '87 / 100', severity: 'HIGH', position: { x: 320, y: 460 } },
];

export const investigationEdges: GraphEdge[] = [
  { id: 'e1', source: 'target', target: 'domain' },
  { id: 'e2', source: 'target', target: 'url' },
  { id: 'e3', source: 'target', target: 'ip' },
  { id: 'e4', source: 'domain', target: 'redirect' },
  { id: 'e5', source: 'url', target: 'creds' },
  { id: 'e6', source: 'ip', target: 'geo' },
  { id: 'e7', source: 'redirect', target: 'risk', label: '+15' },
  { id: 'e8', source: 'creds', target: 'risk', label: '+24' },
  { id: 'e9', source: 'geo', target: 'risk', label: '+9' },
  { id: 'e10', source: 'domain', target: 'risk', label: '+21' },
];

// ─── Mock Analysis Result ─────────────────────────────────────
export interface AnalysisResult {
  riskScore: number;
  classification: Severity;
  confidence: number;
  analysisId: string;
  target: string;
  evidence: EvidenceItem[];
  timeline: TimelineStep[];
}

export const mockAnalysisResult: AnalysisResult = {
  riskScore: 87,
  classification: 'HIGH',
  confidence: 94.2,
  analysisId: 'SX-8F21A9',
  target: 'example-login.com',
  evidence: defaultEvidenceItems,
  timeline: analysisTimeline,
};

// ─── Overview Metrics ─────────────────────────────────────────
export const overviewMetrics = {
  threatsAnalyzed: 1284,
  highRisk: 37,
  suspicious: 126,
  activeAlerts: 11,
  trends: {
    threatsAnalyzed: '+12.4%',
    highRisk: '+3',
    suspicious: '-8',
    activeAlerts: '+2',
  },
};
