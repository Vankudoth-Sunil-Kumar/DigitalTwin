import React from 'react';

interface LowCostSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LowCostSensorModal: React.FC<LowCostSensorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const legacyStations = [
    { id: 'ST07', name: 'Roof Laser Brazing', currentCov: '40%', projectedCov: '80%', confidenceGain: '+24%', cost: '$900' },
    { id: 'ST19', name: 'Primer Surfacer Spray', currentCov: '35%', projectedCov: '75%', confidenceGain: '+28%', cost: '$900' },
    { id: 'ST28', name: 'Front Axle & Motor Assy', currentCov: '45%', projectedCov: '85%', confidenceGain: '+22%', cost: '$900' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 lg:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#0058be] text-[24px]">
              sensors
            </span>
            <div>
              <h2 className="text-[18px] font-bold text-[#1b1b1d]">
                Low-Cost Sensor Upgrade Strategy & ROI Planner
              </h2>
              <p className="text-[12px] text-[#45464d]">
                Bridge data gaps on legacy machines with minimal capital expenditure ($450/sensor) and zero downtime.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#76777d] hover:text-[#1b1b1d] rounded-md transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 bg-white">
          <div className="p-4 bg-[#d8e2ff]/20 border border-[#0058be]/30 rounded-lg text-[13px] text-[#0058be]">
            <span className="font-bold">Core Insight: </span>
            You do not need to replace multi-million dollar legacy lines. Deploying 2 magnetic vibration accelerometers + 1 surface thermocouple during scheduled maintenance elevates digital twin prediction confidence from <strong>61% → 88%</strong>.
          </div>

          <h3 className="text-[14px] font-bold text-[#1b1b1d] uppercase tracking-wider">
            Prioritized Legacy Target Stations
          </h3>

          <div className="space-y-3">
            {legacyStations.map((station) => (
              <div key={station.id} className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-bold text-[#0058be]">{station.id}</span>
                    <span className="font-bold text-[14px] text-[#1b1b1d]">{station.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#76777d] mt-1">
                    <span>Coverage: {station.currentCov} → <strong className="text-[#10B981]">{station.projectedCov}</strong></span>
                    <span>Confidence: <strong className="text-[#0058be]">{station.confidenceGain}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-[#76777d] uppercase">CapEx Investment</div>
                    <div className="font-mono text-[14px] font-bold text-[#1b1b1d]">{station.cost}</div>
                  </div>
                  <button className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[11px] rounded cursor-pointer shadow-sm">
                    Schedule Retrofit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-[#FCF8FA] border border-[#E2E8F0] grid grid-cols-3 gap-4 text-center font-mono">
            <div>
              <div className="text-[10px] text-[#76777d] uppercase">Total Retrofit CapEx</div>
              <div className="text-[18px] font-bold text-[#1b1b1d] mt-1">$2,700</div>
            </div>
            <div>
              <div className="text-[10px] text-[#76777d] uppercase">Annual Scrap Averted</div>
              <div className="text-[18px] font-bold text-[#10B981] mt-1">+$42,000</div>
            </div>
            <div>
              <div className="text-[10px] text-[#76777d] uppercase">Payback Period</div>
              <div className="text-[18px] font-bold text-[#0058be] mt-1">23 Days</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1b1b1d] text-white hover:bg-black font-bold rounded text-[12px] cursor-pointer"
          >
            Close Strategy
          </button>
        </div>
      </div>
    </div>
  );
};
