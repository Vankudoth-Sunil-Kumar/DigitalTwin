import React from 'react';
import { StationData, AnomalyAlert } from '../types';

interface FloorViewProps {
  stations: StationData[];
  selectedStationId: string;
  onSelectStation: (id: string) => void;
  activeAlert: AnomalyAlert;
  onAcknowledgeAlert: (alertId: string) => void;
  onViewAlertDetails: (alertId: string) => void;
  onRequestAudit: (stationId: string) => void;
  liveThroughput?: number;
  liveOee?: number;
  liveAvgCycleTime?: number;
  isLiveStreaming?: boolean;
}

export const FloorView: React.FC<FloorViewProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  activeAlert,
  onAcknowledgeAlert,
  onViewAlertDetails,
  onRequestAudit,
  liveThroughput = 62,
  liveOee = 85.4,
  liveAvgCycleTime = 57.2,
  isLiveStreaming = true
}) => {
  const selectedStation =
    stations.find((s) => s.id === selectedStationId) ||
    stations.find((s) => s.id === 'ST32') ||
    stations[0];

  const zone1Stations = stations.filter((s) => s.zoneId === 1);
  const zone2Stations = stations.filter((s) => s.zoneId === 2);
  const zone3Stations = stations.filter((s) => s.zoneId === 3);

  const getStationStatusColor = (s: StationData) => {
    if (s.status === 'critical') return 'bg-[#F43F5E]';
    if (s.status === 'warning') return 'bg-[#F59E0B]';
    return 'bg-[#10B981]';
  };

  const getStationTextColor = (s: StationData) => {
    if (s.status === 'critical') return 'text-[#F43F5E] font-bold';
    if (s.status === 'warning') return 'text-[#F59E0B] font-bold';
    return 'text-[#1b1b1d]';
  };

  // Convert normalized historical values (around 75% = 56s) into actual seconds
  const historicalSeconds = selectedStation.historicalCycleTimes.map((val) => {
    // 75% is 56.0s nominal
    const sec = Number(((val / 75) * 56.0).toFixed(1));
    return Math.max(50.0, Math.min(65.0, sec));
  });

  return (
    <div id="floor-view-container" className="flex-1 flex flex-col relative w-full font-sans">
      {/* Global Alert Pulse Glow Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent z-30 animate-pulse"></div>

      {/* Main Dashboard Canvas */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#F8FAFC]">
        {/* Bento Grid: 12 Columns */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6 max-w-[1600px] mx-auto pb-8">
          {/* ROW 1: Live Line KPIs (8 cols) & Active Recommendation (4 cols) */}
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-[11px] font-bold text-[#76777d] tracking-widest uppercase font-sans">
                Live Line KPIs (Shift A)
              </h2>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#0058be] font-semibold bg-[#d8e2ff]/20 px-2 py-0.5 rounded border border-[#0058be]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>PLC Edge Infeed Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
              {/* KPI Card 1: Throughput */}
              <div className="bg-white border border-[#E2E8F0] p-4 lg:p-5 rounded-lg flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-[#0058be]/40">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[12px] font-semibold text-[#45464d]">
                    Throughput
                  </span>
                  <span className="material-symbols-outlined text-[#0058be] text-[20px]">
                    conveyor_belt
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-[32px] font-bold text-[#1b1b1d] leading-none font-mono">
                    {liveThroughput}
                  </span>
                  <span className="text-[12px] text-[#45464d] font-medium">Units/Hr</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#10B981] font-mono text-[12px] font-medium">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span>+{liveThroughput - 60 > 0 ? liveThroughput - 60 : 2} vs Target</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#76777d]">Target: 60 U/H</span>
                </div>
              </div>

              {/* KPI Card 2: OEE */}
              <div className="bg-white border border-[#E2E8F0] p-4 lg:p-5 rounded-lg flex flex-col justify-between relative overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-[#0058be]/40">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[12px] font-semibold text-[#45464d]">OEE Overall</span>
                  <span className="material-symbols-outlined text-[#0058be] text-[20px]">
                    donut_large
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-[32px] font-bold text-[#1b1b1d] leading-none font-mono">
                    {liveOee}
                  </span>
                  <span className="text-[12px] text-[#45464d] font-medium">%</span>
                </div>
                <div className="mt-2 flex items-center justify-between font-mono text-[12px]">
                  <span className="text-[#10B981] font-semibold">World Class (&gt;85%)</span>
                  <span className="text-[10px] text-[#76777d]">Avail: 94.2%</span>
                </div>
                {/* Soft bottom metric progress */}
                <div className="absolute bottom-0 left-0 h-1 bg-[#E2E8F0] w-full">
                  <div
                    className="h-full bg-[#10B981] transition-all duration-500"
                    style={{ width: `${liveOee}%` }}
                  ></div>
                </div>
              </div>

              {/* KPI Card 3: Avg Cycle Time */}
              <div className="bg-white border border-[#E2E8F0] p-4 lg:p-5 rounded-lg flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-[#0058be]/40">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[12px] font-semibold text-[#45464d]">
                    Line Avg Cycle Time
                  </span>
                  <span className="material-symbols-outlined text-[#0058be] text-[20px]">
                    timer
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-[32px] font-bold text-[#1b1b1d] leading-none font-mono">
                    {liveAvgCycleTime}
                  </span>
                  <span className="text-[12px] text-[#45464d] font-medium">sec</span>
                </div>
                <div className="mt-2 flex items-center justify-between font-mono text-[12px]">
                  <span className="text-[#F59E0B] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    <span>Drift +{(liveAvgCycleTime - 56.0).toFixed(1)}s</span>
                  </span>
                  <span className="text-[10px] text-[#76777d]">Nominal: 56.0s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Intervention Panel (4 cols) */}
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-2">
            <h2 className="text-[11px] font-bold text-[#76777d] tracking-widest uppercase flex justify-between font-sans">
              <span>Active Intervention</span>
              <span className="text-[#F59E0B] flex items-center gap-1 font-mono text-[11px] font-bold">
                <span className="material-symbols-outlined text-[14px] animate-pulse">radar</span>
                <span>AI Detected</span>
              </span>
            </h2>
            <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#F59E0B] rounded-lg p-4 lg:p-5 h-full flex flex-col justify-between relative shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[#F59E0B] text-[20px]">
                    warning
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#BA1A1A] bg-[#BA1A1A]/10 px-1.5 py-0.5 rounded">
                      {activeAlert.stationId}
                    </span>
                    <h3 className="text-[15px] font-bold text-[#1b1b1d] leading-snug">
                      {activeAlert.title}
                    </h3>
                  </div>
                  <p className="text-[12px] text-[#45464d] mt-1.5 leading-relaxed">
                    {activeAlert.downstreamImpact}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 flex gap-2.5 border-t border-[#E2E8F0]">
                <button
                  id="btn-acknowledge-route"
                  onClick={() => onAcknowledgeAlert(activeAlert.id)}
                  className="flex-1 bg-[#0058be] hover:bg-[#004bb0] text-white text-[13px] font-semibold py-2 px-3 rounded transition-colors cursor-pointer shadow-sm active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Acknowledge</span>
                </button>
                <button
                  id="btn-view-alert-details"
                  onClick={() => onViewAlertDetails(activeAlert.id)}
                  className="flex-1 border border-[#c6c6cd] hover:bg-[#f0edef] text-[#1b1b1d] text-[13px] font-semibold py-2 px-3 rounded transition-colors cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>

          {/* ROW 2: Line Grid Overview (9 cols) & Inspection Focus (3 cols) */}
          <div className="col-span-12 xl:col-span-9 flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-end border-b border-[#E2E8F0] pb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-[11px] font-bold text-[#1b1b1d] tracking-widest uppercase font-sans">
                  Line Grid Overview (Digital Twin Telemetry)
                </h2>
                <span className="text-[10px] font-mono text-[#76777d] bg-[#f0edef] px-2 py-0.5 rounded">
                  40 Active Cells
                </span>
              </div>
              {/* Legend */}
              <div className="flex gap-4 font-mono text-[12px] text-[#45464d]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Optimal
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> Drift / Warning
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F43F5E]"></span> Critical Anomaly
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 lg:p-5 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              {/* Zone 1: Body Construction */}
              <div className="flex flex-col gap-2">
                <h3 className="font-mono text-[12px] font-semibold text-[#45464d] flex items-center gap-1.5 pb-1">
                  <span className="material-symbols-outlined text-[16px] text-[#0058be]">
                    precision_manufacturing
                  </span>
                  <span>Zone 1: Body Construction</span>
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {zone1Stations.map((station) => {
                    const isSelected = station.id === selectedStationId;
                    const statusColor = getStationStatusColor(station);
                    const textColor = getStationTextColor(station);
                    const isWarningOrCrit = station.status !== 'optimal';

                    return (
                      <div
                        key={station.id}
                        id={`station-card-${station.id}`}
                        onClick={() => onSelectStation(station.id)}
                        className={`h-16 border rounded relative overflow-hidden flex flex-col p-1.5 transition-all cursor-pointer group ${
                          isSelected
                            ? 'border-[#0058be] border-l-2 bg-[#0058be]/10 shadow-sm ring-2 ring-[#0058be]/40 scale-[1.02]'
                            : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#0058be] hover:bg-white'
                        }`}
                      >
                        <div className={`absolute top-0 left-0 w-full h-[3px] ${statusColor}`}></div>
                        <div className="flex justify-between items-center mt-0.5">
                          <span className={`font-mono text-[11px] ${textColor}`}>
                            {station.id}
                          </span>
                          {station.status === 'critical' ? (
                            <span className="material-symbols-outlined text-[13px] text-[#F43F5E] animate-pulse">
                              error
                            </span>
                          ) : isSelected && isWarningOrCrit ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping mr-0.5"></span>
                          ) : (
                            <span className="material-symbols-outlined text-[12px] text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity">
                              check_circle
                            </span>
                          )}
                        </div>

                        {/* Telemetry Cycle tag */}
                        <div className="text-[9px] font-mono text-[#76777d] font-semibold mt-0.5">
                          {station.cycleTime}s
                        </div>

                        {/* Enhanced Dynamic Equalizer Bars */}
                        <div className="mt-auto h-3 w-full flex items-end gap-[1.5px] opacity-75 group-hover:opacity-100">
                          {station.sparkHeights.map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${Math.max(20, h)}%` }}
                              className={`flex-1 rounded-t-xs transition-all duration-300 ${
                                station.status === 'critical'
                                  ? 'bg-[#F43F5E]'
                                  : station.status === 'warning'
                                  ? 'bg-[#F59E0B]'
                                  : 'bg-[#0058be]/60'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zone 2: Paint */}
              <div className="flex flex-col gap-2 border-l border-[#E2E8F0] pl-4 md:pl-6">
                <h3 className="font-mono text-[12px] font-semibold text-[#45464d] flex items-center gap-1.5 pb-1">
                  <span className="material-symbols-outlined text-[16px] text-[#0058be]">
                    format_paint
                  </span>
                  <span>Zone 2: Paint</span>
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {zone2Stations.map((station) => {
                    const isSelected = station.id === selectedStationId;
                    const statusColor = getStationStatusColor(station);
                    const textColor = getStationTextColor(station);

                    return (
                      <div
                        key={station.id}
                        id={`station-card-${station.id}`}
                        onClick={() => onSelectStation(station.id)}
                        className={`h-16 border rounded relative overflow-hidden flex flex-col p-1.5 transition-all cursor-pointer group ${
                          isSelected
                            ? 'border-[#0058be] border-l-2 bg-[#0058be]/10 shadow-sm ring-2 ring-[#0058be]/40 scale-[1.02]'
                            : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#0058be] hover:bg-white'
                        }`}
                      >
                        <div className={`absolute top-0 left-0 w-full h-[3px] ${statusColor}`}></div>
                        <div className="flex justify-between items-center mt-0.5">
                          <span className={`font-mono text-[11px] ${textColor}`}>
                            {station.id}
                          </span>
                        </div>
                        <div className="text-[9px] font-mono text-[#76777d] font-semibold mt-0.5">
                          {station.cycleTime}s
                        </div>
                        <div className="mt-auto h-3 w-full flex items-end gap-[1.5px] opacity-60 group-hover:opacity-100">
                          {station.sparkHeights.map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${Math.max(20, h)}%` }}
                              className="flex-1 bg-[#76777d]/70 rounded-t-xs transition-all duration-300"
                            ></div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zone 3: Final Assembly */}
              <div className="flex flex-col gap-2 border-l border-[#E2E8F0] pl-4 md:pl-6">
                <h3 className="font-mono text-[12px] font-semibold text-[#45464d] flex items-center gap-1.5 pb-1">
                  <span className="material-symbols-outlined text-[16px] text-[#0058be]">
                    directions_car
                  </span>
                  <span>Zone 3: Final Assembly</span>
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {zone3Stations.map((station) => {
                    const isSelected = station.id === selectedStationId;
                    const statusColor = getStationStatusColor(station);
                    const textColor = getStationTextColor(station);
                    const isCrit = station.status === 'critical';

                    return (
                      <div
                        key={station.id}
                        id={`station-card-${station.id}`}
                        onClick={() => onSelectStation(station.id)}
                        className={`h-16 border rounded relative overflow-hidden flex flex-col p-1.5 transition-all cursor-pointer group ${
                          isSelected
                            ? 'border-[#0058be] border-l-2 bg-[#0058be]/10 shadow-sm ring-2 ring-[#0058be]/40 scale-[1.02]'
                            : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#0058be] hover:bg-white'
                        } ${isCrit ? 'border-[#F43F5E] shadow-[0_0_12px_rgba(244,63,94,0.25)]' : ''}`}
                      >
                        <div className={`absolute top-0 left-0 w-full h-[3px] ${statusColor}`}></div>
                        <div className="flex justify-between items-center mt-0.5">
                          <span className={`font-mono text-[11px] ${textColor}`}>
                            {station.id}
                          </span>
                          {isCrit && (
                            <span className="material-symbols-outlined text-[13px] text-[#F43F5E] animate-bounce">
                              error
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] font-mono text-[#76777d] font-semibold mt-0.5">
                          {station.cycleTime}s
                        </div>
                        <div className="mt-auto h-3 w-full flex items-end gap-[1.5px] opacity-75 group-hover:opacity-100">
                          {station.sparkHeights.map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${Math.max(20, h)}%` }}
                              className={`flex-1 rounded-t-xs transition-all duration-300 ${
                                isCrit ? 'bg-[#F43F5E]' : 'bg-[#0058be]/70'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Inspection Focus Panel (3 cols) */}
          <div className="col-span-12 xl:col-span-3 flex flex-col gap-2 mt-2">
            <h2 className="text-[11px] font-bold text-[#76777d] tracking-widest uppercase font-sans">
              Inspection Focus
            </h2>

            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              {/* Header: Station Name & Status */}
              <div className="flex justify-between items-start pb-3 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-[18px] font-bold text-[#1b1b1d]">
                      {selectedStation.id}
                    </h3>
                    <span className="text-[11px] font-mono text-[#76777d] bg-[#f0edef] px-1.5 py-0.5 rounded">
                      Zone {selectedStation.zoneId}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#45464d] mt-0.5 font-medium">{selectedStation.name}</p>
                </div>
                <div
                  className={`font-mono text-[11px] uppercase font-bold px-2 py-0.5 rounded ${
                    selectedStation.status === 'critical'
                      ? 'bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/20'
                      : selectedStation.status === 'warning'
                      ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20'
                      : 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                  }`}
                >
                  {selectedStation.status === 'critical'
                    ? 'Critical'
                    : selectedStation.status === 'warning'
                    ? 'Warning'
                    : 'Optimal'}
                </div>
              </div>

              {/* Full-Scale Live Telemetry Graph (Never Cut or Clipped!) */}
              <div className="flex flex-col gap-1 my-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[12px] text-[#76777d]">
                    Live Cycle Time Telemetry
                  </span>
                  <span className="font-mono text-[12px] text-[#1b1b1d] font-bold">
                    {selectedStation.cycleTime}s (
                    <span
                      className={
                        selectedStation.drift > 0
                          ? 'text-[#F59E0B]'
                          : 'text-[#10B981]'
                      }
                    >
                      {selectedStation.drift > 0 ? `+${selectedStation.drift}` : selectedStation.drift}s
                    </span>
                    )
                  </span>
                </div>

                {/* Rich SVG Graph with Area Gradient & Reference Lines */}
                <div className="h-36 w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg relative p-2 overflow-hidden flex flex-col justify-between">
                  {/* Upper Limit Line (60.0s) */}
                  <div className="absolute top-4 left-0 right-0 border-t border-dashed border-[#F43F5E]/70 flex items-center justify-between px-2 z-0">
                    <span className="text-[9px] font-mono font-bold text-[#F43F5E] bg-white/90 px-1 rounded -mt-2">
                      UCL 60.0s
                    </span>
                  </div>

                  {/* Nominal Target Line (56.0s) */}
                  <div className="absolute top-18 left-0 right-0 border-t border-dashed border-[#0058be]/50 flex items-center justify-between px-2 z-0">
                    <span className="text-[9px] font-mono font-bold text-[#0058be] bg-white/90 px-1 rounded -mt-2">
                      Target 56.0s
                    </span>
                  </div>

                  {/* SVG Wave Chart */}
                  <svg className="w-full h-24 overflow-visible relative z-10" viewBox="0 0 280 80" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="driftGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={selectedStation.status === 'critical' ? '#F43F5E' : '#0058be'} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={selectedStation.status === 'critical' ? '#F43F5E' : '#0058be'} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* SVG Area Fill */}
                    {(() => {
                      const pts = historicalSeconds.map((sec, idx) => {
                        const x = (idx / (historicalSeconds.length - 1)) * 280;
                        // 50s -> 75, 62s -> 10
                        const y = Math.max(10, Math.min(75, 75 - ((sec - 50) / 12) * 65));
                        return { x, y, sec };
                      });
                      const dLine = pts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '');
                      const dArea = `${dLine} L 280,80 L 0,80 Z`;
                      const lastPt = pts[pts.length - 1];

                      return (
                        <>
                          <path d={dArea} fill="url(#driftGrad)" />
                          <path
                            d={dLine}
                            fill="none"
                            stroke={selectedStation.status === 'critical' ? '#F43F5E' : '#0058be'}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {pts.map((p, i) => (
                            <circle
                              key={i}
                              cx={p.x}
                              cy={p.y}
                              r={i === pts.length - 1 ? 4 : 2.5}
                              fill={p.sec >= 60 ? '#F43F5E' : p.sec >= 58 ? '#F59E0B' : '#0058be'}
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                          ))}
                          {/* Live pulse on latest sample */}
                          <circle
                            cx={lastPt.x}
                            cy={lastPt.y}
                            r="7"
                            fill="none"
                            stroke={selectedStation.status === 'critical' ? '#F43F5E' : '#0058be'}
                            strokeWidth="1.5"
                            className="animate-ping"
                          />
                        </>
                      );
                    })()}
                  </svg>

                  {/* Equalizer Samples Slider Bar */}
                  <div className="flex justify-between items-center text-[9px] font-mono text-[#76777d] border-t border-[#E2E8F0] pt-1">
                    {historicalSeconds.map((sec, idx) => (
                      <span
                        key={idx}
                        className={`font-semibold ${
                          sec >= 60 ? 'text-[#F43F5E]' : sec >= 58 ? 'text-[#F59E0B]' : 'text-[#45464d]'
                        }`}
                      >
                        {sec}s
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between font-mono text-[10px] text-[#76777d] px-1 mt-0.5">
                  <span>T-60m (Historical)</span>
                  <span className="text-[#0058be] font-bold">Now (Live Edge)</span>
                </div>
              </div>

              {/* Alert note if any */}
              {selectedStation.alertSummary && (
                <div className="mb-3 p-2.5 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg text-[11px] text-[#1b1b1d]">
                  <span className="font-bold text-[#F59E0B] flex items-center gap-1 mb-0.5">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    <span>Telemetry Diagnostics:</span>
                  </span>
                  {selectedStation.alertSummary}
                </div>
              )}

              {/* Content: Sensor Telemetry Metrics */}
              <div className="flex flex-col gap-2 border-t border-[#E2E8F0] pt-3 mt-auto">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-[#45464d] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#0058be]">
                      inventory_2
                    </span>
                    <span>WIP Infeed Buffer</span>
                  </span>
                  <span className="font-mono font-bold text-[#1b1b1d]">
                    {selectedStation.wipBuffer} / 8 units
                  </span>
                </div>

                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-[#45464d] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#0058be]">
                      sensors
                    </span>
                    <span>Sensor Coverage</span>
                  </span>
                  <span className="font-mono font-medium text-[#1b1b1d]">
                    {selectedStation.isExplicitSensor ? (
                      <span className="text-[#10B981] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                        {selectedStation.sensorCoverage}
                      </span>
                    ) : (
                      <span className="text-[#F59E0B] font-semibold">
                        Virtual Inferred ({selectedStation.inferenceConfidence}%)
                      </span>
                    )}
                  </span>
                </div>

                {selectedStation.torqueNm && (
                  <div className="flex justify-between items-center text-[12px] bg-[#f0edef]/50 px-2 py-1 rounded">
                    <span className="text-[#45464d]">Fastener Torque:</span>
                    <span className="font-mono font-bold text-[#1b1b1d]">{selectedStation.torqueNm} N·m</span>
                  </div>
                )}

                {selectedStation.vibrationMmS && (
                  <div className="flex justify-between items-center text-[12px] bg-[#f0edef]/50 px-2 py-1 rounded">
                    <span className="text-[#45464d]">Bearing Vibration:</span>
                    <span className="font-mono font-bold text-[#1b1b1d]">{selectedStation.vibrationMmS} mm/s</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-[#45464d] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#0058be]">
                      router
                    </span>
                    <span>Edge Gateway</span>
                  </span>
                  <span className="font-mono text-[#10B981] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
                    {selectedStation.edgeGateway}
                  </span>
                </div>

                {/* Request Manual Audit CTA */}
                <button
                  id={`btn-manual-audit-${selectedStation.id}`}
                  onClick={() => onRequestAudit(selectedStation.id)}
                  className="w-full mt-2 border border-[#76777d] text-[#1b1b1d] hover:bg-[#0058be] hover:text-white hover:border-[#0058be] text-[12px] font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-[16px]">search</span>
                  <span>Request Precision Diagnostic</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
