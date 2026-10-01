import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CashPoint } from '../../types';
import { TrendingDown, ShieldAlert, Calendar } from 'lucide-react';

interface CashFlowForecastChartProps {
  data: CashPoint[];
  minimumReserve: number;
  breachDate?: string;
  isShockActive: boolean;
}

export const CashFlowForecastChart: React.FC<CashFlowForecastChartProps> = ({
  data,
  minimumReserve,
  breachDate,
  isShockActive,
}) => {
  const [viewWindow, setViewWindow] = useState<'30' | '60' | '90'>('60');

  // Filter based on view window
  // Data has 30 historical points + Today + up to 90 future points
  const filteredData = React.useMemo(() => {
    const historical = data.filter((d) => d.isHistorical);
    const future = data.filter((d) => !d.isHistorical);
    const limit = parseInt(viewWindow, 10);
    return [...historical, ...future.slice(0, limit + 1)];
  }, [data, viewWindow]);

  const formatCurrency = (val: number) => {
    return `₹${(val / 100000).toFixed(1)}L`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Cash Flow Trajectory & Buffer Forecast
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Past 30d + Next {viewWindow}d
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compares baseline cash projection against simulated shock with safety buffer margin.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
          <button
            onClick={() => setViewWindow('30')}
            className={`px-2.5 py-1 rounded-md transition ${
              viewWindow === '30' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setViewWindow('60')}
            className={`px-2.5 py-1 rounded-md transition ${
              viewWindow === '60' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            60 Days
          </button>
          <button
            onClick={() => setViewWindow('90')}
            className={`px-2.5 py-1 rounded-md transition ${
              viewWindow === '90' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Danger Zone notice if breached */}
      {isShockActive && breachDate && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>DANGER ZONE BREACH:</strong> Projected cash drops below ₹
              {(minimumReserve / 100000).toFixed(1)}L safe reserve on{' '}
              <strong>{breachDate}</strong> without preventive intervention.
            </span>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="shockGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              interval={Math.floor(filteredData.length / 7)}
            />

            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              domain={[0, 'dataMax + 200000']}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as CashPoint;
                  return (
                    <div className="bg-slate-900 text-white rounded-lg p-3 text-xs shadow-xl border border-slate-800 space-y-1.5 min-w-[200px]">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1 font-semibold text-slate-300">
                        <span>{label}</span>
                        <span className="text-[10px] text-slate-400">
                          {pt.isHistorical ? 'HISTORICAL ACTUAL' : 'PROJECTION'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sky-400">
                        <span>Baseline Cash:</span>
                        <span className="font-mono font-bold">{formatCurrency(pt.baselineCash)}</span>
                      </div>
                      {isShockActive && (
                        <div className="flex justify-between items-center text-rose-400">
                          <span>Simulated Shock:</span>
                          <span className="font-mono font-bold">{formatCurrency(pt.simulatedCash)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-amber-400 pt-1 border-t border-slate-800">
                        <span>Safe Reserve Margin:</span>
                        <span className="font-mono">{formatCurrency(pt.safeReserve)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
            />

            {/* Minimum Safe Cash Reference Line */}
            <ReferenceLine
              y={minimumReserve}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `MIN SAFE RESERVE (₹${(minimumReserve / 100000).toFixed(1)}L)`,
                position: 'insideBottomRight',
                fill: '#d97706',
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            {/* Historical Boundary */}
            <ReferenceLine
              x="Today"
              stroke="#64748b"
              strokeWidth={1}
              strokeDasharray="2 2"
              label={{
                value: 'TODAY',
                position: 'top',
                fill: '#475569',
                fontSize: 10,
                fontWeight: 700,
              }}
            />

            {/* Baseline Area / Line */}
            <Area
              type="monotone"
              dataKey="baselineCash"
              name="Baseline Scenario"
              stroke="#0284c7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#baselineGrad)"
            />

            {/* Simulated Shock Line */}
            {isShockActive && (
              <Area
                type="monotone"
                dataKey="simulatedCash"
                name="Simulated Shock"
                stroke="#f43f5e"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#shockGrad)"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend summary */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Baseline Track
          </span>
          {isShockActive && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Shock Cascade
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 border-t-2 border-dashed border-amber-500"></span> Minimum Safe Cash Reserve (₹3.0L)
          </span>
        </div>
        <span className="text-slate-400 font-mono">Calculated with MSME daily burn rate ₹17,333/day</span>
      </div>
    </div>
  );
};
