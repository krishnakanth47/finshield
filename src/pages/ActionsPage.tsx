import React from 'react';
import { useFinShield } from '../context/FinShieldContext';
import { ActionCard } from '../components/actions/ActionCard';
import { 
  Lightbulb, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Coins 
} from 'lucide-react';

export const ActionsPage: React.FC = () => {
  const { 
    recommendations, 
    applyAllRecommendations, 
    resetRecommendations, 
    isIntervened, 
    simulationResult, 
    scenario, 
    setActiveTab 
  } = useFinShield();

  const totalExposureDeflected = recommendations
    .filter((r) => r.applied)
    .reduce((sum, r) => sum + r.projectedExposureReduction, 0);

  const totalResilienceBoost = recommendations
    .filter((r) => r.applied)
    .reduce((sum, r) => sum + r.resilienceBoost, 0);

  const appliedCount = recommendations.filter((r) => r.applied).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                AI Prevention & Decision Center
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted financial interventions to avert cash shortfalls and factory downtime before disruption occurs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {appliedCount > 0 ? (
            <button
              onClick={resetRecommendations}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All ({appliedCount} active)</span>
            </button>
          ) : (
            <button
              onClick={applyAllRecommendations}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>APPLY ALL RECOMMENDED ACTIONS</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('simulate')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
          >
            <span>Compare Outcome</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Intervention Performance Summary Meter */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                DECISION INTELLIGENCE IMPACT
              </span>
              <span className="text-xs text-slate-400">
                {appliedCount} of {recommendations.length} Levers Active
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-2">
              {appliedCount > 0
                ? `Mitigation Protocol Active: ₹${(totalExposureDeflected / 100000).toFixed(1)}L Buffer Protected`
                : 'Review Recommended Actions Below'}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Applying these interventions recalculates the cash-flow trajectory and stabilizes the business dependency graph in real time.
            </p>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Cash Deficit Deflected
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                ₹{(totalExposureDeflected / 100000).toFixed(2)} Lakh
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Resilience Recovery
              </span>
              <span className="text-2xl font-black text-sky-400 font-mono">
                +{totalResilienceBoost} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Prioritized Prevention Action Protocol
          </h3>
          <span className="text-xs text-slate-400">
            Ranked by risk reduction efficacy and implementation speed
          </span>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <ActionCard key={rec.id} recommendation={rec} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};
