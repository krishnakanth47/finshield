import React from 'react';
import { useFinShield } from '../context/FinShieldContext';
import { ScenarioControls } from '../components/simulation/ScenarioControls';
import { CascadeVisualizer } from '../components/simulation/CascadeVisualizer';
import { BeforeAfterCard } from '../components/simulation/BeforeAfterCard';
import { EarlyWarningBanner } from '../components/common/EarlyWarningBanner';
import { CashFlowForecastChart } from '../components/charts/CashFlowForecastChart';
import { DependencyGraph } from '../components/digitalTwin/DependencyGraph';
import { 
  SlidersHorizontal, 
  Sparkles, 
  HelpCircle, 
  Info, 
  TrendingDown, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';

export const SimulatePage: React.FC = () => {
  const { 
    dataset, 
    scenario, 
    simulationResult, 
    isIntervened, 
    applyAllRecommendations, 
    resetScenario 
  } = useFinShield();

  const { baselineCashSeries, breachDate, dangerZoneBreached } = simulationResult;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                What-If Scenario Simulation Studio
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Stress-test the business against customer payment delays, price surges, and cash shocks.
              </p>
            </div>
          </div>
        </div>

        {scenario && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>{scenario.title} Active</span>
            </span>
          </div>
        )}
      </div>

      {/* Early Warning Banner */}
      <EarlyWarningBanner />

      {/* Scenario Controls */}
      <ScenarioControls />

      {/* When Scenario is simulated: Cascade + Forecast + Before/After */}
      {scenario && (
        <div className="space-y-6 animate-fade-in">
          {/* Before vs After Card (Essential Acceptance Criteria) */}
          <BeforeAfterCard />

          {/* Cascade Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CascadeVisualizer />

            {/* Cash Flow Forecast under Shock */}
            <div>
              <CashFlowForecastChart
                data={baselineCashSeries}
                minimumReserve={dataset.company.minimumCashReserve}
                breachDate={breachDate}
                isShockActive={true}
              />
            </div>
          </div>

          {/* Synchronized Dependency Twin Reaction */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Real-time Cascade Visualization on Financial Digital Twin
                </h3>
                <p className="text-xs text-slate-500">
                  Notice how the affected nodes (Receivable → Cash → Supplier → Inventory) reflect the simulated stress.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {isIntervened ? 'Stabilized via Interventions' : 'Cascade Active'}
              </span>
            </div>

            <DependencyGraph height="440px" />
          </div>
        </div>
      )}
    </div>
  );
};
