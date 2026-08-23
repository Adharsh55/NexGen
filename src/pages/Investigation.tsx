import { motion } from 'framer-motion';
import InvestigationGraph from '../components/analyzer/InvestigationGraph';
import { investigationNodes, investigationEdges } from '../data/mockData';
import StatusBadge from '../components/ui/StatusBadge';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export default function Investigation() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 h-full"
    >
      <div className="shrink-0">
        <div className="label-section mb-1">Investigation</div>
        <h1 className="font-mono text-lg font-semibold text-text-primary tracking-wide">
          Threat Relationship Graph
        </h1>
        <p className="font-mono text-xs text-text-muted mt-1">
          Interactive investigation graph — drag nodes, zoom, and explore threat relationships.
        </p>
      </div>

      {/* Graph */}
      <div className="flex-1 min-h-0 flex flex-col gap-4">
        <div className="flex-1 min-h-0">
          <InvestigationGraph />
        </div>

        {/* Node legend */}
        <div className="panel p-4 shrink-0">
          <div className="label-section mb-3">Graph Nodes</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {investigationNodes.map((node) => (
              <div key={node.id} className="flex items-center gap-2 bg-bg-surface border border-border-subtle rounded-sm px-3 py-2">
                <StatusBadge status={node.severity === 'NEUTRAL' ? 'RESOLVED' : node.severity} />
                <div className="min-w-0">
                  <div className="font-mono text-[10px] text-text-secondary truncate">{node.label}</div>
                  <div className="font-mono text-[10px] text-text-muted truncate">{node.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
