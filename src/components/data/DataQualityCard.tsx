import React from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { ShieldCheck, AlertTriangle, FileWarning, Copy, UserCheck, Layers } from 'lucide-react';

export const DataQualityCard: React.FC = () => {
  const { dataQualityReport, duplicateAlerts, entityMatches } = useFinShield();

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Ingestion Data Quality Score
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Automated completeness, OCR clarity, and consistency assessment.
          </p>
        </div>

        <div className={`px-3 py-1 rounded-xl border text-sm font-extrabold font-mono ${getScoreColor(dataQualityReport.score)}`}>
          {dataQualityReport.score}% Quality
        </div>
      </div>

      {/* Progress meter */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            dataQualityReport.score >= 85
              ? 'bg-emerald-500'
              : dataQualityReport.score >= 70
              ? 'bg-amber-500'
              : 'bg-rose-500'
          }`}
          style={{ width: `${dataQualityReport.score}%` }}
        />
      </div>

      {/* Records Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Extracted</span>
          <span className="text-base font-extrabold text-slate-900 font-mono">{dataQualityReport.totalRecords}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <span className="text-[10px] text-emerald-700 font-semibold block uppercase">High Confidence</span>
          <span className="text-base font-extrabold text-emerald-800 font-mono">{dataQualityReport.highConfidence}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
          <span className="text-[10px] text-amber-700 font-semibold block uppercase">Needs Review</span>
          <span className="text-base font-extrabold text-amber-800 font-mono">{dataQualityReport.needsReview}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Unresolved</span>
          <span className="text-base font-extrabold text-slate-700 font-mono">{dataQualityReport.unresolved}</span>
        </div>
      </div>

      {/* Diagnostic Issues List */}
      <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5">
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Possible Duplicate Records:</span>
          </span>
          <span className={`font-mono font-bold ${duplicateAlerts.length > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
            {duplicateAlerts.length}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Unmatched Entity Variations:</span>
          </span>
          <span className={`font-mono font-bold ${entityMatches.length > 0 ? 'text-sky-600' : 'text-slate-700'}`}>
            {entityMatches.length}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5">
            <FileWarning className="w-3.5 h-3.5 text-slate-400" />
            <span>Low-Confidence OCR Fields:</span>
          </span>
          <span className={`font-mono font-bold ${dataQualityReport.lowConfidenceOcrCount > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
            {dataQualityReport.lowConfidenceOcrCount}
          </span>
        </div>
      </div>
    </div>
  );
};
