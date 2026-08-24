import React, { useState } from 'react';
import { PlantSiteConfig } from '../types';

interface SystemArchitectureViewProps {
  onOpenTestRunner: () => void;
  onOpenLowCostSensorModal: () => void;
}

export const plantSitesData: PlantSiteConfig[] = [
  {
    id: 'plant-detroit',
    name: 'Plant Alpha — Detroit Assembly Complex',
    location: 'Detroit, MI, USA',
    lineModel: 'Mixed-Model EV SUV & ICE Pickup (Line #4)',
    totalStations: 40,
    nominalThroughputUph: 60,
    activeShift: 'Shift A (08:00 - 16:00)',
    sensorCoveragePct: 88,
    oee: 88.4,
    healthScore: 92
  },
  {
    id: 'plant-stuttgart',
    name: 'Plant Beta — Stuttgart High-Precision Line',
    location: 'Stuttgart, Germany',
    lineModel: 'Next-Gen Performance EV Platform (Line #2)',
    totalStations: 36,
    nominalThroughputUph: 55,
    activeShift: 'Frühschicht (06:00 - 14:00)',
    sensorCoveragePct: 94,
    oee: 91.2,
    healthScore: 96
  },
  {
    id: 'plant-yokohama',
    name: 'Plant Gamma — Yokohama Compact EV Facility',
    location: 'Yokohama, Japan',
    lineModel: 'High-Volume Mixed Hybrid Platform (Line #1)',
    totalStations: 42,
    nominalThroughputUph: 72,
    activeShift: 'Day Shift (08:30 - 17:00)',
    sensorCoveragePct: 76,
    oee: 86.8,
    healthScore: 89
  }
];

export const SystemArchitectureView: React.FC<SystemArchitectureViewProps> = ({
  onOpenTestRunner,
  onOpenLowCostSensorModal
}) => {
  const [selectedPlant, setSelectedPlant] = useState<PlantSiteConfig>(plantSitesData[0]);

  return (
    <div id="architecture-view-container" className="flex-1 flex flex-col font-sans bg-[#F8FAFC]">
      <main className="flex-1 overflow-y-auto p-4 lg:p-6 max-w-[1600px] mx-auto w-full pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0058be] text-[26px]">
                account_tree
              </span>
              <h1 className="text-[24px] font-bold text-[#1b1b1d] tracking-tight">
                System Architecture & Industrial OT Integration
              </h1>
              <span className="bg-[#10B981]/15 text-[#065f46] border border-[#10B981]/40 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                ENTERPRISE READ-ONLY TAP
              </span>
            </div>
            <p className="text-[13px] text-[#45464d] mt-0.5">
              Production-grade 5-layer architecture designed for safe, non-invasive deployment alongside legacy Siemens, Rockwell, and Beckhoff PLCs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTestRunner}
              className="px-3 py-1.5 bg-[#0058be] hover:bg-[#2170e4] text-white text-[12px] font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Run In-App Verification Test Suite</span>
            </button>
            <button
              onClick={onOpenLowCostSensorModal}
              className="px-3 py-1.5 border border-[#cbd5e1] hover:bg-white text-[#1b1b1d] text-[12px] font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">sensors</span>
              <span>Sensor Upgrade Strategy</span>
            </button>
          </div>
        </div>

        {/* 5-Layer Industrial Architecture Grid */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-[15px] font-bold text-[#1b1b1d] uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be]">layers</span>
            <span>The 5-Layer DigitalTwin.ai Technical Architecture</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Layer 1: Data Layer */}
            <div className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#0058be] uppercase">Layer 1</div>
                <h3 className="text-[14px] font-bold text-[#1b1b1d] mt-1">Data Ingestion</h3>
                <p className="text-[11px] text-[#45464d] mt-2 leading-relaxed">
                  Non-invasive industrial edge taps (OPC-UA, MQTT, Passive Siemens S7 / Rockwell EtherNet/IP listener). 100Hz telemetry ingestion without PLC write access.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#E2E8F0] font-mono text-[10px] text-[#76777d]">
                Read-Only Industrial Tap
              </div>
            </div>

            {/* Layer 2: Twin Layer */}
            <div className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#0058be] uppercase">Layer 2</div>
                <h3 className="text-[14px] font-bold text-[#1b1b1d] mt-1">Digital Twin Core</h3>
                <p className="text-[11px] text-[#45464d] mt-2 leading-relaxed">
                  Real-time physical state synchronizer, buffer dynamics, conveyor index tracking, and Kalman-Filter virtual twin inference for legacy sensor-poor stations.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#E2E8F0] font-mono text-[10px] text-[#76777d]">
                40 Station Virtual Graph
              </div>
            </div>

            {/* Layer 3: Intelligence Layer */}
            <div className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#0058be] uppercase">Layer 3</div>
                <h3 className="text-[14px] font-bold text-[#1b1b1d] mt-1">Intelligence & ML</h3>
                <p className="text-[11px] text-[#45464d] mt-2 leading-relaxed">
                  Rolling SPC outlier detection, Isolation Forest anomaly scoring, logistic bottleneck forecasting, and multi-causal factor decomposition (SHAP).
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#E2E8F0] font-mono text-[10px] text-[#76777d]">
                Deterministic SPC + ML
              </div>
            </div>

            {/* Layer 4: Decision Layer */}
            <div className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#0058be] uppercase">Layer 4</div>
                <h3 className="text-[14px] font-bold text-[#1b1b1d] mt-1">Decision Support</h3>
                <p className="text-[11px] text-[#45464d] mt-2 leading-relaxed">
                  Confidence filtering (&gt;80% threshold for operator dispatch), What-If simulation sandbox, and automated advisory generation with human confirmation.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#E2E8F0] font-mono text-[10px] text-[#76777d]">
                Human-in-the-Loop
              </div>
            </div>

            {/* Layer 5: User Layer */}
            <div className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#0058be] uppercase">Layer 5</div>
                <h3 className="text-[14px] font-bold text-[#1b1b1d] mt-1">Role Dashboards</h3>
                <p className="text-[11px] text-[#45464d] mt-2 leading-relaxed">
                  Tailored views for Floor Supervisors (real-time station actions), Plant Managers (bottlenecks & defects), and Executives (OEE & ROI value).
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#E2E8F0] font-mono text-[10px] text-[#76777d]">
                Multi-Persona UI
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: Safe OT Isolation & LLM vs Deterministic AI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Safe OT Isolation */}
          <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#10B981]">security</span>
              <h3 className="text-[15px] font-bold text-[#1b1b1d]">
                Safe OT Integration (Non-Invasive Read-Only Principle)
              </h3>
            </div>
            <p className="text-[13px] text-[#45464d] leading-relaxed mb-4">
              DigitalTwin.ai strictly adheres to ISO/IEC 62443 industrial cybersecurity standards:
            </p>
            <ul className="space-y-2 text-[12px] text-[#1b1b1d]">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#10B981] text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>No PLC Control Loops Modified:</strong> The twin acts solely as a passive listener over industrial data diodes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#10B981] text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>Human-in-the-Loop Authority:</strong> All parameter recommendations require explicit supervisor authorization.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#10B981] text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span><strong>Zero Equipment Halting Risk:</strong> Even in total network loss, factory PLCs continue standard operations without interruption.</span>
              </li>
            </ul>
          </div>

          {/* LLM vs Deterministic AI */}
          <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#0058be]">psychology</span>
              <h3 className="text-[15px] font-bold text-[#1b1b1d]">
                Clear AI Demarcation: Deterministic ML vs LLM
              </h3>
            </div>
            <div className="space-y-3 text-[12px]">
              <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                <span className="font-bold text-[#0058be] block mb-1">
                  1. Numerical Intelligence (Deterministic Math + ML):
                </span>
                <span className="text-[#45464d]">
                  Calculates SPC ±3σ limits, Kalman filter state estimates, bottleneck probability formulas, and downstream buffer depletion physics. No LLM hallucinations.
                </span>
              </div>
              <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                <span className="font-bold text-[#1b1b1d] block mb-1">
                  2. Generative AI (LLM / Natural Language Layer):
                </span>
                <span className="text-[#45464d]">
                  Converts deterministic multi-signal evidence into plain-English root cause summaries, supervisor briefings, and SOP maintenance checklists.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Plant Scalability Section */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-[#1b1b1d] uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0058be]">domain</span>
                <span>Multi-Plant Configuration-Driven Scalability</span>
              </h2>
              <p className="text-[12px] text-[#45464d] mt-0.5">
                New production lines and facilities are onboarded via standard JSON schema (<code className="bg-[#f0edef] px-1 py-0.5 rounded font-mono">line_config.json</code>) without recoding.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#76777d] uppercase">Active Plant Site:</span>
              <select
                value={selectedPlant.id}
                onChange={(e) => {
                  const p = plantSitesData.find((item) => item.id === e.target.value);
                  if (p) setSelectedPlant(p);
                }}
                className="border border-[#cbd5e1] rounded p-1.5 text-[12px] font-bold bg-[#FCF8FA] cursor-pointer"
              >
                {plantSitesData.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <div>
              <div className="text-[10px] text-[#76777d] uppercase font-bold">Line Type & Model</div>
              <div className="text-[13px] font-bold text-[#1b1b1d] mt-0.5">{selectedPlant.lineModel}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#76777d] uppercase font-bold">Assembly Stations</div>
              <div className="text-[13px] font-bold text-[#0058be] font-mono mt-0.5">{selectedPlant.totalStations} Stations</div>
            </div>
            <div>
              <div className="text-[10px] text-[#76777d] uppercase font-bold">Sensor Coverage</div>
              <div className="text-[13px] font-bold text-[#10B981] font-mono mt-0.5">{selectedPlant.sensorCoveragePct}% (Inferred + Direct)</div>
            </div>
            <div>
              <div className="text-[10px] text-[#76777d] uppercase font-bold">Target Throughput</div>
              <div className="text-[13px] font-bold text-[#1b1b1d] font-mono mt-0.5">{selectedPlant.nominalThroughputUph} Units/Hr</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
