import React, { useState, useEffect, useRef } from 'react';
import { AnomalyAlert } from '../types';

interface TopAppBarProps {
  currentShift: string;
  onSelectShift: (shift: string) => void;
  alerts: AnomalyAlert[];
  onOpenAlerts: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showSearch?: boolean;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  isLiveStreaming?: boolean;
  onToggleLiveStream?: () => void;
  liveStreamSpeed?: 1 | 2;
  onChangeSpeed?: (speed: 1 | 2) => void;
  onSimulateAnomaly?: () => void;
  onStartHeroDemo?: () => void;
  onOpenTestRunner?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentShift,
  onSelectShift,
  alerts,
  onOpenAlerts,
  searchQuery,
  onSearchChange,
  showSearch = false,
  onToggleSidebar,
  isSidebarCollapsed = false,
  isLiveStreaming = true,
  onToggleLiveStream,
  liveStreamSpeed = 1,
  onChangeSpeed,
  onSimulateAnomaly,
  onStartHeroDemo,
  onOpenTestRunner
}) => {
  const [shiftDropdownOpen, setShiftDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const topBarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topBarRef.current && !topBarRef.current.contains(e.target as Node)) {
        setShiftDropdownOpen(false);
        setShowNotifications(false);
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const shifts = ['Shift A (08:00 - 16:00)', 'Shift B (16:00 - 00:00)', 'Shift C (00:00 - 08:00)'];

  return (
    <header
      ref={topBarRef}
      id="top-app-bar"
      className="bg-white border-b border-[#E2E8F0] flex justify-between items-center h-16 w-full px-4 lg:px-8 z-30 sticky top-0 shrink-0 font-sans shadow-none"
    >
      {/* Left side: Push/Pull Toggle & Search or Shift Context */}
      <div className="flex items-center gap-3 lg:gap-5">
        {onToggleSidebar && (
          <button
            id="btn-topbar-sidebar-toggle"
            onClick={onToggleSidebar}
            className="p-1.5 rounded text-[#45464d] hover:text-[#1b1b1d] hover:bg-[#f0edef] transition-colors flex items-center justify-center cursor-pointer active:scale-95"
            title={isSidebarCollapsed ? 'Pull to expand sidebar' : 'Push to collapse sidebar'}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isSidebarCollapsed ? 'menu_open' : 'menu'}
            </span>
          </button>
        )}

        {showSearch ? (
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] text-[18px]">
              search
            </span>
            <input
              id="input-param-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search parameters..."
              className="pl-9 pr-3 py-1.5 border border-[#E2E8F0] rounded bg-[#FCF8FA] focus:border-[#0058be] focus:ring-1 focus:ring-[#0058be] outline-none text-[13px] text-[#1b1b1d] w-60 sm:w-72 transition-all"
            />
          </div>
        ) : (
          /* Shift context title / clickable selector */
          <div className="relative">
            <button
              id="shift-selector-btn"
              onClick={() => {
                setShiftDropdownOpen(!shiftDropdownOpen);
                setShowNotifications(false);
                setShowProfile(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#f0edef]/60 hover:bg-[#f0edef] border border-[#E2E8F0] transition-colors text-[14px] font-bold text-[#0058be] cursor-pointer active:scale-98"
            >
              <span>{currentShift}</span>
              <span className="material-symbols-outlined text-[18px] text-[#45464d]">
                arrow_drop_down
              </span>
            </button>

            {shiftDropdownOpen && (
              <div
                id="shift-dropdown-menu"
                className="absolute top-full left-0 mt-1 bg-white border border-[#E2E8F0] rounded-md shadow-lg py-1 w-64 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#76777d] border-b border-[#E2E8F0]">
                  Select Active Line Shift
                </div>
                {shifts.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onSelectShift(s);
                      setShiftDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between hover:bg-[#f6f3f5] transition-colors cursor-pointer ${
                      s === currentShift ? 'text-[#0058be] font-bold bg-[#d8e2ff]/20' : 'text-[#1b1b1d]'
                    }`}
                  >
                    <span>{s}</span>
                    {s === currentShift && (
                      <span className="material-symbols-outlined text-[16px] text-[#0058be]">
                        check
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side: Live Telemetry Controls, Active Alerts badge, Shift pill, Notifications, Profile */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Live Stream Controller */}
        <div className="flex items-center gap-1.5 bg-[#f0edef]/80 border border-[#E2E8F0] px-2.5 py-1 rounded-md">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveStreaming ? 'bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse' : 'bg-[#76777d]'
              }`}
            ></span>
            <span className="font-mono text-[11px] font-bold tracking-tight text-[#1b1b1d] hidden sm:inline">
              {isLiveStreaming ? 'LIVE' : 'PAUSED'}
            </span>
          </div>

          {onToggleLiveStream && (
            <button
              onClick={onToggleLiveStream}
              className="p-1 text-[#45464d] hover:text-[#0058be] hover:bg-white rounded transition-colors cursor-pointer"
              title={isLiveStreaming ? 'Pause Live Telemetry Stream' : 'Resume Live Telemetry Stream'}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isLiveStreaming ? 'pause' : 'play_arrow'}
              </span>
            </button>
          )}

          {onChangeSpeed && isLiveStreaming && (
            <button
              onClick={() => onChangeSpeed(liveStreamSpeed === 1 ? 2 : 1)}
              className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-[#0058be] rounded border border-[#E2E8F0] hover:bg-[#0058be] hover:text-white transition-colors cursor-pointer"
              title="Toggle Stream Rate"
            >
              {liveStreamSpeed}x
            </button>
          )}

          {onStartHeroDemo && (
            <button
              id="btn-run-judge-demo"
              onClick={onStartHeroDemo}
              className="px-2.5 py-1 text-[11px] font-mono font-bold bg-[#0058be] text-white hover:bg-[#2170e4] rounded shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border border-[#0058be]"
              title="Launch 10-step scripted Hero Demo (00:00 - 02:30)"
            >
              <span className="material-symbols-outlined text-[14px]">play_circle</span>
              <span className="hidden sm:inline">RUN JUDGE DEMO</span>
              <span className="sm:hidden">DEMO</span>
            </button>
          )}

          {onOpenTestRunner && (
            <button
              id="btn-topbar-test-suite"
              onClick={onOpenTestRunner}
              className="p-1 text-[#45464d] hover:text-[#0058be] hover:bg-white rounded transition-colors cursor-pointer hidden md:flex"
              title="Run Automated In-App Verification Suite"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </button>
          )}

          {onSimulateAnomaly && (
            <button
              onClick={onSimulateAnomaly}
              className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#BA1A1A]/10 text-[#BA1A1A] hover:bg-[#BA1A1A] hover:text-white rounded border border-[#BA1A1A]/20 transition-all cursor-pointer hidden lg:flex items-center gap-1"
              title="Trigger simulated cycle time drift burst at ST32"
            >
              <span className="material-symbols-outlined text-[12px]">bolt</span>
              <span>Spike ST32</span>
            </button>
          )}
        </div>

        {showSearch && (
          <div className="hidden lg:block font-mono text-[12px] text-[#1b1b1d] font-bold px-3 py-1 bg-[#f0edef] rounded border border-[#E2E8F0]">
            {currentShift}
          </div>
        )}

        {/* 3 Active Alerts Button */}
        <button
          id="btn-active-alerts"
          onClick={onOpenAlerts}
          className="bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B] text-[11px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1.5 rounded flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer active:scale-98"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]"></span>
          </span>
          <span className="hidden sm:inline">{activeAlertsCount} Active Alerts</span>
          <span className="sm:hidden">{activeAlertsCount} Alerts</span>
        </button>

        {/* Trailing Icons */}
        <div className="flex items-center gap-1 border-l border-[#E2E8F0] pl-2 lg:pl-3 relative">
          {/* Notifications button */}
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShiftDropdownOpen(false);
                setShowProfile(false);
              }}
              className="text-[#45464d] hover:text-[#000000] hover:bg-[#f0edef] transition-colors w-8 h-8 flex items-center justify-center rounded cursor-pointer relative active:scale-95"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {activeAlertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F43F5E] rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div
                id="notifications-popover"
                className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E2E8F0] rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-4 py-2 border-b border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#1b1b1d] uppercase tracking-wider">
                    Recent Line Notifications
                  </span>
                  <span className="text-[11px] font-mono text-[#0058be] font-bold">{activeAlertsCount} Active</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[#E2E8F0]">
                  {alerts.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        onOpenAlerts();
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono font-bold text-[#F43F5E]">{a.stationId}</span>
                        <span className="text-[#76777d]">{a.detectedTime}</span>
                      </div>
                      <p className="text-[13px] font-medium text-[#1b1b1d] leading-tight">
                        {a.title}
                      </p>
                      <p className="text-[11px] text-[#45464d] mt-1 line-clamp-1">
                        {a.recommendedIntervention}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile button */}
          <div className="relative">
            <button
              id="btn-user-profile"
              onClick={() => {
                setShowProfile(!showProfile);
                setShiftDropdownOpen(false);
                setShowNotifications(false);
              }}
              className="text-[#45464d] hover:text-[#000000] hover:bg-[#f0edef] transition-colors w-8 h-8 flex items-center justify-center rounded cursor-pointer active:scale-95"
              title="Supervisor Profile"
            >
              <span className="material-symbols-outlined text-[22px]">account_circle</span>
            </button>

            {showProfile && (
              <div
                id="profile-popover"
                className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E2E8F0] rounded-lg shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
                  <div className="w-8 h-8 rounded-full bg-[#0058be] text-white flex items-center justify-center font-bold text-xs">
                    JS
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#1b1b1d]">J. Smith (ID: 492)</div>
                    <div className="text-[11px] text-[#76777d]">Shift Floor Supervisor</div>
                  </div>
                </div>
                <div className="pt-2 text-[12px] flex flex-col gap-1 text-[#45464d]">
                  <div className="flex justify-between py-1">
                    <span>Active Station:</span>
                    <span className="font-mono font-semibold text-[#1b1b1d]">Zone 1-3 Lead</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Role Authorization:</span>
                    <span className="text-[#10B981] font-semibold">Full Override</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
