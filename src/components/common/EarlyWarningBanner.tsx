import React from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { AlertCircle, Clock, ShieldCheck, ArrowRight, TrendingDown } from 'lucide-react';

export const EarlyWarningBanner: React.FC = () => {
  const { simulationResult, scenario, isIntervened, setActiveTab } = useFinShield();
  const { daysOfWarning, dangerZoneBreached, cashExposure } = simulationResult;

  if (!scenario) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                SIMULATED PROJECTION
              </span>
              <h3 className="text-sm sm:text-base font-bold text-emerald-950">
                Baseline Healthy Runway: 41 Days Active
              </h3>
            </div>
            <p className="text-xs text-emerald-700 mt-0.5">
              Operating cash flow is stable. All scheduled payables are covered by current cash and expected receivables.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('simulate')}
          className="shrink-0 flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition"
        >
          <span>Test Shock Resilience</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 transition-all shadow-subtle ${
        isIntervened
          ? 'bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-50 border-sky-300'
          : dangerZoneBreached
          ? 'bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border-rose-300 ring-2 ring-rose-100'
          : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Prominent Days of Warning KPI */}
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
              isIntervened
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-500/20 pulse-danger'
            }`}
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight leading-none">
              {daysOfWarning}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5 opacity-90">
              DAYS
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isIntervened
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                SIMULATED PROJECTION
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Early Warning Detection Window
              </span>
              {isIntervened && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                  MITIGATION APPLIED
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
              {isIntervened
                ? 'Deficit Deflected: Liquidity Restored Ahead of Disruption'
                : `Projected Cash Shortfall Detected ${daysOfWarning} Days Before Operational Impact`}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
              {isIntervened
                ? 'The applied AI prevention plan reduced cash exposure from ₹3.8L to ₹1.2L and averted the factory floor shutdown.'
                : `The simulated ${scenario.title} cascades through supplier obligations and risks a production stoppage on Day 21 unless averted.`}
            </p>
          </div>
        </div>

        {/* Right Stats & Action */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Estimated Exposure
            </span>
            <span
              className={`text-lg font-extrabold ${
                isIntervened ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              ₹{(cashExposure / 100000).toFixed(2)} Lakh
            </span>
          </div>

          <button
            onClick={() => setActiveTab(isIntervened ? 'simulate' : 'actions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
              isIntervened
                ? 'bg-sky-600 hover:bg-sky-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
            }`}
          >
            <span>{isIntervened ? 'View Impact Comparison' : 'Act on Early Warning'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
