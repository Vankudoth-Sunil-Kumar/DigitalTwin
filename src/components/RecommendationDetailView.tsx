import React, { useState } from 'react';
import { AnomalyAlert } from '../types';

interface RecommendationDetailViewProps {
  alert: AnomalyAlert;
  onBack: () => void;
  onExecuteIntervention: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
  onDelegateAlert: (alertId: string, assignee: string) => void;
}

export const RecommendationDetailView: React.FC<RecommendationDetailViewProps> = ({
  alert,
  onBack,
  onExecuteIntervention,
  onDismissAlert,
  onDelegateAlert
}) => {
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [assigneeName, setAssigneeName] = useState('Tech Lead Alex Ramos (ID: 619)');
  const [executedSuccess, setExecutedSuccess] = useState(alert.status === 'executed');

  const handleExecute = () => {
    onExecuteIntervention(alert.id);
    setExecutedSuccess(true);
  };

  const handleConfirmDelegate = () => {
    onDelegateAlert(alert.id, assigneeName);
    setShowDelegateModal(false);
  };

  const isCritical = alert.severity === 'critical';
  const badgeColor = isCritical ? 'text-[#F43F5E]' : 'text-[#F59E0B]';
  const dotBg = isCritical ? 'bg-[#F43F5E]' : 'bg-[#F59E0B]';

  return (
    <div id="recommendation-detail-container" className="flex-1 flex flex-col font-sans">
      <main className="p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1 overflow-y-auto bg-[#F8FAFC]">
        {/* Top Header with Back Navigation */}
        <div className="mb-6 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-from-recommendation"
              onClick={onBack}
              className="text-[#45464d] hover:text-[#1b1b1d] hover:bg-[#f0edef] p-1.5 rounded transition-colors flex items-center cursor-pointer active:scale-95"
              title="Go back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dotBg} animate-pulse`}></span>
              <span className={`font-mono text-[12px] font-bold ${badgeColor} uppercase tracking-wider`}>
                Priority Intervention Required
              </span>
            </div>
          </div>

          <div className="ml-9">
            <h2 className="text-[26px] lg:text-[32px] font-bold text-[#1b1b1d] tracking-tight leading-tight">
              {alert.title}
            </h2>
            <p className="font-mono text-[13px] text-[#45464d] mt-1">
              Event ID: {alert.eventId} | Detected: {alert.detectedTime}
            </p>
          </div>
        </div>

        {/* Execution Success Notification */}
        {executedSuccess && (
          <div className="mb-6 p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#10B981] text-[24px]">
                check_circle
              </span>
              <div>
                <div className="font-bold text-[#1b1b1d] text-[14px]">
                  Intervention Executed & Logged
                </div>
                <div className="text-[12px] text-[#45464d]">
                  Micro-calibration sequence alpha-2 queued on {alert.stationId} PLC. 45s pause window reserved.
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold bg-[#10B981] text-white px-2.5 py-1 rounded">
              ACTIVE
            </span>
          </div>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column (8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            {/* Top Analysis Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg relative overflow-hidden shadow-sm">
              <div className={`absolute top-0 left-0 w-full h-1 ${dotBg}`}></div>
              <div className="p-6 grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-6">
                  {/* Root Cause */}
                  <div className="col-span-2 md:col-span-1">
                    <h3 className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#0058be]">
                        search
                      </span>
                      <span>Root Cause</span>
                    </h3>
                    <p className="text-[14px] text-[#1b1b1d] leading-relaxed">
                      {alert.rootCause}
                    </p>
                  </div>

                  {/* Downstream Impact */}
                  <div className="col-span-2 md:col-span-1">
                    <h3 className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#0058be]">
                        route
                      </span>
                      <span>Downstream Impact</span>
                    </h3>
                    <p className="text-[14px] text-[#1b1b1d] leading-relaxed">
                      {alert.downstreamImpact}
                    </p>
                  </div>

                  {/* Recommended Intervention */}
                  <div className="col-span-2 bg-[#f6f3f5] p-4 border border-[#E2E8F0] rounded">
                    <h3 className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#0058be]">
                        build
                      </span>
                      <span>Recommended Intervention</span>
                    </h3>
                    <p className="font-mono text-[13px] text-[#1b1b1d] leading-relaxed">
                      {alert.recommendedIntervention}
                    </p>
                  </div>
                </div>

                {/* AI Confidence Gauge */}
                <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-[#E2E8F0] pt-4 md:pt-0 md:pl-6">
                  <span className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider mb-3">
                    AI Confidence Score
                  </span>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        fill="none"
                        r="45"
                        stroke="#E2E8F0"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        fill="none"
                        r="45"
                        stroke={isCritical ? '#F43F5E' : '#F59E0B'}
                        strokeWidth="8"
                        strokeDasharray="282.7"
                        strokeDashoffset={282.7 * (1 - alert.aiConfidenceScore / 100)}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span
                        className={`text-[32px] font-bold leading-none ${
                          isCritical ? 'text-[#F43F5E]' : 'text-[#F59E0B]'
                        }`}
                      >
                        {alert.aiConfidenceScore}
                        <span className="text-[20px]">%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictive Propagation Map */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-sm">
              <h3 className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider mb-8 border-b border-[#E2E8F0] pb-3">
                Predictive Propagation Map
              </h3>
              <div className="relative pt-6 pb-4 px-4">
                {/* Timeline axis line */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#E2E8F0] -translate-y-1/2 z-0"></div>

                {/* Critical to warning segment line */}
                <div className="absolute top-1/2 left-[8%] right-[40%] h-[3px] bg-gradient-to-r from-[#F43F5E] to-[#F59E0B] -translate-y-1/2 z-0 opacity-60"></div>

                <div className="flex justify-between items-center relative z-10">
                  {alert.propagationMap.map((step, idx) => {
                    const isOrigin = idx === 0;
                    const isWarning = step.status === 'warning';
                    const isUpcoming = step.status === 'upcoming';

                    return (
                      <div key={idx} className="flex flex-col items-center group cursor-default relative">
                        {/* Hover tooltip */}
                        <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1b1b1d] text-white px-2 py-1 rounded font-mono text-[11px] absolute -top-10 whitespace-nowrap z-20 shadow-md">
                          {step.role}
                        </div>

                        {/* Offset label */}
                        <div
                          className={`font-mono text-[12px] mb-1 font-bold ${
                            isOrigin
                              ? 'text-[#F43F5E]'
                              : isWarning
                              ? 'text-[#F59E0B]'
                              : 'text-[#76777d]'
                          }`}
                        >
                          {step.timeOffset}
                        </div>

                        {/* Node icon / dot */}
                        {isOrigin ? (
                          <div className="w-4 h-4 rounded-full bg-[#F43F5E] border-4 border-white outline outline-2 outline-[#F43F5E] relative z-10 shadow-[0_0_12px_rgba(244,63,94,0.4)]"></div>
                        ) : isWarning ? (
                          <div className="w-4 h-4 rounded-full bg-[#F59E0B] border-4 border-white outline outline-2 outline-[#F59E0B] relative z-10"></div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full bg-[#eae7e9] border-2 border-[#c6c6cd] relative z-10"></div>
                        )}

                        {/* Station Name */}
                        <div className="mt-2 text-[11px] font-bold text-[#1b1b1d] uppercase text-center">
                          {step.stationId}
                        </div>
                        <div className="font-mono text-[11px] text-[#45464d] text-center">
                          {step.stationName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Trigger Evidence & Execution (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-lg flex flex-col h-full shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <h3 className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#0058be]">
                    monitoring
                  </span>
                  <span>Trigger Evidence</span>
                </h3>
              </div>

              <div className="p-5 flex-1 flex flex-col gap-5 overflow-y-auto">
                {alert.triggerEvidence.map((ev, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-end">
                      <span className="font-mono text-[12px] text-[#45464d]">{ev.metric}</span>
                      <span
                        className={`font-mono text-[13px] font-bold ${
                          ev.status === 'critical'
                            ? 'text-[#F43F5E]'
                            : ev.status === 'warning'
                            ? 'text-[#F59E0B]'
                            : 'text-[#10B981]'
                        }`}
                      >
                        {ev.value}{' '}
                        <span className="text-[#76777d] text-[10px] uppercase font-normal">
                          {ev.thresholdInfo}
                        </span>
                      </span>
                    </div>

                    {/* Spark bars */}
                    <div className="h-16 w-full bg-[#f6f3f5] border border-[#E2E8F0] rounded flex items-end justify-between px-1.5 pt-1.5 gap-[3px]">
                      {ev.bars.map((bar, barIdx) => {
                        const bg =
                          bar.color === 'critical'
                            ? 'bg-[#F43F5E]'
                            : bar.color === 'warning'
                            ? 'bg-[#F59E0B]'
                            : 'bg-[#c6c6cd]';

                        return (
                          <div
                            key={barIdx}
                            style={{ height: `${bar.height}%` }}
                            className={`w-full rounded-t-xs transition-all ${bg}`}
                          ></div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between font-mono text-[10px] text-[#76777d]">
                      <span>T-30m</span>
                      <span>{ev.trend}</span>
                      <span>Now</span>
                    </div>

                    {i < alert.triggerEvidence.length - 1 && (
                      <div className="h-px bg-[#E2E8F0] w-full my-2"></div>
                    )}
                  </div>
                ))}

                <div className="mt-auto pt-2">
                  <p className="text-[12px] text-[#76777d] italic">
                    Data correlated against historical anomaly cluster model v4.2.
                  </p>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-[#e4e2e4]/30 border-t border-[#E2E8F0] flex flex-col gap-2.5">
                <button
                  id="btn-acknowledge-execute"
                  onClick={handleExecute}
                  className="w-full py-3 px-4 bg-[#F43F5E] hover:bg-[#ba1a1a] text-white font-bold text-[14px] rounded flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(244,63,94,0.25)] cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  <span>Acknowledge & Execute</span>
                </button>

                <div className="flex gap-2">
                  <button
                    id="btn-dismiss-alert"
                    onClick={() => onDismissAlert(alert.id)}
                    className="flex-1 py-2 px-3 border border-[#76777d] text-[#1b1b1d] text-[12px] font-medium rounded hover:bg-[#e4e2e4] transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    <span>Dismiss</span>
                  </button>
                  <button
                    id="btn-delegate-alert"
                    onClick={() => setShowDelegateModal(true)}
                    className="flex-1 py-2 px-3 border border-[#76777d] text-[#1b1b1d] text-[12px] font-medium rounded hover:bg-[#e4e2e4] transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[16px]">forward_to_inbox</span>
                    <span>Delegate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delegate Dialog Modal */}
        {showDelegateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
                <h3 className="font-bold text-[16px] text-[#1b1b1d] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0058be]">forward_to_inbox</span>
                  <span>Delegate Anomaly Intervention</span>
                </h3>
                <button
                  onClick={() => setShowDelegateModal(false)}
                  className="text-[#76777d] hover:text-[#1b1b1d]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <p className="text-[13px] text-[#45464d] mb-4">
                Select technician or line lead to assign task dispatch for <strong>{alert.title}</strong>:
              </p>

              <div className="space-y-2 mb-5">
                {[
                  'Tech Lead Alex Ramos (ID: 619)',
                  'Robotics Tech Marcus Vance (ID: 802)',
                  'Maintenance Engineer Sarah Lin (ID: 411)',
                  'Shift B Supervisor Off-load'
                ].map((name) => (
                  <label
                    key={name}
                    className={`flex items-center gap-3 p-2.5 rounded border cursor-pointer text-[13px] transition-colors ${
                      assigneeName === name
                        ? 'border-[#0058be] bg-[#0058be]/5 font-semibold text-[#0058be]'
                        : 'border-[#E2E8F0] text-[#1b1b1d] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delegate-assignee"
                      checked={assigneeName === name}
                      onChange={() => setAssigneeName(name)}
                      className="text-[#0058be] focus:ring-[#0058be]"
                    />
                    <span>{name}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDelegateModal(false)}
                  className="px-4 py-2 border border-[#E2E8F0] text-[#45464d] text-[13px] rounded hover:bg-[#f6f3f5]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelegate}
                  className="px-4 py-2 bg-[#0058be] text-white text-[13px] font-bold rounded hover:bg-[#004bb0]"
                >
                  Confirm Delegation
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
