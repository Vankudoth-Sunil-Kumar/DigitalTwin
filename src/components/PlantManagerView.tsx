import React, { useState } from 'react';
import { SupervisorActionLog, DefectTraceItem, BottleneckRow } from '../types';

interface PlantManagerViewProps {
  logs: SupervisorActionLog[];
  defectTraces: DefectTraceItem[];
  bottlenecks: BottleneckRow[];
  onOpenAdjustParameters: () => void;
  onExportReport: () => void;
  onViewFullAuditLog: () => void;
  onSelectStationTrace: (stationId: string) => void;
  liveThroughput?: number;
  isLiveStreaming?: boolean;
}

export const PlantManagerView: React.FC<PlantManagerViewProps> = ({
  logs,
  defectTraces,
  bottlenecks,
  onOpenAdjustParameters,
  onExportReport,
  onViewFullAuditLog,
  onSelectStationTrace,
  liveThroughput = 62,
  isLiveStreaming = true
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Hourly throughput samples across Shift A
  const hourlyData = [
    { time: '08:00', target: 60, actual: 58, note: 'Shift Ramp-up' },
    { time: '09:00', target: 60, actual: 61, note: 'Steady State' },
    { time: '10:00', target: 60, actual: 59, note: 'Tool Wear Drift at ST32' },
    { time: '11:00', target: 60, actual: 64, note: 'Batch Vol Surge' },
    { time: '12:00', target: 60, actual: 66, note: 'Max Surge Production' },
    { time: '13:00', target: 60, actual: 63, note: 'High Infeed Buffer' },
    { time: '14:00', target: 60, actual: 61, note: 'Minor Buffer Depletion' },
    { time: '15:00', target: 60, actual: liveThroughput, note: 'Live Infeed Current' }
  ];

  // SVG Dimension Constants
  const svgWidth = 700;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;
  const minVal = 40;
  const maxVal = 75;

  const getY = (val: number) => {
    return paddingY + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
  };

  const getX = (index: number) => {
    return paddingX + (index / (hourlyData.length - 1)) * chartW;
  };

  // Generate smooth SVG Catmull-Rom or cubic spline
  const points = hourlyData.map((d, i) => ({ x: getX(i), y: getY(d.actual) }));
  const targetY = getY(60);

  // Build SVG path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + chartH} L ${points[0].x} ${paddingY + chartH} Z`;

  return (
    <div id="plant-manager-view-container" className="flex-1 flex flex-col font-sans">
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#F8FAFC]">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[28px] lg:text-[32px] font-bold text-[#1b1b1d] tracking-tight leading-tight">
                Shift Performance Analysis
              </h2>
              {isLiveStreaming && (
                <span className="flex items-center gap-1 text-[11px] font-mono font-bold bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
                  STREAMING
                </span>
              )}
            </div>
            <p className="text-[14px] text-[#45464d]">
              Plant-wide aggregate throughput, defect trace pathways, and supervisor governance logs.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="btn-export-report"
              onClick={onExportReport}
              className="px-4 py-2 border border-[#76777d] font-mono text-[12px] font-semibold rounded text-[#1b1b1d] hover:bg-[#f0edef] transition-colors flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Report</span>
            </button>
            <button
              id="btn-adjust-parameters"
              onClick={onOpenAdjustParameters}
              className="px-4 py-2 bg-[#0058be] text-white font-mono text-[12px] font-bold rounded hover:bg-[#004bb0] transition-colors flex items-center gap-1.5 cursor-pointer active:scale-98 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Adjust Parameters</span>
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6 max-w-[1600px] mx-auto pb-8">
          {/* 1. Throughput vs Target (8 cols) */}
          <div className="col-span-12 xl:col-span-8 bg-white border border-[#E2E8F0] rounded-lg p-5 lg:p-6 flex flex-col shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-[18px] text-[#1b1b1d] font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0058be]">trending_up</span>
                  <span>Throughput vs Target Trajectory</span>
                </h3>
                <p className="text-[12px] text-[#76777d]">
                  Shift A Hourly production volume against 60 U/H standard nominal target.
                </p>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono font-bold uppercase tracking-wider bg-[#F8FAFC] px-3 py-1.5 rounded border border-[#E2E8F0]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                  <span className="text-[#45464d]">Target (60 U/H)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0058be]"></span>
                  <span className="text-[#0058be]">Actual ({liveThroughput} U/H)</span>
                </div>
              </div>
            </div>

            {/* Seamless, Full-Scale Dynamic SVG Chart */}
            <div className="flex-1 relative w-full flex flex-col justify-center min-h-[280px]">
              <svg
                className="w-full h-full min-h-[240px] overflow-visible"
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="plantChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0058be" stopOpacity="0.28" />
                    <stop offset="60%" stopColor="#0058be" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#0058be" stopOpacity="0.0" />
                  </linearGradient>

                  <linearGradient id="surgeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                {[40, 50, 60, 70].map((val) => {
                  const y = getY(val);
                  return (
                    <g key={val}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="#E2E8F0"
                        strokeDasharray={val === 60 ? '4 4' : '2 2'}
                        strokeWidth={val === 60 ? '1.5' : '1'}
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 4}
                        textAnchor="end"
                        fill="#76777d"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Nominal Target Line (60 U/H) */}
                <line
                  x1={paddingX}
                  y1={targetY}
                  x2={svgWidth - paddingX}
                  y2={targetY}
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />

                {/* Soft Surge Window (11:00 - 13:00) */}
                <rect
                  x={getX(3)}
                  y={paddingY}
                  width={getX(5) - getX(3)}
                  height={chartH}
                  fill="url(#surgeAreaGradient)"
                  rx="4"
                />
                <text
                  x={(getX(3) + getX(5)) / 2}
                  y={paddingY + 16}
                  textAnchor="middle"
                  fill="#F59E0B"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  ⚡ BATCH SURGE WINDOW
                </text>

                {/* Actual Spline Area & Curve */}
                <path d={areaD} fill="url(#plantChartGradient)" />
                <path
                  d={pathD}
                  fill="none"
                  stroke="#0058be"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Point Nodes */}
                {points.map((p, idx) => {
                  const d = hourlyData[idx];
                  const isHovered = hoveredPoint === idx;
                  const isLast = idx === points.length - 1;

                  return (
                    <g
                      key={idx}
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer"
                    >
                      {/* Pulse on live latest point */}
                      {isLast && isLiveStreaming && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="12"
                          fill="none"
                          stroke="#0058be"
                          strokeWidth="2"
                          className="animate-ping opacity-75"
                        />
                      )}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered || isLast ? 6 : 4}
                        fill={d.actual >= 60 ? '#0058be' : '#F59E0B'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all"
                      />
                      {/* Value text above node */}
                      <text
                        x={p.x}
                        y={p.y - 10}
                        textAnchor="middle"
                        fill="#1b1b1d"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {d.actual}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* X-Axis Time Labels */}
              <div className="flex justify-between items-center font-mono text-[11px] text-[#45464d] px-8 pt-2 border-t border-[#E2E8F0]">
                {hourlyData.map((d, i) => (
                  <div
                    key={d.time}
                    className={`flex flex-col items-center cursor-pointer transition-colors ${
                      hoveredPoint === i ? 'text-[#0058be] font-bold' : ''
                    }`}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <span>{d.time}</span>
                    {hoveredPoint === i && (
                      <span className="text-[10px] text-[#76777d] mt-0.5">{d.note}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Supervisor Actions Log (4 cols) */}
          <div className="col-span-12 xl:col-span-4 bg-white border border-[#E2E8F0] rounded-lg p-5 lg:p-6 flex flex-col shadow-sm">
            <h3 className="text-[18px] text-[#1b1b1d] font-bold mb-4 border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0058be]">gavel</span>
                <span>Supervisor Actions</span>
              </span>
              <span className="text-[11px] font-mono text-[#76777d] bg-[#f0edef] px-2 py-0.5 rounded font-normal">
                {logs.length} Events
              </span>
            </h3>

            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 max-h-[300px]">
              {logs.map((log) => {
                const badgeStyle =
                  log.type === 'OVERRIDE'
                    ? 'text-[#F43F5E] bg-[#F43F5E]/10 border-[#F43F5E]/20'
                    : log.type === 'ACKNOWLEDGED'
                    ? 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20'
                    : log.type === 'PARAMETERS ADJUSTED'
                    ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20'
                    : 'text-[#0058be] bg-[#0058be]/10 border-[#0058be]/20';

                return (
                  <div
                    key={log.id}
                    className="p-3 bg-[#FCF8FA] rounded-lg border border-[#E2E8F0] hover:border-[#0058be]/40 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeStyle}`}>
                        {log.type}
                      </span>
                      <span className="font-mono text-[11px] text-[#45464d]">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#1b1b1d] font-medium leading-tight mt-1">
                      {log.title}
                    </p>
                    <div className="mt-1.5 font-mono text-[11px] text-[#76777d]">
                      Operator: <span className="text-[#1b1b1d] font-semibold">{log.user} ({log.userId})</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              id="btn-view-full-audit-log"
              onClick={onViewFullAuditLog}
              className="mt-4 w-full py-2 border border-[#0058be] text-[#0058be] hover:bg-[#0058be] hover:text-white font-mono text-[12px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>View Full Line Audit Log</span>
            </button>
          </div>

          {/* 2. Defect Traceability (QA Gates - 6 cols) */}
          <div className="col-span-12 lg:col-span-6 bg-white border border-[#E2E8F0] rounded-lg p-5 lg:p-6 shadow-sm">
            <h3 className="text-[18px] text-[#1b1b1d] font-bold mb-4 border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#F43F5E]">bug_report</span>
              <span>Defect Traceability (QA Gates)</span>
            </h3>

            <div className="flex flex-col gap-4">
              {defectTraces.map((trace) => {
                const isCrit = trace.severity === 'critical';
                const dotColor = isCrit ? 'bg-[#F43F5E]' : 'bg-[#F59E0B]';
                const borderAccent = isCrit ? 'border-l-[#F43F5E]' : 'border-l-[#F59E0B]';

                return (
                  <div key={trace.id} className="relative pl-6 border-l-2 border-[#E2E8F0] ml-2">
                    <div className={`absolute w-3 h-3 ${dotColor} rounded-full -left-[7px] top-1.5 border-2 border-white shadow-sm`}></div>
                    <div className={`bg-[#FCF8FA] p-4 rounded-lg border border-[#E2E8F0] border-l-4 ${borderAccent}`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <h4 className="font-mono text-[13px] font-bold text-[#1b1b1d]">
                          {trace.caughtAt}
                        </h4>
                        <span className="font-mono text-[11px] text-[#45464d] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          {trace.incidentCount} Incident{trace.incidentCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#45464d] mb-3">
                        {trace.description}
                      </p>

                      {/* Root cause trace container */}
                      <div className="bg-[#f6f3f5] p-2.5 rounded border border-[#E2E8F0]">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#45464d] mb-1">
                          ROOT CAUSE TRACE
                        </div>
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[12px]">
                          <span className="material-symbols-outlined text-[16px] text-[#0058be]">
                            arrow_right_alt
                          </span>
                          <span className="text-[#76777d]">Origin Station:</span>
                          <button
                            onClick={() => onSelectStationTrace(trace.rootStationId)}
                            className="font-bold text-[#0058be] hover:underline cursor-pointer flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-[#0058be]/30"
                          >
                            <span>{trace.rootStationId}</span>
                            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Bottleneck Analysis (6 cols) */}
          <div className="col-span-12 lg:col-span-6 bg-white border border-[#E2E8F0] rounded-lg p-5 lg:p-6 shadow-sm">
            <h3 className="text-[18px] text-[#1b1b1d] font-bold mb-4 border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F59E0B]">hourglass_empty</span>
                <span>Active Bottlenecks & Capacity Constraints</span>
              </span>
              <span className="text-[11px] font-mono text-[#76777d]">Shift Target: 56.0s</span>
            </h3>

            <div className="flex flex-col gap-3">
              {bottlenecks.map((row) => {
                const isCrit = row.status === 'critical';
                const barColor = isCrit ? 'bg-[#F43F5E]' : 'bg-[#F59E0B]';
                const pct = Math.min(100, Math.round((row.avgCycle / 65) * 100));

                return (
                  <div
                    key={row.stationId}
                    className="p-3.5 bg-[#FCF8FA] border border-[#E2E8F0] rounded-lg hover:border-[#0058be]/30 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectStationTrace(row.stationId)}
                          className="font-mono text-[13px] font-bold text-[#0058be] hover:underline cursor-pointer"
                        >
                          {row.stationId}
                        </button>
                        <span className="text-[13px] font-medium text-[#1b1b1d]">{row.name}</span>
                      </div>
                      <span className="font-mono text-[13px] font-bold text-[#1b1b1d]">
                        {row.avgCycle}s{' '}
                        <span className={isCrit ? 'text-[#F43F5E]' : 'text-[#F59E0B]'}>
                          (+{row.drift}s)
                        </span>
                      </span>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="w-full bg-[#E2E8F0] h-2 rounded overflow-hidden mt-2">
                      <div
                        className={`h-full rounded ${barColor} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center mt-2 text-[11px] text-[#76777d]">
                      <span>Infeed Queue: {row.infeedQueue} units</span>
                      <span className="font-mono text-[#BA1A1A] font-semibold">{row.rootCauseBrief}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
