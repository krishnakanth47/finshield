import React, { useState } from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { ExtractedField } from '../../types';
import { formatINR } from '../../services/documentParser/normalizer';
import { 
  Check, 
  X, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Layers 
} from 'lucide-react';

export const DataReviewTable: React.FC = () => {
  const { 
    extractedFields, 
    updateFieldStatus, 
    updateFieldValue, 
    approveAllHighConfidence, 
    commitApprovedData,
    commitSuccessMessage,
    setActiveTab
  } = useFinShield();

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'NEEDS_REVIEW'>('ALL');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editInputValue, setEditInputValue] = useState<string>('');

  if (extractedFields.length === 0) return null;

  const filteredFields = extractedFields.filter((f) => {
    if (filter === 'PENDING') return f.status === 'PENDING';
    if (filter === 'APPROVED') return f.status === 'APPROVED';
    if (filter === 'NEEDS_REVIEW') return f.confidence < 0.90;
    return true;
  });

  const approvedCount = extractedFields.filter((f) => f.status === 'APPROVED').length;
  const highConfCount = extractedFields.filter((f) => f.confidence >= 0.85).length;

  const handleStartEdit = (fld: ExtractedField) => {
    setEditingFieldId(fld.id);
    setEditInputValue(String(fld.value || ''));
  };

  const handleSaveEdit = (fldId: string) => {
    const num = parseFloat(editInputValue.replace(/[₹,]/g, ''));
    if (!isNaN(num) && editInputValue.includes('₹') || !isNaN(num) && num > 1000) {
      updateFieldValue(fldId, num);
    } else {
      updateFieldValue(fldId, editInputValue);
    }
    setEditingFieldId(null);
  };

  const getConfidenceBadge = (confidence: number) => {
    const pct = Math.round(confidence * 100);
    if (confidence >= 0.90) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {pct}% High
        </span>
      );
    }
    if (confidence >= 0.70) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          {pct}% Med
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        {pct}% Review
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle space-y-4">
      {/* Header & Batch Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900">
              Review & Validate Extracted Financial Data
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {approvedCount}/{extractedFields.length} Approved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Only approved fields enter the Financial Digital Twin and affect downstream risk simulations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          <button
            onClick={approveAllHighConfidence}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Approve All High Confidence ({highConfCount})</span>
          </button>

          <button
            onClick={commitApprovedData}
            disabled={approvedCount === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] disabled:opacity-40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Commit to Digital Twin ({approvedCount})</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 flex items-center justify-between text-xs border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          {(['ALL', 'PENDING', 'NEEDS_REVIEW', 'APPROVED'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filter === t
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Showing {filteredFields.length} of {extractedFields.length} fields
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Financial Field</th>
              <th className="py-2.5 px-4">Extracted Value</th>
              <th className="py-2.5 px-4 text-center">Confidence</th>
              <th className="py-2.5 px-4">Source Traceability</th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredFields.map((fld) => {
              const isEditing = editingFieldId === fld.id;
              return (
                <tr
                  key={fld.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    fld.status === 'APPROVED'
                      ? 'bg-emerald-50/20'
                      : fld.status === 'REJECTED'
                      ? 'bg-slate-100/60 opacity-60'
                      : ''
                  }`}
                >
                  {/* Field */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{fld.displayName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {fld.targetEntityType} · {fld.field}
                    </div>
                  </td>

                  {/* Extracted Value */}
                  <td className="py-3 px-4 font-mono">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editInputValue}
                          onChange={(e) => setEditInputValue(e.target.value)}
                          className="px-2 py-1 text-xs border border-sky-400 rounded bg-white text-slate-900 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveEdit(fld.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {typeof fld.value === 'number'
                            ? formatINR(fld.value)
                            : String(fld.value || 'unknown')}
                        </span>
                        {fld.isDuplicate && (
                          <span
                            className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 cursor-help"
                            title={fld.duplicateDetails || 'Possible Duplicate'}
                          >
                            Duplicate
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Confidence */}
                  <td className="py-3 px-4 text-center">
                    {getConfidenceBadge(fld.confidence)}
                  </td>

                  {/* Source Traceability */}
                  <td className="py-3 px-4 text-slate-600">
                    <div className="font-semibold text-slate-800 truncate max-w-[180px]">
                      {fld.sourceFile}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {fld.sourceLocation}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        fld.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : fld.status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {fld.status}
                    </span>
                  </td>

                  {/* Row Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleStartEdit(fld)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                        title="Edit value manually"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => updateFieldStatus(fld.id, 'APPROVED')}
                        className={`p-1.5 rounded transition ${
                          fld.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title="Approve field"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      <button
                        onClick={() => updateFieldStatus(fld.id, 'REJECTED')}
                        className={`p-1.5 rounded transition ${
                          fld.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-700'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title="Reject field"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Commit Notification Banner */}
      {commitSuccessMessage && (
        <div className="mx-5 mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">{commitSuccessMessage}</span>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1 font-extrabold text-emerald-800 hover:text-emerald-950 underline"
          >
            <span>View Updated Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
