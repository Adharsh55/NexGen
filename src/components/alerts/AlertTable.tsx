import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { alerts } from '../../data/mockData';
import type { Alert } from '../../data/mockData';
import StatusBadge from '../ui/StatusBadge';
import SearchBar from '../ui/SearchBar';
import FilterBar from '../ui/FilterBar';

const FILTERS = ['ALL', 'HIGH', 'SUSPICIOUS', 'RESOLVED'];

type SortKey = 'severity' | 'riskScore' | 'timeAgo';

export default function AlertTable() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('riskScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filtered = alerts
    .filter((a) => {
      if (filter === 'ALL') return true;
      if (filter === 'HIGH') return a.severity === 'HIGH';
      if (filter === 'SUSPICIOUS') return a.severity === 'SUSPICIOUS';
      if (filter === 'RESOLVED') return a.status === 'RESOLVED';
      return true;
    })
    .filter((a) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        a.target.toLowerCase().includes(s) ||
        a.detection.toLowerCase().includes(s) ||
        a.id.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'riskScore') cmp = a.riskScore - b.riskScore;
      if (sortKey === 'severity') cmp = a.severity.localeCompare(b.severity);
      if (sortKey === 'timeAgo') cmp = 0; // keep original order
      return sortAsc ? cmp : -cmp;
    });

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortAsc ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : null;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar filters={FILTERS} active={filter} onChange={setFilter} />
        <SearchBar value={search} onChange={setSearch} placeholder="Search alerts..." />
      </div>

      {/* Count */}
      <div className="label-mono text-[10px]">
        {filtered.length} {filtered.length === 1 ? 'alert' : 'alerts'} shown
      </div>

      {/* Table */}
      <div className="panel flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[80px_100px_1fr_120px_100px_90px] gap-2 px-4 py-2.5 border-b border-border-subtle bg-bg-surface shrink-0">
          <button onClick={() => toggleSort('severity')} className="flex items-center gap-1 label-mono text-[9px] hover:text-text-secondary text-left">
            SEVERITY <SortIcon k="severity" />
          </button>
          <span className="label-mono text-[9px]">ALERT ID</span>
          <span className="label-mono text-[9px]">DETECTION</span>
          <span className="label-mono text-[9px]">TARGET</span>
          <span className="label-mono text-[9px]">TIME</span>
          <button onClick={() => toggleSort('riskScore')} className="flex items-center gap-1 label-mono text-[9px] hover:text-text-secondary">
            RISK <SortIcon k="riskScore" />
          </button>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 font-mono text-xs text-text-muted">
              No alerts match your criteria
            </div>
          ) : (
            filtered.map((alert) => (
              <div key={alert.id}>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(26,31,46,0.8)' }}
                  onClick={() => setExpanded(expanded === alert.id ? null : alert.id)}
                  className="grid grid-cols-[80px_100px_1fr_120px_100px_90px] gap-2 px-4 py-3 border-b border-border-subtle/50 cursor-pointer items-center"
                >
                  <StatusBadge status={alert.severity} />
                  <span className="font-mono text-xs text-sentinel-accent">{alert.id}</span>
                  <div>
                    <div className="font-mono text-xs text-text-secondary truncate">{alert.detection}</div>
                    <div className="font-mono text-[10px] text-text-muted">{alert.status}</div>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted truncate">{alert.target}</span>
                  <span className="font-mono text-[10px] text-text-muted">{alert.timeAgo}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${alert.riskScore}%`,
                          backgroundColor: alert.riskScore >= 70 ? '#ef4444' : alert.riskScore >= 40 ? '#f97316' : '#22c55e',
                        }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-text-muted w-6 text-right">{alert.riskScore}</span>
                  </div>
                </motion.div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expanded === alert.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-3 bg-bg-surface border-b border-border-subtle grid grid-cols-3 gap-4">
                        <div>
                          <div className="label-mono text-[9px] mb-1">Status</div>
                          <StatusBadge status={alert.status} size="sm" />
                        </div>
                        <div>
                          <div className="label-mono text-[9px] mb-1">Timestamp</div>
                          <span className="font-mono text-xs text-text-secondary">{alert.timestamp}</span>
                        </div>
                        <div>
                          <div className="label-mono text-[9px] mb-1">Assigned To</div>
                          <span className="font-mono text-xs text-text-secondary">{alert.analyst}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
