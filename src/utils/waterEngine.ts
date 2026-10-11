import {
  WaterEvaluation,
  WaterSample,
  DatasetAnalytics,
  ZoneSummary,
  ParameterStatus,
  WaterVerdict,
  MonitoringLocation,
  PresetScenario
} from '../types/water';

export const MONITORING_LOCATIONS: MonitoringLocation[] = [
  'Zone A - River Inlet',
  'Zone B - Residential Tap',
  'Zone C - Industrial Drain',
  'Zone D - Well Water'
];

/**
 * Evaluates individual water parameters and returns a score out of 100
 * along with safety classifications and treatment recommendations.
 * Ported faithfully from PySustain rule engine.
 */
export function evaluateWaterSample(ph: number, turbidity: number, tds: number): WaterEvaluation {
  // pH evaluation (Ideal: 6.5 - 8.5)
  let ph_status: ParameterStatus;
  let ph_points: number;
  let ph_solution: string;

  if (ph >= 6.5 && ph <= 8.5) {
    ph_status = 'Optimal';
    ph_points = 35;
    ph_solution = `The pH value is ${ph.toFixed(2)}, which is within the target range of 6.5-8.5. No pH correction is indicated by this reading. Continue routine water-quality monitoring.`;
  } else if (ph >= 6.0 && ph < 6.5) {
    ph_status = 'Moderate';
    ph_points = 20;
    ph_solution = `The pH value is ${ph.toFixed(2)}, which is slightly below the target range of 6.5-8.5. This means the water is slightly acidic. Acidic water may corrode pipes and allow metals to dissolve into the water. A suitable treatment system can raise the pH through controlled neutralization. The water should be retested after treatment.`;
  } else if (ph > 8.5 && ph <= 9.0) {
    ph_status = 'Moderate';
    ph_points = 20;
    ph_solution = `The pH value is ${ph.toFixed(2)}, which is slightly above the target range of 6.5-8.5. This means the water is alkaline. High pH may affect taste and the effectiveness of some disinfection processes. A suitable treatment system can lower the pH through controlled adjustment. Retest the water after treatment.`;
  } else if (ph < 6.0) {
    ph_status = 'Critical';
    ph_points = 0;
    ph_solution = `The pH value is ${ph.toFixed(2)}, which is well below the target range of 6.5-8.5. The water is acidic, and this can increase pipe corrosion and the possibility of metals entering the water. Have the water tested and use professionally controlled neutralization treatment to raise the pH into the target range. Retest before considering the water for drinking.`;
  } else {
    ph_status = 'Critical';
    ph_points = 0;
    ph_solution = `The pH value is ${ph.toFixed(2)}, which is above the target range of 6.5-8.5. The water is too alkaline for this project's target. This may affect taste and some treatment processes. Have the water tested and use a professionally controlled pH-adjustment system to lower the pH into the target range. Retest after treatment.`;
  }

  // Turbidity evaluation (Ideal: <= 1.0 NTU, Maximum Acceptable: 5.0 NTU)
  let turb_status: ParameterStatus;
  let turb_points: number;
  let turb_solution: string;

  if (turbidity <= 1.0) {
    turb_status = 'Optimal';
    turb_points = 35;
    turb_solution = `The turbidity value is ${turbidity.toFixed(2)} NTU, which meets the preferred target of 1.0 NTU or lower. The water has a low level of suspended particles according to this measurement. Continue routine monitoring.`;
  } else if (turbidity <= 5.0) {
    turb_status = 'Moderate';
    turb_points = 25;
    turb_solution = `The turbidity value is ${turbidity.toFixed(2)} NTU. The water may contain suspended particles such as soil, clay, silt, or organic matter, making it less clear than the preferred target of 1.0 NTU. Allowing particles to settle and then using suitable filtration may reduce turbidity. Investigate the source if cloudiness persists and retest the water. Meeting the 5 NTU project threshold alone does not prove that the water is safe to drink.`;
  } else {
    turb_status = 'Critical';
    turb_points = 0;
    turb_solution = `The turbidity value is ${turbidity.toFixed(2)} NTU, exceeding the project's maximum acceptable target of 5.0 NTU. The water may contain substantial suspended material, such as mud, silt, clay, or organic particles. High turbidity can interfere with disinfection because particles may shield microorganisms from disinfectants. First, identify the source of the particles. Suitable settling, clarification, and filtration may help remove them. Use an appropriate validated disinfection process when required, then retest the water before considering it for drinking.`;
  }

  // TDS evaluation (Ideal: < 300 ppm, Max Acceptable: 500 ppm)
  let tds_status: ParameterStatus;
  let tds_points: number;
  let tds_info: string | undefined = undefined;

  if (tds < 300) {
    tds_status = 'Optimal';
    tds_points = 30;
  } else if (tds <= 500) {
    tds_status = 'Moderate';
    tds_points = 20;
    tds_info = `Your TDS value is ${tds.toFixed(1)} ppm. The project's preferred target is below 300 ppm. However, TDS alone does not establish whether water is safe or unsafe to drink.`;
  } else {
    tds_status = 'Critical';
    tds_points = 0;
    tds_info = `Your TDS value is ${tds.toFixed(1)} ppm, exceeding the project's maximum target of 500 ppm. Identify the dissolved substances through appropriate testing and select a suitable treatment method.`;
  }

  const total_score = ph_points + turb_points + tds_points;

  // Preliminary score-based verdict
  let verdict: WaterVerdict;
  if (total_score >= 80) {
    verdict = 'Safe';
  } else if (total_score >= 50) {
    verdict = 'Needs Basic Filtration';
  } else {
    verdict = 'Unsafe / Hazardous';
  }

  // Additional suitability check:
  // Prevent an acceptable score from hiding an out-of-range parameter.
  const drinking_screen_pass = ph >= 6.5 && ph <= 8.5 && turbidity <= 5.0 && tds <= 500;

  // Preserve the original score while making the verdict reflect
  // whether the measured parameters meet the project's targets.
  if (!drinking_screen_pass) {
    verdict = 'Unsafe / Hazardous';
  }

  // Safety disclaimer
  const safety_disclaimer = verdict === 'Unsafe / Hazardous'
    ? 'Do not consider the water suitable for drinking until it has been appropriately treated and tested.'
    : "The readings meet the project's screening criteria, but this does not certify that the water is safe to drink. Microbes and other contaminants have not been tested.";

  return {
    pH_Status: ph_status,
    Turbidity_Status: turb_status,
    TDS_Status: tds_status,
    Quality_Score: total_score,
    Verdict: verdict,
    pH_Solution: ph_solution,
    Turbidity_Solution: turb_solution,
    drinking_screen_pass,
    ph_points,
    turb_points,
    tds_points,
    tds_info,
    safety_disclaimer
  };
}

/**
 * Generates a synthetic dataset of water samples simulating multi-station telemetry
 */
export function generateSampleDataset(numSamples = 50): WaterSample[] {
  const data: WaterSample[] = [];

  for (let i = 1; i <= numSamples; i++) {
    const ph = Math.round((5.5 + Math.random() * (9.5 - 5.5)) * 100) / 100;
    const turbidity = Math.round((0.5 + Math.random() * (8.0 - 0.5)) * 100) / 100;
    const tds = Math.round((150 + Math.random() * (750 - 150)) * 10) / 10;
    const location = MONITORING_LOCATIONS[Math.floor(Math.random() * MONITORING_LOCATIONS.length)];

    const result = evaluateWaterSample(ph, turbidity, tds);

    data.push({
      Sample_ID: `WAMP-${String(i).padStart(3, '0')}`,
      Location: location,
      pH: ph,
      Turbidity_NTU: turbidity,
      TDS_PPM: tds,
      Score: result.Quality_Score,
      Verdict: result.Verdict,
      timestamp: new Date(Date.now() - (numSamples - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
  }

  return data;
}

/**
 * Computes summary statistics matching the Python data analytics module
 */
export function analyzeWaterData(samples: WaterSample[]): DatasetAnalytics {
  if (samples.length === 0) {
    return {
      totalSamples: 0,
      averageScore: 0,
      verdictCounts: { 'Safe': 0, 'Needs Basic Filtration': 0, 'Unsafe / Hazardous': 0 },
      locationAverages: []
    };
  }

  const totalScore = samples.reduce((acc, s) => acc + s.Score, 0);
  const averageScore = Math.round((totalScore / samples.length) * 100) / 100;

  const verdictCounts: Record<WaterVerdict, number> = {
    'Safe': 0,
    'Needs Basic Filtration': 0,
    'Unsafe / Hazardous': 0
  };

  const locationGroups: Record<string, { totalPh: number; totalTurb: number; totalTds: number; totalScore: number; count: number }> = {};

  for (const loc of MONITORING_LOCATIONS) {
    locationGroups[loc] = { totalPh: 0, totalTurb: 0, totalTds: 0, totalScore: 0, count: 0 };
  }

  for (const s of samples) {
    if (verdictCounts[s.Verdict] !== undefined) {
      verdictCounts[s.Verdict]++;
    }

    if (!locationGroups[s.Location]) {
      locationGroups[s.Location] = { totalPh: 0, totalTurb: 0, totalTds: 0, totalScore: 0, count: 0 };
    }
    locationGroups[s.Location].totalPh += s.pH;
    locationGroups[s.Location].totalTurb += s.Turbidity_NTU;
    locationGroups[s.Location].totalTds += s.TDS_PPM;
    locationGroups[s.Location].totalScore += s.Score;
    locationGroups[s.Location].count += 1;
  }

  const locationAverages: ZoneSummary[] = Object.entries(locationGroups).map(([location, stats]) => {
    const c = stats.count || 1;
    return {
      location,
      avgPh: Math.round((stats.totalPh / c) * 100) / 100,
      avgTurbidity: Math.round((stats.totalTurb / c) * 100) / 100,
      avgTds: Math.round((stats.totalTds / c) * 10) / 10,
      avgScore: Math.round((stats.totalScore / c) * 100) / 100,
      sampleCount: stats.count
    };
  });

  return {
    totalSamples: samples.length,
    averageScore,
    verdictCounts,
    locationAverages
  };
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'pristine-tap',
    name: 'Municipal Tap (Purified)',
    category: 'Optimal',
    description: 'Meets WHO & PySustain screening bounds with clear particulate filtration and balanced minerals.',
    location: 'Zone B - Residential Tap',
    pH: 7.25,
    turbidity: 0.65,
    tds: 210.0
  },
  {
    id: 'river-turbid',
    name: 'River Inlet (Sediment Load)',
    category: 'Moderate',
    description: 'Elevated silt and clay suspension from seasonal rain run-off; requires flocculation and media filtration.',
    location: 'Zone A - River Inlet',
    pH: 6.85,
    turbidity: 3.40,
    tds: 340.0
  },
  {
    id: 'industrial-acid',
    name: 'Industrial Drain (Chemical Runoff)',
    category: 'Critical',
    description: 'Corrosive acidic effluent with dissolved synthetic salts and elevated turbidity; high environmental hazard.',
    location: 'Zone C - Industrial Drain',
    pH: 5.10,
    turbidity: 6.80,
    tds: 690.0
  },
  {
    id: 'well-mineral',
    name: 'Deep Well (Alkaline Hard Water)',
    category: 'Moderate',
    description: 'Subterranean limestone aquifer with elevated dissolved minerals and slightly alkaline pH.',
    location: 'Zone D - Well Water',
    pH: 8.65,
    turbidity: 1.15,
    tds: 520.0
  },
  {
    id: 'acid-drainage',
    name: 'Acid Mine Drainage Simulation',
    category: 'Critical',
    description: 'Severe leaching with pH < 4.5, hazardous metal dissolution risks, failing the safety screening gate.',
    location: 'Zone C - Industrial Drain',
    pH: 4.20,
    turbidity: 4.90,
    tds: 610.0
  }
];

export function exportSamplesToCSV(samples: WaterSample[]): string {
  const headers = ['Sample_ID', 'Location', 'pH', 'Turbidity_NTU', 'TDS_PPM', 'Score', 'Verdict', 'Timestamp'];
  const rows = samples.map(s => [
    s.Sample_ID,
    `"${s.Location}"`,
    s.pH.toFixed(2),
    s.Turbidity_NTU.toFixed(2),
    s.TDS_PPM.toFixed(1),
    s.Score,
    `"${s.Verdict}"`,
    `"${s.timestamp}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
