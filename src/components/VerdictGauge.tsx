import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Check, X } from 'lucide-react';
import { WaterEvaluation } from '../types/water';

interface VerdictGaugeProps {
  evaluation: WaterEvaluation;
  ph: number;
  turbidity: number;
  tds: number;
}

export const VerdictGauge: React.FC<VerdictGaugeProps> = ({
  evaluation,
  ph,
  turbidity,
  tds
}) => {
  const {
    Quality_Score,
    Verdict,
    drinking_screen_pass,
    ph_points,
    turb_points,
    tds_points,
    pH_Status,
    Turbidity_Status,
    TDS_Status
  } = evaluation;

  // Gauge arc parameters
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Quality_Score / 100) * circumference;

  // Color scheme matching python matplotlib code
  // Safe: #2ecc71, Needs Basic Filtration: #f1c40f, Unsafe: #e74c3c
  const getVerdictStyles = () => {
    switch (Verdict) {
      case 'Safe':
        return {
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/40',
          bgColor: 'bg-emerald-950/20',
          hex: '#2ecc71',
          icon: ShieldCheck,
          kicker: 'POTABLE / PASS'
        };
      case 'Needs Basic Filtration':
        return {
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/40',
          bgColor: 'bg-amber-950/20',
          hex: '#f1c40f',
          icon: AlertTriangle,
          kicker: 'CONDITIONING REQUIRED'
        };
      case 'Unsafe / Hazardous':
      default:
        return {
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/40',
          bgColor: 'bg-rose-950/20',
          hex: '#e74c3c',
          icon: ShieldAlert,
          kicker: 'NON-POTABLE / CRITICAL'
        };
    }
  };

  const style = getVerdictStyles();
  const VerdictIcon = style.icon;

  // Screening criteria verification tests
  const phPass = ph >= 6.5 && ph <= 8.5;
  const turbPass = turbidity <= 5.0;
  const tdsPass = tds <= 500;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 lg:p-6 shadow-sm backdrop-blur-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-semibold text-white tracking-tight">
            Safety Scorecard & Verdict
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Rule Engine v2026
          </span>
        </div>

        {/* Circular Gauge and Primary Metric */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="rotate-[-90deg] transition-all duration-300"
            >
              {/* Background ring */}
              <circle
                stroke="#1e293b"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Dynamic progress ring */}
              <circle
                stroke={style.hex}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-500 ease-out"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold font-mono text-white tabular-nums tracking-tight">
                {Quality_Score}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Score / 100
              </span>
            </div>
          </div>

          {/* Verdict Status Box */}
          <div className={`mt-5 w-full rounded-lg border ${style.borderColor} ${style.bgColor} p-4 text-center transition-colors`}>
            <div className="flex items-center justify-center gap-2">
              <VerdictIcon className={`h-5 w-5 ${style.textColor}`} />
              <span className={`text-base font-bold tracking-tight ${style.textColor}`}>
                {Verdict}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-400 font-mono">
              Status: {style.kicker}
            </div>
          </div>
        </div>

        {/* Three Individual Scoring Pillars */}
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
            <span className="text-[11px] font-medium text-slate-400 block truncate">
              pH Balance
            </span>
            <div className="mt-1 text-lg font-mono font-bold text-white tabular-nums">
              {ph_points}
              <span className="text-xs font-normal text-slate-400">/35</span>
            </div>
            <span className={`mt-1 inline-block text-[10px] font-mono ${
              pH_Status === 'Optimal' ? 'text-emerald-400' : pH_Status === 'Moderate' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {pH_Status}
            </span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
            <span className="text-[11px] font-medium text-slate-400 block truncate">
              Turbidity
            </span>
            <div className="mt-1 text-lg font-mono font-bold text-white tabular-nums">
              {turb_points}
              <span className="text-xs font-normal text-slate-400">/35</span>
            </div>
            <span className={`mt-1 inline-block text-[10px] font-mono ${
              Turbidity_Status === 'Optimal' ? 'text-emerald-400' : Turbidity_Status === 'Moderate' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {Turbidity_Status}
            </span>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
            <span className="text-[11px] font-medium text-slate-400 block truncate">
              TDS Purity
            </span>
            <div className="mt-1 text-lg font-mono font-bold text-white tabular-nums">
              {tds_points}
              <span className="text-xs font-normal text-slate-400">/30</span>
            </div>
            <span className={`mt-1 inline-block text-[10px] font-mono ${
              TDS_Status === 'Optimal' ? 'text-emerald-400' : TDS_Status === 'Moderate' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {TDS_Status}
            </span>
          </div>
        </div>

        {/* Screening Gate Verification Details */}
        <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/40 p-3.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            <span>Drinking Suitability Screening Gate</span>
            <span className={`font-mono text-[11px] ${drinking_screen_pass ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
              {drinking_screen_pass ? 'Pass (Screen Cleared)' : 'Blocked (Failed Gate)'}
            </span>
          </div>

          <div className="mt-2.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-400 font-mono">
              <span className="text-[11px]">pH Threshold [6.5 – 8.5]:</span>
              <span className={`inline-flex items-center gap-1 ${phPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                {phPass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                <span>{ph.toFixed(2)}</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400 font-mono">
              <span className="text-[11px]">Turbidity Threshold [≤ 5.0 NTU]:</span>
              <span className={`inline-flex items-center gap-1 ${turbPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                {turbPass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                <span>{turbidity.toFixed(2)} NTU</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400 font-mono">
              <span className="text-[11px]">TDS Threshold [≤ 500 ppm]:</span>
              <span className={`inline-flex items-center gap-1 ${tdsPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tdsPass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                <span>{tds.toFixed(1)} ppm</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Gate Alert Note */}
      {!drinking_screen_pass && Quality_Score >= 50 && (
        <div className="mt-4 rounded border border-rose-500/30 bg-rose-950/30 p-2.5 text-[11px] text-rose-300">
          <strong>Rule Engine Override:</strong> Even though raw score was {Quality_Score}/100, one or more measured parameters breached critical drinking screening boundaries. Verdict has been set to <em>Unsafe / Hazardous</em>.
        </div>
      )}
    </div>
  );
};
