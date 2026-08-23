import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Eye, Activity } from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import ThreatChart from '../components/overview/ThreatChart';
import ThreatDistribution from '../components/overview/ThreatDistribution';
import LiveFeed from '../components/overview/LiveFeed';
import { overviewMetrics } from '../data/mockData';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

export default function Overview() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar"
    >
      {/* Page header */}
      <div className="shrink-0">
        <div className="label-section mb-1">Security Operations Center</div>
        <h1 className="font-mono text-lg font-semibold text-text-primary tracking-wide">
          Threat Visibility Dashboard
        </h1>
        <p className="font-mono text-xs text-text-muted mt-1">
          Threat visibility. Evidence-driven analysis.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <MetricCard
          label="Threats Analyzed"
          value={overviewMetrics.threatsAnalyzed}
          trend={overviewMetrics.trends.threatsAnalyzed}
          trendUp={true}
          icon={<Eye size={14} />}
          accentColor="accent"
        />
        <MetricCard
          label="High Risk"
          value={overviewMetrics.highRisk}
          trend={overviewMetrics.trends.highRisk}
          trendUp={true}
          icon={<Shield size={14} />}
          accentColor="red"
        />
        <MetricCard
          label="Suspicious"
          value={overviewMetrics.suspicious}
          trend={overviewMetrics.trends.suspicious}
          trendUp={false}
          icon={<AlertTriangle size={14} />}
          accentColor="orange"
        />
        <MetricCard
          label="Active Alerts"
          value={overviewMetrics.activeAlerts}
          trend={overviewMetrics.trends.activeAlerts}
          trendUp={true}
          icon={<Activity size={14} />}
          accentColor="red"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 shrink-0" style={{ height: 280 }}>
        <div className="lg:col-span-2 h-full">
          <ThreatChart />
        </div>
        <div className="h-full">
          <ThreatDistribution />
        </div>
      </div>

      {/* Live Feed */}
      <div className="flex-1 min-h-0" style={{ minHeight: 280 }}>
        <LiveFeed />
      </div>
    </motion.div>
  );
}
