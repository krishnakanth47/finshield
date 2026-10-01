import React from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { 
  ArrowDown, 
  AlertCircle, 
  Clock, 
  Building2, 
  Coins, 
  Truck, 
  Boxes, 
  Cog, 
  CheckCircle2 
} from 'lucide-react';

export const CascadeVisualizer: React.FC = () => {
  const { simulationResult, scenario, isIntervened } = useFinShield();
  const { cascadeSteps } = simulationResult;

  if (!scenario || cascadeSteps.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
        <h4 className="text-sm font-bold text-slate-700">No Active Shock Simulated</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Choose a scenario above and click &quot;SIMULATE SHOCK&quot; to see how a financial event cascades through ABC Precision Components.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    if (status === 'HEALTHY') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (status === 'DELAYED' || status === 'MEDIUM RISK') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <h3 className="text-sm font-bold text-slate-900">
              Downstream Cascade Propagation Pathway
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step transmission of risk through the business dependency graph.
          </p>
        </div>

        {isIntervened ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Chain Reaction Neutralized
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> Active Chain Reaction
          </span>
        )}
      </div>

      {/* Vertical Cascade Progression */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {cascadeSteps.map((step, idx) => {
          const isMitigated = isIntervened && idx >= 2;
          return (
            <div key={step.step} className="relative group">
              {/* Step number bullet */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold border-2 transition-all ${
                  isMitigated
                    ? 'bg-emerald-600 text-white border-white shadow-sm'
                    : 'bg-slate-900 text-white border-white shadow-sm'
                }`}
              >
                {step.step}
              </div>

              {/* Step Card */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  isMitigated
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{step.title}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                      [{step.entity}]
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {step.timeframe}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                        isMitigated
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : getStatusBadge(step.status)
                      }`}
                    >
                      {isMitigated ? 'STABILIZED' : step.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">{step.description}</p>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Downstream Financial Exposure:</span>
                  <span className="font-mono font-bold text-slate-800">
                    ₹{(step.financialImpact / 100000).toFixed(2)} Lakh
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
