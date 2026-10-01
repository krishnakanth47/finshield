import React, { useState } from 'react';
import { FinShieldProvider, useFinShield } from './context/FinShieldContext';
import { Navbar } from './components/common/Navbar';
import { DemoTourBar } from './components/demo/DemoTourBar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { SimulatePage } from './pages/SimulatePage';
import { RiskPage } from './pages/RiskPage';
import { ActionsPage } from './pages/ActionsPage';
import { DataImportPage } from './pages/DataImportPage';
import { ShieldCheck, ShieldAlert, Lock, Info, ExternalLink } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useFinShield();
  const [showLanding, setShowLanding] = useState<boolean>(false);

  const renderCurrentPage = () => {
    if (showLanding) return <LandingPage />;

    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'digital-twin':
        return <DigitalTwinPage />;
      case 'simulate':
        return <SimulatePage />;
      case 'risk':
        return <RiskPage />;
      case 'actions':
        return <ActionsPage />;
      case 'data':
        return <DataImportPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a]">
      {/* Navigation */}
      <Navbar />

      {/* Main Content View */}
      <main className="flex-1 pb-16">
        {renderCurrentPage()}
      </main>

      {/* Interactive Guided Demo Tour Bar (floats on bottom when active) */}
      <DemoTourBar />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-xs">
              FS
            </div>
            <span className="font-extrabold text-slate-800 tracking-tight">FINSHIELD</span>
            <span className="text-slate-300">|</span>
            <span>Financial Early-Warning & Decision Intelligence for MSMEs</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button
              onClick={() => {
                setShowLanding(!showLanding);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-sky-600 hover:text-sky-700 font-semibold"
            >
              {showLanding ? '← Return to App' : 'View Product Pitch Landing Page'}
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-amber-600 font-medium">
              DEMO DATA — NOT REAL FINANCIAL INFORMATION
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>
            Architected for Startup Ideathon live demonstration. Uses explainable deterministic scenario simulation and graph cascade propagation.
          </p>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted in production · Explainable AI · Consent-based</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FinShieldProvider>
      <MainAppContent />
    </FinShieldProvider>
  );
};

export default App;
