import React from 'react';
import { AnomalyAlert } from '../types';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AnomalyAlert[];
  onSelectAlert: (alertId: string) => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onSelectAlert
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 font-sans">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-ping"></span>
            <h3 className="font-bold text-[16px] text-[#1b1b1d]">
              Active Anomaly Interventions ({alerts.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#76777d] hover:text-[#1b1b1d] p-1 rounded hover:bg-[#eae7e9]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#E2E8F0] space-y-4">
          {alerts.map((alert) => {
            const isCrit = alert.severity === 'critical';
            return (
              <div
                key={alert.id}
                onClick={() => {
                  onSelectAlert(alert.id);
                  onClose();
                }}
                className={`pt-4 first:pt-0 p-3.5 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                  isCrit
                    ? 'border-[#F43F5E]/30 bg-[#F43F5E]/5 hover:border-[#F43F5E]'
                    : 'border-[#F59E0B]/30 bg-[#F59E0B]/5 hover:border-[#F59E0B]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded text-white ${
                        isCrit ? 'bg-[#F43F5E]' : 'bg-[#F59E0B]'
                      }`}
                    >
                      {alert.stationId}
                    </span>
                    <span className="text-[12px] font-bold text-[#1b1b1d]">{alert.zone}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#76777d]">
                    {alert.detectedTime}
                  </span>
                </div>

                <h4 className="text-[14px] font-bold text-[#1b1b1d] leading-snug">
                  {alert.title}
                </h4>

                <p className="text-[12px] text-[#45464d] mt-1 line-clamp-2">
                  {alert.downstreamImpact}
                </p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/5 text-[11px]">
                  <span className="font-mono text-[#0058be] font-bold">
                    AI Confidence: {alert.aiConfidenceScore}%
                  </span>
                  <span className="text-[#0058be] font-semibold flex items-center gap-1">
                    <span>Inspect Details</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#0058be] text-white font-bold text-[13px] rounded hover:bg-[#004bb0] transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
