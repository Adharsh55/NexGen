import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User, Circle } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'Overview',
  '/analyzer': 'Threat Analyzer',
  '/alerts': 'Alert Center',
  '/activity': 'Activity Log',
  '/investigation': 'Investigation',
  '/reports': 'Reports',
};

export default function TopBar() {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [notifCount] = useState(11);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pageTitle = pageTitles[location.pathname] ?? 'SENTINEL-X';

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  return (
    <header className="h-12 bg-bg-panel border-b border-border-subtle flex items-center justify-between px-4 shrink-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs tracking-widest uppercase text-text-muted">
          Security Operations Center
        </span>
        <span className="text-border-default">|</span>
        <span className="font-mono text-xs tracking-wider text-text-secondary uppercase">
          {pageTitle}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <Circle size={5} className="fill-sentinel-green text-sentinel-green blink" />
          <span className="font-mono text-xs text-sentinel-green tracking-widest">LIVE</span>
          <span className="font-mono text-xs text-text-muted tracking-wider ml-1">Monitoring</span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-border-default" />

        {/* Datetime */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-text-muted tracking-wider">{formattedDate}</span>
          <span className="font-mono text-xs text-text-secondary tracking-widest tabular-nums">{formattedTime}</span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-border-default" />

        {/* Notifications */}
        <button
          className="relative w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors duration-150 rounded-sm hover:bg-bg-hover"
          aria-label="Notifications"
        >
          <Bell size={14} />
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-sentinel-red text-white font-mono text-[8px] rounded-full flex items-center justify-center leading-none">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <button
          className="w-7 h-7 rounded-sm bg-bg-surface border border-border-default flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-subtle transition-all duration-150"
          aria-label="User profile"
        >
          <User size={13} />
        </button>
      </div>
    </header>
  );
}
