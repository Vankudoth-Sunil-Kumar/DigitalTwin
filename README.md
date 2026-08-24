# DigitalTwin.ai — Vehicle Assembly-Line Predictive Digital Twin

> **Accenture Innovation Challenge 2026 — Track 4: DigitalTwin.ai**  
> *Repository:* [https://github.com/Vankudoth-Sunil-Kumar/DigitalTwin](https://github.com/Vankudoth-Sunil-Kumar/DigitalTwin)  
> *Core Paradigm:* **Predict → Explain → Warn → Act → Verify**

---

## 1. Project Overview

**DigitalTwin.ai** is an industrial manufacturing digital twin application engineered for discrete vehicle assembly lines. Modern automotive manufacturing involves interconnected multi-stage workflows across Body Construction (S01–S15), Paint Shop (S16–S25), and Final Assembly (S26–S40). 

While conventional supervisory control and data acquisition (SCADA) systems only react *after* line stoppages occur or after parts fail end-of-line quality gates, **DigitalTwin.ai** continuously monitors micro-drifts in cycle times, vibration harmonics, pneumatics, and thermal signatures to warn operators **before** a minor drift escalates into a catastrophic production bottleneck or downstream defect surge.

---

## 2. Problem Statement

Automotive final assembly lines face four structural challenges:
1. **The Delayed Defect Trap:** Inconsistencies originating in early assembly (e.g., torque or clamping variance at S07) often remain invisible until optical scanning or road-dyno tests at S34/S40, resulting in tens of vehicles needing teardown rework.
2. **Cascading Bottleneck Propagation:** Slower cycle times at a single upstream station (e.g., S18 seam sealing) trigger starvation at immediate downstream stations (S19, S20) and back-pressure queue buildup upstream, compounding line losses.
3. **Uneven Sensor Instrumentation:** Factory lines are rarely 100% instrumented. Brownfield legacy stations lack IoT vibration or thermal sensors, requiring reliable numerical inference rather than blind guesswork.
4. **False Alarm Fatigue & Black-Box Mistrust:** Unfiltered statistical noise leads operators to ignore alerts. AI models without multi-causal explainability (SHAP / causal attribution) fail human-in-the-loop adoption.

---

## 3. Solution: Predict → Explain → Warn → Act → Verify

DigitalTwin.ai delivers a closed-loop predictive manufacturing intelligence pipeline:

```
[ OT Sensor Streams & Legacy PLCs ]
                 │
                 ▼  (Read-Only Unidirectional Data Diode)
┌─────────────────────────────────────────────────────────────┐
│ 1. PREDICT: Statistical Process Control (SPC) & ML Trends   │
│    Detects cycle-time drift and calculates ETA to bottleneck │
├─────────────────────────────────────────────────────────────┤
│ 2. EXPLAIN: Multi-Factor Root Cause Decomposition (SHAP)    │
│    Attributes risk % across cycle drift, vibration, WIP, etc│
├─────────────────────────────────────────────────────────────┤
│ 3. WARN: Confidence-Aware Predictive Alerting Filter         │
│    Suppresses low-confidence noise; dispatches high-urgency │
├─────────────────────────────────────────────────────────────┤
│ 4. ACT: Interactive What-If Simulation & Human Dispatch     │
│    Operator tests parameter tweaks & executes micro-service │
├─────────────────────────────────────────────────────────────┤
│ 5. VERIFY: Real-Time Recovery Validation & Audit Trail      │
│    Measures actual lead time vs predicted metrics           │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Why Digital Twin (vs. Traditional SCADA/MES)

| Capability | Legacy MES / SCADA | DigitalTwin.ai |
| :--- | :--- | :--- |
| **Response Horizon** | Reactive (post-alarm failure) | **Predictive (15–30 min advance warning)** |
| **Sensor Gaps** | Blind spots at legacy cells | **Kalman-Filter / Flow-differential Virtual Twin** |
| **Downstream Awareness** | Isolated station metrics | **Full 40-station line topology propagation** |
| **Intervention Testing** | Trial-and-error on live line | **In-app What-If scenario sandbox** |
| **Decision Support** | Raw alarms without causality | **Multi-causal contribution & actionable micro-steps** |

---

## 5. Safe Industrial OT Architecture

DigitalTwin.ai respects industrial plant safety and the ISA-95 automation hierarchy:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ LEVEL 0 / 1: PHYSICAL LINE & SENSORS                                    │
│ Torquing Spindles, Weld Guns, Robotic Dispensers, Conveyor Drives       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│ LEVEL 2: INDUSTRIAL PLCs (Siemens S7-1500 / Rockwell ControlLogix)       │
│ Hard real-time deterministic motion & safety interlocks                │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ (Read-Only OPC-UA / MQTT Data Diode)
┌────────────────────────────────────▼────────────────────────────────────┐
│ LEVEL 3: DIGITAL TWIN SIMULATION & INGESTION ENGINE                      │
│ Line topology state, WIP queue tracking, Kalman virtual inference       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│ LEVEL 4: PREDICTIVE & SPC ANALYTICS                                     │
│ Anomaly scoring, bottleneck probability, propagation forecasting        │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ (Advisory Recommendations)
┌────────────────────────────────────▼────────────────────────────────────┐
│ HUMAN-IN-THE-LOOP INTERACTION LAYER                                     │
│ Floor Supervisor, Plant Manager, Leadership Persona Consoles            │
│ [Acknowledge] [Override & Log] [Simulate What-If] [Authorize Action]     │
└─────────────────────────────────────────────────────────────────────────┘
```
> **Safety Assurance:** DigitalTwin.ai strictly operates as a read-only advisory digital twin. AI algorithms do **not** directly write to PLC registers or trigger machine actuators without human authorization and safety interlock compliance.

---

## 6. Station Data Model

The assembly line topology models 40 contiguous stations grouped into 3 operational zones:
- **Zone 1: Body Construction (ST01 – ST15):** Underbody alignment, floor pan clamping, robot spot welds, laser brazing, dimensional optical inspection, BIW buffer transfer.
- **Zone 2: Paint Shop (ST16 – ST25):** E-coat bath, curing ovens, robotic seam sealer (Hero Demo ST18), primer surfacer, basecoat bell sprayers, clearcoat curing.
- **Zone 3: Final Assembly (ST26 – ST40):** Wiring harness, cockpit install, powertrain marriage, steering calibration (ST32), fluid vacuum fill, windshield urethane, dyno QA gates.

### Core Station Attribute Schema
```typescript
interface StationData {
  id: string;                      // e.g. "ST18"
  number: number;                  // 1 to 40
  name: string;                    // e.g. "Seam Sealer Robotic Application"
  zone: string;                    // "Zone 2: Paint"
  zoneId: 1 | 2 | 3;
  status: 'optimal' | 'warning' | 'critical';
  cycleTime: number;               // Live cycle time (e.g. 49.2s)
  targetCycleTime: number;         // Nominal takt target (56.0s)
  drift: number;                   // +0.3s to +3.8s drift
  sensorCoverage: string;          // "Full (10/10)", "Partial (8/10)", "Inferred (Virtual Twin)"
  sensorOnlineCount: number;
  sensorTotalCount: number;
  isExplicitSensor: boolean;       // false for sensor-poor stations
  inferenceConfidence?: number;    // e.g. 96.4%
  inferenceModel?: string;         // e.g. "Physics Kalman Filter + ST17/ST19 Sync"
  wipBuffer: number;               // Current units in buffer
  maxWipBuffer: number;            // Buffer capacity (default: 8)
  torqueNm: number;                // Torque telemetry
  vibrationMmS: number;            // Harmonic vibration velocity (mm/s)
  temperatureC: number;            // Operating temperature (°C)
  healthScore: number;             // 0 - 100 composite health
  anomalyScore: number;            // 0 - 100 anomaly deviation
  bottleneckProbability: number;   // 0 - 100%
  defectProbability: number;       // 0 - 100%
  timeToBottleneckMin: number;     // Projected ETA to line stall
  affectedVehiclesCount: number;   // Calculated downstream vehicles at risk
}
```

---

## 7. Live Simulation Engine

DigitalTwin.ai features an in-browser deterministic simulation engine capable of running in continuous live telemetry mode or via the synchronized **10-Step Hero Demo Controller**:
- **Telemetry Controls:** Start Production (`▶`), Pause (`⏸`), Reset (`↻`), 1x/2x Speed Toggle, and Live Anomaly Injection.
- **Continuous KPI Dynamics:** Real-time calculation of line throughput (Units/Hour), Overall Equipment Effectiveness (OEE %), average cycle times, and WIP buffer pressure.
- **Three Core Operational States:**
  1. `NORMAL`: Baseline operating rhythm, low vibration, zero queue accumulation.
  2. `DEGRADATION`: Gradual mechanical wear, increasing cycle drift, rising harmonic vibration.
  3. `INTERVENTION & RECOVERY`: Operator micro-servicing restores nominal parameters and clears queues.

---

## 8. Early Warning & SPC Engine

DigitalTwin.ai rejects single-sample spikes to prevent false alarms. The engine combines:
- **Rolling SPC X-Bar & R Charts:** 8-point moving averages against 3-sigma Upper Control Limits (UCL) and Lower Control Limits (LCL).
- **Z-Score Deviation:** Standard score calculation on cycle time velocity ($\frac{X - \mu}{\sigma}$).
- **Multi-Signal Persistence Filter:** Alerts are only elevated to predictive warnings if cycle drift, vibration harmonics, and WIP accumulation correlate over at least 3 consecutive cycles.

---

## 9. Bottleneck Prediction Engine

The bottleneck model calculates the probability and estimated time of line starvation:
$$\text{Bottleneck Probability} = f(\text{Cycle Drift}, \text{Current WIP}, \text{Downstream Buffer Capacity}, \text{Station Utilization})$$

### Output Metrics
- **Bottleneck Probability:** e.g., **78%**
- **Estimated Time to Bottleneck (ETA):** **21 minutes**
- **Potential Vehicle Impact:** **42 units**
- **Throughput Deficit:** **-8.5%**

---

## 10. Downstream Propagation Forecast

A slowdown at Station 18 does not stay contained; it cascades across adjacent cells:
```
ST18 (Seam Sealer)  [🔴 Anomaly Origin: Cycle Time 49.2s]
  ↓ (T+5m)
ST19 (Primer Surfacer) [🟡 Infeed Buffer Depletion: WIP 7 → 1]
  ↓ (T+12m)
ST20 (Basecoat Bell)   [🟡 Feed Starvation: Output drops to 48 U/H]
  ↓ (T+20m)
ST40 (End-of-Line QA)  [🔴 Plant-level Deficit: Cumulative loss of 14 vehicles]
```
The application visually maps this progression across T+0m, T+10m, T+20m, and T+30m horizons with dynamic line charts.

---

## 11. Defect Prediction & Delayed Defect Traceability

### Root Cause Trace: The S07 $\rightarrow$ S34 Scenario
A subtle torque deviation at **ST07 (Roof Laser Brazing)** during early Body Construction remains unflagged by legacy inspection. Forty-five minutes later, **ST34 (Windshield Urethane Robot)** detects a dimensional alignment fault.

DigitalTwin.ai traces the lineage backward:
$$\text{Defect Incident at ST34} \longleftarrow \text{Queue Transit} \longleftarrow \text{BIW Optical Gate ST13} \longleftarrow \text{Origin: ST07 Torque Drift (+6.4 Nm)}$$
*Actionable Insight:* "Earlier intervention at Station 07 would have prevented 18 downstream defective vehicle shells."

---

## 12. Multi-Factor Root Cause (SHAP Attribution)

Rather than displaying opaque errors, DigitalTwin.ai computes quantitative feature contributions:
- **Cycle-time drift:** 34%
- **Harmonic vibration trend:** 25%
- **Upstream WIP buildup:** 21%
- **Temperature dissipation:** 12%
- **Operator index pace:** 8%
- **Classified Root Cause:** *Tooling Degradation / Dispenser Motor Bearing Micro-Wear* (87% AI Confidence).

---

## 13. Uneven Sensor Coverage & Virtual Twin Inference

Assembly lines feature uneven sensor density:
- **Full Instrumentation (100%):** Direct high-speed accelerometers, load cells, and thermocouple arrays.
- **Partial Instrumentation (60–80%):** Discrete PLC proximity sensors and drive currents.
- **Sensor-Poor / Brownfield Legacy (20–40%):** ST07, ST14, ST19, ST28.

### Physics Kalman-Filter & Flow Differential
For sensor-poor stations, DigitalTwin.ai reconstructs unmeasured variables using upstream and downstream flow differentials:
$$\hat{x}_k = A \hat{x}_{k-1} + B u_k + K_k (z_k - H \hat{x}_{k-1})$$
All inferred values are explicitly badged in the UI with `Inferred (Virtual Twin)` and an active confidence percentage (e.g., *96.4% confidence*).

---

## 14. What-If Simulation Sandbox

Operators can test parameter variations in a risk-free virtual environment before executing physical adjustments:
- **Adjustable Parameters:** Station Cycle Time, Conveyor Line Speed (0.8–1.2 m/s), Buffer Watermark Limits, Tool Service State, and IoT Sensor Retrofits.
- **Live Before-vs-After Deltas:**
  - Bottleneck Probability: **78% $\rightarrow$ 19%** (-59% delta)
  - WIP Accumulation: **+31% $\rightarrow$ +8%**
  - Defect Risk: **43% $\rightarrow$ 21%**
  - Line Throughput: **+9.2%**
  - Estimated Averted Cost: **$18,400**

---

## 15. Prediction Validation & Performance Tracking

DigitalTwin.ai continuously records predictive accuracy against simulated outcomes:
- **Bottleneck Precision:** **91.4%**
- **Defect Detection Precision:** **87.2%**
- **Average Warning Lead Time:** **18.5 minutes**
- **False-Alert Suppression Rate:** **94.8%**

*(All metrics explicitly documented as prototype simulation metrics).*

---

## 16. Stakeholder Persona Views

1. **Floor Supervisor Console (`FloorView.tsx`):** Focuses on live operational execution — "What should I act on now?" Features station cards, sparkline equalizer bars, and rapid 1-click acknowledge/override buttons.
2. **Plant Manager Diagnostics (`PlantManagerView.tsx`):** Focuses on plant-wide efficiency — "Where are we losing production?" Features OEE waterfall analysis, shift-by-shift comparisons, bottleneck rankings, and maintenance schedules.
3. **Executive Leadership Studio (`LeadershipView.tsx`):** Focuses on strategic deployment — "Should we deploy this across all plants?" Features annualized ROI calculators, defect reduction forecasting, multi-plant scaling roadmaps, and payback projections.

---

## 17. Business Impact Calculator

Illustrative estimates based on prototype assembly-line assumptions:
- **Defect Rate Reduction:** **-18.4%**
- **Unplanned Downtime Reduction:** **-14.2%**
- **Throughput Improvement:** **+9.1%**
- **Recovered Daily Output:** **+145 Vehicles / Day**
- **Projected Annual Value (3-Shift Plant):** **$3.84M USD**

---

## 18. Setup & Local Development

### Prerequisites
- Node.js 18+ or Bun
- npm or bun package manager

### Installation
```bash
# 1. Clone repository
git clone https://github.com/Vankudoth-Sunil-Kumar/DigitalTwin.git
cd DigitalTwin

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
The application will launch on `http://localhost:3000`.

---

## 19. Judge Demo Walkthrough (10-Step Timeline)

Click the **⚡ RUN JUDGE DEMO** button in the top navigation bar to automatically step through the Track 4 scenario:
1. `00:00` — **Healthy Baseline:** All 40 stations green, 62.4 U/H nominal rhythm.
2. `00:15` — **Station 18 Micro-Wear:** Cycle time creeps from 42.1s to 44.3s; vibration rises.
3. `00:30` — **SPC Anomaly Triggered:** X-bar engine detects 3 consecutive points outside $\pm 2\sigma$.
4. `00:45` — **Bottleneck Prediction:** 78% probability of line stall in 21 minutes, 42 vehicles at risk.
5. `01:00` — **Propagation Forecast:** Downstream starvation predicted at ST19 $\rightarrow$ ST20 $\rightarrow$ ST40.
6. `01:15` — **Root Cause Breakdown:** SHAP attribution isolates dispenser motor wear (34% cycle drift, 25% vibration).
7. `01:30` — **Predictive Warning:** Actionable advisory dispatched to supervisor console.
8. `01:45` — **What-If Simulation:** Supervisor simulates nozzle purge and cycle time restoration in sandbox.
9. `02:00` — **Maintenance Executed:** Human authorizes 85-second micro-purge during index gap.
10. `02:30` — **Recovery Verified:** Vibration drops to 1.1 mm/s, full 62.5 U/H throughput restored, $18,400 saved.

---

## 20. Limitations & Technical Honesty

- **Simulation Mode:** All sensor streams, PLC feeds, and physics models are generated via deterministic numerical simulations tailored for vehicle manufacturing demonstration.
- **Model Training:** Predictive neural weights are pre-calibrated based on empirical automotive assembly degradation curves rather than live connected field machinery.
- **Advisory Only:** In accordance with industrial functional safety standards (IEC 61508 / ISO 26262), DigitalTwin.ai provides advisory decision support and does not replace hardware Emergency Stop (E-Stop) safety circuits.

---

## 21. Future Roadmap

- **Phase 1 (Q3 2026):** Direct OPC-UA & MQTT connector plug-ins for Siemens SIMATIC and Rockwell FactoryTalk.
- **Phase 2 (Q4 2026):** Edge inference deployment via lightweight Docker containers on Siemens IPC edge hardware.
- **Phase 3 (Q1 2027):** 3D WebGL / Three.js spatial line visualization with real-time robotic kinematics replay.
- **Phase 4 (Q2 2027):** Automated integration with enterprise CMMS (SAP PM / IBM Maximo) for autonomous work-order generation.

---

*Developed for the Accenture Innovation Challenge 2026 — Track 4: DigitalTwin.ai*
