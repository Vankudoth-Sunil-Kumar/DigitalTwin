import React, { useState, useEffect } from 'react';
import { StationData, AnomalyAlert, SpcDataPoint } from '../types';
import { spcLiveSamples } from '../data/mockData';

interface AnalyticsEngineViewProps {
  stations: StationData[];
  alerts: AnomalyAlert[];
  onSelectStation: (stationId: string) => void;
  onSelectAlert: (alertId: string) => void;
  onOpenRecommendation: (alertId: string) => void;
  isLiveStreaming?: boolean;
  telemetryTick?: number;
}

export const AnalyticsEngineView: React.FC<AnalyticsEngineViewProps> = ({
  stations,
  alerts,
  onSelectStation,
  onSelectAlert,
  onOpenRecommendation,
  isLiveStreaming = true,
  telemetryTick = 0
}) => {
  // Active Tab within Analytics Engine
  const [activeTab, setActiveTab] = useState<'pipeline' | 'propagation' | 'inference' | 'spc'>('pipeline');
  
  // Pipeline Stage Selection
  const [selectedStage, setSelectedStage] = useState<number>(3); // Default to AI Engine (Stage 3)
  
  // Propagation Simulator State
  const [simMinutes, setSimMinutes] = useState<number>(0);
  const [isSimPlaying, setIsSimPlaying] = useState<boolean>(false);
  const [injectedStation, setInjectedStation] = useState<string>('ST32');
  const [isMitigated, setIsMitigated] = useState<boolean>(false);

  // Live Stream Telemetry Generator
  const [isStreaming, setIsStreaming] = useState<boolean>(isLiveStreaming);
  const [streamTicks, setStreamTicks] = useState<number>(14280);
  const [liveSpc, setLiveSpc] = useState<SpcDataPoint[]>(spcLiveSamples);
  const [hoveredSpcIndex, setHoveredSpcIndex] = useState<number | null>(null);

  // Sync isStreaming with parent isLiveStreaming
  useEffect(() => {
    setIsStreaming(isLiveStreaming);
  }, [isLiveStreaming]);

  // Live stream pulse on telemetry tick
  useEffect(() => {
    if (!isStreaming) return;
    setStreamTicks((prev) => prev + Math.floor(Math.random() * 8) + 1);

    // Occasionally append new SPC subgroup point
    setLiveSpc((prev) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const baseMean = 56.0;
      // Introduce natural drift or occasional outlier
      const noise = (Math.random() - 0.45) * 3.2;
      const meanCycle = Number((baseMean + noise).toFixed(1));
      const isOutlier = meanCycle > 59.5 || meanCycle < 52.5;

      const newPoint: SpcDataPoint = {
        sampleId: (prev[prev.length - 1]?.sampleId || 100) + 1,
        timestamp: timeStr,
        meanCycle,
        rangeVal: Number((Math.random() * 2 + 1.2).toFixed(1)),
        torqueMean: Number((45.0 + Math.random() * 4).toFixed(1)),
        stationId: 'ST32',
        isOutlier
      };

      return [...prev.slice(1), newPoint];
    });
  }, [telemetryTick, isStreaming]);

  // Sim playback interval
  useEffect(() => {
    let interval: any;
    if (isSimPlaying) {
      interval = setInterval(() => {
        setSimMinutes((prev) => {
          if (prev >= 30) {
            setIsSimPlaying(false);
            return 30;
          }
          return prev + 2;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isSimPlaying]);

  // Live stream pulse
  useEffect(() => {
    let interval: any;
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamTicks((prev) => prev + Math.floor(Math.random() * 8) + 1);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Explicit vs Inferred station counts
  const explicitCount = stations.filter((s) => s.isExplicitSensor).length;
  const inferredCount = stations.filter((s) => !s.isExplicitSensor).length;
  const avgInferenceConfidence = 95.8;

  // Selected station object for simulator
  const activeSimStation = stations.find((s) => s.id === injectedStation) || stations[31];

  // Calculate simulated propagation metrics based on time slider
  const simulatedDrift = isMitigated
    ? Math.max(0.2, (activeSimStation.drift * (1 - simMinutes / 30)).toFixed(1) as any)
    : Math.min(8.5, (activeSimStation.drift + (simMinutes / 30) * 4.2).toFixed(1) as any);

  const simulatedUpstreamBuffer = isMitigated
    ? Math.max(3, Math.round(activeSimStation.wipBuffer - (simMinutes / 30) * 3))
    : Math.min(8, Math.round(activeSimStation.wipBuffer + (simMinutes / 30) * 4));

  const simulatedDownstreamStarvationRisk = isMitigated
    ? Math.max(5, Math.round(12 - (simMinutes / 30) * 7))
    : Math.min(92, Math.round(24 + (simMinutes / 30) * 68));

  return (
    <div id="analytics-engine-view" className="flex flex-col flex-1 bg-[#f7f9fb] min-h-0 overflow-y-auto">
      {/* Top Hero Banner: Digital Twin Intelligence Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 lg:px-8 py-5 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#0058be]/10 text-[#0058be] text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Predict • Prevent • Perform
              </span>
              <span className="text-[12px] font-mono text-[#718096] flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-[#10B981] animate-pulse' : 'bg-[#94A3B8]'}`}></span>
                {isStreaming ? 'Live Digital Twin Telemetry Stream Active' : 'Stream Paused'}
              </span>
            </div>
            <h1 className="text-[22px] font-bold text-[#1b1b1d] tracking-tight">
              Connected Line Intelligence & Predictive Analysis
            </h1>
            <p className="text-[13px] text-[#45464d] mt-0.5">
              Closed-loop digital twin modeling 40 assembly stations, physics-informed inference for unmonitored legacy machines, and predictive bottleneck prevention.
            </p>
          </div>

          {/* Quick Stream Controls */}
          <div className="flex items-center gap-3">
            <div className="bg-[#f0edef] px-3 py-1.5 rounded border border-[#E2E8F0] flex items-center gap-2 font-mono text-[12px] text-[#1b1b1d]">
              <span className="text-[#718096]">Ingress:</span>
              <span className="font-bold text-[#0058be]">{streamTicks.toLocaleString()} msgs/s</span>
            </div>
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3.5 py-1.5 rounded font-mono text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isStreaming
                  ? 'bg-white hover:bg-[#f0edef] text-[#1b1b1d] border-[#E2E8F0]'
                  : 'bg-[#0058be] text-white border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isStreaming ? 'pause' : 'play_arrow'}
              </span>
              <span>{isStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="flex items-center gap-2 mt-5 border-b border-[#E2E8F0] -mb-5">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pipeline'
                ? 'border-[#0058be] text-[#0058be] bg-[#0058be]/5'
                : 'border-transparent text-[#718096] hover:text-[#1b1b1d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
            <span>5-Stage Closed-Loop Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('propagation')}
            className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'propagation'
                ? 'border-[#0058be] text-[#0058be] bg-[#0058be]/5'
                : 'border-transparent text-[#718096] hover:text-[#1b1b1d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">timeline</span>
            <span>Ripple & Starvation Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('inference')}
            className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'inference'
                ? 'border-[#0058be] text-[#0058be] bg-[#0058be]/5'
                : 'border-transparent text-[#718096] hover:text-[#1b1b1d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">sensors_off</span>
            <span>Sensor Gap & Physics Inference ({inferredCount} Legacy)</span>
          </button>

          <button
            onClick={() => setActiveTab('spc')}
            className={`px-4 py-2.5 text-[13px] font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'spc'
                ? 'border-[#0058be] text-[#0058be] bg-[#0058be]/5'
                : 'border-transparent text-[#718096] hover:text-[#1b1b1d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">show_chart</span>
            <span>Statistical Process Control (SPC) & Quality</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 lg:p-8 flex-1">
        {/* ========================================================================= */}
        {/* TAB 1: 5-STAGE CLOSED-LOOP ARCHITECTURE (Predict, Prevent, Perform)     */}
        {/* ========================================================================= */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6 animate-fadeIn">
            {/* The Solution Architecture Diagram Banner */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[16px] font-bold text-[#1b1b1d] tracking-tight">
                    THE SOLUTION: PREDICT, PREVENT, PERFORM PIPELINE
                  </h2>
                  <p className="text-[12px] text-[#718096]">
                    Continuous real-time loop connecting physical plant floor OT to predictive AI and back to supervisor intervention.
                  </p>
                </div>
                <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-mono text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
                  <span>Continuous Learning & Feedback Active</span>
                </div>
              </div>

              {/* 5-Stage Visual Workflow Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                {/* Stage 1: Data Input */}
                <div
                  onClick={() => setSelectedStage(1)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer relative group ${
                    selectedStage === 1
                      ? 'border-[#0058be] bg-[#0058be]/5 shadow-sm'
                      : 'border-[#E2E8F0] bg-[#FCF8FA] hover:border-[#0058be]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#0058be]">STAGE 1</span>
                    <span className="material-symbols-outlined text-[20px] text-[#0058be]">sensors</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-[#1b1b1d]">1. Data Input</h3>
                  <ul className="mt-2 space-y-1 text-[11px] text-[#45464d]">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#0058be]"></span>
                      <span>Sensors / PLCs (OPC-UA)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#0058be]"></span>
                      <span>Vision Systems (Keyence/Cognex)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#0058be]"></span>
                      <span>Quality & Torque Data</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#0058be]"></span>
                      <span>Production MES Line Signals</span>
                    </li>
                  </ul>
                </div>

                {/* Stage 2: Digital Twin */}
                <div
                  onClick={() => setSelectedStage(2)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer relative group ${
                    selectedStage === 2
                      ? 'border-[#0058be] bg-[#0058be]/5 shadow-sm'
                      : 'border-[#E2E8F0] bg-[#FCF8FA] hover:border-[#0058be]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#0058be]">STAGE 2</span>
                    <span className="material-symbols-outlined text-[20px] text-[#0058be]">view_in_ar</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-[#1b1b1d]">2. Digital Twin</h3>
                  <div className="mt-2 text-[11px] text-[#45464d] space-y-1">
                    <div className="font-mono text-[10px] text-[#718096] bg-white p-1 rounded border border-[#E2E8F0]">
                      S01 ➔ S02 ➔ S03 ... S40
                    </div>
                    <p className="pt-1">
                      Live virtual model of all 40 assembly stations reflecting WIP buffers, cycle time drifts, and kinematic states.
                    </p>
                  </div>
                </div>

                {/* Stage 3: AI Engine */}
                <div
                  onClick={() => setSelectedStage(3)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer relative group ${
                    selectedStage === 3
                      ? 'border-[#0058be] bg-[#0058be]/5 shadow-sm'
                      : 'border-[#E2E8F0] bg-[#FCF8FA] hover:border-[#0058be]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#0058be]">STAGE 3</span>
                    <span className="material-symbols-outlined text-[20px] text-[#0058be]">psychology</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-[#1b1b1d]">3. AI Engine</h3>
                  <ul className="mt-2 space-y-1 text-[11px] text-[#45464d]">
                    <li className="flex items-center gap-1.5 text-[#10B981] font-semibold">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>Detect Anomalies</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-[#0058be] font-semibold">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>Predict Ripple Impact</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-[#F59E0B] font-semibold">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>Infer Missing Sensor Data</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-[#1b1b1d] font-semibold">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>Recommend Mitigations</span>
                    </li>
                  </ul>
                </div>

                {/* Stage 4: Insights & Alerts */}
                <div
                  onClick={() => setSelectedStage(4)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer relative group ${
                    selectedStage === 4
                      ? 'border-[#0058be] bg-[#0058be]/5 shadow-sm'
                      : 'border-[#E2E8F0] bg-[#FCF8FA] hover:border-[#0058be]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#0058be]">STAGE 4</span>
                    <span className="material-symbols-outlined text-[20px] text-[#F59E0B]">warning</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-[#1b1b1d]">4. Insights & Alerts</h3>
                  <div className="mt-2 space-y-1.5 text-[11px]">
                    <div className="bg-[#F59E0B]/10 text-[#B45309] font-mono text-[10px] p-1.5 rounded border border-[#F59E0B]/20">
                      ⚡ Bottleneck at ST32 in 15m
                    </div>
                    <div className="bg-[#BA1A1A]/10 text-[#BA1A1A] font-mono text-[10px] p-1.5 rounded border border-[#BA1A1A]/20">
                      ⚠ Defect Risk Rising (63%)
                    </div>
                  </div>
                </div>

                {/* Stage 5: Closed-Loop Action */}
                <div
                  onClick={() => setSelectedStage(5)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer relative group ${
                    selectedStage === 5
                      ? 'border-[#0058be] bg-[#0058be]/5 shadow-sm'
                      : 'border-[#E2E8F0] bg-[#FCF8FA] hover:border-[#0058be]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#0058be]">STAGE 5</span>
                    <span className="material-symbols-outlined text-[20px] text-[#10B981]">engineering</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-[#1b1b1d]">5. Action & Learn</h3>
                  <ul className="mt-2 space-y-1 text-[11px] text-[#45464d]">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#10B981]"></span>
                      <span>Operator / Team Intervenes</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#10B981]"></span>
                      <span>1-Click AGV Buffer Route</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#10B981]"></span>
                      <span>Auto Tool Calibration</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#10B981]"></span>
                      <span>Monitored Outcome Loop</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Detailed Stage Deep-Dive Panel */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0058be]/10 text-[#0058be] flex items-center justify-center font-bold font-mono">
                    S{selectedStage}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1b1b1d]">
                      {selectedStage === 1 && 'Stage 1 Deep-Dive: Plant OT Ingress & Protocol Connectors'}
                      {selectedStage === 2 && 'Stage 2 Deep-Dive: Kinematic Virtual Digital Twin Topology'}
                      {selectedStage === 3 && 'Stage 3 Deep-Dive: Multi-Model AI Engine & Missing Sensor Estimator'}
                      {selectedStage === 4 && 'Stage 4 Deep-Dive: Real-Time Predictive Bottleneck Dispatcher'}
                      {selectedStage === 5 && 'Stage 5 Deep-Dive: Closed-Loop Execution & Validation Engine'}
                    </h3>
                    <p className="text-[12px] text-[#718096]">
                      {selectedStage === 1 && 'Zero-production-disruption passive tap into Siemens S7-1500, Rockwell ControlLogix, and Cognex vision sensors.'}
                      {selectedStage === 2 && 'Graph network modeling station cycle times, WIP conveyor buffers, and inter-station transfer delays.'}
                      {selectedStage === 3 && 'Physics-informed Kalman filtering + LSTM auto-encoders inferring missing data at uninstrumented legacy machines.'}
                      {selectedStage === 4 && 'Multi-horizon lead time forecasting (15m to 45m ahead) with explainable root-cause attribution.'}
                      {selectedStage === 5 && 'Supervisor one-click overrides, dynamic AGV rerouting, and closed-loop model weight retraining.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-mono text-[#718096]">Latency:</span>
                  <span className="font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded text-[12px]">
                    {selectedStage === 1 ? '12ms' : selectedStage === 3 ? '48ms' : '22ms'}
                  </span>
                </div>
              </div>

              {/* Stage Specific Interactive Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {/* Metric 1 */}
                <div className="bg-[#FCF8FA] p-4 rounded border border-[#E2E8F0]">
                  <span className="text-[11px] font-mono uppercase text-[#718096]">Active Throughput</span>
                  <div className="text-[22px] font-bold text-[#1b1b1d] mt-1 font-mono">
                    {selectedStage === 1 && '14,280 msgs/s'}
                    {selectedStage === 2 && '40 Station Nodes'}
                    {selectedStage === 3 && '98.2% Accuracy'}
                    {selectedStage === 4 && '3 Active Alerts'}
                    {selectedStage === 5 && '100% Validated'}
                  </div>
                  <p className="text-[11px] text-[#45464d] mt-1">
                    {selectedStage === 1 && 'OPC-UA Binary + MQTT Sparkplug B protocol bridge'}
                    {selectedStage === 2 && '3 Zones (Body, Paint, Final Assembly) synced'}
                    {selectedStage === 3 && 'Ensemble: Isolation Forests + Bayesian Kalman'}
                    {selectedStage === 4 && 'Avg lead warning time: 18.4 minutes'}
                    {selectedStage === 5 && 'Mean Time to Mitigate: 2.1 minutes'}
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="bg-[#FCF8FA] p-4 rounded border border-[#E2E8F0]">
                  <span className="text-[11px] font-mono uppercase text-[#718096]">Sensor Coverage Strategy</span>
                  <div className="text-[22px] font-bold text-[#0058be] mt-1 font-mono">
                    28 IoT / 12 Inferred
                  </div>
                  <p className="text-[11px] text-[#45464d] mt-1">
                    Addresses legacy equipment constraints without expensive PLC recoding or line stoppages.
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="bg-[#FCF8FA] p-4 rounded border border-[#E2E8F0]">
                  <span className="text-[11px] font-mono uppercase text-[#718096]">Economic Impact Yield</span>
                  <div className="text-[22px] font-bold text-[#10B981] mt-1 font-mono">
                    +$42,500 Saved
                  </div>
                  <p className="text-[11px] text-[#45464d] mt-1">
                    3 line micro-stoppages prevented in current shift; 0 defect escapes to final delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: RIPPLE & STARVATION PROPAGATION SIMULATOR                          */}
        {/* ========================================================================= */}
        {activeTab === 'propagation' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Interactive Control Header */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                <div>
                  <h2 className="text-[17px] font-bold text-[#1b1b1d] tracking-tight">
                    Inter-Station Ripple & Downstream Starvation Simulator
                  </h2>
                  <p className="text-[12px] text-[#45464d] mt-0.5">
                    Model how a small cycle degradation at an upstream station propagates into upstream buffer backlog and downstream line starvation.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsSimPlaying(!isSimPlaying);
                    }}
                    className={`px-4 py-2 rounded font-mono text-[13px] font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      isSimPlaying
                        ? 'bg-[#F59E0B] text-white'
                        : 'bg-[#0058be] text-white hover:bg-[#004bb0]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isSimPlaying ? 'pause' : 'play_arrow'}
                    </span>
                    <span>{isSimPlaying ? 'Pause Time-Lapse' : 'Play Time-Lapse (30m)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSimMinutes(0);
                      setIsSimPlaying(false);
                      setIsMitigated(false);
                    }}
                    className="px-3 py-2 border border-[#E2E8F0] rounded text-[13px] font-mono font-medium hover:bg-[#f0edef] text-[#45464d] cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Time Scrubber */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-[12px] font-mono">
                  <span className="text-[#0058be] font-bold">
                    Forecast Timeline: T+{simMinutes} Minutes Ahead
                  </span>
                  <span className="text-[#718096]">Horizon: T+0m (Now) to T+30m (Shift Target)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={simMinutes}
                  onChange={(e) => setSimMinutes(Number(e.target.value))}
                  className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0058be]"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#718096]">
                  <span>T+0m (Current Detection)</span>
                  <span>T+5m (Buffer Depletion)</span>
                  <span>T+15m (Starvation Threshold)</span>
                  <span>T+30m (Full Line Stall)</span>
                </div>
              </div>

              {/* Select Disturbance Station */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#E2E8F0]">
                <div>
                  <label className="block text-[11px] font-bold text-[#718096] uppercase mb-1">
                    Select Target Station
                  </label>
                  <select
                    value={injectedStation}
                    onChange={(e) => setInjectedStation(e.target.value)}
                    className="w-full bg-[#FCF8FA] border border-[#E2E8F0] rounded px-3 py-1.5 text-[13px] font-bold text-[#1b1b1d] outline-none"
                  >
                    <option value="ST32">ST32 - Steering Column (+3.8s Drift)</option>
                    <option value="ST04">ST04 - Spot Weld (+2.6s Tip Wear)</option>
                    <option value="ST08">ST08 - Door Clamping (+3.2s Hydraulic)</option>
                    <option value="ST18">ST18 - Seam Sealer (+1.8s Flow)</option>
                    <option value="ST28">ST28 - Motor Rig (Legacy Inferred)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#718096] uppercase mb-1">
                    Simulated Cycle Time
                  </label>
                  <div className="text-[18px] font-bold font-mono text-[#BA1A1A]">
                    {(56.0 + Number(simulatedDrift)).toFixed(1)}s <span className="text-[12px] text-[#718096] font-normal">(Target: 56.0s)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#718096] uppercase mb-1">
                    Upstream WIP Accumulation
                  </label>
                  <div className="text-[18px] font-bold font-mono text-[#F59E0B]">
                    {simulatedUpstreamBuffer} / 8 Units <span className="text-[12px] text-[#718096] font-normal">({simulatedUpstreamBuffer >= 7 ? 'Critical Buffer' : 'Nominal'})</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#718096] uppercase mb-1">
                    Downstream Starvation Risk
                  </label>
                  <div className={`text-[18px] font-bold font-mono ${simulatedDownstreamStarvationRisk > 50 ? 'text-[#BA1A1A]' : 'text-[#10B981]'}`}>
                    {simulatedDownstreamStarvationRisk}% Probability
                  </div>
                </div>
              </div>
            </div>

            {/* Ripple Propagation Visual Chain */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-[#1b1b1d]">
                  Linear Station Chain Ripple & Buffer Status (Zone 3 Final Assembly)
                </h3>
                <div className="flex items-center gap-3">
                  {!isMitigated ? (
                    <button
                      onClick={() => setIsMitigated(true)}
                      className="bg-[#10B981] hover:bg-[#059669] text-white font-mono text-[12px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                      <span>Apply DigitalTwin AI Mitigation (AGV Buffer Reroute)</span>
                    </button>
                  ) : (
                    <span className="bg-[#10B981]/10 text-[#10B981] font-mono text-[12px] font-bold px-3 py-1.5 rounded border border-[#10B981]/30 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Mitigation Applied: Buffer Stabilized</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Station Flow Visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
                {[
                  { id: 'ST30', name: 'HV Harness', role: 'Upstream Flow', wip: Math.min(8, 3 + (simMinutes > 10 ? 2 : 0)), status: 'optimal' },
                  { id: 'ST31', name: 'Strut Bolting', role: 'Upstream Backlog', wip: Math.min(8, 4 + Math.round(simMinutes / 6)), status: simMinutes > 12 ? 'warning' : 'optimal' },
                  { id: 'ST32', name: 'Steering Column', role: 'Anomaly Bottleneck', wip: simulatedUpstreamBuffer, status: 'critical' },
                  { id: 'ST33', name: 'Brake Vacuum', role: 'Immediate Starvation', wip: Math.max(1, 4 - Math.round(simMinutes / 5)), status: simMinutes > 8 ? 'warning' : 'optimal' },
                  { id: 'ST34', name: 'Windshield Urethane', role: 'Downstream Starved', wip: Math.max(0, 3 - Math.round(simMinutes / 4)), status: simMinutes > 15 ? 'critical' : 'optimal' },
                  { id: 'ST40', name: 'Final QA Gate', role: 'Target Output', wip: Math.max(0, 2 - Math.round(simMinutes / 8)), status: simMinutes > 20 ? 'critical' : 'optimal' }
                ].map((st) => (
                  <div
                    key={st.id}
                    className={`p-3.5 rounded border ${
                      st.id === injectedStation
                        ? 'border-[#BA1A1A] bg-[#BA1A1A]/5 ring-2 ring-[#BA1A1A]/20'
                        : st.status === 'critical'
                        ? 'border-[#BA1A1A]/60 bg-[#BA1A1A]/5'
                        : st.status === 'warning'
                        ? 'border-[#F59E0B]/60 bg-[#F59E0B]/5'
                        : 'border-[#E2E8F0] bg-[#FCF8FA]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[13px] font-bold text-[#1b1b1d]">{st.id}</span>
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          st.status === 'critical'
                            ? 'bg-[#BA1A1A] text-white'
                            : st.status === 'warning'
                            ? 'bg-[#F59E0B] text-white'
                            : 'bg-[#10B981] text-white'
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                    <div className="text-[12px] font-semibold text-[#1b1b1d] truncate">{st.name}</div>
                    <div className="text-[10px] text-[#718096]">{st.role}</div>

                    {/* WIP Buffer Meter */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-mono text-[#45464d] mb-1">
                        <span>WIP Buffer</span>
                        <span className="font-bold">{st.wip}/8</span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] h-2 rounded overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-300 ${
                            st.wip >= 7 ? 'bg-[#BA1A1A]' : st.wip <= 1 ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                          }`}
                          style={{ width: `${(st.wip / 8) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SENSOR GAP & PHYSICS INFERENCE EXPLORER                             */}
        {/* ========================================================================= */}
        {activeTab === 'inference' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header explanation card */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#0058be]/10 text-[#0058be] text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                      Incomplete Sensor Coverage Strategy
                    </span>
                    <span className="text-[12px] font-mono text-[#718096]">
                      12 Legacy / Uninstrumented Stations Virtualized
                    </span>
                  </div>
                  <h2 className="text-[18px] font-bold text-[#1b1b1d] tracking-tight">
                    Physics-Informed Missing Data Inference Matrix
                  </h2>
                  <p className="text-[13px] text-[#45464d] mt-1 max-w-3xl">
                    Rather than treating unmonitored legacy equipment as blind spots, DigitalTwin.ai reconstructs cycle times, pneumatic pressures, and thermal states using adjacent upstream/downstream anchor stations, Markov flow conservation, and historical machine profiles.
                  </p>
                </div>

                <div className="bg-[#FCF8FA] p-4 rounded border border-[#E2E8F0] shrink-0 text-center">
                  <span className="text-[11px] font-mono text-[#718096] uppercase">Avg Inference Fidelity</span>
                  <div className="text-[24px] font-bold font-mono text-[#10B981]">{avgInferenceConfidence}%</div>
                  <span className="text-[10px] text-[#718096]">Validated Against QA Audits</span>
                </div>
              </div>
            </div>

            {/* Inferred Stations Table */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#1b1b1d]">
                  Legacy Stations Virtual Model Roster
                </h3>
                <span className="text-[12px] font-mono text-[#0058be] font-bold">
                  Showing 4 High-Impact Virtualized Twins
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-[#FCF8FA] border-b border-[#E2E8F0] text-[11px] font-bold font-mono uppercase text-[#718096]">
                      <th className="p-3.5 pl-5">Station</th>
                      <th className="p-3.5">Zone</th>
                      <th className="p-3.5">Instrumentation Status</th>
                      <th className="p-3.5">Inference Algorithm</th>
                      <th className="p-3.5">Upstream Anchor</th>
                      <th className="p-3.5">Downstream Anchor</th>
                      <th className="p-3.5">Inferred Cycle</th>
                      <th className="p-3.5 pr-5 text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-[13px]">
                    {[
                      {
                        id: 'ST07',
                        name: 'Roof Laser Brazing (Legacy Station)',
                        zone: 'Zone 1: Body Const.',
                        instrumentation: '2/10 Sensors (Manual Log)',
                        algo: 'Extended Kalman Filter + Laser Flow',
                        upstream: 'ST06 (Rear Quarter, 10/10)',
                        downstream: 'ST08 (Door Framing, 10/10)',
                        cycle: '56.4s (Nominal)',
                        conf: '96.4%'
                      },
                      {
                        id: 'ST14',
                        name: 'Underseal Robot Coating',
                        zone: 'Zone 1: Body Const.',
                        instrumentation: '3/10 Sensors (No IoT)',
                        algo: 'Markov Chain Flow Differential',
                        upstream: 'ST13 (Optical Check, 10/10)',
                        downstream: 'ST15 (Buffer Lift, 10/10)',
                        cycle: '56.1s (Nominal)',
                        conf: '95.8%'
                      },
                      {
                        id: 'ST19',
                        name: 'Primer Surfacer (Legacy Sprayer)',
                        zone: 'Zone 2: Paint Shop',
                        instrumentation: '2/10 Sensors (Hydraulic Dial)',
                        algo: 'Viscosity Pressure Inversion',
                        upstream: 'ST18 (Seam Sealer, 10/10)',
                        downstream: 'ST20 (Bell Sprayers, 10/10)',
                        cycle: '56.2s (Nominal)',
                        conf: '94.7%'
                      },
                      {
                        id: 'ST28',
                        name: 'Front Axle Rig (Legacy 1998 Rig)',
                        zone: 'Zone 3: Final Assy',
                        instrumentation: '2/10 Sensors (Limit Switch)',
                        algo: 'Current-Draw Regression Model',
                        upstream: 'ST27 (Battery Lift, 10/10)',
                        downstream: 'ST29 (Inverter Bolting, 10/10)',
                        cycle: '56.4s (Nominal)',
                        conf: '96.1%'
                      }
                    ].map((row) => (
                      <tr key={row.id} className="hover:bg-[#f0edef]/40 transition-colors">
                        <td className="p-3.5 pl-5 font-mono font-bold text-[#0058be]">
                          {row.id} <span className="font-sans font-normal text-[#1b1b1d] ml-1">{row.name}</span>
                        </td>
                        <td className="p-3.5 text-[12px] text-[#718096]">{row.zone}</td>
                        <td className="p-3.5">
                          <span className="bg-[#F59E0B]/10 text-[#B45309] font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-[#F59E0B]/20">
                            {row.instrumentation}
                          </span>
                        </td>
                        <td className="p-3.5 text-[12px] text-[#45464d] font-mono">{row.algo}</td>
                        <td className="p-3.5 text-[12px] text-[#0058be]">{row.upstream}</td>
                        <td className="p-3.5 text-[12px] text-[#0058be]">{row.downstream}</td>
                        <td className="p-3.5 font-mono font-bold text-[#1b1b1d]">{row.cycle}</td>
                        <td className="p-3.5 pr-5 text-right font-mono font-bold text-[#10B981]">
                          {row.conf}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: STATISTICAL PROCESS CONTROL (SPC) & QUALITY PREDICTION             */}
        {/* ========================================================================= */}
        {activeTab === 'spc' && (
          <div className="space-y-6 animate-fadeIn">
            {/* SPC Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm">
                <span className="text-[11px] font-mono uppercase text-[#718096]">Process Capability (Cpk)</span>
                <div className="text-[26px] font-bold text-[#1b1b1d] mt-1 font-mono">1.42</div>
                <div className="text-[11px] text-[#10B981] font-semibold mt-1">4.26σ Capable Range (&gt; 1.33)</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm">
                <span className="text-[11px] font-mono uppercase text-[#718096]">Upper Control Limit (UCL)</span>
                <div className="text-[26px] font-bold text-[#BA1A1A] mt-1 font-mono">59.5s</div>
                <div className="text-[11px] text-[#718096] mt-1">3-Sigma Statistical Boundary</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm">
                <span className="text-[11px] font-mono uppercase text-[#718096]">Nominal Takt Target</span>
                <div className="text-[26px] font-bold text-[#0058be] mt-1 font-mono">56.0s</div>
                <div className="text-[11px] text-[#718096] mt-1">Centerline (X-Bar) Target</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-sm">
                <span className="text-[11px] font-mono uppercase text-[#718096]">Defect Escape Probability</span>
                <div className="text-[26px] font-bold text-[#10B981] mt-1 font-mono">0.02%</div>
                <div className="text-[11px] text-[#10B981] font-semibold mt-1">Zero Escapes Detected</div>
              </div>
            </div>

            {/* X-Bar Chart Visualizer */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-[#1b1b1d] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0058be]">analytics</span>
                    <span>Live X-Bar Statistical Process Control Chart (ST32 Steering Column)</span>
                  </h3>
                  <p className="text-[12px] text-[#718096]">
                    Real-time subgroup means plotted against 3-sigma Upper (59.5s) and Lower (52.5s) control boundaries.
                  </p>
                </div>
                <span className="bg-[#BA1A1A]/10 text-[#BA1A1A] font-mono text-[11px] font-bold px-2.5 py-1 rounded border border-[#BA1A1A]/20 flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-[#BA1A1A] animate-ping"></span>
                  <span>Western Electric Rule #1 Triggered</span>
                </span>
              </div>

              {/* Full SVG SPC Chart Canvas */}
              <div className="relative w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 pt-6 pb-2 min-h-[260px] flex flex-col justify-between">
                {(() => {
                  const svgW = 760;
                  const svgH = 200;
                  const padL = 50;
                  const padR = 30;
                  const padT = 25;
                  const padB = 30;
                  const plotW = svgW - padL - padR;
                  const plotH = svgH - padT - padB;
                  const minAxis = 51.0;
                  const maxAxis = 61.5;

                  const calcY = (val: number) => {
                    return padT + plotH - ((val - minAxis) / (maxAxis - minAxis)) * plotH;
                  };

                  const calcX = (idx: number) => {
                    return padL + (idx / (liveSpc.length - 1)) * plotW;
                  };

                  const uclY = calcY(59.5);
                  const clY = calcY(56.0);
                  const lclY = calcY(52.5);

                  const pts = liveSpc.map((pt, i) => ({
                    x: calcX(i),
                    y: calcY(pt.meanCycle),
                    ...pt
                  }));

                  const lineD = pts.reduce(
                    (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`,
                    ''
                  );

                  return (
                    <>
                      <svg
                        className="w-full h-[180px] overflow-visible"
                        viewBox={`0 0 ${svgW} ${svgH}`}
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="spcBandGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.03" />
                          </linearGradient>
                        </defs>

                        {/* In-Control 3-Sigma Band */}
                        <rect
                          x={padL}
                          y={uclY}
                          width={plotW}
                          height={lclY - uclY}
                          fill="url(#spcBandGradient)"
                        />

                        {/* UCL Reference Line (59.5s) */}
                        <line
                          x1={padL}
                          y1={uclY}
                          x2={svgW - padR}
                          y2={uclY}
                          stroke="#BA1A1A"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padL - 6}
                          y={uclY + 3}
                          textAnchor="end"
                          fill="#BA1A1A"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          UCL 59.5s
                        </text>

                        {/* Centerline Reference Line (56.0s) */}
                        <line
                          x1={padL}
                          y1={clY}
                          x2={svgW - padR}
                          y2={clY}
                          stroke="#0058be"
                          strokeWidth="1.5"
                          strokeDasharray="6 4"
                        />
                        <text
                          x={padL - 6}
                          y={clY + 3}
                          textAnchor="end"
                          fill="#0058be"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          CL 56.0s
                        </text>

                        {/* LCL Reference Line (52.5s) */}
                        <line
                          x1={padL}
                          y1={lclY}
                          x2={svgW - padR}
                          y2={lclY}
                          stroke="#718096"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padL - 6}
                          y={lclY + 3}
                          textAnchor="end"
                          fill="#718096"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          LCL 52.5s
                        </text>

                        {/* Connected Polyline */}
                        <path
                          d={lineD}
                          fill="none"
                          stroke="#0058be"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data Nodes */}
                        {pts.map((p, idx) => {
                          const isLast = idx === pts.length - 1;
                          const isHovered = hoveredSpcIndex === idx;

                          return (
                            <g
                              key={p.sampleId}
                              onMouseEnter={() => setHoveredSpcIndex(idx)}
                              onMouseLeave={() => setHoveredSpcIndex(null)}
                              className="cursor-pointer"
                            >
                              {/* Pulse on Outlier or Live Latest */}
                              {(p.isOutlier || (isLast && isStreaming)) && (
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r="10"
                                  fill="none"
                                  stroke={p.isOutlier ? '#BA1A1A' : '#0058be'}
                                  strokeWidth="1.5"
                                  className="animate-ping"
                                />
                              )}
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={isHovered || isLast ? 6 : 4}
                                fill={p.isOutlier ? '#BA1A1A' : '#0058be'}
                                stroke="#ffffff"
                                strokeWidth="2"
                                className="transition-all"
                              />
                              {/* Value Label */}
                              <text
                                x={p.x}
                                y={p.y - 9}
                                textAnchor="middle"
                                fill={p.isOutlier ? '#BA1A1A' : '#1b1b1d'}
                                fontSize="10"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                {p.meanCycle}s
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {/* X-Axis Subgroup Labels */}
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#718096] border-t border-[#E2E8F0] pt-1.5 px-10">
                        {liveSpc.map((pt, i) => (
                          <div
                            key={pt.sampleId}
                            className={`flex flex-col items-center transition-colors cursor-pointer ${
                              hoveredSpcIndex === i ? 'text-[#0058be] font-bold' : ''
                            }`}
                            onMouseEnter={() => setHoveredSpcIndex(i)}
                            onMouseLeave={() => setHoveredSpcIndex(null)}
                          >
                            <span>{pt.timestamp}</span>
                            <span className="text-[9px] text-[#A0AEC0]">{pt.sampleId}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}

                {/* Hover Tooltip Overlay if active */}
                {hoveredSpcIndex !== null && liveSpc[hoveredSpcIndex] && (
                  <div className="absolute top-2 right-4 bg-white/95 backdrop-blur-sm border border-[#E2E8F0] rounded-lg shadow-md p-2.5 text-[11px] font-mono z-20 animate-in fade-in duration-100">
                    <div className="font-bold text-[#1b1b1d] flex items-center gap-2">
                      <span>Subgroup {liveSpc[hoveredSpcIndex].sampleId}</span>
                      <span className={liveSpc[hoveredSpcIndex].isOutlier ? 'text-[#BA1A1A]' : 'text-[#10B981]'}>
                        {liveSpc[hoveredSpcIndex].isOutlier ? 'OUT OF SPEC' : 'IN CONTROL'}
                      </span>
                    </div>
                    <div className="text-[#718096] mt-0.5">
                      Time: {liveSpc[hoveredSpcIndex].timestamp} | Mean: <span className="font-bold text-[#1b1b1d]">{liveSpc[hoveredSpcIndex].meanCycle}s</span> | Range: {liveSpc[hoveredSpcIndex].rangeVal}s
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Multi-Causal Root Cause Pareto Breakdown */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm">
              <h3 className="text-[15px] font-bold text-[#1b1b1d] mb-3">
                Multi-Causal Root Cause Decomposition (Predictive Engine Model Weights)
              </h3>
              <div className="space-y-3">
                {[
                  { factor: 'Pneumatic Tooling & Mechanical Wear', weight: 41, color: '#BA1A1A' },
                  { factor: 'Operator Manual Pacing Variation', weight: 26, color: '#F59E0B' },
                  { factor: 'Upstream Stamping / Batch Tolerance Variance', weight: 19, color: '#0058be' },
                  { factor: 'Environmental Thermal & Humidity Drift', weight: 14, color: '#10B981' }
                ].map((item) => (
                  <div key={item.factor}>
                    <div className="flex justify-between text-[12px] font-mono mb-1">
                      <span className="text-[#1b1b1d] font-semibold">{item.factor}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.weight}%</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-2.5 rounded overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{ width: `${item.weight}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
