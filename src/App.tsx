import React, { useState, useEffect } from 'react';
import { ViewMode, StationData, AnomalyAlert, SupervisorActionLog } from './types';
import {
  initialStations,
  alertsData,
  initialSupervisorLogs,
  bottleneckRows,
  defectTraceData
} from './data/mockData';
import { NavigationSidebar } from './components/NavigationSidebar';
import { TopAppBar } from './components/TopAppBar';
import { FloorView } from './components/FloorView';
import { PlantManagerView } from './components/PlantManagerView';
import { LeadershipView } from './components/LeadershipView';
import { RecommendationDetailView } from './components/RecommendationDetailView';
import { AuditLogsView } from './components/AuditLogsView';
import { AnalyticsEngineView } from './components/AnalyticsEngineView';
import { SystemHealthModal } from './components/SystemHealthModal';
import { AdjustParametersModal } from './components/AdjustParametersModal';
import { AlertsDrawer } from './components/AlertsDrawer';
import { SettingsModal } from './components/SettingsModal';
import { SupportModal } from './components/SupportModal';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewMode>('floor');
  const [previousView, setPreviousView] = useState<ViewMode>('floor');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Core Data State
  const [stations, setStations] = useState<StationData[]>(initialStations);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(alertsData);
  const [actionLogs, setActionLogs] = useState<SupervisorActionLog[]>(initialSupervisorLogs);
  const [bottlenecks, setBottlenecks] = useState(bottleneckRows);
  const [defectTraces, setDefectTraces] = useState(defectTraceData);

  // Live Telemetry Engine State
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [liveStreamSpeed, setLiveStreamSpeed] = useState<1 | 2>(1);
  const [liveThroughput, setLiveThroughput] = useState<number>(62);
  const [liveOee, setLiveOee] = useState<number>(85.4);
  const [liveAvgCycleTime, setLiveAvgCycleTime] = useState<number>(57.2);
  const [telemetryTick, setTelemetryTick] = useState<number>(0);

  // Active Context Selections
  const [selectedStationId, setSelectedStationId] = useState<string>('ST32');
  const [selectedAlertId, setSelectedAlertId] = useState<string>('alert-st32');
  const [currentShift, setCurrentShift] = useState<string>('Shift A (08:00 - 16:00)');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers State
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isAdjustParamsModalOpen, setIsAdjustParamsModalOpen] = useState(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Active Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Comprehensive real-time digital twin live streaming engine
  useEffect(() => {
    if (!isLiveStreaming) return;

    const intervalTime = liveStreamSpeed === 2 ? 1000 : 2000;
    const interval = setInterval(() => {
      setTelemetryTick((t) => t + 1);

      // Fluctuating plant-wide KPIs
      setLiveThroughput((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.min(68, Math.max(58, prev + delta));
      });

      setLiveOee((prev) => {
        const delta = (Math.random() - 0.48) * 0.4;
        return Number(Math.min(89.5, Math.max(81.2, prev + delta)).toFixed(1));
      });

      setLiveAvgCycleTime((prev) => {
        const delta = (Math.random() - 0.5) * 0.3;
        return Number(Math.min(59.0, Math.max(55.2, prev + delta)).toFixed(1));
      });

      // Update station telemetry dynamically
      setStations((prevStations) =>
        prevStations.map((station) => {
          // Dynamic sparks
          const updatedSparks = station.sparkHeights.map((val) => {
            const delta = (Math.random() - 0.5) * 8;
            return Math.min(100, Math.max(15, Math.round(val + delta)));
          });

          // Generate next historical cycle time sample (sliding 8-point window)
          const baseNominal = 56.0;
          const driftOffset = station.drift || 0;
          const noise = (Math.random() - 0.48) * 1.6;
          const newCycle = Number((baseNominal + driftOffset + noise).toFixed(1));

          // Convert to percentage of nominal for normalized charts
          const newPct = Math.round((newCycle / baseNominal) * 75);
          const updatedHistory = [...station.historicalCycleTimes.slice(1), newPct];

          // Torque and vibration micro-fluctuations
          const updatedTorque = station.torqueNm
            ? Number((station.torqueNm + (Math.random() - 0.5) * 0.4).toFixed(1))
            : undefined;
          const updatedVibration = station.vibrationMmS
            ? Number(Math.max(0.4, station.vibrationMmS + (Math.random() - 0.5) * 0.1).toFixed(2))
            : undefined;

          return {
            ...station,
            cycleTime: newCycle,
            sparkHeights: updatedSparks,
            historicalCycleTimes: updatedHistory,
            torqueNm: updatedTorque,
            vibrationMmS: updatedVibration
          };
        })
      );
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isLiveStreaming, liveStreamSpeed]);

  // Simulate an injected anomaly burst
  const handleSimulateAnomaly = () => {
    setStations((prev) =>
      prev.map((st) => {
        if (st.id === 'ST32') {
          return {
            ...st,
            status: 'critical',
            drift: 4.2,
            cycleTime: 60.2,
            historicalCycleTimes: [70, 75, 80, 85, 95, 105, 115, 120]
          };
        }
        return st;
      })
    );
    showToast('⚠️ Telemetry Spike Injected at ST32: Cycle time jumped to 60.2s (+4.2s drift)');
  };

  // View Navigation Helpers
  const handleSelectView = (view: ViewMode) => {
    setPreviousView(currentView);
    setCurrentView(view);
  };

  const handleOpenRecommendation = (alertId: string) => {
    setSelectedAlertId(alertId);
    setPreviousView(currentView);
    setCurrentView('recommendation');
  };

  const handleBackFromRecommendation = () => {
    setCurrentView(previousView === 'recommendation' ? 'floor' : previousView);
  };

  // Actions
  const handleAcknowledgeAlert = (alertId: string) => {
    const targetAlert = alerts.find((a) => a.id === alertId);
    if (!targetAlert) return;

    // Log the supervisor action
    const newLog: SupervisorActionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-GB'),
      type: 'ACKNOWLEDGED',
      title: `Acknowledged recommendation for ${targetAlert.stationId}: ${targetAlert.title}`,
      stationId: targetAlert.stationId,
      user: 'J. Smith',
      userId: 'ID: 492'
    };

    setActionLogs((prev) => [newLog, ...prev]);
    showToast(`✓ Acknowledged & routed mitigation plan for ${targetAlert.stationId}`);
  };

  const handleExecuteIntervention = (alertId: string) => {
    const targetAlert = alerts.find((a) => a.id === alertId);
    if (!targetAlert) return;

    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'executed' } : a))
    );

    const newLog: SupervisorActionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-GB'),
      type: 'OVERRIDE',
      title: `Executed automated micro-calibration sequence alpha-2 for ${targetAlert.stationId}`,
      stationId: targetAlert.stationId,
      user: 'J. Smith',
      userId: 'ID: 492'
    };

    setActionLogs((prev) => [newLog, ...prev]);
    showToast(`⚡ Sequence Executed: Calibration sent to ${targetAlert.stationId} PLC`);
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'dismissed' } : a))
    );
    showToast(`Anomaly Alert dismissed by Shift Supervisor`);
    handleBackFromRecommendation();
  };

  const handleDelegateAlert = (alertId: string, assignee: string) => {
    const newLog: SupervisorActionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-GB'),
      type: 'ACKNOWLEDGED',
      title: `Delegated anomaly task to ${assignee}`,
      stationId: selectedAlert?.stationId || 'ST32',
      user: 'J. Smith',
      userId: 'ID: 492'
    };
    setActionLogs((prev) => [newLog, ...prev]);
    showToast(`✓ Task delegated to ${assignee}`);
  };

  const handleRequestAudit = (stationId: string) => {
    const newLog: SupervisorActionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-GB'),
      type: 'OVERRIDE',
      title: `Manual QA Physical Audit Requested for ${stationId}`,
      stationId: stationId,
      user: 'J. Smith',
      userId: 'ID: 492'
    };
    setActionLogs((prev) => [newLog, ...prev]);
    showToast(`🔍 Manual QA Audit dispatch triggered for ${stationId}`);
  };

  const handleSaveParameters = (params: {
    targetThroughput: number;
    driftTolerance: number;
    aiConfidenceFloor: number;
    bufferLowWatermark: number;
  }) => {
    const newLog: SupervisorActionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-GB'),
      type: 'PARAMETERS ADJUSTED',
      title: `Recalibrated target throughput to ${params.targetThroughput} U/H, drift tol ±${params.driftTolerance}s`,
      user: 'J. Smith',
      userId: 'ID: 492'
    };
    setActionLogs((prev) => [newLog, ...prev]);
    showToast(`✓ Operating parameters synchronized across line`);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Timestamp,ActionType,Station,Description,User,UserId\n' +
      actionLogs
        .map(
          (l) =>
            `"${l.timestamp}","${l.type}","${l.stationId || ''}","${l.title.replace(/"/g, '""')}","${l.user}","${l.userId}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `digitaltwin_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Audit log CSV exported successfully');
  };

  const handleExportPlantReport = () => {
    showToast('📊 Shift Performance Summary Report generated (PDF/JSON)');
  };

  // Find active alert & selected alert
  const activeAlert = alerts.find((a) => a.id === 'alert-st32') || alerts[0];
  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || activeAlert;

  return (
    <div id="digital-twin-app" className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#1b1b1d] antialiased">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div
          id="system-toast"
          className="fixed bottom-6 right-6 z-50 bg-[#1b1b1d] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-white/10 font-sans text-[13px]"
        >
          <span className="material-symbols-outlined text-[#10B981] text-[20px]">info</span>
          <span className="font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Main Navigation Sidebar with Push/Pull Collapse */}
      <NavigationSidebar
        currentView={currentView}
        onSelectView={handleSelectView}
        onNavigate={handleSelectView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenHealthCheck={() => setIsHealthModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenSupport={() => setIsSupportModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top App Bar */}
        <TopAppBar
          currentShift={currentShift}
          onSelectShift={setCurrentShift}
          alerts={alerts}
          onOpenAlerts={() => setIsAlertsDrawerOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSearch={currentView === 'plant' || currentView === 'audit'}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          isLiveStreaming={isLiveStreaming}
          onToggleLiveStream={() => setIsLiveStreaming((prev) => !prev)}
          liveStreamSpeed={liveStreamSpeed}
          onChangeSpeed={setLiveStreamSpeed}
          onSimulateAnomaly={handleSimulateAnomaly}
        />

        {/* View Switcher Screen Render */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {currentView === 'floor' && (
            <FloorView
              stations={stations}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
              activeAlert={activeAlert}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onViewAlertDetails={handleOpenRecommendation}
              onRequestAudit={handleRequestAudit}
              liveThroughput={liveThroughput}
              liveOee={liveOee}
              liveAvgCycleTime={liveAvgCycleTime}
              isLiveStreaming={isLiveStreaming}
            />
          )}

          {currentView === 'plant' && (
            <PlantManagerView
              logs={actionLogs}
              defectTraces={defectTraces}
              bottlenecks={bottlenecks}
              onOpenAdjustParameters={() => setIsAdjustParamsModalOpen(true)}
              onExportReport={handleExportPlantReport}
              onViewFullAuditLog={() => setCurrentView('audit')}
              onSelectStationTrace={(stationId) => {
                setSelectedStationId(stationId);
                setCurrentView('floor');
              }}
              liveThroughput={liveThroughput}
              isLiveStreaming={isLiveStreaming}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsEngineView
              stations={stations}
              alerts={alerts}
              onSelectStation={(stId) => {
                setSelectedStationId(stId);
                setCurrentView('floor');
              }}
              onSelectAlert={(aId) => {
                setSelectedAlertId(aId);
              }}
              onOpenRecommendation={(aId) => {
                setSelectedAlertId(aId);
                setPreviousView('analytics');
                setCurrentView('recommendation');
              }}
              isLiveStreaming={isLiveStreaming}
              telemetryTick={telemetryTick}
            />
          )}

          {currentView === 'leadership' && (
            <LeadershipView
              onNavigateToFloor={() => setCurrentView('floor')}
              onNavigateToPlant={() => setCurrentView('plant')}
            />
          )}

          {currentView === 'recommendation' && (
            <RecommendationDetailView
              alert={selectedAlert}
              onBack={handleBackFromRecommendation}
              onExecuteIntervention={handleExecuteIntervention}
              onDismissAlert={handleDismissAlert}
              onDelegateAlert={handleDelegateAlert}
            />
          )}

          {currentView === 'audit' && (
            <AuditLogsView logs={actionLogs} onExportLogs={handleExportCSV} />
          )}
        </div>
      </div>

      {/* Interactive Modals and Drawers */}
      <SystemHealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
      />

      <AdjustParametersModal
        isOpen={isAdjustParamsModalOpen}
        onClose={() => setIsAdjustParamsModalOpen(false)}
        onSaveParameters={handleSaveParameters}
      />

      <AlertsDrawer
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        alerts={alerts}
        onSelectAlert={handleOpenRecommendation}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}
