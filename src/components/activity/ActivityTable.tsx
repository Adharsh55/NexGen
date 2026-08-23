import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { activityRecords } from '../../data/mockData';
import type { ActivityRecord } from '../../data/mockData';
import StatusBadge from '../ui/StatusBadge';
import SearchBar from '../ui/SearchBar';
import FilterBar from '../ui/FilterBar';

const FILTERS = ['ALL', 'HIGH', 'SUSPICIOUS', 'SAFE'];
type SortKey = keyof ActivityRecord;

export default function ActivityTable() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filtered = activityRecords
    .filter((r) => filter === 'ALL' || r.severity === filter)
    .filter((r) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return r.target.toLowerCase().includes(s) || r.type.toLowerCase().includes(s) || r.analyst.toLowerCase().includes(s);
    })
    .sort((a, b) => {
      const av = a[sortKey] as any;
      const bv = b[sortKey] as any;
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortAsc ? cmp : -cmp;
    });

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortAsc ? <ChevronUp size={10} /> : <ChevronDown size={10} />) : null;

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return '#ef4444';
    if (risk >= 40) return '#f97316';
    return '#22c55e';
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar filters={FILTERS} active={filter} onChange={setFilter} />
        <SearchBar value={search} onChange={setSearch} placeholder="Search activity..." />
      </div>
      <div className="label-mono text-[10px]">{filtered.length} records</div>

      <div className="panel flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[80px_80px_110px_1fr_80px_80px_90px] gap-2 px-4 py-2.5 border-b border-border-subtle bg-bg-surface shrink-0">
          {[
            { label: 'TIME', key: 'timestamp' as SortKey },
            { label: 'ID', key: 'id' as SortKey },
            { label: 'ANALYST', key: 'analyst' as SortKey },
            { label: 'TARGET', key: 'target' as SortKey },
            { label: 'TYPE', key: 'type' as SortKey },
            { label: 'RISK', key: 'risk' as SortKey },
            { label: 'ACTION', key: 'action' as SortKey },
          ].map(({ label, key }) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className="flex items-center gap-1 label-mono text-[9px] hover:text-text-secondary text-left"
            >
              {label} <SortIcon k={key} />
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 font-mono text-xs text-text-muted">
              No records found
            </div>
          ) : (
            filtered.map((rec) => (
              <div
                key={rec.id}
                className="grid grid-cols-[80px_80px_110px_1fr_80px_80px_90px] gap-2 px-4 py-2.5 border-b border-border-subtle/40 hover:bg-bg-hover transition-colors duration-100 items-center"
              >
                <span className="font-mono text-[10px] text-text-muted tabular-nums">{rec.timestamp}</span>
                <span className="font-mono text-[10px] text-sentinel-accent">{rec.id}</span>
                <span className="font-mono text-[10px] text-text-secondary truncate">{rec.analyst}</span>
                <span className="font-mono text-xs text-text-secondary truncate">{rec.target}</span>
                <span className="font-mono text-[10px] text-text-muted truncate">{rec.type}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-medium" style={{ color: getRiskColor(rec.risk) }}>
                    {rec.risk}
                  </span>
                  <StatusBadge status={rec.severity} />
                </div>
                <span className="font-mono text-[10px] text-text-muted">{rec.action}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
