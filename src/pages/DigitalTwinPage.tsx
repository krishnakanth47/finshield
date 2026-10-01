import React, { useState } from 'react';
import { useFinShield } from '../context/FinShieldContext';
import { DependencyGraph } from '../components/digitalTwin/DependencyGraph';
import { 
  Network, 
  Building2, 
  FileText, 
  Coins, 
  Truck, 
  Boxes, 
  Cog, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  const { dataset, scenario, simulationResult, isIntervened, setActiveTab } = useFinShield();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Entities' },
    { id: 'CUSTOMER', label: 'Customers & Receivables' },
    { id: 'CASH', label: 'Cash & Reserves' },
    { id: 'SUPPLIER', label: 'Suppliers & Payables' },
    { id: 'OPERATIONS', label: 'Inventory & Operations' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Financial Digital Twin
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic dependency modeling connecting external buyers, liquidity reserves, vendors, and plant capacity.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulate')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Test Scenario on Twin</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Graph Canvas */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              End-to-End Enterprise Value Chain Graph
            </h3>
            <p className="text-xs text-slate-500">
              Pan, zoom, or click individual nodes to inspect credit terms and downstream risk exposures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Simulation State:</span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                scenario
                  ? isIntervened
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {scenario ? (isIntervened ? 'MITIGATED FLOW' : 'SHOCK CASCADE ACTIVE') : 'BASELINE HEALTHY'}
            </span>
          </div>
        </div>

        <DependencyGraph height="520px" />
      </div>

      {/* Entity Breakdown Tabs & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customers & Receivables */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase">Customers & Inflows</h4>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700">₹11.5L Total</span>
          </div>
          <div className="space-y-2 text-xs">
            {dataset.customers.map((c) => (
              <div key={c.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-[10px] text-slate-400">Reliability: {c.paymentReliabilityScore}/100</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-800">
                    ₹{(c.receivableAmount / 100000).toFixed(1)}L
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${c.criticality === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                    {c.criticality}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suppliers & Obligations */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase">Suppliers & Outflows</h4>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700">₹9.7L Total</span>
          </div>
          <div className="space-y-2 text-xs">
            {dataset.suppliers.map((s) => (
              <div key={s.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{s.name}</div>
                  <div className="text-[10px] text-slate-400">{s.suppliesCategory}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-800">
                    ₹{(s.payableAmount / 100000).toFixed(1)}L
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${s.criticality === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'}`}>
                    {s.criticality}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory & Operations */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase">Inventory & Operations</h4>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700">₹6.8L Stock</span>
          </div>
          <div className="space-y-2 text-xs">
            {dataset.inventory.map((inv) => (
              <div key={inv.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{inv.name}</div>
                  <div className="text-[10px] text-slate-400">Coverage: {inv.coverageDays} days</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-800">
                    ₹{(inv.value / 100000).toFixed(1)}L
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                    {inv.stockUnits} units
                  </span>
                </div>
              </div>
            ))}
            <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100 text-slate-700 flex justify-between">
              <span>Plant Capacity Utilization:</span>
              <span className="font-bold text-sky-900">{dataset.operations.productionCapacityUtilized}% Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
