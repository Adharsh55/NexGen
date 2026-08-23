import { motion } from 'framer-motion';
import AlertTable from '../components/alerts/AlertTable';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export default function AlertCenter() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 h-full"
    >
      <div className="shrink-0">
        <div className="label-section mb-1">Alert Center</div>
        <h1 className="font-mono text-lg font-semibold text-text-primary tracking-wide">
          Active Security Alerts
        </h1>
        <p className="font-mono text-xs text-text-muted mt-1">
          Triage, investigate, and resolve incoming security alerts.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <AlertTable />
      </div>
    </motion.div>
  );
}
