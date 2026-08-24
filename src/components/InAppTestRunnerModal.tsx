import React, { useState, useEffect } from 'react';
import { StationData, AnomalyAlert, InAppTestCase } from '../types';
import { runInAppVerificationSuite } from '../utils/digitalTwinEngine';

interface InAppTestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: StationData[];
  alerts: AnomalyAlert[];
}

export const InAppTestRunnerModal: React.FC<InAppTestRunnerModalProps> = ({
  isOpen,
  onClose,
  stations,
  alerts
}) => {
  const [tests, setTests] = useState<InAppTestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'passed' | 'failed'>('all');

  const executeTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const suiteResults = runInAppVerificationSuite(stations, alerts);
      setTests(suiteResults);
      setIsRunning(false);
    }, 400);
  };

  useEffect(() => {
    if (isOpen && tests.length === 0) {
      executeTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const passedCount = tests.filter((t) => t.status === 'passed').length;
  const failedCount = tests.filter((t) => t.status === 'failed').length;
  const filteredTests = tests.filter((t) => {
    if (activeTab === 'passed') return t.status === 'passed';
    if (activeTab === 'failed') return t.status === 'failed';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 lg:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#0058be] text-[24px]">
              verified
            </span>
            <div>
              <h2 className="text-[18px] font-bold text-[#1b1b1d]">
                DigitalTwin.ai Automated In-App Verification Suite
              </h2>
              <p className="text-[12px] text-[#45464d]">
                Validating deterministic industrial physics, SPC rules, propagation, and false-alert filtering.
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

        {/* Status Bar */}
        <div className="px-5 py-3 bg-[#FCF8FA] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
              <span>{passedCount} Passed</span>
            </div>
            {failedCount > 0 && (
              <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold text-[#F43F5E]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]"></span>
                <span>{failedCount} Failed</span>
              </div>
            )}
            <span className="text-[#76777d] text-[12px]">|</span>
            <span className="text-[12px] text-[#45464d]">
              Total 7 Automated Unit & Integration Assertions
            </span>
          </div>

          <button
            onClick={executeTests}
            disabled={isRunning}
            className="px-3 py-1.5 bg-[#0058be] hover:bg-[#2170e4] text-white font-bold text-[12px] rounded flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <span className={`material-symbols-outlined text-[16px] ${isRunning ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isRunning ? 'Executing Suite...' : 'Re-Run All Verification Tests'}</span>
          </button>
        </div>

        {/* Test List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="p-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#cbd5e1] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      test.status === 'passed' ? 'text-[#10B981]' : 'text-[#F43F5E]'
                    }`}
                  >
                    {test.status === 'passed' ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="text-[14px] font-bold text-[#1b1b1d]">{test.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#76777d]">{test.executionTimeMs}ms</span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      test.status === 'passed'
                        ? 'bg-[#10B981]/15 text-[#065f46]'
                        : 'bg-[#F43F5E]/15 text-[#F43F5E]'
                    }`}
                  >
                    {test.status}
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-[#45464d] mt-1.5 leading-relaxed">
                {test.description}
              </p>

              <div className="mt-2.5 p-2 bg-white rounded border border-[#E2E8F0] font-mono text-[11px] text-[#065f46]">
                {test.assertionDetails}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center text-[12px]">
          <span className="text-[#76777d]">
            Accenture Innovation Challenge 2026 — Track 4 Automated Verification
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1b1b1d] text-white hover:bg-black font-bold rounded cursor-pointer"
          >
            Close Runner
          </button>
        </div>
      </div>
    </div>
  );
};
