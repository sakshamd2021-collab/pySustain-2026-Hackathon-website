import React, { useState } from 'react';
import { BarChart3, PieChart, ScatterChart, BarChart2, Info } from 'lucide-react';
import { WaterSample, DatasetAnalytics } from '../types/water';

interface AnalyticsChartsProps {
  samples: WaterSample[];
  analytics: DatasetAnalytics;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  samples,
  analytics
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pie' | 'zones' | 'ph' | 'scatter'>('all');
  const [hoveredScatterPoint, setHoveredScatterPoint] = useState<WaterSample | null>(null);

  const { verdictCounts, locationAverages, totalSamples, averageScore } = analytics;

  // Chart 1: Verdict Distribution Pie / Donut
  const totalVerdictCount = (verdictCounts['Safe'] || 0) + 
                            (verdictCounts['Needs Basic Filtration'] || 0) + 
                            (verdictCounts['Unsafe / Hazardous'] || 0) || 1;

  const safeCount = verdictCounts['Safe'] || 0;
  const needsCount = verdictCounts['Needs Basic Filtration'] || 0;
  const unsafeCount = verdictCounts['Unsafe / Hazardous'] || 0;

  const safePct = ((safeCount / totalVerdictCount) * 100);
  const needsPct = ((needsCount / totalVerdictCount) * 100);
  const unsafePct = ((unsafeCount / totalVerdictCount) * 100);

  // SVG Donut calculation
  const donutRadius = 60;
  const donutStroke = 24;
  const donutCircumference = 2 * Math.PI * donutRadius;

  const safeDash = (safePct / 100) * donutCircumference;
  const needsDash = (needsPct / 100) * donutCircumference;
  const unsafeDash = (unsafePct / 100) * donutCircumference;

  // Chart 2: Zone Average Scores
  const maxBarScore = 100;

  // Chart 3: pH Histogram (Bins: 5.0 to 10.0, 10 bins each 0.5 step)
  const phBins = [
    { min: 5.0, max: 5.5, label: '5.0-5.5', count: 0 },
    { min: 5.5, max: 6.0, label: '5.5-6.0', count: 0 },
    { min: 6.0, max: 6.5, label: '6.0-6.5', count: 0 },
    { min: 6.5, max: 7.0, label: '6.5-7.0', count: 0 },
    { min: 7.0, max: 7.5, label: '7.0-7.5', count: 0 },
    { min: 7.5, max: 8.0, label: '7.5-8.0', count: 0 },
    { min: 8.0, max: 8.5, label: '8.0-8.5', count: 0 },
    { min: 8.5, max: 9.0, label: '8.5-9.0', count: 0 },
    { min: 9.0, max: 9.5, label: '9.0-9.5', count: 0 },
    { min: 9.5, max: 10.0, label: '9.5-10.0', count: 0 }
  ];

  for (const s of samples) {
    for (const bin of phBins) {
      if (s.pH >= bin.min && s.pH < bin.max) {
        bin.count++;
        break;
      }
    }
  }

  const maxBinCount = Math.max(1, ...phBins.map(b => b.count));

  // Chart 4: TDS vs Turbidity Scatter Plot Coordinate Normalization
  // Bounds: TDS 100 to 800, Turbidity 0 to 9.0
  const scatterWidth = 460;
  const scatterHeight = 220;
  const paddingX = 45;
  const paddingY = 25;
  const plotW = scatterWidth - paddingX - 20;
  const plotH = scatterHeight - paddingY - 30;

  const tdsMin = 100;
  const tdsMax = 800;
  const turbMin = 0;
  const turbMax = 9.0;

  const getViridisColor = (score: number) => {
    // Score 0 to 100 viridis approximation
    if (score >= 80) return '#2ecc71'; // Green
    if (score >= 60) return '#27ae60';
    if (score >= 45) return '#f1c40f'; // Yellow/amber
    if (score >= 25) return '#e67e22'; // Orange
    return '#e74c3c'; // Red
  };

  return (
    <div id="charts-section" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 lg:p-6 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">
              Visual Analytics Dashboard
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time Matplotlib engine visualization equivalents for statistical water monitoring.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quad Grid (All 4)
          </button>
          <button
            onClick={() => setActiveTab('pie')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'pie'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Verdict Share
          </button>
          <button
            onClick={() => setActiveTab('zones')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'zones'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Zone Scores
          </button>
          <button
            onClick={() => setActiveTab('ph')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'ph'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            pH Distribution
          </button>
          <button
            onClick={() => setActiveTab('scatter')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'scatter'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TDS Correlation
          </button>
        </div>
      </div>

      {/* Analytics Summary Kicker Bar */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Total Telemetry Samples
          </span>
          <div className="mt-0.5 text-lg font-mono font-bold text-white tabular-nums">
            {totalSamples}
          </div>
        </div>
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Mean Quality Score
          </span>
          <div className="mt-0.5 text-lg font-mono font-bold text-cyan-300 tabular-nums">
            {averageScore.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/100</span>
          </div>
        </div>
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Safe Potable Ratio
          </span>
          <div className="mt-0.5 text-lg font-mono font-bold text-emerald-400 tabular-nums">
            {safePct.toFixed(1)}%
          </div>
        </div>
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Critical Alerts
          </span>
          <div className="mt-0.5 text-lg font-mono font-bold text-rose-400 tabular-nums">
            {unsafeCount}
          </div>
        </div>
      </div>

      {/* 2x2 QUAD GRID OF CHARTS */}
      <div className={`mt-5 grid gap-5 ${
        activeTab === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>
        {/* CHART 1: Verdict Distribution Pie / Donut Chart */}
        {(activeTab === 'all' || activeTab === 'pie') && (
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Chart 1: Water Quality Verdict Share
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                PySustain Matplotlib #1
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Donut Chart SVG */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg width="150" height="150" className="rotate-[-90deg]">
                  {/* Background Track */}
                  <circle
                    cx="75"
                    cy="75"
                    r={donutRadius}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth={donutStroke}
                  />
                  {/* Slice 1: Safe (#2ecc71) */}
                  {safeDash > 0 && (
                    <circle
                      cx="75"
                      cy="75"
                      r={donutRadius}
                      fill="none"
                      stroke="#2ecc71"
                      strokeWidth={donutStroke}
                      strokeDasharray={`${safeDash} ${donutCircumference - safeDash}`}
                      strokeDashoffset={0}
                      className="transition-all duration-500"
                    />
                  )}
                  {/* Slice 2: Needs Basic Filtration (#f1c40f) */}
                  {needsDash > 0 && (
                    <circle
                      cx="75"
                      cy="75"
                      r={donutRadius}
                      fill="none"
                      stroke="#f1c40f"
                      strokeWidth={donutStroke}
                      strokeDasharray={`${needsDash} ${donutCircumference - needsDash}`}
                      strokeDashoffset={-safeDash}
                      className="transition-all duration-500"
                    />
                  )}
                  {/* Slice 3: Unsafe / Hazardous (#e74c3c) */}
                  {unsafeDash > 0 && (
                    <circle
                      cx="75"
                      cy="75"
                      r={donutRadius}
                      fill="none"
                      stroke="#e74c3c"
                      strokeWidth={donutStroke}
                      strokeDasharray={`${unsafeDash} ${donutCircumference - unsafeDash}`}
                      strokeDashoffset={-(safeDash + needsDash)}
                      className="transition-all duration-500"
                    />
                  )}
                </svg>

                <div className="absolute text-center">
                  <span className="text-xl font-bold font-mono text-white tabular-nums">
                    {totalSamples}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                    Samples
                  </span>
                </div>
              </div>

              {/* Legend with exact Matplotlib colors */}
              <div className="space-y-2.5 w-full sm:w-auto">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-[#2ecc71]" />
                    <span className="text-xs font-medium text-slate-200">Safe:</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
                    {safeCount} ({safePct.toFixed(1)}%)
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-[#f1c40f]" />
                    <span className="text-xs font-medium text-slate-200">Needs Filtration:</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                    {needsCount} ({needsPct.toFixed(1)}%)
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-[#e74c3c]" />
                    <span className="text-xs font-medium text-slate-200">Unsafe / Hazardous:</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-rose-400 tabular-nums">
                    {unsafeCount} ({unsafePct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 pt-2 border-t border-slate-900 text-[11px] text-slate-400 text-center">
              Categorized based on cumulative quality score and mandatory drinking screen safety checks.
            </p>
          </div>
        )}

        {/* CHART 2: Average Score by Location / Zone (Bar Graph) */}
        {(activeTab === 'all' || activeTab === 'zones') && (
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-[#3498db]" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Chart 2: Average Quality Score by Zone
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                PySustain Matplotlib #2
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {locationAverages.map((zone) => {
                const pct = Math.min(100, Math.max(0, (zone.avgScore / maxBarScore) * 100));
                return (
                  <div key={zone.location}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-300 truncate max-w-[200px]" title={zone.location}>
                        {zone.location}
                      </span>
                      <div className="flex items-center gap-2 font-mono tabular-nums">
                        <span className="text-slate-400 text-[11px]">n={zone.sampleCount}</span>
                        <span className="font-bold text-sky-400">{zone.avgScore.toFixed(1)}/100</span>
                      </div>
                    </div>
                    <div className="h-4 w-full rounded-md bg-slate-800 overflow-hidden relative">
                      <div
                        className="h-full bg-[#3498db] transition-all duration-500 rounded-md"
                        style={{ width: `${pct}%` }}
                      />
                      {/* 80 benchmark guide */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-emerald-400/70"
                        style={{ left: '80%' }}
                        title="Safe threshold (80)"
                      />
                    </div>
                    <div className="mt-0.5 flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Avg pH: {zone.avgPh.toFixed(2)}</span>
                      <span>Turb: {zone.avgTurbidity.toFixed(2)} NTU</span>
                      <span>TDS: {zone.avgTds.toFixed(0)} ppm</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-900 flex justify-between text-[11px] font-mono text-slate-400">
              <span>Baseline: 0</span>
              <span className="text-emerald-400">Target Safe Baseline: ≥ 80.0</span>
              <span>Max: 100</span>
            </div>
          </div>
        )}

        {/* CHART 3: pH Level Distribution (Histogram) */}
        {(activeTab === 'all' || activeTab === 'ph') && (
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#9b59b6]" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Chart 3: pH Level Distribution (Histogram)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                PySustain Matplotlib #3
              </span>
            </div>

            <div className="mt-4">
              {/* Histogram visualization */}
              <div className="relative h-44 w-full flex items-end gap-1.5 pt-4 pb-6 px-2 border-b border-slate-800">
                {/* Min Target Guide Line (6.5) */}
                <div
                  className="absolute top-0 bottom-6 border-l-2 border-dashed border-red-500 z-10 pointer-events-none"
                  style={{ left: '33%' }}
                >
                  <span className="absolute -top-1 left-1 text-[9px] font-mono text-red-400 bg-slate-950/80 px-1 rounded whitespace-nowrap">
                    Min Target (6.5)
                  </span>
                </div>

                {/* Max Target Guide Line (8.5) */}
                <div
                  className="absolute top-0 bottom-6 border-l-2 border-dashed border-red-500 z-10 pointer-events-none"
                  style={{ left: '73%' }}
                >
                  <span className="absolute -top-1 left-1 text-[9px] font-mono text-red-400 bg-slate-950/80 px-1 rounded whitespace-nowrap">
                    Max Target (8.5)
                  </span>
                </div>

                {/* Bins */}
                {phBins.map((bin) => {
                  const heightPct = (bin.count / maxBinCount) * 100;
                  const isOptimal = bin.min >= 6.5 && bin.max <= 8.5;
                  return (
                    <div
                      key={bin.label}
                      className="flex-1 flex flex-col items-center h-full justify-end group relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 hidden group-hover:flex flex-col items-center bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-white z-20 whitespace-nowrap">
                        <span>{bin.label}</span>
                        <span className="text-purple-300 font-bold">{bin.count} samples</span>
                      </div>

                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isOptimal ? 'bg-[#9b59b6]' : 'bg-[#9b59b6]/60 hover:bg-[#9b59b6]'
                        }`}
                        style={{ height: `${Math.max(4, heightPct)}%` }}
                      />
                      <span className="absolute -bottom-5 text-[9px] font-mono text-slate-400">
                        {bin.min.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-red-400">Acidic (&lt; 6.5)</span>
                <span className="text-emerald-400 font-bold">Optimal Drinking Band (6.5 – 8.5)</span>
                <span className="text-red-400">Alkaline (&gt; 8.5)</span>
              </div>
            </div>
          </div>
        )}

        {/* CHART 4: TDS vs. Turbidity Correlation (Scatter Plot) */}
        {(activeTab === 'all' || activeTab === 'scatter') && (
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <ScatterChart className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Chart 4: TDS vs. Turbidity Correlation
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                PySustain Matplotlib #4
              </span>
            </div>

            <div className="mt-2 relative">
              <svg viewBox={`0 0 ${scatterWidth} ${scatterHeight}`} className="w-full h-44 overflow-visible">
                {/* Plot Background and Grid */}
                <rect
                  x={paddingX}
                  y={paddingY}
                  width={plotW}
                  height={plotH}
                  fill="#0b0f19"
                  stroke="#1e293b"
                  strokeWidth="1"
                />

                {/* Acceptable Threshold Box (TDS <= 500, Turbidity <= 5.0) */}
                <rect
                  x={paddingX}
                  y={paddingY + plotH - ((5.0 - turbMin) / (turbMax - turbMin)) * plotH}
                  width={((500 - tdsMin) / (tdsMax - tdsMin)) * plotW}
                  height={((5.0 - turbMin) / (turbMax - turbMin)) * plotH}
                  fill="#2ecc71"
                  fillOpacity="0.06"
                  stroke="#2ecc71"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />

                {/* Y-Axis Grid Lines (Turbidity: 0, 2.5, 5.0, 7.5 NTU) */}
                {[0, 2.5, 5.0, 7.5].map((val) => {
                  const y = paddingY + plotH - ((val - turbMin) / (turbMax - turbMin)) * plotH;
                  return (
                    <g key={`turb-grid-${val}`}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={paddingX + plotW}
                        y2={y}
                        stroke="#1e293b"
                        strokeDasharray={val === 5.0 ? '2 2' : 'none'}
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 6}
                        y={y + 3}
                        fill={val === 5.0 ? '#f87171' : '#64748b'}
                        fontSize="9"
                        textAnchor="end"
                        fontFamily="monospace"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis Grid Lines (TDS: 200, 400, 600, 800 ppm) */}
                {[200, 300, 500, 700].map((val) => {
                  const x = paddingX + ((val - tdsMin) / (tdsMax - tdsMin)) * plotW;
                  return (
                    <g key={`tds-grid-${val}`}>
                      <line
                        x1={x}
                        y1={paddingY}
                        x2={x}
                        y2={paddingY + plotH}
                        stroke="#1e293b"
                        strokeDasharray={val === 500 ? '2 2' : 'none'}
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y={paddingY + plotH + 14}
                        fill={val === 500 ? '#f87171' : '#64748b'}
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Axis Labels */}
                <text
                  x={paddingX + plotW / 2}
                  y={scatterHeight - 2}
                  fill="#94a3b8"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  TDS (ppm)
                </text>
                <text
                  transform={`rotate(-90) translate(-${paddingY + plotH / 2}, 12)`}
                  fill="#94a3b8"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  Turbidity (NTU)
                </text>

                {/* Scatter Points */}
                {samples.map((s) => {
                  const cx = paddingX + ((Math.min(tdsMax, Math.max(tdsMin, s.TDS_PPM)) - tdsMin) / (tdsMax - tdsMin)) * plotW;
                  const cy = paddingY + plotH - ((Math.min(turbMax, Math.max(turbMin, s.Turbidity_NTU)) - turbMin) / (turbMax - turbMin)) * plotH;
                  const color = getViridisColor(s.Score);

                  return (
                    <circle
                      key={s.Sample_ID}
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill={color}
                      fillOpacity="0.85"
                      stroke="#0f172a"
                      strokeWidth="1"
                      className="cursor-pointer hover:r-6 hover:fill-white transition-all"
                      onMouseEnter={() => setHoveredScatterPoint(s)}
                      onMouseLeave={() => setHoveredScatterPoint(null)}
                    />
                  );
                })}
              </svg>

              {/* Hover Inspection HUD */}
              {hoveredScatterPoint && (
                <div className="absolute top-2 right-2 bg-slate-900/95 border border-slate-700 p-2.5 rounded shadow-lg text-[11px] font-mono text-slate-200 z-20 max-w-xs">
                  <div className="font-bold text-cyan-300">{hoveredScatterPoint.Sample_ID}</div>
                  <div className="text-slate-400 text-[10px]">{hoveredScatterPoint.Location}</div>
                  <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5">
                    <span>pH: {hoveredScatterPoint.pH.toFixed(2)}</span>
                    <span>Turb: {hoveredScatterPoint.Turbidity_NTU.toFixed(2)} NTU</span>
                    <span>TDS: {hoveredScatterPoint.TDS_PPM.toFixed(1)} ppm</span>
                    <span className="font-bold text-white">Score: {hoveredScatterPoint.Score}/100</span>
                  </div>
                  <div className={`mt-1 font-semibold ${
                    hoveredScatterPoint.Verdict === 'Safe' ? 'text-emerald-400' : hoveredScatterPoint.Verdict === 'Needs Basic Filtration' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {hoveredScatterPoint.Verdict}
                  </div>
                </div>
              )}
            </div>

            {/* Viridis Colorbar Legend */}
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Score Scale:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-rose-400">0 (Critical)</span>
                <div className="h-2 w-28 rounded bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />
                <span className="text-emerald-400">100 (Optimal)</span>
              </div>
              <span className="text-[10px] text-slate-400">Green box = Safe zone</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
