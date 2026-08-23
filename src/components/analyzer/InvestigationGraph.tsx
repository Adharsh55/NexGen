import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Node,
  type Edge,
  type Connection,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { investigationNodes, investigationEdges } from '../../data/mockData';

// ─── Custom Node ──────────────────────────────────────────────
const severityColors: Record<string, { border: string; bg: string; text: string }> = {
  HIGH: { border: '#ef4444', bg: 'rgba(239,68,68,0.08)', text: '#ef4444' },
  SUSPICIOUS: { border: '#f97316', bg: 'rgba(249,115,22,0.08)', text: '#f97316' },
  SAFE: { border: '#22c55e', bg: 'rgba(34,197,94,0.08)', text: '#22c55e' },
  NEUTRAL: { border: '#252b3a', bg: '#141720', text: '#94a3b8' },
};

function ThreatNode({ data }: { data: any }) {
  const colors = severityColors[data.severity] ?? severityColors['NEUTRAL'];
  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        background: colors.bg,
        boxShadow: `0 0 12px ${colors.border}20`,
      }}
      className="rounded-sm px-3 py-2 min-w-[100px] text-center cursor-pointer"
    >
      <Handle type="target" position={Position.Top} style={{ background: colors.border, width: 6, height: 6, border: 'none' }} />
      <div className="font-mono text-[9px] tracking-widest uppercase mb-0.5" style={{ color: colors.text }}>
        {data.label}
      </div>
      <div className="font-mono text-[10px] text-slate-300">{data.sublabel}</div>
      <Handle type="source" position={Position.Bottom} style={{ background: colors.border, width: 6, height: 6, border: 'none' }} />
    </div>
  );
}

const nodeTypes = { threat: ThreatNode };

// Build React Flow nodes
const rfNodes: Node[] = investigationNodes.map((n) => ({
  id: n.id,
  type: 'threat',
  position: n.position,
  data: { label: n.label, sublabel: n.sublabel, severity: n.severity },
}));

const rfEdges: Edge[] = investigationEdges.map((e) => ({
  id: e.id,
  source: e.source,
  target: e.target,
  label: e.label,
  style: { stroke: '#252b3a', strokeWidth: 1.5 },
  labelStyle: { fill: '#475569', fontSize: 9, fontFamily: 'JetBrains Mono' },
  labelBgStyle: { fill: '#0f1117' },
  labelBgPadding: [3, 3],
  animated: false,
}));

interface InvestigationGraphProps {
  compact?: boolean;
}

export default function InvestigationGraph({ compact = false }: InvestigationGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className={`panel overflow-hidden ${compact ? 'h-64' : 'h-full'}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle shrink-0">
        <div className="label-section">Investigation Graph</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-sentinel-red" />
            <span className="label-mono text-[9px]">HIGH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-sentinel-orange" />
            <span className="label-mono text-[9px]">SUSPICIOUS</span>
          </div>
        </div>
      </div>
      <div style={{ height: compact ? 220 : 'calc(100% - 48px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.4}
          maxZoom={2}
          style={{ background: '#09090b' }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={0.8}
            color="#1e2330"
          />
          <Controls
            style={{
              background: '#0f1117',
              border: '1px solid #1e2330',
              borderRadius: 2,
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
