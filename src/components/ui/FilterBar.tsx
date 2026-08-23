interface FilterBarProps {
  filters: string[];
  active: string;
  onChange: (f: string) => void;
}

export default function FilterBar({ filters, active, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1" role="tablist" aria-label="Filter options">
      {filters.map((f) => (
        <button
          key={f}
          role="tab"
          aria-selected={active === f}
          onClick={() => onChange(f)}
          className={`font-mono text-xs px-3 py-1.5 rounded-sm tracking-wider uppercase transition-all duration-150 ${
            active === f
              ? 'bg-bg-hover text-text-primary border border-border-default'
              : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover border border-transparent'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
