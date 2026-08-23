import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, MessageSquare, Wifi, File, Upload, Loader2 } from 'lucide-react';
import type { AnalysisTab } from '../../data/mockData';

interface AnalyzerInputProps {
  onAnalyze: (tab: AnalysisTab, value: string) => void;
  isAnalyzing: boolean;
}

const TABS: { id: AnalysisTab; label: string; icon: React.ReactNode; placeholder: string }[] = [
  { id: 'URL', label: 'URL', icon: <Link2 size={13} />, placeholder: 'Paste suspicious URL — e.g. https://login-verify-secure.com/auth?...' },
  { id: 'MESSAGE', label: 'Message', icon: <MessageSquare size={13} />, placeholder: 'Paste suspicious email, SMS, or message text...' },
  { id: 'IP', label: 'IP Address', icon: <Wifi size={13} />, placeholder: 'Enter IP address — e.g. 203.0.113.47' },
  { id: 'FILE', label: 'File Hash', icon: <File size={13} />, placeholder: 'Enter MD5/SHA256 hash or drop a file...' },
];

export default function AnalyzerInput({ onAnalyze, isAnalyzing }: AnalyzerInputProps) {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('URL');
  const [value, setValue] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  const handleSubmit = () => {
    const v = value.trim() || 'example-login.com';
    onAnalyze(activeTab, v);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
  };

  return (
    <div className="panel flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border-subtle shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setValue(''); }}
            className={`flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-wider uppercase transition-all duration-150 border-b-2 ${
              activeTab === tab.id
                ? 'border-sentinel-red text-text-primary bg-bg-surface'
                : 'border-transparent text-text-muted hover:text-text-secondary hover:bg-bg-hover'
            }`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4">
        <label htmlFor="analyzer-input" className="label-mono block mb-2">
          {activeTab === 'URL' && 'Suspicious URL'}
          {activeTab === 'MESSAGE' && 'Message Content'}
          {activeTab === 'IP' && 'IP Address'}
          {activeTab === 'FILE' && 'File Hash / Upload'}
        </label>

        {activeTab === 'FILE' ? (
          <div
            className={`border-2 border-dashed rounded-sm h-28 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 ${
              dragOver
                ? 'border-sentinel-red/50 bg-sentinel-red/5'
                : 'border-border-default hover:border-border-default/80 hover:bg-bg-hover'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) setValue(file.name);
            }}
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Drop file or click to upload"
          >
            <input ref={fileRef} type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setValue(e.target.files[0].name); }} />
            <Upload size={18} className="text-text-muted" />
            <span className="font-mono text-xs text-text-muted">
              {value ? value : 'Drop file here or click to upload'}
            </span>
            <span className="font-mono text-[10px] text-text-muted opacity-60">Supported: .exe .zip .pdf .docx .js .py</span>
          </div>
        ) : (
          <textarea
            id="analyzer-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentTab.placeholder}
            rows={activeTab === 'MESSAGE' ? 5 : 3}
            className="input-field resize-none leading-relaxed"
            aria-label={currentTab.placeholder}
          />
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="font-mono text-[10px] text-text-muted">
            {activeTab !== 'FILE' && value ? `${value.length} characters` : 'Press Ctrl+Enter to run'}
          </span>
          <motion.button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="btn-primary flex items-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.97 }}
            aria-label="Run threat analysis"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                ANALYZING...
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-white/80 blink" />
                RUN ANALYSIS
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
