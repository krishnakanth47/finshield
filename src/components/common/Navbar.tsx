import React from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { 
  ShieldAlert, 
  Activity, 
  Network, 
  SlidersHorizontal, 
  AlertTriangle, 
  Lightbulb, 
  Database, 
  Play, 
  RefreshCw 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    dataset, 
    activeTab, 
    setActiveTab, 
    scenario, 
    resetScenario, 
    startDemoTour,
    isDemoTourActive
  } = useFinShield();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'digital-twin', label: 'Digital Twin', icon: Network },
    { id: 'simulate', label: 'What-If Simulator', icon: SlidersHorizontal },
    { id: 'risk', label: 'Risk Intelligence', icon: AlertTriangle },
    { id: 'actions', label: 'AI Prevention Plan', icon: Lightbulb },
    { id: 'data', label: 'Data Hub', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Demo Notification Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-mono px-4 py-1 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-white tracking-wider">FINSHIELD ENGINE v2.4</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400 font-medium">DEMO DATA — NOT REAL FINANCIAL INFORMATION</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-slate-400">Model: Deterministic Dependency Graph</span>
          {scenario && (
            <button 
              onClick={resetScenario}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-sans underline"
            >
              <RefreshCw className="w-3 h-3" /> Reset Shock Scenario
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">FINSHIELD</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-sky-100 text-sky-800 px-2 py-0.5 rounded">MSME</span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Financial Early-Warning & Decision Intelligence
              </p>
            </div>
          </div>

          {/* Company Selector & Live Status */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400 font-medium">Target MSME:</span>
            <span className="font-semibold text-slate-800">{dataset.company.name}</span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Monitoring Active
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={startDemoTour}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                isDemoTourActive
                  ? 'bg-amber-500 text-white shadow-amber-500/30 ring-2 ring-amber-300'
                  : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-900/20'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isDemoTourActive ? 'Demo Tour Active' : 'Guided Pitch Demo'}</span>
              <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-mono">60s</span>
            </button>
          </div>
        </div>

        {/* Tab Links */}
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm font-medium border-t border-slate-100 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold border-b-2 border-sky-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'simulate' && scenario && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
