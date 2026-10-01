import React from 'react';
import { useFinShield } from '../context/FinShieldContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  AlertTriangle, 
  HelpCircle, 
  TrendingDown, 
  ShieldCheck, 
  Coins, 
  Truck, 
  Boxes, 
  Cog, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';

export const RiskPage: React.FC = () => {
  const { dataset, simulationResult, scenario, setActiveTab } = useFinShield();
  const { risks } = simulationResult;

  const pillars = [
    {
      id: 'liquidity',
      title: 'Liquidity Risk',
      icon: Coins,
      risk: risks.liquidityRisk,
      weight: '40% Weight',
      desc: 'Solvency margin against near-term scheduled obligations and daily payroll burn rate.',
    },
    {
      id: 'supplier',
      title: 'Supplier Risk',
      icon: Truck,
      risk: risks.supplierRisk,
      weight: '25% Weight',
      desc: 'Default probability on critical vendor payables (SteelWorks India Ltd) and credit term downgrades.',
    },
    {
      id: 'inventory',
      title: 'Inventory Risk',
      icon: Boxes,
      risk: risks.inventoryRisk,
      weight: '20% Weight',
      desc: 'Stock depletion risk below minimum threshold (14 days) and raw steel starvation.',
    },
    {
      id: 'production',
      title: 'Production Continuity Risk',
      icon: Cog,
      risk: risks.productionRisk,
      weight: '15% Weight',
      desc: 'Risk of plant line stoppage at CNC Turning Centre and active customer order delivery penalties.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Explainable Risk Intelligence Engine
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Deterministic mathematical scoring across liquidity, vendor obligations, and factory uptime.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Financial Resilience
            </span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {risks.resilienceScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Explainable AI Core Principle Box: What, Why, Next, Action */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-sky-400">
            Explainable AI Diagnostic Framework
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* What is happening */}
          <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              1. WHAT IS HAPPENING?
            </span>
            <h4 className="text-xs font-bold text-white">
              {scenario ? scenario.title : 'Normal Business Operations'}
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {scenario
                ? `Customer delayed ₹${(scenario.delayedAmount / 100000).toFixed(1)}L receivable payment by ${scenario.delayDurationDays} days.`
                : 'Collections from 4 customers and payables to 4 suppliers are tracking on scheduled maturity dates.'}
            </p>
          </div>

          {/* Why is it happening */}
          <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              2. WHY IS IT HAPPENING?
            </span>
            <h4 className="text-xs font-bold text-white">Concentration & Timing Deficit</h4>
            <ul className="text-[11px] text-slate-300 space-y-1 list-disc pl-3">
              {risks.explanation.why.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>

          {/* What happens next */}
          <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              3. WHAT HAPPENS NEXT?
            </span>
            <h4 className="text-xs font-bold text-white">Downstream Transmission</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {risks.explanation.whatHappensNext}
            </p>
          </div>

          {/* What should I do */}
          <div className="bg-sky-950/70 p-4 rounded-xl border border-sky-800/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
              4. WHAT SHOULD I DO?
            </span>
            <h4 className="text-xs font-bold text-sky-200">AI Prevention Plan</h4>
            <p className="text-[11px] text-sky-100 leading-relaxed">
              {risks.explanation.whatShouldDo}
            </p>
            <button
              onClick={() => setActiveTab('actions')}
              className="mt-2 text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 underline"
            >
              Execute Recommendations <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Risk Pillars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{p.weight}</span>
                  </div>
                </div>

                <div className="text-right">
                  <RiskBadge level={p.risk.level} />
                  <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                    Score: {p.risk.score}/100
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500">{p.desc}</p>

              {/* Progress meter */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    p.risk.score > 70
                      ? 'bg-rose-500'
                      : p.risk.score > 40
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, p.risk.score))}%` }}
                />
              </div>

              {/* Primary Drivers */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Primary Empirical Drivers:
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {p.risk.primaryDrivers.map((driver, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
