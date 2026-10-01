import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TwinNodeData } from '../../services/dependencyEngine';
import { 
  Building2, 
  FileText, 
  Coins, 
  Truck, 
  Boxes, 
  Cog, 
  Briefcase 
} from 'lucide-react';

const iconMap = {
  CUSTOMER: Building2,
  RECEIVABLE: FileText,
  CASH: Coins,
  SUPPLIER: Truck,
  INVENTORY: Boxes,
  PRODUCTION: Cog,
  OPERATIONS: Briefcase,
};

export const TwinCustomNode = memo(({ data }: { data: TwinNodeData }) => {
  const Icon = iconMap[data.category] || Coins;
  const isHighRisk = data.status === 'HIGH RISK' || data.status === 'CRITICAL';
  const isAtRisk = data.status === 'AT RISK' || data.status === 'DELAYED';

  return (
    <div
      className={`rounded-xl bg-white border-2 p-3.5 shadow-md w-64 transition-all duration-300 relative ${
        isHighRisk
          ? 'border-rose-500 shadow-rose-500/20 ring-4 ring-rose-100'
          : isAtRisk
          ? 'border-amber-400 shadow-amber-400/20 ring-4 ring-amber-50'
          : 'border-slate-200 hover:border-sky-300'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-slate-400" />
      <Handle type="source" position={Position.Right} className="!bg-slate-400" />
      <Handle type="target" position={Position.Top} id="top" className="!bg-slate-400" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-slate-400" />

      {/* Header category & status */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5">
          <div
            className={`p-1.5 rounded-lg ${
              isHighRisk
                ? 'bg-rose-100 text-rose-700'
                : isAtRisk
                ? 'bg-amber-100 text-amber-700'
                : 'bg-sky-100 text-sky-700'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {data.category}
          </span>
        </div>

        <span
          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${data.statusColor}`}
        >
          {data.status}
        </span>
      </div>

      {/* Node Title */}
      <h4 className="text-xs font-bold text-slate-900 truncate" title={data.label}>
        {data.label}
      </h4>

      {/* Financial Metric */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 text-[11px]">{data.metricLabel}:</span>
        <span className="font-extrabold text-slate-800 font-mono">{data.metricValue}</span>
      </div>

      {/* Risk indicator bar */}
      <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            data.riskScore > 70
              ? 'bg-rose-500'
              : data.riskScore > 35
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(10, data.riskScore))}%` }}
        />
      </div>
    </div>
  );
});
