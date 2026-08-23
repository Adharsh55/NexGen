import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle } from 'lucide-react';
import { threatEvents } from '../../data/mockData';
import StatusBadge from '../ui/StatusBadge';

export default function LiveFeed() {
  const [events, setEvents] = useState(threatEvents.slice(0, 7));
  const [tick, setTick] = useState(0);

  // Simulate new events arriving
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tick > 0) {
      const next = threatEvents[tick % threatEvents.length];
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setEvents((prev) => [{ ...next, id: `live-${tick}`, timestamp: ts, status: 'ACTIVE' }, ...prev.slice(0, 6)]);
    }
  }, [tick]);

  return (
    <div className="panel flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle shrink-0">
        <div>
          <div className="label-section mb-0.5">Live Security Feed</div>
          <div className="font-mono text-xs text-text-muted">Real-time event stream</div>
        </div>
        <div className="flex items-center gap-1.5">
          <Circle size={5} className="fill-sentinel-green text-sentinel-green blink" />
          <span className="font-mono text-[10px] text-sentinel-green tracking-wider">STREAMING</span>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[70px_80px_1fr_120px_70px] gap-2 px-4 py-2 border-b border-border-subtle bg-bg-surface shrink-0">
        {['TIME', 'SEV', 'EVENT', 'TARGET', 'STATUS'].map((h) => (
          <span key={h} className="label-mono text-[9px]">{h}</span>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-[70px_80px_1fr_120px_70px] gap-2 px-4 py-2.5 border-b border-border-subtle/50 hover:bg-bg-hover transition-colors duration-150 items-center"
            >
              <span className="font-mono text-[10px] text-text-muted tabular-nums">{event.timestamp}</span>
              <StatusBadge status={event.severity} />
              <div>
                <div className="font-mono text-xs text-text-secondary truncate">{event.event}</div>
                <div className="font-mono text-[10px] text-text-muted">{event.category}</div>
              </div>
              <span className="font-mono text-[10px] text-text-muted truncate">{event.target}</span>
              <div className="flex items-center gap-1">
                {event.status === 'ACTIVE' ? (
                  <>
                    <Circle size={5} className="fill-sentinel-orange text-sentinel-orange shrink-0 pulse-dot" />
                    <span className="font-mono text-[10px] text-sentinel-orange">ACTIVE</span>
                  </>
                ) : (
                  <span className="font-mono text-[10px] text-text-muted">DONE</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
