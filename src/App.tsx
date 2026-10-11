/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { LaboratoryBanner } from './components/LaboratoryBanner';
import { ParameterEvaluator } from './components/ParameterEvaluator';
import { VerdictGauge } from './components/VerdictGauge';
import { TreatmentRecommendations } from './components/TreatmentRecommendations';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { DatasetTable } from './components/DatasetTable';
import { StandardsReference } from './components/StandardsReference';
import {
  evaluateWaterSample,
  generateSampleDataset,
  analyzeWaterData,
  MONITORING_LOCATIONS,
  exportSamplesToCSV
} from './utils/waterEngine';
import {
  WaterSample,
  MonitoringLocation,
  PresetScenario
} from './types/water';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  // Synthetic dataset initialized with 50 samples matching Python script
  const [samples, setSamples] = useState<WaterSample[]>(() => generateSampleDataset(50));

  // Current interactive evaluator state
  const [ph, setPh] = useState<number>(7.25);
  const [turbidity, setTurbidity] = useState<number>(0.85);
  const [tds, setTds] = useState<number>(215.0);
  const [location, setLocation] = useState<MonitoringLocation>('Zone B - Residential Tap');

  // Live simulation telemetry stream state
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);

  // Evaluate current manual water sample
  const currentEvaluation = useMemo(() => {
    return evaluateWaterSample(ph, turbidity, tds);
  }, [ph, turbidity, tds]);

  // Aggregate dataset analytics
  const analytics = useMemo(() => {
    return analyzeWaterData(samples);
  }, [samples]);

  // Toast feedback auto-dismiss
  useEffect(() => {
    if (!feedbackToast) return;
    const timer = setTimeout(() => setFeedbackToast(null), 3000);
    return () => clearTimeout(timer);
  }, [feedbackToast]);

  // Telemetry stream ticker
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      // Pick random location
      const randomLoc = MONITORING_LOCATIONS[Math.floor(Math.random() * MONITORING_LOCATIONS.length)];

      // Generate realistic reading centered on normal with occasional drift
      const streamPh = Math.round((5.6 + Math.random() * (9.3 - 5.6)) * 100) / 100;
      const streamTurb = Math.round((0.4 + Math.random() * (7.5 - 0.4)) * 100) / 100;
      const streamTds = Math.round((160 + Math.random() * (720 - 160)) * 10) / 10;

      const evalRes = evaluateWaterSample(streamPh, streamTurb, streamTds);

      const newSample: WaterSample = {
        Sample_ID: `WAMP-${String(Date.now()).slice(-4)}`,
        Location: randomLoc,
        pH: streamPh,
        Turbidity_NTU: streamTurb,
        TDS_PPM: streamTds,
        Score: evalRes.Quality_Score,
        Verdict: evalRes.Verdict,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setSamples((prev) => [newSample, ...prev.slice(0, 74)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: PresetScenario) => {
    setPh(preset.pH);
    setTurbidity(preset.turbidity);
    setTds(preset.tds);
    setLocation(preset.location);
    setFeedbackToast({
      message: `Loaded Preset: ${preset.name}`,
      type: 'success'
    });
  };

  // Record Current Evaluator Sample to the Dataset
  const handleCommitSample = () => {
    const newSample: WaterSample = {
      Sample_ID: `WAMP-USR-${String(samples.length + 1).padStart(3, '0')}`,
      Location: location,
      pH: ph,
      Turbidity_NTU: turbidity,
      TDS_PPM: tds,
      Score: currentEvaluation.Quality_Score,
      Verdict: currentEvaluation.Verdict,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setSamples((prev) => [newSample, ...prev]);
    setFeedbackToast({
      message: `Recorded Sample ${newSample.Sample_ID} to telemetry database`,
      type: 'success'
    });
  };

  // Inject Anomaly Scenarios
  const handleInjectAnomaly = (type: 'acid' | 'turbidity' | 'tds') => {
    let anomalyPh = ph;
    let anomalyTurb = turbidity;
    let anomalyTds = tds;
    let anomalyLoc = location;
    let label = '';

    if (type === 'acid') {
      anomalyPh = 4.35;
      anomalyTurb = 2.40;
      anomalyTds = 560.0;
      anomalyLoc = 'Zone C - Industrial Drain';
      label = 'Severe Acid Leak (pH 4.35)';
    } else if (type === 'turbidity') {
      anomalyPh = 6.90;
      anomalyTurb = 8.45;
      anomalyTds = 310.0;
      anomalyLoc = 'Zone A - River Inlet';
      label = 'Sediment Flash Silt Surge (8.45 NTU)';
    } else {
      anomalyPh = 8.10;
      anomalyTurb = 1.30;
      anomalyTds = 790.0;
      anomalyLoc = 'Zone C - Industrial Drain';
      label = 'High Saline Chemical Discharge (790 ppm)';
    }

    setPh(anomalyPh);
    setTurbidity(anomalyTurb);
    setTds(anomalyTds);
    setLocation(anomalyLoc);

    const evalResult = evaluateWaterSample(anomalyPh, anomalyTurb, anomalyTds);
    const newSample: WaterSample = {
      Sample_ID: `ALERT-${String(Date.now()).slice(-4)}`,
      Location: anomalyLoc,
      pH: anomalyPh,
      Turbidity_NTU: anomalyTurb,
      TDS_PPM: anomalyTds,
      Score: evalResult.Quality_Score,
      Verdict: evalResult.Verdict,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setSamples((prev) => [newSample, ...prev]);
    setFeedbackToast({
      message: `Injected Anomaly Event: ${label}`,
      type: 'alert'
    });
  };

  // Inspect and load sample from table into evaluator
  const handleSelectSample = (s: WaterSample) => {
    setPh(s.pH);
    setTurbidity(s.Turbidity_NTU);
    setTds(s.TDS_PPM);
    if (MONITORING_LOCATIONS.includes(s.Location as MonitoringLocation)) {
      setLocation(s.Location as MonitoringLocation);
    }
    setFeedbackToast({
      message: `Loaded Sample ${s.Sample_ID} into active evaluator console`,
      type: 'success'
    });

    const el = document.getElementById('evaluator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset baseline
  const handleResetToDefaults = () => {
    setPh(7.25);
    setTurbidity(0.85);
    setTds(215.0);
    setLocation('Zone B - Residential Tap');
  };

  // Regenerate entire 50-sample dataset
  const handleResetData = () => {
    setSamples(generateSampleDataset(50));
    setFeedbackToast({
      message: 'Generated 50 new synthetic telemetry samples across all zones',
      type: 'success'
    });
  };

  // Export CSV
  const handleExportData = () => {
    const csvContent = exportSamplesToCSV(samples);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `water_quality_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedbackToast({
      message: 'Exported telemetry dataset to CSV',
      type: 'success'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract (3 Zones) */}
      <Header
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        onExportData={handleExportData}
        onResetData={handleResetData}
      />

      {/* Main Single Dashboard Stage */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Laboratory Hero & Telemetry Banner */}
        <LaboratoryBanner
          isStreaming={isStreaming}
          onToggleStreaming={() => setIsStreaming(!isStreaming)}
          onInjectAnomaly={handleInjectAnomaly}
        />

        {/* Core Live Evaluation Section: 2-Column Split */}
        <div id="evaluator-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Column 1: Interactive Parameter Controls (7 cols) */}
          <div className="lg:col-span-7">
            <ParameterEvaluator
              ph={ph}
              turbidity={turbidity}
              tds={tds}
              location={location}
              onPhChange={setPh}
              onTurbidityChange={setTurbidity}
              onTdsChange={setTds}
              onLocationChange={setLocation}
              onSelectPreset={handleSelectPreset}
              onCommitSample={handleCommitSample}
              onResetToDefaults={handleResetToDefaults}
            />
          </div>

          {/* Column 2: Safety Scorecard & Verdict Gauge (5 cols) */}
          <div className="lg:col-span-5">
            <VerdictGauge
              evaluation={currentEvaluation}
              ph={ph}
              turbidity={turbidity}
              tds={tds}
            />
          </div>
        </div>

        {/* Treatment Recommendations & Solutions Engine */}
        <TreatmentRecommendations
          evaluation={currentEvaluation}
          tds={tds}
        />

        {/* Visual Analytics Dashboard: Quad Matplotlib Chart Equivalents */}
        <AnalyticsCharts
          samples={samples}
          analytics={analytics}
        />

        {/* Dataset Table & Inspection Log */}
        <DatasetTable
          samples={samples}
          onSelectSample={handleSelectSample}
        />

        {/* Standards & Guidelines Matrix */}
        <StandardsReference />
      </main>

      {/* Quiet, Human Editorial Footer */}
      <footer className="mt-12 border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">PySustain Smart Water Quality Engine</span>
            <span aria-hidden="true">·</span>
            <span>Empirical Environmental Analytics</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>WHO Potability Baseline</span>
            <span aria-hidden="true">·</span>
            <span>EPA 40 CFR Part 141</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Multi-Zone Telemetry</span>
          </div>
        </div>
      </footer>

      {/* Floating Action Feedback Notification */}
      {feedbackToast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 shadow-xl backdrop-blur-md transition-all ${
            feedbackToast.type === 'alert'
              ? 'border-rose-500/50 bg-rose-950/90 text-rose-200'
              : 'border-cyan-500/50 bg-slate-900/95 text-cyan-200'
          }`}
        >
          {feedbackToast.type === 'alert' ? (
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
          )}
          <span className="text-xs font-medium font-mono">{feedbackToast.message}</span>
        </div>
      )}
    </div>
  );
}
