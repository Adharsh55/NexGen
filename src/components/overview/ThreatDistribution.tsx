import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { threatDistribution } from '../../data/mockData';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-bg-surface border border-border-default rounded-sm p-2.5 font-mono text-xs shadow-panel">
      <div className="text-text-primary font-medium mb-1">{d.category}</div>
      <div className="text-text-muted">{d.count} events</div>
      <div className="text-text-muted">{d.percentage}%</div>
    </div>
  );
};

export default function ThreatDistribution() {
  const total = threatDistribution.reduce((s, d) => s + d.count, 0);

  return (
    <div className="panel p-4 h-full flex flex-col">
      <div className="mb-4 shrink-0">
        <div className="label-section mb-1">Threat Distribution</div>
        <div className="font-mono text-xs text-text-muted">Category breakdown</div>
      </div>

      {/* Chart */}
      <div className="h-36 shrink-0 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={threatDistribution} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barSize={16}>
            <XAxis
              dataKey="category"
              tick={{ fill: '#475569', fontSize: 8, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 8, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="count" radius={[1, 1, 0, 0]}>
              {threatDistribution.map((entry, i) => (
                <Cell key={i} fill={entry.color} fillOpacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend list */}
      <div className="flex flex-col gap-1.5 flex-1">
        {threatDistribution.map((item) => (
          <div key={item.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-mono text-xs text-text-secondary">{item.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-text-muted">{item.count}</span>
              <div className="w-14 h-1 bg-bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color, opacity: 0.7 }}
                />
              </div>
              <span className="font-mono text-[10px] text-text-muted w-8 text-right">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
