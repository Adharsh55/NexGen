import { motion } from 'framer-motion';
import ActivityTable from '../components/activity/ActivityTable';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export default function Activity() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 h-full"
    >
      <div className="shrink-0">
        <div className="label-section mb-1">Activity Log</div>
        <h1 className="font-mono text-lg font-semibold text-text-primary tracking-wide">
          Analyst Activity
        </h1>
        <p className="font-mono text-xs text-text-muted mt-1">
          Full audit trail of analyst actions and automated system events.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <ActivityTable />
      </div>
    </motion.div>
  );
}
