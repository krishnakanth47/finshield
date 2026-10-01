import React from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { RiskBadge } from '../common/RiskBadge';
import { CheckCircle2, TrendingUp, Sparkles, Shield, ArrowRight } from 'lucide-react';

export const BeforeAfterCard: React.FC = () => {
  const { 
    scenario, 
    interventionComparison, 
    applyAllRecommendations, 
    resetRecommendations,
    isIntervened,
    setActiveTab 
  } = useFinShield();

  if (!scenario || !interventionComparison) return null;

  const {
    beforeRisks,
    afterRisks,
    beforeCashExposure,
    afterCashExposure,
    exposureReduced,
    resilienceScoreGain,
  } = interventionComparison;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Prototype simulation
            </span>
            <h3 className="text-base font-extrabold text-white">
              Before vs After Intervention Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Evaluates the risk reduction efficacy of executing the AI Prevention Plan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isIntervened ? (
            <button
              onClick={resetRecommendations}
              className="text-xs text-slate-400 hover:text-white underline transition"
            >
              Reset Actions
            </button>
          ) : (
            <button
              onClick={applyAllRecommendations}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>APPLY RECOMMENDED ACTIONS</span>
            </button>
          )}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <th className="py-2.5 px-3">Risk Dimension</th>
                <th className="py-2.5 px-3 text-center">Before Intervention</th>
                <th className="py-2.5 px-3 text-center">After Intervention</th>
                <th className="py-2.5 px-3 text-right">Efficacy Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {/* Liquidity Risk */}
              <tr>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-800">Liquidity Risk</div>
                  <div className="text-[11px] text-slate-400">Cash buffer & payment timeline</div>
                </td>
                <td className="py-3 px-3 text-center">
                  <RiskBadge level={beforeRisks.liquidityRisk.level} />
                </td>
                <td className="py-3 px-3 text-center">
                  <RiskBadge level={afterRisks.liquidityRisk.level} />
                </td>
                <td className="py-3 px-3 text-right text-emerald-600 font-bold font-mono">
                  -{beforeRisks.liquidityRisk.score - afterRisks.liquidityRisk.score} pts
                </td>
              </tr>

              {/* Supplier Risk */}
              <tr>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-800">Supplier Risk</div>
                  <div className="text-[11px] text-slate-400">SteelWorks India obligation status</div>
                </td>
                <td className="py-3 px-3 text-center">
                  <RiskBadge level={beforeRisks.supplierRisk.level} />
                </td>
                <td className="py-3 px-3 text-center">
                  <RiskBadge level={afterRisks.supplierRisk.level} />
                </td>
                <td className="py-3 px-3 text-right text-emerald-600 font-bold font-mono">
                  -{beforeRisks.supplierRisk.score - afterRisks.supplierRisk.score} pts
                </td>
              </tr>

              {/* Inventory Risk */}
              <tr>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-800">Inventory Risk</div>
                  <div className="text-[11px] text-slate-400">Raw alloy steel coverage margin</div>
                </td>
                <td className="py-3 px-3 text-center">
                  <RiskBadge level={beforeRisks.inventoryRisk.level} />
                </td>
                <td className="py-3 px-3 text-center">
                  <RiskBadge level={afterRisks.inventoryRisk.level} />
                </td>
                <td className="py-3 px-3 text-right text-emerald-600 font-bold font-mono">
                  -{beforeRisks.inventoryRisk.score - afterRisks.inventoryRisk.score} pts
                </td>
              </tr>

              {/* Production Risk */}
              <tr>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-800">Production Continuity Risk</div>
                  <div className="text-[11px] text-slate-400">CNC turning center line operations</div>
                </td>
                <td className="py-3 px-3 text-center">
                  <RiskBadge level={beforeRisks.productionRisk.level} />
                </td>
                <td className="py-3 px-3 text-center">
                  <RiskBadge level={afterRisks.productionRisk.level} />
                </td>
                <td className="py-3 px-3 text-right text-emerald-600 font-bold font-mono">
                  -{beforeRisks.productionRisk.score - afterRisks.productionRisk.score} pts
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Aggregate KPI Summary Badges */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          {/* Exposure reduction */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">
              Simulated Cash Exposure
            </span>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-base text-rose-600 line-through font-mono">
                ₹{(beforeCashExposure / 100000).toFixed(1)}L
              </span>
              <span className="text-xl font-extrabold text-emerald-700 font-mono">
                ₹{(afterCashExposure / 100000).toFixed(1)}L
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                -₹{(exposureReduced / 100000).toFixed(1)}L Deflected
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Derived from automated invoice discounting and payment extension adjustments.
            </p>
          </div>

          {/* Resilience Score */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">
              Financial Resilience Score
            </span>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-base text-slate-400 font-mono">
                {beforeRisks.resilienceScore} / 100
              </span>
              <span className="text-xl font-extrabold text-sky-700 font-mono">
                {afterRisks.resilienceScore} / 100
              </span>
              <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +{resilienceScoreGain} pts
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Multi-pillar weighted resilience score reflecting restored liquidity buffer.
            </p>
          </div>
        </div>

        {/* Link to actions */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Click below to inspect or fine-tune individual intervention levers.</span>
          <button
            onClick={() => setActiveTab('actions')}
            className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Go to AI Prevention Action Center <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
