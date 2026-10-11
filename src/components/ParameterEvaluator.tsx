import React from 'react';
import { Sliders, RotateCcw, PlusCircle, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { MonitoringLocation, PresetScenario } from '../types/water';
import { MONITORING_LOCATIONS, PRESET_SCENARIOS } from '../utils/waterEngine';

interface ParameterEvaluatorProps {
  ph: number;
  turbidity: number;
  tds: number;
  location: MonitoringLocation;
  onPhChange: (val: number) => void;
  onTurbidityChange: (val: number) => void;
  onTdsChange: (val: number) => void;
  onLocationChange: (loc: MonitoringLocation) => void;
  onSelectPreset: (preset: PresetScenario) => void;
  onCommitSample: () => void;
  onResetToDefaults: () => void;
}

export const ParameterEvaluator: React.FC<ParameterEvaluatorProps> = ({
  ph,
  turbidity,
  tds,
  location,
  onPhChange,
  onTurbidityChange,
  onTdsChange,
  onLocationChange,
  onSelectPreset,
  onCommitSample,
  onResetToDefaults
}) => {
  // Turbidity visual turbidity opacity (clamp 0 to 0.9)
  const turbidityOpacity = Math.min(0.9, Math.max(0.05, (turbidity / 10) * 0.85));

  // Visual status indicators
  const getPhStatus = (v: number) => {
    if (v >= 6.5 && v <= 8.5) return { label: 'Optimal Range (6.5–8.5)', color: 'text-emerald-400', icon: CheckCircle2 };
    if ((v >= 6.0 && v < 6.5) || (v > 8.5 && v <= 9.0)) return { label: 'Moderate Divergence', color: 'text-amber-400', icon: AlertTriangle };
    return { label: 'Critical Violation', color: 'text-rose-400', icon: AlertOctagon };
  };

  const getTurbStatus = (v: number) => {
    if (v <= 1.0) return { label: 'Optimal Clarity (≤ 1.0 NTU)', color: 'text-emerald-400', icon: CheckCircle2 };
    if (v <= 5.0) return { label: 'Moderate Cloudiness (≤ 5.0 NTU)', color: 'text-amber-400', icon: AlertTriangle };
    return { label: 'Critical Turbidity (> 5.0 NTU)', color: 'text-rose-400', icon: AlertOctagon };
  };

  const getTdsStatus = (v: number) => {
    if (v < 300) return { label: 'Optimal Purity (< 300 ppm)', color: 'text-emerald-400', icon: CheckCircle2 };
    if (v <= 500) return { label: 'Moderate Minerals (300–500 ppm)', color: 'text-amber-400', icon: AlertTriangle };
    return { label: 'Critical Contamination (> 500 ppm)', color: 'text-rose-400', icon: AlertOctagon };
  };

  const phMeta = getPhStatus(ph);
  const turbMeta = getTurbStatus(turbidity);
  const tdsMeta = getTdsStatus(tds);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 lg:p-6 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">
              Interactive Water Quality Parameter Controls
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time multi-sensor calibration engine evaluating pH, turbidity, and chemical dissolved solids.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetToDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Preset Scenario Quick Selectors */}
      <div className="mt-4 pt-1">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Standard Scenario Presets
        </label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {PRESET_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSelectPreset(scenario)}
              className="text-left rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                  {scenario.name.split(' ')[0]}
                </span>
                <span
                  className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                    scenario.category === 'Optimal'
                      ? 'text-emerald-400 bg-emerald-950/60'
                      : scenario.category === 'Moderate'
                      ? 'text-amber-400 bg-amber-950/60'
                      : 'text-rose-400 bg-rose-950/60'
                  }`}
                >
                  {scenario.category}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 font-mono">
                pH {scenario.pH} · {scenario.turbidity} NTU
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Monitoring Location Selector */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Monitoring Station
          </label>
        </div>
        <div className="sm:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {MONITORING_LOCATIONS.map((loc) => {
              const isSelected = location === loc;
              return (
                <button
                  key={loc}
                  onClick={() => onLocationChange(loc)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center truncate ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {loc.split(' - ')[0]}
                  <span className="block text-[10px] text-slate-400 truncate">
                    {loc.split(' - ')[1]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Parameter Control Sliders */}
      <div className="mt-6 space-y-6">
        {/* PARAMETER 1: pH Level */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold">
                pH
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Hydrogen-Ion Concentration (pH)
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Target Range: 6.5 – 8.5</span>
                  <span aria-hidden="true">·</span>
                  <span>Scale: 0.0 – 14.0</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <phMeta.icon className={`h-3.5 w-3.5 ${phMeta.color}`} />
                <span className={phMeta.color}>{phMeta.label}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="14"
                  step="0.01"
                  value={ph}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) onPhChange(Math.min(14, Math.max(0, val)));
                  }}
                  className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-right font-mono text-base font-bold text-white tabular-nums focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* pH Slider */}
          <div className="mt-3">
            <input
              type="range"
              min="0"
              max="14"
              step="0.05"
              value={ph}
              onChange={(e) => onPhChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Visual pH Spectrum Bar */}
          <div className="mt-2.5 relative">
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-600 via-amber-400 via-emerald-400 via-cyan-400 to-purple-600 relative overflow-hidden">
              {/* Target zone highlighted overlay */}
              <div
                className="absolute top-0 bottom-0 bg-white/30 border-x-2 border-white shadow-sm"
                style={{
                  left: `${(6.5 / 14) * 100}%`,
                  width: `${((8.5 - 6.5) / 14) * 100}%`
                }}
                title="Target Safe Drinking Range: 6.5 to 8.5"
              />
            </div>
            {/* Current pointer indicator */}
            <div
              className="absolute -top-1 w-2.5 h-5 bg-white border border-slate-900 rounded-sm shadow-md transition-all -translate-x-1/2 pointer-events-none"
              style={{ left: `${(Math.min(14, Math.max(0, ph)) / 14) * 100}%` }}
            />
            <div className="mt-1.5 flex justify-between text-[10px] font-mono text-slate-400">
              <span>0.0 (Acidic)</span>
              <span className="text-emerald-400 font-bold">6.5 Target Min</span>
              <span className="text-cyan-400 font-bold">7.0 Neutral</span>
              <span className="text-emerald-400 font-bold">8.5 Target Max</span>
              <span>14.0 (Alkaline)</span>
            </div>
          </div>
        </div>

        {/* PARAMETER 2: Turbidity */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-bold">
                NTU
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Turbidity (Suspended Particulates)
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Preferred Target: ≤ 1.0 NTU</span>
                  <span aria-hidden="true">·</span>
                  <span>Max Acceptable: 5.0 NTU</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <turbMeta.icon className={`h-3.5 w-3.5 ${turbMeta.color}`} />
                <span className={turbMeta.color}>{turbMeta.label}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.01"
                  value={turbidity}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) onTurbidityChange(Math.min(20, Math.max(0, val)));
                  }}
                  className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-right font-mono text-base font-bold text-white tabular-nums focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Turbidity Slider */}
          <div className="mt-3">
            <input
              type="range"
              min="0"
              max="10"
              step="0.05"
              value={turbidity}
              onChange={(e) => onTurbidityChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Clarity simulation preview strip */}
          <div className="mt-2.5 flex items-center gap-3">
            <div className="relative flex-1 h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-amber-500 to-amber-900 transition-all duration-150"
                style={{ width: `${Math.min(100, (turbidity / 10) * 100)}%` }}
              />
              {/* 1.0 NTU marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-10"
                style={{ left: `${(1.0 / 10) * 100}%` }}
                title="Preferred limit: 1.0 NTU"
              />
              {/* 5.0 NTU marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
                style={{ left: `${(5.0 / 10) * 100}%` }}
                title="Maximum screening threshold: 5.0 NTU"
              />
            </div>

            {/* Visual particulate simulation vial */}
            <div
              className="h-7 w-20 rounded border border-slate-700 bg-slate-950 relative overflow-hidden flex items-center justify-center shrink-0"
              title={`Simulated water turbidity level: ${turbidity.toFixed(2)} NTU`}
            >
              <div
                className="absolute inset-0 bg-amber-700 transition-opacity"
                style={{ opacity: turbidityOpacity }}
              />
              <span className="relative z-10 text-[9px] font-mono text-slate-200">
                {turbidity <= 1.0 ? 'Clear' : turbidity <= 5.0 ? 'Hazy' : 'Turbid'}
              </span>
            </div>
          </div>

          <div className="mt-1 flex justify-between text-[10px] font-mono text-slate-400">
            <span className="text-emerald-400">0.0 NTU (Crystal Clear)</span>
            <span className="text-emerald-400 font-semibold">1.0 NTU (Preferred Target)</span>
            <span className="text-rose-400 font-semibold">5.0 NTU (Threshold Max)</span>
            <span>10.0+ NTU (Heavy Sediment)</span>
          </div>
        </div>

        {/* PARAMETER 3: Chemical Contamination (TDS) */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-teal-500/10 text-teal-400 font-mono text-xs font-bold">
                TDS
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Total Dissolved Solids & Chemical Contamination
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Preferred Target: &lt; 300 ppm</span>
                  <span aria-hidden="true">·</span>
                  <span>Max Screening Threshold: 500 ppm</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <tdsMeta.icon className={`h-3.5 w-3.5 ${tdsMeta.color}`} />
                <span className={tdsMeta.color}>{tdsMeta.label}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="1200"
                  step="1"
                  value={Math.round(tds)}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) onTdsChange(Math.min(1200, Math.max(0, val)));
                  }}
                  className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-right font-mono text-base font-bold text-white tabular-nums focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* TDS Slider */}
          <div className="mt-3">
            <input
              type="range"
              min="50"
              max="900"
              step="5"
              value={tds}
              onChange={(e) => onTdsChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* TDS Spectrum Bar */}
          <div className="mt-2.5 relative">
            <div className="h-3 w-full rounded-full bg-slate-800 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-600 transition-all duration-150"
                style={{ width: `${Math.min(100, (tds / 900) * 100)}%` }}
              />
              {/* 300 ppm marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-300 z-10"
                style={{ left: `${(300 / 900) * 100}%` }}
                title="Preferred: < 300 ppm"
              />
              {/* 500 ppm marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-10"
                style={{ left: `${(500 / 900) * 100}%` }}
                title="Max screening: 500 ppm"
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] font-mono text-slate-400">
              <span className="text-emerald-400">&lt; 300 ppm (Optimal)</span>
              <span className="text-amber-400 font-semibold">300 – 500 ppm (Moderate)</span>
              <span className="text-rose-400 font-semibold">&gt; 500 ppm (Critical Contamination)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Commit to Live Telemetry Feed */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400">
          Engine automatically executes real-time evaluation upon parameter adjustment.
        </div>
        <button
          onClick={onCommitSample}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Record Sample to Sensor Telemetry Dataset</span>
        </button>
      </div>
    </div>
  );
};
