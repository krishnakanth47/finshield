import React from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { History, FileText, CheckCircle2, AlertTriangle, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';

export const ImportHistoryTable: React.FC = () => {
  const { importHistory } = useFinShield();

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF':
        return <FileText className="w-3.5 h-3.5 text-rose-600" />;
      case 'CSV':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />;
      case 'DOCX':
        return <FileText className="w-3.5 h-3.5 text-blue-600" />;
      case 'IMAGE':
        return <ImageIcon className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle space-y-3 p-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-700" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Document Ingestion Audit History
          </h4>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {importHistory.length} Batches Processed
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] text-slate-400 uppercase font-semibold border-b border-slate-100">
            <tr>
              <th className="py-2">Document File</th>
              <th className="py-2 text-center">Format</th>
              <th className="py-2 text-center">Extracted Records</th>
              <th className="py-2 text-center">Status</th>
              <th className="py-2 text-right">Processed Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {importHistory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition">
                <td className="py-2.5 flex items-center gap-2">
                  {getFormatIcon(item.format)}
                  <span className="font-semibold text-slate-800">{item.fileName}</span>
                </td>
                <td className="py-2.5 text-center font-mono">
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {item.format}
                  </span>
                </td>
                <td className="py-2.5 text-center font-mono font-bold text-slate-900">
                  {item.recordsExtracted}
                </td>
                <td className="py-2.5 text-center">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'SUCCESS'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {item.status === 'SUCCESS' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                    )}
                    {item.status}
                  </span>
                </td>
                <td className="py-2.5 text-right text-slate-400 font-mono text-[11px]">
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
