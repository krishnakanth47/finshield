import React from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { SlidersHorizontal, ArrowRight, Zap, AlertTriangle, Building2 } from 'lucide-react';
import { formatINR } from '../../services/documentParser/normalizer';

export const DetectedScenariosCard: React.FC = () => {
  const { scenarioSuggestions, activateSuggestedScenario } = useFinShield();

  if (scenarioSuggestions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Auto-Detected Stress Scenarios
            </h4>
            <p className="text-[11px] text-slate-500">
              Derived from normalized balance sheet exposure across your ingested documents.
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
          Ready to Simulate
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarioSuggestions.map((sug) => (
          <div
            key={sug.id}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-2 bg-slate-50/50"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {sug.category}
                </span>
                <span className="text-[10px] font-extrabold text-rose-700 font-mono">
                  {formatINR(sug.exposureAmount)} Exposure
                </span>
              </div>

              <h5 className="text-xs font-bold text-slate-900">{sug.title}</h5>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                {sug.description}
              </p>
            </div>

            <button
              onClick={() => activateSuggestedScenario(sug)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-sky-700 bg-white hover:bg-sky-50 border border-sky-200 transition"
            >
              <span>Simulate Detected Shock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
