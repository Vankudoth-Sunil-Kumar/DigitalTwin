export type ViewMode = 
  | 'floor' 
  | 'plant' 
  | 'analytics' 
  | 'whatif' 
  | 'leadership' 
  | 'architecture' 
  | 'recommendation' 
  | 'audit';

export type StationStatus = 'optimal' | 'warning' | 'critical';

export type SensorInstrumentationTier = 'fully_instrumented' | 'partially_instrumented' | 'sensor_poor_inferred';

export interface StationData {
  id: string; // e.g. "ST01", "ST18", "ST32"
  number: number;
  name: string;
  zone: 'Zone 1: Body Const.' | 'Zone 2: Paint' | 'Zone 3: Final Assy';
  zoneId: 1 | 2 | 3;
  status: StationStatus;
  processType?: 'Welding' | 'Laser Brazing' | 'Robotic Spray' | 'Oven Curing' | 'Sub-Assembly' | 'Torque Bolting' | 'Inspection' | 'Fluid Fill' | 'Calibration' | string;
  vehicleModel?: string;
  cycleTime: number; // in seconds, e.g. 57.2
  targetCycleTime: number; // e.g. 56.0
  drift: number; // e.g. +0.8
  sensorCoverage: string; // e.g. "Partial (7/10)", "Full (10/10)", "Inferred (2/10)"
  sensorTier?: SensorInstrumentationTier;
  sensorOnlineCount: number;
  sensorTotalCount: number;
  isExplicitSensor: boolean; // true if direct IoT / PLC instrumentation, false if inferred from adjacent stations
  inferenceConfidence?: number; // e.g. 94.2%
  inferenceModel?: string; // e.g. "Kalman-Markov Particle Filter + Upstream/Downstream Flow"
  upstreamAnchor?: string;
  downstreamAnchor?: string;
  wipBuffer: number; // current WIP units in buffer
  maxWipBuffer: number; // max buffer capacity e.g. 8 units
  torqueNm?: number; // live torque reading in Nm
  vibrationMmS?: number; // live vibration velocity in mm/s
  temperatureC?: number; // live thermal reading in °C
  downtimeMinutesToday?: number;
  healthScore?: number; // 0 - 100
  anomalyScore?: number; // 0 - 100
  bottleneckProbability?: number; // 0 - 100
  defectProbability?: number; // 0 - 100
  timeToBottleneckMin?: number; // Estimated minutes to bottleneck impact
  potentialThroughputImpactPct?: number; // e.g. -8%
  affectedVehiclesCount?: number; // e.g. 42
  edgeGateway: 'Online' | 'Degraded' | 'Offline';
  maintenanceState?: 'Operational' | 'Inspection Due' | 'Intervention Recommended' | 'Under Maintenance';
  sparkHeights: number[]; // e.g. [50, 70, 90, 100, 80]
  historicalCycleTimes: number[]; // 8 data points for last 60m chart
  alertSummary?: string;
}

export interface MultiCausalContributor {
  factor: string;
  percentage: number;
  signalTrend: string;
  measuredDelta: string;
  description: string;
}

export interface AnomalyAlert {
  id: string;
  eventId: string;
  detectedTime: string;
  title: string;
  stationId: string;
  stationName: string;
  zone: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'acknowledged' | 'executed' | 'dismissed';
  rootCause: string;
  likelyRootCauseCategory?: 'Tool Wear / Mechanical Degradation' | 'Hydraulic Valve Latency' | 'Pneumatic Pressure Leak' | 'Thermal Dissipation Drift' | 'Sensor Calibration Error' | string;
  downstreamImpact: string;
  recommendedIntervention: string;
  aiConfidenceScore: number; // e.g. 87%
  bottleneckProbability?: number; // e.g. 78%
  estimatedTimeToImpactMin?: number; // e.g. 21
  potentialAffectedVehicles?: number; // e.g. 42
  potentialThroughputImpactPct?: number; // e.g. -8.5%
  isHighConfidenceWarning?: boolean; // true if confidence >= 80% (false-alert suppression filter)
  multiCausalContributors?: MultiCausalContributor[];
  propagationMap: {
    timeOffset: string; // "T+0m", "T+5m", "T+12m", "T+25m"
    stationId: string; // "ST18"
    stationName: string; // "Torque App"
    role: string; // "Anomaly Origin" | "WIP Buildup Pressure" | "Starvation Risk" | "Throughput Deficit"
    status: 'critical' | 'warning' | 'upcoming';
    predictedWipDelta?: string;
  }[];
  triggerEvidence: {
    metric: string;
    value: string;
    thresholdInfo: string;
    status: 'critical' | 'warning' | 'optimal';
    trend: string;
    bars: { height: number; color: 'gray' | 'warning' | 'critical' }[];
  }[];
  howInsightGenerated?: {
    dataLayer: string;
    intelligenceMethod: string;
    propagationModel: string;
    llmRole: string; // "Summary and Natural Language explanation only"
  };
}

export interface SupervisorActionLog {
  id: string;
  type: 'OVERRIDE' | 'ACKNOWLEDGED' | 'PARAMETERS ADJUSTED' | 'EXECUTED' | 'DISMISSED';
  timestamp: string;
  title: string;
  user: string;
  userId: string;
  stationId?: string;
  reason?: string;
  badgeColor?: 'status-critical' | 'status-healthy' | 'status-warning' | 'secondary' | string;
}

export interface DefectTraceItem {
  id: string;
  caughtAt: string;
  qaGate: string;
  incidentCount: number;
  description: string;
  severity: 'critical' | 'warning';
  rootCauseStation: string;
  rootCauseStationName?: string;
  rootCauseArea: string;
  rootCauseDescription: string;
  originLatencyMinutes?: number; // e.g. 45 min delay before detection at QA gate
  tracePath?: {
    stationId: string;
    name: string;
    event: string;
  }[];
}

export interface BottleneckRow {
  stationId: string;
  name?: string;
  avgCycle: number;
  varianceStr: string;
  drift?: number;
  infeedQueue?: number;
  rootCauseBrief?: string;
  status?: 'optimal' | 'warning' | 'critical';
  isCritical?: boolean;
  isWarning?: boolean;
  segments: {
    intensity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  }[];
}

export interface SpcDataPoint {
  sampleId: number;
  timestamp: string;
  meanCycle: number;
  rangeVal: number;
  torqueMean: number;
  vibrationMean?: number;
  isOutlier: boolean;
  stationId: string;
}

export interface WhatIfScenarioInput {
  targetStationId: string;
  adjustedCycleTime: number; // in seconds
  adjustedConveyorSpeed: number; // m/s (0.8 - 1.2)
  bufferLimit: number; // 4 - 16
  toolConditionState: 'degraded' | 'serviced' | 'new';
  sensorUpgradeTier: 'existing' | 'upgraded_iot';
  productionSurgeTarget: number; // 50 - 75 U/H
}

export interface WhatIfScenarioResult {
  bottleneckProbabilityBefore: number;
  bottleneckProbabilityAfter: number;
  wipAccumulationBeforePct: number;
  wipAccumulationAfterPct: number;
  throughputDeltaPct: number;
  defectRiskBeforePct: number;
  defectRiskAfterPct: number;
  estimatedCostAverted: number;
  propagationRiskResolved: boolean;
}

export interface HeroDemoStep {
  stepIndex: number;
  timeLabel: string;
  clockTime: string;
  title: string;
  subtitle: string;
  focusStationId: string;
  viewRecommendation: ViewMode;
  systemState: 'HEALTHY' | 'EARLY_DRIFT' | 'ANOMALY_TRIGGERED' | 'BOTTLENECK_PREDICTED' | 'PROPAGATION_FORECAST' | 'ROOT_CAUSE_ANALYSIS' | 'PREDICTIVE_WARNING' | 'WHAT_IF_INTERVENTION' | 'MAINTENANCE_EXECUTED' | 'RECOVERY_VERIFIED';
  explanationText: string;
  metrics: {
    cycleTime: number;
    vibrationMmS: number;
    wipBuffer: number;
    bottleneckProb: number;
    throughputUph: number;
    defectProb: number;
  };
}

export interface PlantSiteConfig {
  id: string;
  name: string;
  location: string;
  lineModel: string;
  totalStations: number;
  nominalThroughputUph: number;
  activeShift: string;
  sensorCoveragePct: number;
  oee: number;
  healthScore: number;
}

export interface InAppTestCase {
  id: string;
  name: string;
  category: 'Anomaly Detection' | 'Bottleneck Prediction' | 'Downstream Propagation' | 'Defect Traceability' | 'Missing Sensor Inference' | 'Confidence Filtering' | 'What-If Simulation';
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  executionTimeMs: number;
  assertionDetails: string;
  inputs: Record<string, any>;
  actualOutput: Record<string, any>;
}



