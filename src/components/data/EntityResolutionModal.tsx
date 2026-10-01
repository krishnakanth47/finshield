import React from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { UserCheck, Copy, Check, X, ShieldAlert } from 'lucide-react';
import { formatINR } from '../../services/documentParser/normalizer';

export const EntityResolutionModal: React.FC = () => {
  const { 
    entityMatches, 
    resolveEntityMatch, 
    duplicateAlerts, 
    resolveDuplicate 
  } = useFinShield();

  const pendingMatches = entityMatches.filter((m) => m.status === 'PENDING');
  const pendingDuplicates = duplicateAlerts.filter((d) => d.status === 'PENDING');

  if (pendingMatches.length === 0 && pendingDuplicates.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 shadow-subtle space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 border-b border-amber-200/80 pb-2">
        <ShieldAlert className="w-4 h-4 text-amber-700" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Entity Consistency & Duplicate Resolution
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Entity Matches */}
        {pendingMatches.map((m) => (
          <div key={m.id} className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-amber-800 font-mono">
                {m.entityType} NAME VARIATION
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {m.confidence}% Match
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-800">
              <span className="font-bold">{m.originalName}</span>
              <span className="text-slate-400">≈</span>
              <span className="font-bold text-sky-700">{m.matchedName}</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Discovered from cross-document parsing. Merge to unify credit and collection records?
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => resolveEntityMatch(m.id, 'MERGED')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
              >
                <Check className="w-3 h-3" /> Merge Entities
              </button>
              <button
                onClick={() => resolveEntityMatch(m.id, 'KEPT_SEPARATE')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Keep Separate
              </button>
            </div>
          </div>
        ))}

        {/* Duplicate Alerts */}
        {pendingDuplicates.map((d) => (
          <div key={d.id} className="bg-white p-3.5 rounded-xl border border-rose-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-rose-800 font-mono">
                POSSIBLE DUPLICATE INVOICE
              </span>
              <span className="font-mono font-bold text-rose-700">{formatINR(d.amount)}</span>
            </div>

            <div className="font-bold text-slate-900">
              {d.recordIdentifier} · {d.entityName}
            </div>

            <p className="text-[11px] text-slate-500">
              Found in <span className="font-semibold text-slate-700">{d.sourceA}</span>, matching existing entry from <span className="font-semibold text-slate-700">{d.sourceB}</span>.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => resolveDuplicate(d.id, 'SKIPPED')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
              >
                <Check className="w-3 h-3" /> Skip Duplicate
              </button>
              <button
                onClick={() => resolveDuplicate(d.id, 'IMPORTED')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Import Anyway
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
