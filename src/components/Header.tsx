import React from 'react';
import { Activity, Download, RefreshCw } from 'lucide-react';

interface HeaderProps {
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onExportData: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isStreaming,
  onToggleStreaming,
  onExportData,
  onResetData
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="h-5 w-5" />
          </div>
          <a href="#" className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            PySustain AquaGuard
          </a>
        </div>

        {/* Zone 2: Single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#evaluator-section" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Live Evaluator
          </a>
          <a href="#recommendations-section" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Treatment Engine
          </a>
          <a href="#charts-section" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Analytical Charts
          </a>
          <a href="#dataset-section" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Telemetry Dataset
          </a>
          <a href="#standards-section" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Safety Standards
          </a>
        </nav>

        {/* Zone 3: Primary action & controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onResetData}
            title="Regenerate synthetic sensor dataset"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors whitespace-nowrap"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Data</span>
          </button>

          <button
            onClick={onExportData}
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onToggleStreaming}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
              isStreaming
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-sm'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isStreaming ? 'bg-amber-400 animate-pulse' : 'bg-slate-900'
              }`}
            />
            <span>{isStreaming ? 'Pause Stream' : 'Start Sensor Stream'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
