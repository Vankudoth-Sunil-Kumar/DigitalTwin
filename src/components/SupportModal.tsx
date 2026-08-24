import React from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
          <h3 className="font-bold text-[17px] text-[#1b1b1d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be]">help</span>
            <span>DigitalTwin.ai Operations Support</span>
          </h3>
          <button onClick={onClose} className="text-[#76777d] hover:text-[#1b1b1d]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-3 mb-6 text-[13px]">
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
            <span className="font-bold text-[#1b1b1d] block">Plant OT / SCADA Engineering Hotline</span>
            <span className="text-[12px] text-[#45464d] font-mono">+1 (800) 555-TWIN (ext. 402)</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
            <span className="font-bold text-[#1b1b1d] block">Predictive Model Documentation</span>
            <span className="text-[12px] text-[#45464d]">
              Cluster model v4.2 trained on 14.8M hours of robotic automotive line cycles.
            </span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
            <span className="font-bold text-[#1b1b1d] block">Line Protocol Compliance</span>
            <span className="text-[12px] text-[#10B981] font-medium">
              ISO 9001 QA & ISA-95 Manufacturing Operations Compliant
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0058be] text-white text-[13px] font-bold rounded hover:bg-[#004bb0]"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
