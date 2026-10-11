import React from 'react';
import { BookOpen, Check, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

export const StandardsReference: React.FC = () => {
  return (
    <div id="standards-section" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 lg:p-6 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">
              Regulatory Standards & Scoring Matrix Specification
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            PySustain Rule Engine criteria mapped against World Health Organization (WHO) and EPA baselines.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          WHO Guidelines for Drinking-Water Quality (4th Ed.)
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Parameter</th>
              <th className="py-3 px-4">Optimal Range (Max Points)</th>
              <th className="py-3 px-4">Moderate Divergence</th>
              <th className="py-3 px-4">Critical / Hazard Limit</th>
              <th className="py-3 px-4">Weightage</th>
              <th className="py-3 px-4">Primary Health / Environmental Concern</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px] text-slate-300">
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 font-bold text-white">
                Hydrogen-Ion Potential (pH)
              </td>
              <td className="py-3 px-4 text-emerald-400">
                6.5 – 8.5 (35 pts)
              </td>
              <td className="py-3 px-4 text-amber-400">
                6.0–6.5 or 8.5–9.0 (20 pts)
              </td>
              <td className="py-3 px-4 text-rose-400">
                &lt; 6.0 or &gt; 9.0 (0 pts)
              </td>
              <td className="py-3 px-4 text-cyan-300">
                35%
              </td>
              <td className="py-3 px-4 text-slate-400 font-sans text-xs">
                Low pH causes pipe corrosion and heavy metal leaching (Pb, Cu). High pH induces scaling and hinders chlorination.
              </td>
            </tr>

            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 font-bold text-white">
                Turbidity (NTU)
              </td>
              <td className="py-3 px-4 text-emerald-400">
                ≤ 1.0 NTU (35 pts)
              </td>
              <td className="py-3 px-4 text-amber-400">
                1.0 – 5.0 NTU (25 pts)
              </td>
              <td className="py-3 px-4 text-rose-400">
                &gt; 5.0 NTU (0 pts)
              </td>
              <td className="py-3 px-4 text-cyan-300">
                35%
              </td>
              <td className="py-3 px-4 text-slate-400 font-sans text-xs">
                Suspended clay, silt, and microbes shield pathogenic organisms (Cryptosporidium, Giardia) from ultraviolet and chlorine disinfection.
              </td>
            </tr>

            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-4 font-bold text-white">
                Total Dissolved Solids (TDS ppm)
              </td>
              <td className="py-3 px-4 text-emerald-400">
                &lt; 300 ppm (30 pts)
              </td>
              <td className="py-3 px-4 text-amber-400">
                300 – 500 ppm (20 pts)
              </td>
              <td className="py-3 px-4 text-rose-400">
                &gt; 500 ppm (0 pts)
              </td>
              <td className="py-3 px-4 text-cyan-300">
                30%
              </td>
              <td className="py-3 px-4 text-slate-400 font-sans text-xs">
                Dissolved mineral salts and inorganic contaminants. High concentrations (&gt;500 ppm) signal brackish intrusion or industrial effluent.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Decision Tree & Screen Gate Clarification */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3.5">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase font-mono">
              Safe (Score ≥ 80)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            All parameters operate within physiological and aesthetic tolerances. Drinking screen pass must also be affirmatively met.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase font-mono">
              Needs Basic Filtration (50–79)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Moderate turbidity or minor pH drift. Particle sedimentation, 5μm cartridge filtration, or mild mineralization indicated.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3.5">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-rose-400" />
            <span className="text-xs font-bold text-rose-400 uppercase font-mono">
              Unsafe / Hazardous (&lt; 50 or Gate Fail)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Severe pH extremity (&lt;6 or &gt;9), high particulate density (&gt;5 NTU), or elevated chemical TDS (&gt;500 ppm). Non-potable.
          </p>
        </div>
      </div>
    </div>
  );
};
