export type ViewMode = 'floor' | 'plant' | 'analytics' | 'leadership' | 'recommendation' | 'audit';

export type StationStatus = 'optimal' | 'warning' | 'critical';

export interface StationData {
  id: string; // e.g. "ST01", "ST32"
  number: number;
  name: string;
  zone: 'Zone 1: Body Const.' | 'Zone 2: Paint' | 'Zone 3: Final Assy';
  zoneId: 1 | 2 | 3;
  status: StationStatus;
  cycleTime: number; // in seconds, e.g. 57.2
  targetCycleTime: number; // e.g. 56.0
  drift: number; // e.g. +0.8
  sensorCoverage: string; // e.g. "Partial (7/10)" or "Full (10/10)"
  sensorOnlineCount: number;
  sensorTotalCount: number;
  isExplicitSensor: boolean; // true if direct IoT / PLC instrumentation, false if inferred from adjacent stations
  inferenceConfidence?: number; // e.g. 94.2%
  inferenceModel?: string; // e.g. "Kalman-Markov Particle Filter"
  upstreamAnchor?: string;
  downstreamAnchor?: string;
  wipBuffer: number; // current WIP units in buffer
  maxWipBuffer: number; // max buffer capacity e.g. 8 units
  torqueNm?: number; // live torque reading in Nm
  vibrationMmS?: number; // live vibration velocity in mm/s
  temperatureC?: number; // live thermal reading in °C
  edgeGateway: 'Online' | 'Degraded' | 'Offline';
  sparkHeights: number[]; // e.g. [50, 70, 90, 100, 80]
  historicalCycleTimes: number[]; // 8 data points for last 60m chart
  alertSummary?: string;
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
  downstreamImpact: string;
  recommendedIntervention: string;
  aiConfidenceScore: number; // 98
  propagationMap: {
    timeOffset: string; // "T+0m", "T+5m", "T+12m", "T+25m"
    stationId: string; // "Station 12"
    stationName: string; // "Torque App"
    role: string; // "Anomaly Origin" | "Minor Defect Propagation" | "Predicted QA Failure" | "Final Assy"
    status: 'critical' | 'warning' | 'upcoming';
  }[];
  triggerEvidence: {
    metric: string;
    value: string;
    thresholdInfo: string;
    status: 'critical' | 'warning' | 'optimal';
    trend: string;
    bars: { height: number; color: 'gray' | 'warning' | 'critical' }[];
  }[];
}

export interface SupervisorActionLog {
  id: string;
  type: 'OVERRIDE' | 'ACKNOWLEDGED' | 'PARAMETERS ADJUSTED' | 'EXECUTED' | 'DISMISSED';
  timestamp: string;
  title: string;
  user: string;
  userId: string;
  stationId?: string;
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
  rootCauseArea: string;
  rootCauseDescription: string;
}

export interface BottleneckRow {
  stationId: string;
  avgCycle: number;
  varianceStr: string;
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
  isOutlier: boolean;
  stationId: string;
}

