export type ParameterStatus = 'Optimal' | 'Moderate' | 'Critical';

export type WaterVerdict = 'Safe' | 'Needs Basic Filtration' | 'Unsafe / Hazardous';

export type MonitoringLocation = 
  | 'Zone A - River Inlet'
  | 'Zone B - Residential Tap'
  | 'Zone C - Industrial Drain'
  | 'Zone D - Well Water';

export interface WaterEvaluation {
  pH_Status: ParameterStatus;
  Turbidity_Status: ParameterStatus;
  TDS_Status: ParameterStatus;
  Quality_Score: number;
  Verdict: WaterVerdict;
  pH_Solution: string;
  Turbidity_Solution: string;
  drinking_screen_pass: boolean;
  ph_points: number;
  turb_points: number;
  tds_points: number;
  tds_info?: string;
  safety_disclaimer: string;
}

export interface WaterSample {
  Sample_ID: string;
  Location: string;
  pH: number;
  Turbidity_NTU: number;
  TDS_PPM: number;
  Score: number;
  Verdict: WaterVerdict;
  timestamp: string;
}

export interface ZoneSummary {
  location: string;
  avgPh: number;
  avgTurbidity: number;
  avgTds: number;
  avgScore: number;
  sampleCount: number;
}

export interface DatasetAnalytics {
  totalSamples: number;
  averageScore: number;
  verdictCounts: Record<WaterVerdict, number>;
  locationAverages: ZoneSummary[];
}

export interface PresetScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  location: MonitoringLocation;
  pH: number;
  turbidity: number;
  tds: number;
}
