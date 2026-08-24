import React, { useState } from 'react';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({ isOpen, onClose }) => {
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [checkPassed, setCheckPassed] = useState(true);

  if (!isOpen) return null;

  const handleRunHealthCheck = () => {
    setIsRunningCheck(true);
    setTimeout(() => {
      setIsRunningCheck(false);
      setCheckPassed(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 font-sans max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#0058be] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
            </div>
            <div>
              <h3 className="font-bold text-[18px] text-[#1b1b1d]">
                Line System Health Diagnostic
              </h3>
              <p className="text-[12px] text-[#76777d]">
                Real-time edge gateway status, PLC telemetry sync, and ML inference health.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#76777d] hover:text-[#1b1b1d] p-1 rounded hover:bg-[#f6f3f5] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Health Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
            <div className="flex justify-between items-start text-[11px] uppercase font-bold text-[#76777d] mb-1">
              <span>Edge Gateways</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            </div>
            <div className="text-[20px] font-bold text-[#1b1b1d]">40 / 40</div>
            <div className="text-[11px] text-[#10B981] font-mono mt-1">100% Online (12ms ping)</div>
          </div>

          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
            <div className="flex justify-between items-start text-[11px] uppercase font-bold text-[#76777d] mb-1">
              <span>Sensor Telemetry</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            </div>
            <div className="text-[20px] font-bold text-[#1b1b1d]">394 / 400</div>
            <div className="text-[11px] text-[#45464d] font-mono mt-1">6 non-critical degraded</div>
          </div>

          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
            <div className="flex justify-between items-start text-[11px] uppercase font-bold text-[#76777d] mb-1">
              <span>ML Model Ingest</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            </div>
            <div className="text-[20px] font-bold text-[#1b1b1d]">18.4k evt/s</div>
            <div className="text-[11px] text-[#0058be] font-mono mt-1">Inference latency: 8.2ms</div>
          </div>
        </div>

        {/* Detailed subsystem test status */}
        <div className="space-y-2 mb-6 text-[13px]">
          <div className="p-3 border border-[#E2E8F0] rounded bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
              <div>
                <span className="font-semibold text-[#1b1b1d]">OPC-UA / MQTT Broker Connectivity</span>
                <span className="block text-[11px] text-[#76777d]">Zero dropped frames over past 4 hours</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#10B981] font-bold bg-[#10B981]/10 px-2 py-0.5 rounded">
              OPTIMAL
            </span>
          </div>

          <div className="p-3 border border-[#E2E8F0] rounded bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
              <div>
                <span className="font-semibold text-[#1b1b1d]">Digital Twin State Synchronizer</span>
                <span className="block text-[11px] text-[#76777d]">Synthetic state twin synchronized with real physical line sensors</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#10B981] font-bold bg-[#10B981]/10 px-2 py-0.5 rounded">
              SYNCED (1.1s)
            </span>
          </div>

          <div className="p-3 border border-[#F59E0B]/30 rounded bg-[#F59E0B]/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#F59E0B] text-[18px]">warning</span>
              <div>
                <span className="font-semibold text-[#1b1b1d]">Station 32 & Station 12 Anomaly Watchdog</span>
                <span className="block text-[11px] text-[#45464d]">2 predictive drift anomalies flagged for supervisory intervention</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#F59E0B] font-bold bg-[#F59E0B]/10 px-2 py-0.5 rounded">
              ACTIVE WATCH
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
          <div className="text-[12px] text-[#76777d]">
            Diagnostic version: <span className="font-mono text-[#1b1b1d]">v2.14.8-prod</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#E2E8F0] text-[#45464d] text-[13px] rounded hover:bg-[#f6f3f5]"
            >
              Close
            </button>
            <button
              onClick={handleRunHealthCheck}
              disabled={isRunningCheck}
              className="px-4 py-2 bg-[#0058be] text-white text-[13px] font-bold rounded hover:bg-[#004bb0] flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isRunningCheck ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                  <span>Testing Subsystems...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  <span>Execute Full Diagnostic</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
