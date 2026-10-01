import React from 'react';
import { LucideIcon, Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: React.ReactNode;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  tooltip?: string;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  icon: Icon,
  iconColor = 'text-sky-600 bg-sky-50',
  trend,
  tooltip,
  highlight = false,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border p-5 transition-all shadow-subtle hover:shadow-card relative overflow-hidden ${
        highlight ? 'border-sky-300 ring-2 ring-sky-100' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>{title}</span>
            {tooltip && (
              <span className="cursor-help text-slate-400 hover:text-slate-600" title={tooltip}>
                <Info className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </span>
            {badge && <div>{badge}</div>}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border border-slate-100 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {trend && (
            <span className={`font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
