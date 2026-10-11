import React, { useState, useMemo } from 'react';
import { Search, Download, ArrowUpDown, Database, AlertCircle } from 'lucide-react';
import { WaterSample, WaterVerdict, MonitoringLocation } from '../types/water';
import { MONITORING_LOCATIONS, exportSamplesToCSV } from '../utils/waterEngine';

interface DatasetTableProps {
  samples: WaterSample[];
  onSelectSample: (sample: WaterSample) => void;
}

export const DatasetTable: React.FC<DatasetTableProps> = ({
  samples,
  onSelectSample
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof WaterSample>('Sample_ID');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter and sort samples
  const filteredSamples = useMemo(() => {
    return samples
      .filter((s) => {
        const matchesSearch =
          s.Sample_ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.Location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesZone = selectedZone === 'all' || s.Location === selectedZone;
        const matchesVerdict = selectedVerdict === 'all' || s.Verdict === selectedVerdict;
        return matchesSearch && matchesZone && matchesVerdict;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA);
        const strB = String(valB);
        return sortDirection === 'asc'
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
  }, [samples, searchQuery, selectedZone, selectedVerdict, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredSamples.length / itemsPerPage) || 1;
  const paginatedSamples = filteredSamples.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof WaterSample) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = exportSamplesToCSV(samples);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `water_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getVerdictBadge = (verdict: WaterVerdict) => {
    switch (verdict) {
      case 'Safe':
        return <span className="font-mono text-xs font-semibold text-emerald-400">Safe</span>;
      case 'Needs Basic Filtration':
        return <span className="font-mono text-xs font-semibold text-amber-400">Needs Filtration</span>;
      case 'Unsafe / Hazardous':
      default:
        return <span className="font-mono text-xs font-semibold text-rose-400">Unsafe / Hazardous</span>;
    }
  };

  return (
    <div id="dataset-section" className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 lg:p-6 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">
              Sensor Telemetry Dataset & Inspection Log
            </h2>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span>{samples.length} Active Telemetry Records</span>
            <span aria-hidden="true">·</span>
            <span>4 Municipal Monitoring Zones</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Sync</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="mt-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Sample ID or Station..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-800 bg-slate-950/70 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Zone Filter */}
          <select
            value={selectedZone}
            onChange={(e) => {
              setSelectedZone(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Monitoring Zones</option>
            {MONITORING_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Verdict Filter */}
          <select
            value={selectedVerdict}
            onChange={(e) => {
              setSelectedVerdict(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Verdicts</option>
            <option value="Safe">Safe</option>
            <option value="Needs Basic Filtration">Needs Basic Filtration</option>
            <option value="Unsafe / Hazardous">Unsafe / Hazardous</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
            <tr>
              <th
                onClick={() => handleSort('Sample_ID')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Sample ID</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Location')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Monitoring Station</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('pH')}
                className="py-3 px-3 cursor-pointer hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>pH</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Turbidity_NTU')}
                className="py-3 px-3 cursor-pointer hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Turbidity (NTU)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('TDS_PPM')}
                className="py-3 px-3 cursor-pointer hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>TDS (ppm)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Score')}
                className="py-3 px-3 cursor-pointer hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Score / 100</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Verdict')}
                className="py-3 px-3 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Safety Verdict</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-900/30">
            {paginatedSamples.length > 0 ? (
              paginatedSamples.map((s) => (
                <tr
                  key={s.Sample_ID}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  onClick={() => onSelectSample(s)}
                >
                  <td className="py-2.5 px-3 font-mono font-medium text-cyan-300">
                    {s.Sample_ID}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {s.Location}
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-right text-slate-200">
                    <span className={s.pH < 6.5 || s.pH > 8.5 ? 'text-amber-400 font-bold' : ''}>
                      {s.pH.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-right text-slate-200">
                    <span className={s.Turbidity_NTU > 5.0 ? 'text-rose-400 font-bold' : s.Turbidity_NTU > 1.0 ? 'text-amber-400' : ''}>
                      {s.Turbidity_NTU.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-right text-slate-200">
                    <span className={s.TDS_PPM > 500 ? 'text-rose-400 font-bold' : s.TDS_PPM > 300 ? 'text-amber-400' : ''}>
                      {s.TDS_PPM.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-right font-bold text-white">
                    {s.Score}
                  </td>
                  <td className="py-2.5 px-3">
                    {getVerdictBadge(s.Verdict)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSample(s);
                      }}
                      className="text-xs text-cyan-400 group-hover:text-cyan-300 hover:underline font-mono"
                    >
                      Inspect & Load
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <AlertCircle className="h-5 w-5 text-slate-500" />
                    <span>No telemetry records match your current filter criteria.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Strip */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono">
          Showing {filteredSamples.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredSamples.length)} of {filteredSamples.length} filtered records
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 disabled:opacity-40 hover:bg-slate-800 font-mono"
          >
            Previous
          </button>
          <span className="px-2 font-mono">
            Page {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 disabled:opacity-40 hover:bg-slate-800 font-mono"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
