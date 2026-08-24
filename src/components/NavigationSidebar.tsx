import React from 'react';
import { ViewMode } from '../types';

interface NavigationSidebarProps {
  currentView: ViewMode;
  onSelectView?: (view: ViewMode) => void;
  onNavigate?: (view: ViewMode) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenHealthCheck: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentView,
  onSelectView,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
  onOpenHealthCheck,
  onOpenSettings,
  onOpenSupport
}) => {
  // Support both onSelectView and onNavigate
  const handleNavigation = (view: ViewMode) => {
    if (onSelectView) onSelectView(view);
    else if (onNavigate) onNavigate(view);
  };

  return (
    <aside
      id="side-navigation-bar"
      className={`bg-[#131b2e] text-[#7c839b] border-r border-[#c6c6cd]/20 flex flex-col h-screen shrink-0 select-none font-sans transition-all duration-300 relative z-30 ${
        isCollapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Brand Header with Push/Pull Collapse Toggle */}
      <div
        id="brand-header"
        className={`p-3.5 border-b border-[#c6c6cd]/20 flex items-center ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            onClick={() => handleNavigation('floor')}
            className="w-8 h-8 rounded bg-[#0058be] hover:bg-[#004bb0] flex items-center justify-center shrink-0 shadow-sm text-white cursor-pointer transition-colors"
            title="DigitalTwin.ai Home"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              precision_manufacturing
            </span>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[16px] font-bold text-white tracking-tight leading-none truncate">
                DigitalTwin.ai
              </span>
              <span className="text-[10px] font-semibold text-[#7c839b] uppercase tracking-wider mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                <span>Line: Optimal</span>
              </span>
            </div>
          )}
        </div>

        {/* Push / Pull Toggle Button */}
        {onToggleCollapse && (
          <button
            id="btn-push-pull-sidebar"
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-md text-[#7c839b] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer ${
              isCollapsed ? 'mt-2 w-8 h-8' : ''
            }`}
            title={isCollapsed ? 'Pull to expand sidebar' : 'Push to collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isCollapsed ? 'dock_to_right' : 'dock_to_left'}
            </span>
          </button>
        )}
      </div>

      {/* Action CTA: System Health Check */}
      <div id="sidebar-cta-container" className="px-2.5 pt-3 pb-2">
        <button
          id="btn-system-health-check"
          onClick={onOpenHealthCheck}
          className={`w-full bg-[#2170e4]/15 hover:bg-[#2170e4]/25 border border-[#2170e4]/40 text-[#d8e2ff] font-mono text-[12px] font-medium py-2 rounded transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer group shadow-sm ${
            isCollapsed ? 'px-1' : 'px-3'
          }`}
          title="System Health Check"
        >
          <span className="material-symbols-outlined text-[18px] text-[#adc6ff] group-hover:rotate-12 transition-transform">
            health_and_safety
          </span>
          {!isCollapsed && <span className="truncate">Health Check</span>}
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav id="sidebar-nav-tabs" className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-1">
        {/* Floor View */}
        <button
          id="nav-floor-view"
          onClick={() => handleNavigation('floor')}
          className={`flex items-center gap-3 py-2.5 rounded transition-all w-full cursor-pointer group relative ${
            isCollapsed ? 'justify-center px-1' : 'px-3'
          } ${
            currentView === 'floor'
              ? 'text-[#d8e2ff] font-bold border-l-2 border-[#d8e2ff] bg-[#2170e4]/20 shadow-sm'
              : 'text-[#7c839b] hover:text-white hover:bg-white/5 font-medium'
          }`}
          title="Floor View"
        >
          <span
            className="material-symbols-outlined text-[20px] shrink-0"
            style={{ fontVariationSettings: currentView === 'floor' ? "'FILL' 1" : "'FILL' 0" }}
          >
            factory
          </span>
          {!isCollapsed && <span className="text-[13px] truncate">Floor View</span>}
        </button>

        {/* Plant Manager View */}
        <button
          id="nav-plant-manager-view"
          onClick={() => handleNavigation('plant')}
          className={`flex items-center gap-3 py-2.5 rounded transition-all w-full cursor-pointer group relative ${
            isCollapsed ? 'justify-center px-1' : 'px-3'
          } ${
            currentView === 'plant'
              ? 'text-[#d8e2ff] font-bold border-l-2 border-[#d8e2ff] bg-[#2170e4]/20 shadow-sm'
              : 'text-[#7c839b] hover:text-white hover:bg-white/5 font-medium'
          }`}
          title="Plant Manager View"
        >
          <span
            className="material-symbols-outlined text-[20px] shrink-0"
            style={{ fontVariationSettings: currentView === 'plant' ? "'FILL' 1" : "'FILL' 0" }}
          >
            precision_manufacturing
          </span>
          {!isCollapsed && <span className="text-[13px] truncate">Plant Manager View</span>}
        </button>

        {/* Live Twin Engine & Analytics View */}
        <button
          id="nav-analytics-view"
          onClick={() => handleNavigation('analytics')}
          className={`flex items-center gap-3 py-2.5 rounded transition-all w-full cursor-pointer group relative ${
            isCollapsed ? 'justify-center px-1' : 'px-3'
          } ${
            currentView === 'analytics'
              ? 'text-[#d8e2ff] font-bold border-l-2 border-[#d8e2ff] bg-[#2170e4]/20 shadow-sm'
              : 'text-[#7c839b] hover:text-white hover:bg-white/5 font-medium'
          }`}
          title="Digital Twin Intelligence & Analysis"
        >
          <span
            className="material-symbols-outlined text-[20px] shrink-0"
            style={{ fontVariationSettings: currentView === 'analytics' ? "'FILL' 1" : "'FILL' 0" }}
          >
            psychology
          </span>
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="text-[13px] truncate">Twin AI Intelligence</span>
              <span className="bg-[#0058be] text-[9px] font-mono font-bold text-white px-1.5 py-0.2 rounded shrink-0">
                LIVE
              </span>
            </div>
          )}
        </button>

        {/* What-If Simulation View */}
        <button
          id="nav-whatif-view"
          onClick={() => handleNavigation('whatif')}
          className={`flex items-center gap-3 py-2.5 rounded transition-all w-full cursor-pointer group relative ${
            isCollapsed ? 'justify-center px-1' : 'px-3'
          } ${
            currentView === 'whatif'
              ? 'text-[#d8e2ff] font-bold border-l-2 border-[#d8e2ff] bg-[#2170e4]/20 shadow-sm'
              : 'text-[#7c839b] hover:text-white hover:bg-white/5 font-medium'
          }`}
          title="What-If Simulation Studio"
        >
          <span
            className="material-symbols-outlined text-[20px] shrink-0"
            style={{ fontVariationSettings: currentView === 'whatif' ? "'FILL' 1" : "'FILL' 0" }}
          >
            science
          </span>
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="text-[13px] truncate">What-If Simulation</span>
              <span className="bg-[#10B981] text-[9px] font-mono font-bold text-black px-1.5 py-0.2 rounded shrink-0">
                SANDBOX
              </span>
            </div>
          )}
        </button>

        {/* Leadership View */}
        <button
          id="nav-leadership-view"
          onClick={() => handleNavigation('leadership')}
          className={`flex items-center gap-3 py-2.5 rounded transition-all w-full cursor-pointer group relative ${
            isCollapsed ? 'justify-center px-1' : 'px-3'
          } ${
            currentView === 'leadership'
              ? 'text-[#d8e2ff] font-bold border-l-2 border-[#d8e2ff] bg-[#2170e4]/20 shadow-sm'
              : 'text-[#7c839b] hover:text-white hover:bg-white/5 font-medium'
          }`}
          title="Leadership & ROI View"
        >
          <span
            className="material-symbols-outlined text-[20px] shrink-0"
            style={{ fontVariationSettings: currentView === 'leadership' ? "'FILL' 1" : "'FILL' 0" }}
          >
            insights
          </span>
          {!isCollapsed && <span className="text-[13px] truncate">Leadership & ROI</span>}
        </button>

        {/* System Architecture & OT Integration */}
        <button
          id="nav-architecture-view"
          onClick={() => handleNavigation('architecture')}
          className={`flex items-center gap-3 py-2.5 rounded transition-all w-full cursor-pointer group relative ${
            isCollapsed ? 'justify-center px-1' : 'px-3'
          } ${
            currentView === 'architecture'
              ? 'text-[#d8e2ff] font-bold border-l-2 border-[#d8e2ff] bg-[#2170e4]/20 shadow-sm'
              : 'text-[#7c839b] hover:text-white hover:bg-white/5 font-medium'
          }`}
          title="System Architecture & OT Tap"
        >
          <span
            className="material-symbols-outlined text-[20px] shrink-0"
            style={{ fontVariationSettings: currentView === 'architecture' ? "'FILL' 1" : "'FILL' 0" }}
          >
            account_tree
          </span>
          {!isCollapsed && <span className="text-[13px] truncate">Architecture & OT</span>}
        </button>

        {/* Audit Logs */}
        <button
          id="nav-audit-logs-view"
          onClick={() => handleNavigation('audit')}
          className={`flex items-center gap-3 py-2.5 rounded transition-all w-full cursor-pointer group relative ${
            isCollapsed ? 'justify-center px-1' : 'px-3'
          } ${
            currentView === 'audit'
              ? 'text-[#d8e2ff] font-bold border-l-2 border-[#d8e2ff] bg-[#2170e4]/20 shadow-sm'
              : 'text-[#7c839b] hover:text-white hover:bg-white/5 font-medium'
          }`}
          title="Audit Logs"
        >
          <span
            className="material-symbols-outlined text-[20px] shrink-0"
            style={{ fontVariationSettings: currentView === 'audit' ? "'FILL' 1" : "'FILL' 0" }}
          >
            history
          </span>
          {!isCollapsed && <span className="text-[13px] truncate">Audit Logs</span>}
        </button>
      </nav>

      {/* Footer Navigation & Push/Pull button for collapsed rail */}
      <div id="sidebar-footer" className="p-2 border-t border-[#c6c6cd]/20 flex flex-col gap-1 pb-3">
        {isCollapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center p-2 rounded text-[#7c839b] hover:text-white hover:bg-white/10 transition-colors cursor-pointer w-full mb-1"
            title="Expand Sidebar (Push / Pull)"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        )}

        <button
          id="btn-settings"
          onClick={onOpenSettings}
          className={`flex items-center gap-3 py-2 rounded text-[#7c839b] hover:text-white hover:bg-white/5 transition-colors cursor-pointer w-full text-[13px] ${
            isCollapsed ? 'justify-center px-1' : 'px-3'
          }`}
          title="Settings"
        >
          <span className="material-symbols-outlined text-[18px] shrink-0">settings</span>
          {!isCollapsed && <span className="truncate">Settings</span>}
        </button>
        <button
          id="btn-support"
          onClick={onOpenSupport}
          className={`flex items-center gap-3 py-2 rounded text-[#7c839b] hover:text-white hover:bg-white/5 transition-colors cursor-pointer w-full text-[13px] ${
            isCollapsed ? 'justify-center px-1' : 'px-3'
          }`}
          title="Support & Manual"
        >
          <span className="material-symbols-outlined text-[18px] shrink-0">help</span>
          {!isCollapsed && <span className="truncate">Support</span>}
        </button>
      </div>
    </aside>
  );
};
