import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  ScanSearch,
  AlertTriangle,
  Activity,
  GitBranch,
  FileText,
  ChevronLeft,
  ChevronRight,
  Circle,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  shortLabel: string;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Overview', shortLabel: 'OVR', icon: <LayoutDashboard size={15} /> },
  { to: '/analyzer', label: 'Threat Analyzer', shortLabel: 'ANA', icon: <ScanSearch size={15} /> },
  { to: '/alerts', label: 'Alert Center', shortLabel: 'ALT', icon: <AlertTriangle size={15} /> },
  { to: '/activity', label: 'Activity', shortLabel: 'ACT', icon: <Activity size={15} /> },
  { to: '/investigation', label: 'Investigation', shortLabel: 'INV', icon: <GitBranch size={15} /> },
  { to: '/reports', label: 'Reports', shortLabel: 'RPT', icon: <FileText size={15} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 200 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-bg-panel border-r border-border-subtle shrink-0 overflow-hidden z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 h-12 border-b border-border-subtle shrink-0">
        <div className="w-7 h-7 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path
              d="M12 2L4 6v6c0 5.1 3.4 9.9 8 11 4.6-1.1 8-5.9 8-11V6L12 2z"
              stroke="#ef4444"
              strokeWidth="1.5"
              fill="rgba(239,68,68,0.08)"
            />
            <path d="M9 12l2 2 4-4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="font-mono text-sm font-semibold tracking-widest text-text-primary">
                SENTINEL<span className="text-sentinel-red">-X</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto no-scrollbar">
        {!collapsed && (
          <div className="label-mono px-2 py-1.5 mb-1">Navigation</div>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              isActive
                ? `flex items-center gap-3 px-2.5 py-2 rounded-sm text-text-primary bg-bg-hover border-l-2 border-sentinel-red transition-all duration-150 ${collapsed ? 'justify-center' : ''}`
                : `flex items-center gap-3 px-2.5 py-2 rounded-sm text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all duration-150 ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="font-mono text-xs tracking-wider uppercase whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Bottom status */}
      <div className="border-t border-border-subtle px-3 py-3 shrink-0">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="label-mono mb-2">System Status</div>
              <div className="flex items-center gap-2 mb-2">
                <Circle size={6} className="fill-sentinel-green text-sentinel-green pulse-dot" />
                <span className="font-mono text-xs text-sentinel-green tracking-wider">OPERATIONAL</span>
              </div>
              <div className="label-mono text-xs opacity-50">v1.0.0</div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="flex justify-center">
            <Circle size={6} className="fill-sentinel-green text-sentinel-green pulse-dot" />
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute top-3 -right-3 w-6 h-6 rounded-full bg-bg-surface border border-border-default flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-default transition-all duration-150 z-30"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </motion.aside>
  );
}
