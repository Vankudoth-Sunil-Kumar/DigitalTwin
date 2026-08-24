import React from 'react';

interface LeadershipViewProps {
  onNavigateToFloor: () => void;
  onNavigateToPlant: () => void;
}

export const LeadershipView: React.FC<LeadershipViewProps> = ({
  onNavigateToFloor,
  onNavigateToPlant
}) => {
  return (
    <div id="leadership-view-container" className="flex-1 flex flex-col font-sans">
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto pb-8">
          {/* Header Section */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <h2 className="text-[28px] lg:text-[32px] font-bold text-[#1b1b1d] tracking-tight leading-tight">
                Executive Dashboard
              </h2>
              <p className="text-[14px] text-[#45464d] mt-1">
                Real-time performance and AI impact summary.
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-mono text-[11px] text-[#76777d] uppercase tracking-wider mb-0.5">
                Last Sync
              </p>
              <div className="flex items-center gap-1.5 font-mono text-[13px] text-[#1b1b1d] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>Just now</span>
              </div>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* 1. High-Level KPIs */}
            {/* Shift Yield */}
            <div
              onClick={onNavigateToPlant}
              className="col-span-12 md:col-span-4 bg-white border border-[#E2E8F0] rounded-lg p-5 lg:p-6 hover:border-[#0058be] transition-colors cursor-pointer shadow-sm group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#45464d]">
                  Shift Yield
                </span>
                <span className="material-symbols-outlined text-[#10B981] group-hover:scale-110 transition-transform">
                  trending_up
                </span>
              </div>
              <div className="text-[32px] font-bold text-[#1b1b1d] mb-1">94.8%</div>
              <div className="flex items-center gap-1.5 font-mono text-[12px] text-[#10B981]">
                <span className="font-bold">+1.2%</span>
                <span className="text-[#76777d]">vs. historical avg</span>
              </div>
            </div>

            {/* Downtime Cost Saved */}
            <div
              onClick={onNavigateToPlant}
              className="col-span-12 md:col-span-4 bg-white border border-[#E2E8F0] rounded-lg p-5 lg:p-6 hover:border-[#0058be] transition-colors cursor-pointer shadow-sm group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#45464d]">
                  Downtime Cost Saved (Est)
                </span>
                <span className="material-symbols-outlined text-[#0058be] group-hover:scale-110 transition-transform">
                  monetization_on
                </span>
              </div>
              <div className="text-[32px] font-bold text-[#1b1b1d] mb-1">$42,500</div>
              <div className="flex items-center gap-1.5 font-mono text-[12px] text-[#0058be] font-medium">
                <span>3 Events Prevented</span>
              </div>
            </div>

            {/* AI Rec Accuracy */}
            <div className="col-span-12 md:col-span-4 bg-white border border-[#E2E8F0] rounded-lg p-5 lg:p-6 hover:border-[#0058be] transition-colors shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#45464d]">
                  AI Rec Accuracy
                </span>
                <span className="material-symbols-outlined text-[#1b1b1d]">memory</span>
              </div>
              <div className="text-[32px] font-bold text-[#1b1b1d] mb-2">98.2%</div>
              <div className="w-full bg-[#eae7e9] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0058be] h-full rounded-full transition-all duration-1000" style={{ width: '98.2%' }}></div>
              </div>
            </div>

            {/* 2. Strategic Impact Summary */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-[#E2E8F0] rounded-lg p-5 lg:p-6 flex flex-col shadow-sm">
              <h3 className="text-[18px] text-[#1b1b1d] font-semibold mb-4 border-b border-[#E2E8F0] pb-3">
                Strategic Impact
              </h3>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-[15px] lg:text-[16px] text-[#1b1b1d] leading-relaxed">
                  Shift A is currently operating above target yield baselines. The DigitalTwin.ai predictive engine successfully identified and mitigated two micro-stoppages in the Paint Shop and one critical failure anomaly in Final Assembly early this morning. System confidence remains exceptionally high, recommending a sustained production velocity for the remainder of the shift without increased wear risk.
                </p>
              </div>
            </div>

            {/* 3. Line Health Overview */}
            <div className="col-span-12 lg:col-span-4 bg-white border border-[#E2E8F0] rounded-lg p-5 lg:p-6 shadow-sm">
              <h3 className="text-[18px] text-[#1b1b1d] font-semibold mb-4 border-b border-[#E2E8F0] pb-3">
                Line Health
              </h3>
              <div className="flex flex-col gap-3">
                {/* Zone: Body */}
                <div
                  onClick={onNavigateToFloor}
                  className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded bg-[#FCF8FA] hover:border-[#10B981] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                    <span className="font-mono text-[13px] font-medium text-[#1b1b1d]">
                      Body Shop
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
                    Optimal
                  </span>
                </div>

                {/* Zone: Paint */}
                <div
                  onClick={onNavigateToFloor}
                  className="flex items-center justify-between p-3 border border-[#F59E0B]/30 rounded bg-[#F59E0B]/5 hover:border-[#F59E0B] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse"></div>
                    <span className="font-mono text-[13px] font-medium text-[#1b1b1d]">
                      Paint Shop
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">
                    Monitoring
                  </span>
                </div>

                {/* Zone: Assembly */}
                <div
                  onClick={onNavigateToFloor}
                  className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded bg-[#FCF8FA] hover:border-[#10B981] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                    <span className="font-mono text-[13px] font-medium text-[#1b1b1d]">
                      Assembly
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
                    Optimal
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Future Outlook / Predicted Throughput */}
            <div className="col-span-12 bg-white border border-[#E2E8F0] rounded-lg p-5 lg:p-6 relative overflow-hidden shadow-sm">
              {/* Subtle background dot pattern */}
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px'
                }}
              ></div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-[18px] font-semibold text-[#1b1b1d] mb-1">
                    Predicted Throughput (End of Shift)
                  </h3>
                  <p className="text-[14px] text-[#45464d]">
                    Based on current velocity and ML health scores.
                  </p>
                </div>
                <div className="flex items-end gap-6">
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#76777d] mb-0.5">
                      Target
                    </div>
                    <div className="font-mono text-[14px] text-[#76777d] font-semibold">
                      450 Units
                    </div>
                  </div>
                  <div className="h-8 border-l border-[#E2E8F0]"></div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#0058be] mb-0.5">
                      Predicted
                    </div>
                    <div className="text-[28px] font-bold text-[#1b1b1d] flex items-baseline gap-1.5 leading-none">
                      <span>462</span>
                      <span className="font-mono text-[14px] text-[#10B981] font-bold">+12</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Visualization */}
              <div className="relative w-full h-2.5 bg-[#eae7e9] rounded-full mt-6 overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-[#76777d] w-[65%] rounded-l-full"></div>
                <div
                  className="absolute top-0 left-0 h-full bg-[#0058be]/30 w-[100%] border-r-2 border-[#0058be]"
                  style={{ clipPath: 'inset(0 0 0 65%)' }}
                ></div>
                {/* Target Marker */}
                <div
                  className="absolute top-0 h-full w-1 bg-[#1b1b1d] z-10"
                  style={{ left: '95%' }}
                  title="Target: 450 Units"
                ></div>
              </div>

              <div className="w-full flex justify-between mt-1.5 px-1 font-mono text-[11px]">
                <span className="text-[#76777d]">08:00</span>
                <span className="text-[#45464d] relative right-[5%] font-medium">Target (450)</span>
                <span className="text-[#0058be] font-bold">Predicted End (462)</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
