import React, { useState } from 'react';

interface AdjustParametersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveParameters: (newParams: {
    targetThroughput: number;
    driftTolerance: number;
    aiConfidenceFloor: number;
    bufferLowWatermark: number;
  }) => void;
}

export const AdjustParametersModal: React.FC<AdjustParametersModalProps> = ({
  isOpen,
  onClose,
  onSaveParameters
}) => {
  const [targetThroughput, setTargetThroughput] = useState(60);
  const [driftTolerance, setDriftTolerance] = useState(1.5);
  const [aiConfidenceFloor, setAiConfidenceFloor] = useState(85);
  const [bufferLowWatermark, setBufferLowWatermark] = useState(30);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveParameters({
      targetThroughput,
      driftTolerance,
      aiConfidenceFloor,
      bufferLowWatermark
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be]">tune</span>
            <h3 className="font-bold text-[17px] text-[#1b1b1d]">
              Adjust Shift Operating Parameters
            </h3>
          </div>
          <button onClick={onClose} className="text-[#76777d] hover:text-[#1b1b1d]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-3 bg-[#10B981]/10 text-[#10B981] text-[13px] font-medium rounded border border-[#10B981]/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>Parameters updated across all PLC controllers and twin models.</span>
          </div>
        )}

        <div className="space-y-4 mb-6 text-[13px]">
          {/* Target Throughput */}
          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span className="text-[#1b1b1d]">Target Line Throughput</span>
              <span className="font-mono font-bold text-[#0058be]">{targetThroughput} Units/Hr</span>
            </div>
            <input
              type="range"
              min={40}
              max={80}
              step={1}
              value={targetThroughput}
              onChange={(e) => setTargetThroughput(Number(e.target.value))}
              className="w-full accent-[#0058be]"
            />
            <div className="flex justify-between text-[10px] text-[#76777d] mt-0.5">
              <span>40 Units/Hr (Safe)</span>
              <span>60 Units/Hr (Baseline)</span>
              <span>80 Units/Hr (Surge)</span>
            </div>
          </div>

          {/* Drift Tolerance */}
          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span className="text-[#1b1b1d]">Cycle Time Drift Tolerance</span>
              <span className="font-mono font-bold text-[#0058be]">±{driftTolerance.toFixed(1)} sec</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={5.0}
              step={0.1}
              value={driftTolerance}
              onChange={(e) => setDriftTolerance(Number(e.target.value))}
              className="w-full accent-[#0058be]"
            />
            <div className="flex justify-between text-[10px] text-[#76777d] mt-0.5">
              <span>0.5s (Strict)</span>
              <span>1.5s (Standard)</span>
              <span>5.0s (Relaxed)</span>
            </div>
          </div>

          {/* AI Confidence Floor */}
          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span className="text-[#1b1b1d]">AI Recommendation Confidence Floor</span>
              <span className="font-mono font-bold text-[#0058be]">{aiConfidenceFloor}%</span>
            </div>
            <input
              type="range"
              min={70}
              max={99}
              step={1}
              value={aiConfidenceFloor}
              onChange={(e) => setAiConfidenceFloor(Number(e.target.value))}
              className="w-full accent-[#0058be]"
            />
            <div className="flex justify-between text-[10px] text-[#76777d] mt-0.5">
              <span>70% (Show tentative alerts)</span>
              <span>85% (Optimal)</span>
              <span>95% (High certainty only)</span>
            </div>
          </div>

          {/* Buffer Low Watermark */}
          <div>
            <div className="flex justify-between mb-1.5 font-medium">
              <span className="text-[#1b1b1d]">AGV Buffer Starvation Low Watermark</span>
              <span className="font-mono font-bold text-[#0058be]">{bufferLowWatermark}%</span>
            </div>
            <input
              type="range"
              min={15}
              max={50}
              step={5}
              value={bufferLowWatermark}
              onChange={(e) => setBufferLowWatermark(Number(e.target.value))}
              className="w-full accent-[#0058be]"
            />
            <div className="flex justify-between text-[10px] text-[#76777d] mt-0.5">
              <span>15% Capacity</span>
              <span>30% Capacity</span>
              <span>50% Capacity</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E2E8F0] text-[#45464d] text-[13px] rounded hover:bg-[#f6f3f5]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#0058be] text-white text-[13px] font-bold rounded hover:bg-[#004bb0] shadow-sm"
          >
            Apply & Recalibrate
          </button>
        </div>
      </div>
    </div>
  );
};
