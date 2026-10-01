import React from 'react';
import { useFinShield } from '../context/FinShieldContext';
import { MetricCard } from '../components/common/MetricCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { EarlyWarningBanner } from '../components/common/EarlyWarningBanner';
import { CashFlowForecastChart } from '../components/charts/CashFlowForecastChart';
import { DependencyGraph } from '../components/digitalTwin/DependencyGraph';
import { ActionCard } from '../components/actions/ActionCard';
import { 
  ShieldCheck, 
  Clock, 
  Coins, 
  AlertTriangle, 
  ArrowRight, 
  SlidersHorizontal, 
  Sparkles, 
  TrendingUp, 
  Building2 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    dataset, 
    simulationResult, 
    scenario, 
    recommendations, 
    setActiveTab, 
    isIntervened 
  } = useFinShield();

  const { risks, baselineCashSeries, dangerZoneBreached, breachDate } = simulationResult;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Executive Financial Intelligence Dashboard
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
              Live State
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-tier financial dependency monitoring for{' '}
            <strong className="text-slate-800">{dataset.company.name}</strong> ({dataset.company.industry}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulate')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Simulate a Shock</span>
          </button>
        </div>
      </div>

      {/* Early Warning Banner */}
      <EarlyWarningBanner />

      {/* KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Financial Resilience */}
        <MetricCard
          title="Financial Resilience"
          value={`${risks.resilienceScore}/100`}
          subtitle="Multi-tier solvency score"
          icon={ShieldCheck}
          iconColor={
            risks.resilienceScore >= 70
              ? 'text-emerald-600 bg-emerald-50'
              : risks.resilienceScore >= 45
              ? 'text-amber-600 bg-amber-50'
              : 'text-rose-600 bg-rose-50'
          }
          trend={{
            value: isIntervened ? '+20 pts boosted' : (scenario ? '-14 pts shock' : 'Stable (+0.4)'),
            isPositive: !scenario || isIntervened,
          }}
          badge={
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                risks.resilienceScore >= 70
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {risks.resilienceScore >= 70 ? 'ROBUST' : 'STRESSED'}
            </span>
          }
          tooltip="Explainable weighted score across Liquidity (40%), Suppliers (25%), Inventory (20%), and Operations (15%)."
        />

        {/* Cash Runway */}
        <MetricCard
          title="Cash Runway"
          value={`${risks.cashRunwayDays} Days`}
          subtitle={`Burn: ₹${(dataset.company.dailyBurnRate / 1000).toFixed(1)}k/day`}
          icon={Clock}
          iconColor="text-sky-600 bg-sky-50"
          badge={
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              ₹{(dataset.company.cashBalance / 100000).toFixed(1)}L balance
            </span>
          }
          tooltip="Days of operating expenditure before cash depletes under current scheduled collections."
        />

        {/* Liquidity Risk */}
        <MetricCard
          title="Liquidity Risk"
          value={risks.liquidityRisk.level}
          subtitle={`Deficit: ₹${(simulationResult.cashExposure / 100000).toFixed(1)}L`}
          icon={Coins}
          iconColor={
            risks.liquidityRisk.level === 'HIGH'
              ? 'text-rose-600 bg-rose-50'
              : risks.liquidityRisk.level === 'MEDIUM'
              ? 'text-amber-600 bg-amber-50'
              : 'text-emerald-600 bg-emerald-50'
          }
          badge={<RiskBadge level={risks.liquidityRisk.level} showIcon={false} />}
          tooltip="Measures cash cushion vs upcoming scheduled payables (₹9.7L) and minimum safe reserve (₹3.0L)."
        />

        {/* Early Warnings */}
        <MetricCard
          title="Early Warnings"
          value={simulationResult.earlyWarnings.length}
          subtitle={scenario ? `${simulationResult.daysOfWarning}d alert window` : 'All safe'}
          icon={AlertTriangle}
          iconColor={
            simulationResult.earlyWarnings.length > 2
              ? 'text-rose-600 bg-rose-50'
              : 'text-amber-600 bg-amber-50'
          }
          badge={
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
              {risks.criticalAlertCount} Critical
            </span>
          }
          tooltip="Early warning signals triggered before operational disruption occurs."
        />
      </div>

      {/* MAIN CONTENT: Left Cash Flow Forecast, Right Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowForecastChart
            data={baselineCashSeries}
            minimumReserve={dataset.company.minimumCashReserve}
            breachDate={breachDate}
            isShockActive={!!scenario}
          />
        </div>

        {/* Risk Overview Breakdown Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Risk Pillar Breakdown</h3>
                <p className="text-xs text-slate-500">Multifactor sensitivity analysis</p>
              </div>
              <button
                onClick={() => setActiveTab('risk')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                Deep Dive <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Liquidity */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Liquidity Health</span>
                  <RiskBadge level={risks.liquidityRisk.level} />
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      risks.liquidityRisk.score > 70
                        ? 'bg-rose-500'
                        : risks.liquidityRisk.score > 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${risks.liquidityRisk.score}%` }}
                  />
                </div>
              </div>

              {/* Supplier Risk */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Supplier Stability</span>
                  <RiskBadge level={risks.supplierRisk.level} />
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      risks.supplierRisk.score > 70
                        ? 'bg-rose-500'
                        : risks.supplierRisk.score > 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${risks.supplierRisk.score}%` }}
                  />
                </div>
              </div>

              {/* Inventory Risk */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Inventory Continuity</span>
                  <RiskBadge level={risks.inventoryRisk.level} />
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      risks.inventoryRisk.score > 70
                        ? 'bg-rose-500'
                        : risks.inventoryRisk.score > 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${risks.inventoryRisk.score}%` }}
                  />
                </div>
              </div>

              {/* Production Risk */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Production Line Uptime</span>
                  <RiskBadge level={risks.productionRisk.level} />
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      risks.productionRisk.score > 70
                        ? 'bg-rose-500'
                        : risks.productionRisk.score > 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${risks.productionRisk.score}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 text-xs bg-slate-50 p-3 rounded-lg">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              CURRENT EXPLANATION
            </span>
            <p className="text-slate-700">{risks.explanation.whatHappensNext}</p>
          </div>
        </div>
      </div>

      {/* Financial Dependency Graph Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Interactive Financial Digital Twin Preview
            </h3>
            <p className="text-xs text-slate-500">
              Connected graph modeling dependencies between customers, cash, vendors, and production.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('digital-twin')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Open Full Canvas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <DependencyGraph height="420px" />
      </div>

      {/* Active Early Warnings List */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Early-Warning Signals</h3>
            <p className="text-xs text-slate-500">Sensed risk anomalies and pre-disruption alerts</p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {simulationResult.earlyWarnings.length} Signals Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {simulationResult.earlyWarnings.map((alrt) => (
            <div
              key={alrt.id}
              className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                alrt.priority === 'CRITICAL'
                  ? 'bg-rose-50/70 border-rose-200'
                  : alrt.priority === 'HIGH'
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{alrt.title}</span>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    alrt.priority === 'CRITICAL'
                      ? 'bg-rose-200 text-rose-900'
                      : alrt.priority === 'HIGH'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {alrt.priority}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">{alrt.cause}</p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>Affected: {alrt.affectedComponent}</span>
                <span className="font-semibold text-slate-700">
                  Est. Impact: {alrt.estimatedTimeToImpactDays} days
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Prioritized AI Prevention Plan</h3>
            <p className="text-xs text-slate-500">
              Targeted financial levers to safeguard cash runway before disruption occurs.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('actions')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Open Prevention Center <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {recommendations.slice(0, 2).map((rec, i) => (
            <ActionCard key={rec.id} recommendation={rec} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
