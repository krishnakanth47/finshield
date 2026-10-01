# FINSHIELD — AI Financial Early-Warning & Decision Intelligence for MSMEs

> **Financial Early-Warning & Decision Intelligence for MSMEs**  
> *"See the financial shock before it becomes a business problem."*

---

## 🛡️ Core Product Promise

FINSHIELD does not merely report past accounting ledger entries. It helps an MSME leadership team understand:

> **What could break next, why it could happen, how severe the downstream impact could be, and what action should be taken before the disruption occurs.**

### The Core Intelligence Loop

```
SENSE  ➔  SIMULATE  ➔  PREDICT  ➔  PREVENT
```

1. **SENSE**: Continuous ingestion of customer reliability scores, receivables, supplier payables, and burn rate.
2. **SIMULATE**: Graph-based shock propagation through interconnected business entities.
3. **PREDICT**: Deterministic quantification of liquidity shortfalls, breach dates, and early warning countdown windows.
4. **PREVENT**: Prioritized, mathematically ranked action plan with quantified risk and exposure reduction.

---

## 🚀 Live Demo Quickstart

The application runs locally on Vite + React + TypeScript with an active dev server:

```bash
# Clone and enter directory
cd finshield

# Install dependencies (already installed)
npm install

# Start local development server
npm run dev
# Running at: http://localhost:5173/

# Test production build
npm run build
```

---

## 🎯 Primary Demo Scenario (60–120s Pitch Flow)

**Target MSME:** ABC Precision Components (Tier-2 Automotive & Precision Engineering, Pune)  
*(Clearly labelled: DEMO / SIMULATED DATA — NOT REAL FINANCIAL INFORMATION)*

### Initial Baseline State:
* **Cash Balance**: ₹8.2 Lakh
* **Expected Receivables**: ₹11.5 Lakh *(Largest Customer: ₹7.0 Lakh from Apex Auto Systems Ltd)*
* **Upcoming Payables**: ₹9.7 Lakh *(Critical Supplier: ₹4.1 Lakh to SteelWorks India Ltd)*
* **Inventory Value**: ₹6.8 Lakh *(Alloy Steel Billets, Carbide Inserts, WIP)*
* **Monthly Fixed Burn**: ₹5.2 Lakh (~₹17,333/day)
* **Minimum Safe Reserve Margin**: ₹3.0 Lakh

### The Pitch Flow:
1. **Open Dashboard (`/dashboard`)**:
   - Point out healthy baseline: Resilience **72/100**, Cash Runway **41 days**, Liquidity Risk **LOW/MEDIUM**.
   - Show the 90-day cash forecast tracking safely above the ₹3.0L reserve.
2. **Open What-If Simulator (`/simulate`)**:
   - Target Customer: **Apex Auto Systems Ltd**
   - Delayed Amount: **₹7,00,000**
   - Delay Duration: **20 Days**
   - Click **SIMULATE SHOCK & PROPAGATE CASCADE**.
3. **Observe the Downstream Cascade**:
   - **21 DAYS Early Warning Detection Window** prominently displayed.
   - **Step-by-step Cascade**:
     - Step 1: Customer payment delayed by 20 days.
     - Step 2: Receivable timing shifted; inflow blocked.
     - Step 3: Cash balance drops to ₹2.1L (penetrating the ₹3.0L safe threshold).
     - Step 4: Default on ₹4.1L payable to SteelWorks India (critical raw steel).
     - Step 5: Alloy billet shipments held; inventory coverage shrinks to 6 days.
     - Step 6: CNC Turning line shutdown projected on Day 21, risking ₹14.2L order backlog.
   - Cash-Flow Chart clearly shows the simulated line diving into the **Danger Zone**.
4. **Inspect the Financial Digital Twin (`/digital-twin`)**:
   - Interactive React Flow graph visually updates in real time with animated pulses:
     `Customer [DELAYED] ➔ Receivable [DELAYED] ➔ Cash [HIGH RISK] ➔ Supplier [AT RISK] ➔ Inventory [MEDIUM RISK] ➔ Production [HIGH RISK]`.
5. **Review AI Prevention Plan (`/actions`)**:
   - 01 — **Accelerate Receivable Collection**: Invoice Discounting / TReDS unlocks ₹5.6L in 48 hours.
   - 02 — **Negotiate Supplier Payment Extension**: 15-day extension on secondary vendors defers ₹2.5L.
   - 03 — **Defer Non-Critical Procurement**: Postpones ₹1.2L fastener replenishment.
   - 04 — **Drawdown Overdraft Buffer**: Injects ₹2.5L liquidity cushion.
6. **Apply Interventions & Re-Simulate**:
   - Click **APPLY RECOMMENDED ACTIONS**.
   - Review **Before vs After Intervention Comparison**:
     - Liquidity Risk: **HIGH ➔ MEDIUM** (-28 pts)
     - Supplier Risk: **HIGH ➔ LOW** (-32 pts)
     - Production Risk: **HIGH ➔ LOW** (-35 pts)
     - Cash Exposure: **₹3.8L ➔ ₹1.2L** (-₹2.6L Deflected!)
     - Resilience Score: **58 ➔ 78** (+20 points gained!)

---

## 🏛️ System Architecture

```text
                                FINSHIELD
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                 Frontend                        Engines
                    │                               │
            React 19 + TypeScript          Deterministic Logic
                    │                               │
      ┌─────────────┼─────────────┐   ┌─────────────┼─────────────┐
      │             │             │   │             │             │
  React Flow    Recharts     Tailwind forecastEngine  riskEngine  dependencyEngine
(Digital Twin) (Cash Forecast) (UI)         │             │             │
                                            └─────────────┼─────────────┘
                                                          │
                                                recommendationEngine
                                                anomalyEngine / csvParser
```

### Modular Services:
- `src/services/forecastEngine.ts`: Calculates daily cash curves (Past 30d actuals + Next 90d projections), tracking breach points against the safety reserve.
- `src/services/riskEngine.ts`: Explainable multi-factor scoring (Liquidity 40%, Suppliers 25%, Inventory 20%, Operations 15%), calculating the 0-100 Financial Resilience Score.
- `src/services/dependencyEngine.ts`: Constructs the React Flow digital twin nodes, edge transmission pathways, and status pulses.
- `src/services/scenarioEngine.ts`: Executes shock cascades, recalculates balance sheet ripples, and compares Before vs After intervention.
- `src/services/recommendationEngine.ts`: Formulates prioritized mitigation levers with calculated financial impact.
- `src/services/csvParser.ts`: Ingests and validates customer, supplier, and inventory CSV datasets with real-time model synchronization.

---

## 📁 Project Structure

```
finshield/
├── src/
│   ├── types/
│   │   └── index.ts                 # Strict TypeScript data contracts
│   ├── services/
│   │   ├── sampleData.ts            # Realistic synthetic MSME dataset (ABC Precision)
│   │   ├── forecastEngine.ts        # 90-day baseline vs shock cash modeling
│   │   ├── riskEngine.ts            # Explainable 4-pillar risk calculations
│   │   ├── anomalyEngine.ts         # Early warning detection & countdown
│   │   ├── dependencyEngine.ts      # Graph node & cascade status builder
│   │   ├── scenarioEngine.ts        # What-if simulation & before/after comparison
│   │   ├── recommendationEngine.ts  # Prioritized AI prevention protocols
│   │   └── csvParser.ts             # CSV schema validation & template generation
│   ├── context/
│   │   └── FinShieldContext.tsx     # Centralized reactive state & demo tour runner
│   ├── components/
│   │   ├── common/                  # Navbar, MetricCard, RiskBadge, EarlyWarningBanner
│   │   ├── charts/                  # CashFlowForecastChart (Recharts)
│   │   ├── digitalTwin/             # DependencyGraph, TwinCustomNode (@xyflow/react)
│   │   ├── simulation/              # ScenarioControls, CascadeVisualizer, BeforeAfterCard
│   │   ├── actions/                 # ActionCard with intervention toggles
│   │   └── demo/                    # DemoTourBar (60s automated presentation guide)
│   ├── pages/
│   │   ├── LandingPage.tsx          # Product introduction & value proposition
│   │   ├── DashboardPage.tsx        # Executive fintech dashboard
│   │   ├── DigitalTwinPage.tsx      # Interactive full-canvas dependency twin
│   │   ├── SimulatePage.tsx         # What-if scenario simulator
│   │   ├── RiskPage.tsx             # 4-question explainable AI diagnostic framework
│   │   ├── ActionsPage.tsx          # AI prevention & decision action center
│   │   └── DataImportPage.tsx       # CSV file upload, parser, and template download
│   ├── App.tsx                      # Root component & page router
│   ├── index.css                    # Tailwind CSS directives & custom styling
│   └── main.tsx                     # React DOM entry point
```

---

## 🔒 Trust, Security & Responsible AI Positioning

- **Not an Accounting Replacement**: FINSHIELD is built specifically for **dependency and scenario intelligence**.
- **Transparent Mathematical Logic**: Every risk score displays its empirical drivers; no black-box hallucinations.
- **Enterprise Security Ready**: Designed for consent-based API connections, read-only data minimization, and audit trails.
- **Clear Synthetic Labeling**: All demo datasets are explicitly tagged as synthetic simulation data.
