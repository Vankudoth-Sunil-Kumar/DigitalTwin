import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [refreshInterval, setRefreshInterval] = useState('1s');
  const [telemetryMode, setTelemetryMode] = useState('synthetic');
  const [audioAlerts, setAudioAlerts] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
          <h3 className="font-bold text-[17px] text-[#1b1b1d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be]">settings</span>
            <span>DigitalTwin.ai Settings</span>
          </h3>
          <button onClick={onClose} className="text-[#76777d] hover:text-[#1b1b1d]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-4 mb-6 text-[13px]">
          <div>
            <label className="block font-medium text-[#1b1b1d] mb-1">
              Data Stream Telemetry Mode
            </label>
            <select
              value={telemetryMode}
              onChange={(e) => setTelemetryMode(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded p-2 bg-[#FCF8FA] text-[#1b1b1d]"
            >
              <option value="synthetic">Synthetic Line Emulator (High Fidelity)</option>
              <option value="opcua">OPC-UA Real PLC Live Feed</option>
              <option value="mqtt">MQTT IoT Gateway Sensor Stream</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#1b1b1d] mb-1">
              Live Twin Sync Rate
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded p-2 bg-[#FCF8FA] text-[#1b1b1d]"
            >
              <option value="500ms">500ms (High Frequency)</option>
              <option value="1s">1 second (Recommended)</option>
              <option value="5s">5 seconds (Low Bandwidth)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-medium text-[#1b1b1d] block">Critical Anomaly Audio Alarm</span>
              <span className="text-[11px] text-[#76777d]">Chime on priority predictive bottleneck alert</span>
            </div>
            <input
              type="checkbox"
              checked={audioAlerts}
              onChange={(e) => setAudioAlerts(e.target.checked)}
              className="h-4 w-4 text-[#0058be] rounded"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0058be] text-white text-[13px] font-bold rounded hover:bg-[#004bb0]"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
