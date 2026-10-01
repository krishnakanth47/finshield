import React from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { Database, FileCheck, Layers, AlertCircle, ArrowRight } from 'lucide-react';

export const DataSourceIndicator: React.FC = () => {
  const { dataset, setActiveTab, dataQualityReport } = useFinShield();
  const summary = dataset.dataSourcesSummary || {
    filesCount: 4,
    recordsCount: 146,
    formats: ['CSV', 'PDF', 'DOCX', 'IMAGE'],
    needsReviewCount: dataQualityReport.needsReview || 4,
    qualityScore: 88,
    lastUpdated: 'Just now',
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sm:p-5 rounded-2xl border border-slate-700 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-400/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
              UNIFIED MULTI-FORMAT DATA SOURCES
            </span>
            <span className="text-xs text-slate-400">
              Digital Twin Synchronized
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-200">
            <span className="font-semibold text-white">
              ✓ {summary.filesCount} Ingested Documents
            </span>
            <span className="text-slate-500">|</span>
            <span className="font-mono text-emerald-400 font-bold">
              ✓ {summary.recordsCount} Active Records
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              Formats: {summary.formats.join(' • ')}
            </span>
            {summary.needsReviewCount > 0 && (
              <>
                <span className="text-slate-500">|</span>
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {summary.needsReviewCount} Fields Need Review
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('data')}
        className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
      >
        <span>Manage Data Center</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
