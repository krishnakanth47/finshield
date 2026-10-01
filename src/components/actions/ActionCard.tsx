import React from 'react';
import { Recommendation } from '../../types';
import { useFinShield } from '../../context/FinShieldContext';
import { 
  CheckCircle, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Check, 
  Zap 
} from 'lucide-react';

interface ActionCardProps {
  recommendation: Recommendation;
  index: number;
}

export const ActionCard: React.FC<ActionCardProps> = ({ recommendation, index }) => {
  const { toggleRecommendation } = useFinShield();

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      className={`rounded-xl border p-5 transition-all shadow-subtle ${
        recommendation.applied
          ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-100'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Index bullet */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 border ${
              recommendation.applied
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {recommendation.applied ? <Check className="w-4 h-4 stroke-[3]" /> : `0${index + 1}`}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityStyle(
                  recommendation.priority
                )}`}
              >
                {recommendation.priority} PRIORITY
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                {recommendation.category.replace('_', ' ')}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              {recommendation.action}
            </h4>
          </div>
        </div>

        {/* Action Toggle Switch */}
        <button
          onClick={() => toggleRecommendation(recommendation.id)}
          className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
            recommendation.applied
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {recommendation.applied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Applied</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-current" />
              <span>Apply Action</span>
            </>
          )}
        </button>
      </div>

      {/* Rationale and Expected Effect */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            WHY THIS ACTION?
          </span>
          <p className="text-slate-700">{recommendation.why}</p>
        </div>

        <div className="bg-sky-50/60 p-3 rounded-lg border border-sky-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block mb-1">
            EXPECTED FINANCIAL EFFECT
          </span>
          <p className="text-sky-950 font-medium">{recommendation.expectedEffect}</p>
        </div>
      </div>

      {/* Projected Gains Metric Bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] text-slate-400">Risk Exposure Deflected:</span>
            <span className="ml-1.5 font-mono font-bold text-emerald-700">
              ₹{(recommendation.projectedExposureReduction / 100000).toFixed(2)} Lakh
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400">Resilience Boost:</span>
            <span className="ml-1.5 font-mono font-bold text-sky-700">
              +{recommendation.resilienceBoost} pts
            </span>
          </div>
        </div>

        <span className="text-[10px] text-slate-400 font-mono">
          Status: {recommendation.applied ? 'Active in Simulation Engine' : 'Unapplied'}
        </span>
      </div>
    </div>
  );
};
