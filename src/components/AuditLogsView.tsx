import React, { useState } from 'react';
import { SupervisorActionLog } from '../types';

interface AuditLogsViewProps {
  logs: SupervisorActionLog[];
  onExportLogs: () => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, onExportLogs }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesType = filterType === 'ALL' || log.type === filterType;
    const matchesSearch =
      log.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.user.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (log.stationId && log.stationId.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div id="audit-logs-view-container" className="flex-1 flex flex-col font-sans">
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto pb-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-[28px] lg:text-[32px] font-bold text-[#1b1b1d] tracking-tight leading-tight">
                System & Supervisor Audit Logs
              </h2>
              <p className="text-[14px] text-[#45464d] mt-1">
                Immutable chronological event trail of supervisory overrides, parameter calibrations, and automated mitigations.
              </p>
            </div>
            <button
              onClick={onExportLogs}
              className="px-4 py-2 bg-[#0058be] text-white font-mono text-[12px] font-bold rounded hover:bg-[#004bb0] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export CSV Audit</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by keyword, user, or station..."
                className="w-full pl-9 pr-3 py-1.5 border border-[#E2E8F0] rounded text-[13px] bg-[#FCF8FA] focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] outline-none"
              />
            </div>

            {/* Type Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {['ALL', 'OVERRIDE', 'ACKNOWLEDGED', 'PARAMETERS ADJUSTED', 'EXECUTED'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    filterType === type
                      ? 'bg-[#0058be] text-white'
                      : 'bg-[#f6f3f5] text-[#45464d] hover:bg-[#eae7e9]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr className="bg-[#f6f3f5] border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#45464d]">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action Type</th>
                    <th className="py-3 px-4">Station</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Authorized User</th>
                    <th className="py-3 px-4">Integrity Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#76777d]">
                        No matching audit entries found for the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const badgeClass =
                        log.type === 'OVERRIDE'
                          ? 'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/20'
                          : log.type === 'ACKNOWLEDGED'
                          ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                          : log.type === 'PARAMETERS ADJUSTED'
                          ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                          : 'bg-[#0058be]/10 text-[#0058be] border-[#0058be]/20';

                      return (
                        <tr key={log.id} className="hover:bg-[#FCF8FA] transition-colors">
                          <td className="py-3 px-4 font-mono text-[12px] text-[#45464d] whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border whitespace-nowrap ${badgeClass}`}
                            >
                              {log.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#1b1b1d]">
                            {log.stationId || '—'}
                          </td>
                          <td className="py-3 px-4 text-[#1b1b1d] font-medium max-w-md">
                            {log.title}
                          </td>
                          <td className="py-3 px-4 text-[#45464d] font-mono text-[12px] whitespace-nowrap">
                            {log.user} ({log.userId})
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-[#76777d] whitespace-nowrap">
                            0x{log.id.replace('-', '').slice(0, 8)}...8f
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
