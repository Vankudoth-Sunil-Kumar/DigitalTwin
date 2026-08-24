import { HeroDemoStep } from '../types';

export const heroDemoSteps: HeroDemoStep[] = [
  {
    stepIndex: 0,
    timeLabel: '00:00',
    clockTime: '10:00:00 AM',
    title: 'Healthy Line Baseline',
    subtitle: 'All 40 stations nominal across Body, Paint, and Final Assembly.',
    focusStationId: 'ST18',
    viewRecommendation: 'floor',
    systemState: 'HEALTHY',
    explanationText: 'Line is operating at full rhythm (62.4 Units/Hr, OEE 88.2%). Station 18 cycle time is 42.1s (nominal target 42.0s).',
    metrics: {
      cycleTime: 42.1,
      vibrationMmS: 1.1,
      wipBuffer: 3,
      bottleneckProb: 8,
      throughputUph: 62.4,
      defectProb: 6
    }
  },
  {
    stepIndex: 1,
    timeLabel: '00:15',
    clockTime: '10:05:00 AM',
    title: 'Station 18 Begins Degrading',
    subtitle: 'Micro-wear detected in robotic seam sealer dispenser motor.',
    focusStationId: 'ST18',
    viewRecommendation: 'floor',
    systemState: 'EARLY_DRIFT',
    explanationText: 'Cycle time creeps from 42.1s to 44.3s (+2.3s drift). Harmonic vibration velocity rises from 1.1 mm/s to 2.4 mm/s.',
    metrics: {
      cycleTime: 44.3,
      vibrationMmS: 2.4,
      wipBuffer: 4,
      bottleneckProb: 24,
      throughputUph: 61.8,
      defectProb: 12
    }
  },
  {
    stepIndex: 2,
    timeLabel: '00:30',
    clockTime: '10:10:00 AM',
    title: 'Early Anomaly Detected',
    subtitle: 'Rolling SPC X-Bar detects 3 consecutive points outside ±2σ.',
    focusStationId: 'ST18',
    viewRecommendation: 'analytics',
    systemState: 'ANOMALY_TRIGGERED',
    explanationText: 'Statistical Process Control (SPC) engine flags subtle trend. Standard factory dashboards still show Green, but DigitalTwin.ai raises yellow early-signal flag.',
    metrics: {
      cycleTime: 46.8,
      vibrationMmS: 3.1,
      wipBuffer: 5,
      bottleneckProb: 48,
      throughputUph: 60.1,
      defectProb: 22
    }
  },
  {
    stepIndex: 3,
    timeLabel: '00:45',
    clockTime: '10:15:00 AM',
    title: 'Bottleneck Prediction Generated',
    subtitle: 'Predictive risk: 78% probability in 21 minutes, 42 vehicles at risk.',
    focusStationId: 'ST18',
    viewRecommendation: 'analytics',
    systemState: 'BOTTLENECK_PREDICTED',
    explanationText: 'Machine Learning engine projects: If current drift persists, Station 18 buffer will overflow at T+21m, stalling Zone 2 and penalizing plant output by -8.5%.',
    metrics: {
      cycleTime: 49.2,
      vibrationMmS: 3.8,
      wipBuffer: 7,
      bottleneckProb: 78,
      throughputUph: 57.0,
      defectProb: 43
    }
  },
  {
    stepIndex: 4,
    timeLabel: '01:00',
    clockTime: '10:18:00 AM',
    title: 'Downstream Propagation Forecast',
    subtitle: 'Cascading impact mapped: ST18 -> ST19 -> ST20 -> ST21 -> ST40.',
    focusStationId: 'ST18',
    viewRecommendation: 'analytics',
    systemState: 'PROPAGATION_FORECAST',
    explanationText: 'Physical flow graph predicts: ST19 starvation within 5m; ST20 WIP queue exhaustion in 12m; End-of-Line QA gate defect surge in 45m.',
    metrics: {
      cycleTime: 49.5,
      vibrationMmS: 4.1,
      wipBuffer: 7,
      bottleneckProb: 82,
      throughputUph: 55.4,
      defectProb: 49
    }
  },
  {
    stepIndex: 5,
    timeLabel: '01:15',
    clockTime: '10:20:00 AM',
    title: 'Multi-Causal Root Cause Analysis',
    subtitle: 'Contribution decomposition isolates mechanical motor wear.',
    focusStationId: 'ST18',
    viewRecommendation: 'recommendation',
    systemState: 'ROOT_CAUSE_ANALYSIS',
    explanationText: 'SHAP / Factor Decomposition: Cycle Time (34%), Vibration (25%), Upstream WIP (21%), Thermal (12%), Operator Pace (8%). Root cause: Dispenser motor bearing friction.',
    metrics: {
      cycleTime: 49.8,
      vibrationMmS: 4.3,
      wipBuffer: 8,
      bottleneckProb: 86,
      throughputUph: 54.0,
      defectProb: 52
    }
  },
  {
    stepIndex: 6,
    timeLabel: '01:30',
    clockTime: '10:21:00 AM',
    title: 'Predictive Warning Dispatched',
    subtitle: 'Actionable advisory sent to Floor Supervisor with AI explainability.',
    focusStationId: 'ST18',
    viewRecommendation: 'recommendation',
    systemState: 'PREDICTIVE_WARNING',
    explanationText: 'Advisory: "Execute 90-second automated nozzle purge & adjust infeed AGV buffer during the scheduled 10:30 index window to avert $18,400 line stall."',
    metrics: {
      cycleTime: 49.8,
      vibrationMmS: 4.3,
      wipBuffer: 8,
      bottleneckProb: 86,
      throughputUph: 54.0,
      defectProb: 52
    }
  },
  {
    stepIndex: 7,
    timeLabel: '01:45',
    clockTime: '10:23:00 AM',
    title: 'What-If Simulation Evaluated',
    subtitle: 'Supervisor tests intervention in DigitalTwin.ai sandbox.',
    focusStationId: 'ST18',
    viewRecommendation: 'whatif',
    systemState: 'WHAT_IF_INTERVENTION',
    explanationText: 'Simulation confirms: Reducing cycle time back to 42.0s and servicing dispenser reduces bottleneck probability from 78% -> 19%, restoring full 62 U/H line rhythm.',
    metrics: {
      cycleTime: 42.0,
      vibrationMmS: 1.4,
      wipBuffer: 4,
      bottleneckProb: 19,
      throughputUph: 62.1,
      defectProb: 9
    }
  },
  {
    stepIndex: 8,
    timeLabel: '02:00',
    clockTime: '10:25:00 AM',
    title: 'Maintenance Executed (Human in Loop)',
    subtitle: 'Supervisor authorizes recommended micro-purge & lubrication.',
    focusStationId: 'ST18',
    viewRecommendation: 'floor',
    systemState: 'MAINTENANCE_EXECUTED',
    explanationText: 'Maintenance completed in 85 seconds without line stoppage. PLC sensors confirm harmonic vibration dropping back to 1.3 mm/s.',
    metrics: {
      cycleTime: 42.4,
      vibrationMmS: 1.3,
      wipBuffer: 3,
      bottleneckProb: 12,
      throughputUph: 62.0,
      defectProb: 7
    }
  },
  {
    stepIndex: 9,
    timeLabel: '02:30',
    clockTime: '10:30:00 AM',
    title: 'Recovery Verified & ROI Realized',
    subtitle: 'Zero downtime incurred, $18,400 saved, full shift quota protected.',
    focusStationId: 'ST18',
    viewRecommendation: 'leadership',
    systemState: 'RECOVERY_VERIFIED',
    explanationText: 'Line restored to 100% nominal speed. Executive dashboard updates: 1 critical failure prevented, 42 vehicles protected from rework, $18,400 saved.',
    metrics: {
      cycleTime: 42.0,
      vibrationMmS: 1.1,
      wipBuffer: 3,
      bottleneckProb: 6,
      throughputUph: 62.5,
      defectProb: 4
    }
  }
];
