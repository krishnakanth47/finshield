import React from 'react';
import { useFinShield } from '../context/FinShieldContext';
import { 
  ShieldAlert, 
  ArrowRight, 
  Activity, 
  Network, 
  SlidersHorizontal, 
  CheckCircle2, 
  TrendingUp, 
  Lock, 
  ShieldCheck, 
  Zap, 
  Eye, 
  RefreshCw 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, startDemoTour } = useFinShield();

  const loopSteps = [
    {
      phase: 'SENSE',
      title: 'Continuous Financial Sensing',
      desc: 'Ingests transaction ledgers, buyer reliability scores, and supplier credit terms to model real-time operational liquidity.',
      icon: Eye,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      phase: 'SIMULATE',
      title: 'Dependency Graph Propagation',
      desc: 'Applies discrete financial shocks (e.g. ₹7L payment delay) and traces the cascading impact through cash, suppliers, and plant ops.',
      icon: SlidersHorizontal,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      phase: 'PREDICT',
      title: 'Early Warning Countdown',
      desc: 'Calculates the exact "Days of Warning" window before cash breaches safety reserves and forces production line stoppages.',
      icon: Activity,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      phase: 'PREVENT',
      title: 'Actionable AI Decision Plan',
      desc: 'Generates mathematically ranked mitigation steps: invoice discounting, supplier renegotiation, and buffer allocation.',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            FINSHIELD — Financial Early-Warning & Decision Intelligence for MSMEs
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            See the financial shock <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
              before it becomes a business problem.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            FINSHIELD models financial dependencies across cash, receivables, suppliers, inventory and operations to simulate potential shocks, identify downstream risks, and recommend preventive actions.
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02]"
            >
              <span>Open Live Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={startDemoTour}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition"
            >
              <Zap className="w-4 h-4 fill-current text-sky-600" />
              <span>Launch 60-Second Pitch Tour</span>
            </button>

            <button
              onClick={() => setActiveTab('digital-twin')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition"
            >
              <Network className="w-4 h-4 text-slate-500" />
              <span>Explore Digital Twin</span>
            </button>
          </div>

          {/* Live MSME context badge */}
          <div className="mt-8 inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-700">Preloaded Simulation Model:</span>
            <span>ABC Precision Components (Tier-2 Auto MSME, Pune)</span>
          </div>
        </div>
      </section>

      {/* Core Intelligence Loop: SENSE -> SIMULATE -> PREDICT -> PREVENT */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            Continuous Intelligence Cycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            SENSE → SIMULATE → PREDICT → PREVENT
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Most accounting software only reports what happened last month. FINSHIELD calculates what could break next and how to prevent it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {loopSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.phase}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle hover:shadow-card transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-black text-slate-400">
                      PHASE
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${step.color}`}>
                      {step.phase}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Positioning & Difference */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                WHAT FINSHIELD IS NOT
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Not generic accounting. Not another passive dashboard.
              </h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Traditional ERPs and invoicing apps record historic receipts. They cannot answer: 
                <span className="font-semibold text-slate-800">
                  &quot;If our largest buyer delays their ₹7L payment by 20 days, will our factory floor run out of steel in Pune next week?&quot;
                </span>
              </p>
              <div className="mt-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Deterministic graph models connecting invoices to machine uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>What-if scenario stress testing with instant cascade recalculation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Quantified Before vs After risk reduction metrics</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <span className="text-xs font-mono text-sky-400 font-semibold block mb-2">
                THE FINSHIELD ADVANTAGE
              </span>
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">EVENT</span>
                  <span className="text-rose-400 font-bold">Largest Customer Delays ₹7L</span>
                </div>
                <div className="text-center text-slate-500 font-bold">↓ cascade</div>
                <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">DOWNSTREAM RISK</span>
                  <span className="text-amber-400 font-bold">Default on SteelWorks India & CNC Starvation</span>
                </div>
                <div className="text-center text-slate-500 font-bold">↓ mitigation</div>
                <div className="p-3 bg-emerald-950/70 rounded-lg border border-emerald-700">
                  <span className="text-emerald-400 block text-[10px]">PREVENTION PLAN</span>
                  <span className="text-emerald-300 font-bold">Bill Discounting + Net-45 Terms Extension</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-700">
              Enterprise Trust & Security Architecture
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs text-slate-600">
            <div>
              <strong className="text-slate-800 block mb-0.5">Consent-Based Data Ingestion</strong>
              Secure read-only connectors with full data minimization and audit logging.
            </div>
            <div>
              <strong className="text-slate-800 block mb-0.5">Explainable AI Scoring</strong>
              No mysterious black-box numbers; every risk score reveals its exact mathematical drivers.
            </div>
            <div>
              <strong className="text-slate-800 block mb-0.5">Simulated Decision Guardrails</strong>
              Preserves data integrity with synthetic sandboxing before production rollout.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
