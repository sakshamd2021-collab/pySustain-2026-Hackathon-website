import React from 'react';
import { ShieldCheck, Activity, Zap, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import sensorImage from '../assets/images/water_sensor_probe_1791697435168.jpg';

interface LaboratoryBannerProps {
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onInjectAnomaly: (type: 'acid' | 'turbidity' | 'tds') => void;
}

export const LaboratoryBanner: React.FC<LaboratoryBannerProps> = ({
  isStreaming,
  onToggleStreaming,
  onInjectAnomaly
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm backdrop-blur-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Information & Telemetry Status (7 cols) */}
        <div className="p-6 lg:p-7 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
              <span>PySustain-2026 Analytical Engine</span>
              <span aria-hidden="true">·</span>
              <span>Online Prober</span>
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Smart Water Parameter & Safety Monitoring Engine
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Continuous multi-parametric monitoring of chemical hydrogen-ion potential (pH), suspended particulates (turbidity), and total dissolved solids (TDS) with automated potability verdicts and treatment engineering directives.
            </p>

            {/* Core Sensor Specifications */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Sensor 01: pH Prober
                </span>
                <span className="text-sm font-bold font-mono text-slate-100 block mt-0.5">
                  6.5 – 8.5
                </span>
                <span className="text-[11px] text-emerald-400">Target Bound</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Sensor 02: Nephelometer
                </span>
                <span className="text-sm font-bold font-mono text-slate-100 block mt-0.5">
                  ≤ 1.0 NTU
                </span>
                <span className="text-[11px] text-cyan-400">Target Clarity</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Sensor 03: TDS Meter
                </span>
                <span className="text-sm font-bold font-mono text-slate-100 block mt-0.5">
                  &lt; 300 ppm
                </span>
                <span className="text-[11px] text-teal-400">Target Salinity</span>
              </div>
            </div>
          </div>

          {/* Interactive Stream Controls & Anomaly Injection */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleStreaming}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isStreaming
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                <span>{isStreaming ? 'Pause Auto-Stream' : 'Start Sensor Telemetry Stream'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Inject Event:</span>
              <button
                onClick={() => onInjectAnomaly('acid')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
                title="Inject acidic industrial discharge"
              >
                Acid Leak
              </button>
              <button
                onClick={() => onInjectAnomaly('turbidity')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
                title="Inject flash sediment runoff"
              >
                Silt Surge
              </button>
              <button
                onClick={() => onInjectAnomaly('tds')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
                title="Inject chemical brine contamination"
              >
                Saline Spurt
              </button>
            </div>
          </div>
        </div>

        {/* Right Photo Stage & Instrument Rig (5 cols) */}
        <div className="relative lg:col-span-5 min-h-[220px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950 overflow-hidden group">
          <img
            src={sensorImage}
            alt="Laboratory Water Quality Analysis Probe Station"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Subtle gradient overlay to blend into slate */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

          {/* Overlay Tag */}
          <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
            <span className="truncate">Model: Aqua-Tech Benchtop Submersible Array</span>
            <span className="text-cyan-400 shrink-0">Calibrated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
