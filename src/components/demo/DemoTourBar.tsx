import React from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { ChevronRight, ChevronLeft, X, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export const DemoTourBar: React.FC = () => {
  const { 
    isDemoTourActive, 
    demoTourStep, 
    nextDemoStep, 
    prevDemoStep, 
    exitDemoTour, 
    scenario,
    isIntervened 
  } = useFinShield();

  if (!isDemoTourActive) return null;

  const tourSteps = [
    {
      title: 'Step 1: Baseline Financial Health',
      desc: 'ABC Precision Components operates with ₹8.2L cash, 41-day runway, and resilience score of 72.',
      badge: 'SENSE',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'Step 2: Financial Digital Twin',
      desc: 'Explore the live dependency graph connecting Customers → Receivables → Cash → Suppliers → Inventory → Production.',
      badge: 'MAP',
      badgeColor: 'bg-sky-100 text-sky-800',
    },
    {
      title: 'Step 3: What-If Simulator Setup',
      desc: 'Set the primary demo scenario: Largest Customer (Apex Auto Systems) delays ₹7.0L payment by 20 days.',
      badge: 'SIMULATE',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      title: 'Step 4: Cascade Shock & Early Warning',
      desc: 'Watch the chain reaction propagate through the business. Cash drops into the danger zone with 21-day warning window.',
      badge: 'PREDICT',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      title: 'Step 5: AI Prevention Plan',
      desc: 'FINSHIELD calculates a 4-step prioritized action plan: Bill discounting, supplier payment extension, and buffer protection.',
      badge: 'PREVENT',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      title: 'Step 6: Before vs After Intervention',
      desc: 'Review the simulated recovery: Cash exposure reduced from ₹3.8L to ₹1.2L, and resilience score rebounds to 78.',
      badge: 'IMPACT',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  const currentInfo = tourSteps[demoTourStep - 1] || tourSteps[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-4xl bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 rounded-2xl shadow-2xl p-4 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${currentInfo.badgeColor}`}>
                {currentInfo.badge}
              </span>
              <h4 className="text-sm font-bold text-white">{currentInfo.title}</h4>
              <span className="text-xs text-slate-400 font-mono">({demoTourStep}/6)</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              {currentInfo.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          {demoTourStep > 1 && (
            <button
              onClick={prevDemoStep}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}

          <button
            onClick={nextDemoStep}
            className="flex items-center gap-1 text-xs font-semibold px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/30 transition"
          >
            <span>{demoTourStep === 6 ? 'Finish Demo' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={exitDemoTour}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Exit Demo Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
