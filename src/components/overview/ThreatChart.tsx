import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { threatChartData } from '../../data/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-surface border border-border-default rounded-sm p-3 font-mono text-xs shadow-panel">
      <div className="text-text-muted mb-2 tracking-wider">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-text-secondary uppercase tracking-wider">{p.dataKey}</span>
          </div>
          <span className="text-text-primary font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex items-center gap-6 justify-end pr-2 pt-1">
    {payload?.map((p: any) => (
      <div key={p.dataKey} className="flex items-center gap-1.5">
        <span className="w-2 h-0.5" style={{ backgroundColor: p.color }} />
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{p.value}</span>
      </div>
    ))}
  </div>
);

export default function ThreatChart() {
  return (
    <div className="panel p-4 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4 shrink-0">
        <div>
          <div className="label-section mb-1">Threat Activity</div>
          <div className="font-mono text-xs text-text-muted">Detection activity — last 24 hours</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="label-mono text-[10px]">24H</span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={threatChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSuspicious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSafe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="#1e2330" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#1e2330' }}
              tickLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#252b3a', strokeWidth: 1 }} />
            <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              dataKey="safe"
              name="safe"
              stroke="#22c55e"
              strokeWidth={1.5}
              fill="url(#gradSafe)"
              dot={false}
              activeDot={{ r: 3, fill: '#22c55e', stroke: 'none' }}
            />
            <Area
              type="monotone"
              dataKey="suspicious"
              name="suspicious"
              stroke="#f97316"
              strokeWidth={1.5}
              fill="url(#gradSuspicious)"
              dot={false}
              activeDot={{ r: 3, fill: '#f97316', stroke: 'none' }}
            />
            <Area
              type="monotone"
              dataKey="high"
              name="high risk"
              stroke="#ef4444"
              strokeWidth={1.5}
              fill="url(#gradHigh)"
              dot={false}
              activeDot={{ r: 3, fill: '#ef4444', stroke: 'none' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
