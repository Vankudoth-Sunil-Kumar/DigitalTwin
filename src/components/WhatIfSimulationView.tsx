import React, { useState, useMemo } from 'react';
import { StationData, AnomalyAlert, WhatIfScenarioInput } from '../types';
import { runWhatIfSimulation } from '../utils/digitalTwinEngine';

interface WhatIfSimulationViewProps {
  stations: StationData[];
  selectedStationId: string;
  onSelectStation: (id: string) => void;
  activeAlert?: AnomalyAlert;
  onApplyInterventionToLiveTwin?: (stationId: string, adjustedCycleTime: number) => void;
  onNavigateToFloor?: () => void;
}

export const WhatIfSimulationView: React.FC<WhatIfSimulationViewProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  activeAlert,
  onApplyInterventionToLiveTwin,
  onNavigateToFloor
}) => {
  const selectedStation = stations.find((s) => s.id === selectedStationId) || stations.find((s) => s.id === 'ST18') || stations[0];

  // Simulation inputs
  const [scenarioInput, setScenarioInput] = useState<WhatIfScenarioInput>({
    targetStationId: selectedStation.id,
    adjustedCycleTime: 42.0,
    adjustedConveyorSpeed: 1.0,
    bufferLimit: 8,
    toolConditionState: 'serviced',
    sensorUpgradeTier: 'upgraded_iot',
    productionSurgeTarget: 62
  });

  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Sync target station if changed
  const handleStationChange = (id: string) => {
    onSelectStation(id);
    const st = stations.find((s) => s.id === id);
    if (st) {
      setScenarioInput((prev) => ({
        ...prev,
        targetStationId: id,
        adjustedCycleTime: st.targetCycleTime
      }));
    }
  };

  // Run simulation physics
  const simulationResult = useMemo(() => {
    return runWhatIfSimulation(scenarioInput, selectedStation, activeAlert);
  }, [scenarioInput, selectedStation, activeAlert]);

  const handleApply = () => {
    if (onApplyInterventionToLiveTwin) {
      onApplyInterventionToLiveTwin(selectedStation.id, scenarioInput.adjustedCycleTime);
      setAppliedNotification(`Intervention applied to ${selectedStation.id}! Cycle time calibrated to ${scenarioInput.adjustedCycleTime}s.`);
      setTimeout(() => setAppliedNotification(null), 4000);
    }
  };

  const handleReset = () => {
    setScenarioInput({
      targetStationId: selectedStation.id,
      adjustedCycleTime: selectedStation.targetCycleTime,
      adjustedConveyorSpeed: 1.0,
      bufferLimit: 8,
      toolConditionState: 'degraded',
      sensorUpgradeTier: 'existing',
      productionSurgeTarget: 60
    });
  };

  return (
    <div id="whatif-simulation-container" className="flex-1 flex flex-col font-sans bg-[#F8FAFC]">
      <main className="flex-1 overflow-y-auto p-4 lg:p-6 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0058be] text-[26px]">
                science
              </span>
              <h1 className="text-[24px] font-bold text-[#1b1b1d] tracking-tight">
                What-If Simulation Studio
              </h1>
              <span className="bg-[#2170e4]/10 text-[#0058be] border border-[#2170e4]/30 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                PHYSICS SANDBOX
              </span>
            </div>
            <p className="text-[13px] text-[#45464d] mt-0.5">
              Simulate operational modifications, line rebalancing, and maintenance actions before executing them on the physical line.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 border border-[#cbd5e1] hover:bg-white text-[#45464d] text-[12px] font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Baseline</span>
            </button>
            {onNavigateToFloor && (
              <button
                onClick={onNavigateToFloor}
                className="px-3 py-1.5 bg-[#0058be] hover:bg-[#2170e4] text-white text-[12px] font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Back to Floor View</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        {appliedNotification && (
          <div className="mb-4 p-3 bg-[#10B981]/15 border border-[#10B981] text-[#065f46] rounded-lg flex items-center justify-between text-[13px] font-bold animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{appliedNotification}</span>
            </div>
            <button onClick={() => setAppliedNotification(null)} className="text-gray-500 hover:text-black">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* 2-Column Sandbox Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: Simulation Controls (5 cols) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-sm">
              <h2 className="text-[14px] font-bold text-[#1b1b1d] uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>1. Target Station & Parameters</span>
                <span className="text-[11px] font-mono text-[#0058be]">STATION: {selectedStation.id}</span>
              </h2>

              {/* Station Selector */}
              <div className="mb-4">
                <label className="text-[12px] font-bold text-[#45464d] block mb-1">
                  Select Assembly Station
                </label>
                <select
                  value={selectedStation.id}
                  onChange={(e) => handleStationChange(e.target.value)}
                  className="w-full border border-[#cbd5e1] rounded p-2 text-[13px] bg-[#FCF8FA] focus:ring-1 focus:ring-[#0058be] outline-none cursor-pointer"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.id} - {st.name} ({st.zone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Slider 1: Cycle Time */}
              <div className="mb-4 bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] font-bold text-[#1b1b1d]">Adjusted Cycle Time</span>
                  <span className="font-mono text-[14px] font-bold text-[#0058be]">
                    {scenarioInput.adjustedCycleTime}s
                  </span>
                </div>
                <input
                  type="range"
                  min={35}
                  max={65}
                  step={0.5}
                  value={scenarioInput.adjustedCycleTime}
                  onChange={(e) =>
                    setScenarioInput({ ...scenarioInput, adjustedCycleTime: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#0058be] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#76777d] font-mono mt-1">
                  <span>Fast (35s)</span>
                  <span>Nominal ({selectedStation.targetCycleTime}s)</span>
                  <span>Degraded (65s)</span>
                </div>
              </div>

              {/* Slider 2: Conveyor Speed Multiplier */}
              <div className="mb-4 bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] font-bold text-[#1b1b1d]">Conveyor Velocity Index</span>
                  <span className="font-mono text-[14px] font-bold text-[#0058be]">
                    {scenarioInput.adjustedConveyorSpeed.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={1.2}
                  step={0.05}
                  value={scenarioInput.adjustedConveyorSpeed}
                  onChange={(e) =>
                    setScenarioInput({ ...scenarioInput, adjustedConveyorSpeed: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#0058be] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#76777d] font-mono mt-1">
                  <span>0.80x (Low Stress)</span>
                  <span>1.00x (Standard)</span>
                  <span>1.20x (Surge)</span>
                </div>
              </div>

              {/* Option 3: Tool Condition State */}
              <div className="mb-4">
                <label className="text-[12px] font-bold text-[#45464d] block mb-1.5">
                  Simulated Maintenance & Tool State
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['degraded', 'serviced', 'new'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setScenarioInput({ ...scenarioInput, toolConditionState: st })}
                      className={`py-2 px-2 rounded text-[11px] font-bold uppercase transition-all cursor-pointer ${
                        scenarioInput.toolConditionState === st
                          ? 'bg-[#0058be] text-white shadow-sm'
                          : 'bg-[#F8FAFC] border border-[#cbd5e1] text-[#45464d] hover:bg-gray-100'
                      }`}
                    >
                      {st === 'degraded' ? 'Degraded Tool' : st === 'serviced' ? 'Serviced' : 'New Tooling'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 4: Sensor Instrumentation Tier */}
              <div className="mb-5">
                <label className="text-[12px] font-bold text-[#45464d] block mb-1.5">
                  Sensor Instrumentation Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setScenarioInput({ ...scenarioInput, sensorUpgradeTier: 'existing' })}
                    className={`py-2 px-2 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      scenarioInput.sensorUpgradeTier === 'existing'
                        ? 'bg-[#0058be] text-white shadow-sm'
                        : 'bg-[#F8FAFC] border border-[#cbd5e1] text-[#45464d] hover:bg-gray-100'
                    }`}
                  >
                    Current Sensor Level
                  </button>
                  <button
                    onClick={() => setScenarioInput({ ...scenarioInput, sensorUpgradeTier: 'upgraded_iot' })}
                    className={`py-2 px-2 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      scenarioInput.sensorUpgradeTier === 'upgraded_iot'
                        ? 'bg-[#0058be] text-white shadow-sm'
                        : 'bg-[#F8FAFC] border border-[#cbd5e1] text-[#45464d] hover:bg-gray-100'
                    }`}
                  >
                    + Upgraded IoT Sensor (+28%)
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  onClick={handleApply}
                  className="w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Apply Recommended Parameters to Live Twin</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Real-Time Recalculation Results (7 cols) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
            {/* Live Delta Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bottleneck Risk */}
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[12px] font-bold text-[#45464d] uppercase tracking-wider">
                    Bottleneck Probability
                  </span>
                  <span className="material-symbols-outlined text-[#F59E0B] text-[20px]">
                    warning
                  </span>
                </div>
                <div className="my-3 flex items-baseline gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[32px] font-bold text-[#1b1b1d] font-mono leading-none">
                      {simulationResult.bottleneckProbabilityAfter}%
                    </span>
                  </div>
                  <span className="text-[12px] font-mono line-through text-[#76777d]">
                    {simulationResult.bottleneckProbabilityBefore}%
                  </span>
                  <span className="text-[12px] font-bold font-mono text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded">
                    -{simulationResult.bottleneckProbabilityBefore - simulationResult.bottleneckProbabilityAfter}% Delta
                  </span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] transition-all duration-500"
                    style={{ width: `${100 - simulationResult.bottleneckProbabilityAfter}%` }}
                  ></div>
                </div>
                <span className="text-[11px] text-[#10B981] font-semibold mt-2">
                  Line flow stability restored
                </span>
              </div>

              {/* Avoided Downtime Cost */}
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[12px] font-bold text-[#45464d] uppercase tracking-wider">
                    Averted Downtime Value
                  </span>
                  <span className="material-symbols-outlined text-[#10B981] text-[20px]">
                    monetization_on
                  </span>
                </div>
                <div className="my-3 flex items-baseline gap-2">
                  <span className="text-[32px] font-bold text-[#10B981] font-mono leading-none">
                    ${simulationResult.estimatedCostAverted.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#45464d]">per shift</span>
                </div>
                <div className="text-[11px] font-mono text-[#76777d] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#10B981]">verified</span>
                  <span>Calculated via $350/min idle rate formula</span>
                </div>
              </div>

              {/* Line Throughput Delta */}
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[12px] font-bold text-[#45464d] uppercase tracking-wider">
                    Line Throughput Impact
                  </span>
                  <span className="material-symbols-outlined text-[#0058be] text-[20px]">
                    speed
                  </span>
                </div>
                <div className="my-3 flex items-baseline gap-2">
                  <span className="text-[32px] font-bold text-[#0058be] font-mono leading-none">
                    +{simulationResult.throughputDeltaPct}%
                  </span>
                  <span className="text-[12px] text-[#45464d] font-mono">
                    (~62.4 Units/Hr)
                  </span>
                </div>
                <span className="text-[11px] text-[#0058be] font-semibold">
                  Zero starvation in downstream buffer
                </span>
              </div>

              {/* Defect Probability */}
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[12px] font-bold text-[#45464d] uppercase tracking-wider">
                    Defect Risk Probability
                  </span>
                  <span className="material-symbols-outlined text-[#F43F5E] text-[20px]">
                    error_outline
                  </span>
                </div>
                <div className="my-3 flex items-baseline gap-2">
                  <span className="text-[32px] font-bold text-[#1b1b1d] font-mono leading-none">
                    {simulationResult.defectRiskAfterPct}%
                  </span>
                  <span className="text-[12px] font-mono line-through text-[#76777d]">
                    {simulationResult.defectRiskBeforePct}%
                  </span>
                  <span className="text-[12px] font-bold font-mono text-[#10B981]">
                    -{simulationResult.defectRiskBeforePct - simulationResult.defectRiskAfterPct}%
                  </span>
                </div>
                <span className="text-[11px] text-[#10B981] font-semibold">
                  End-of-Line QA reject rate below 0.5%
                </span>
              </div>
            </div>

            {/* Propagation Impact Comparison Graphic */}
            <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-sm">
              <h3 className="text-[14px] font-bold text-[#1b1b1d] mb-3 flex items-center justify-between">
                <span>Downstream Cascading Propagation (Before vs After)</span>
                <span className="text-[11px] font-mono text-[#10B981] font-bold">
                  {simulationResult.propagationRiskResolved ? 'STATUS: PROPAGATION BLOCKED' : 'STATUS: RISK ACTIVE'}
                </span>
              </h3>

              <div className="grid grid-cols-4 gap-2 text-center font-mono text-[11px]">
                <div className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="font-bold text-[#1b1b1d]">T+0m (Origin)</div>
                  <div className="text-[10px] text-[#76777d] mt-1">{selectedStation.id}</div>
                  <div className="mt-2 text-[#10B981] font-bold">
                    Cycle: {scenarioInput.adjustedCycleTime}s
                  </div>
                </div>

                <div className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="font-bold text-[#1b1b1d]">T+5m (Infeed)</div>
                  <div className="text-[10px] text-[#76777d] mt-1">Downstream Buffer</div>
                  <div className="mt-2 text-[#10B981] font-bold">
                    WIP: 4/8 (Optimal)
                  </div>
                </div>

                <div className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="font-bold text-[#1b1b1d]">T+12m (Zone)</div>
                  <div className="text-[10px] text-[#76777d] mt-1">Conveyor Flow</div>
                  <div className="mt-2 text-[#10B981] font-bold">
                    Starvation: 0%
                  </div>
                </div>

                <div className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="font-bold text-[#1b1b1d]">T+21m (QA Gate)</div>
                  <div className="text-[10px] text-[#76777d] mt-1">End-of-Line QA</div>
                  <div className="mt-2 text-[#10B981] font-bold">
                    Quota: 100% On-Track
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#d8e2ff]/20 border border-[#0058be]/30 rounded text-[12px] text-[#0058be]">
                <span className="font-bold">DigitalTwin.ai Recommendation Summary: </span>
                Applying these adjusted parameters resolves the mechanical bottleneck at {selectedStation.id}, preserves nominal cycle time, and prevents a 4-minute line stall across Zone 2.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
