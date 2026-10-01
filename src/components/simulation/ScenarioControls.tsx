import React, { useState } from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { ScenarioConfig, ScenarioType } from '../../types';
import { Sliders, Zap, RotateCcw, AlertOctagon, HelpCircle } from 'lucide-react';

export const ScenarioControls: React.FC = () => {
  const { dataset, scenario, simulateShock, resetScenario } = useFinShield();

  // Primary scenario default values: Largest customer ₹7L delayed by 20 days
  const [selectedType, setSelectedType] = useState<ScenarioType>('CUSTOMER_DELAY');
  const [selectedCustomer, setSelectedCustomer] = useState<string>(dataset.customers[0]?.id || 'cust_apex');
  const [delayedAmount, setDelayedAmount] = useState<number>(700000);
  const [delayDuration, setDelayDuration] = useState<number>(20);
  const [percentageChange, setPercentageChange] = useState<number>(30);
  const [unexpectedExpense, setUnexpectedExpense] = useState<number>(250000);
  const [severity, setSeverity] = useState<'MILD' | 'MODERATE' | 'SEVERE'>('SEVERE');

  const scenariosList = [
    {
      id: 'CUSTOMER_DELAY',
      title: 'Customer Payment Delay',
      desc: 'Largest customer delays a major receivable payment.',
      defaultDuration: 20,
    },
    {
      id: 'REVENUE_DROP',
      title: 'Revenue / Sales Contraction',
      desc: 'Sudden drop in monthly incoming customer purchase orders.',
      defaultDuration: 30,
    },
    {
      id: 'SUPPLIER_COST_INCREASE',
      title: 'Supplier Material Cost Surge',
      desc: 'Raw alloy steel prices increase abruptly.',
      defaultDuration: 15,
    },
    {
      id: 'UNEXPECTED_EXPENSE',
      title: 'Unexpected Factory Expense',
      desc: 'CNC breakdown repair or unbudgeted compliance penalty.',
      defaultDuration: 7,
    },
    {
      id: 'SUPPLIER_DISRUPTION',
      title: 'Single-Source Supplier Disruption',
      desc: 'Key raw material vendor temporarily halts dispatches.',
      defaultDuration: 25,
    },
    {
      id: 'LOAN_EMI_INCREASE',
      title: 'Loan Interest / EMI Hike',
      desc: 'Working capital facility interest rate bump of 300 bps.',
      defaultDuration: 30,
    },
  ];

  const handleRunSimulation = () => {
    let title = 'Financial Shock';
    if (selectedType === 'CUSTOMER_DELAY') title = 'Customer Payment Delay';
    if (selectedType === 'REVENUE_DROP') title = 'Revenue Contraction Shock';
    if (selectedType === 'SUPPLIER_COST_INCREASE') title = 'Raw Material Cost Surge';
    if (selectedType === 'UNEXPECTED_EXPENSE') title = 'Unexpected Emergency Expense';
    if (selectedType === 'SUPPLIER_DISRUPTION') title = 'Supplier Chain Stoppage';
    if (selectedType === 'LOAN_EMI_INCREASE') title = 'Debt Servicing Spike';

    const config: ScenarioConfig = {
      type: selectedType,
      title,
      customerId: selectedCustomer,
      delayedAmount,
      delayDurationDays: delayDuration,
      percentageChange,
      unexpectedExpenseAmount: unexpectedExpense,
      severity,
    };

    simulateShock(config);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Scenario Parameter Studio</h3>
            <p className="text-xs text-slate-500">Configure financial shock stress parameters</p>
          </div>
        </div>

        {scenario && (
          <button
            onClick={resetScenario}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Scenario Type Selection Grid */}
      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-2">
          Select Shock Scenario
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {scenariosList.map((sc) => {
            const isSelected = selectedType === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSelectedType(sc.id as ScenarioType);
                  if (sc.id === 'CUSTOMER_DELAY') setDelayDuration(20);
                }}
                className={`text-left p-3 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold shadow-xs ring-1 ring-sky-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold">{sc.title}</div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                  {sc.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Controls based on selected scenario */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
        {selectedType === 'CUSTOMER_DELAY' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Target Customer
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {dataset.customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (₹{(c.receivableAmount / 100000).toFixed(1)}L receivable)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Scenario Severity Tier
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['MILD', 'MODERATE', 'SEVERE'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeverity(lvl)}
                      className={`py-2 rounded-lg text-xs font-bold transition border ${
                        severity === lvl
                          ? 'bg-white border-slate-900 text-slate-900 shadow-xs'
                          : 'bg-slate-200/50 border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-slate-700">Delayed Payment Amount</span>
                  <span className="font-mono font-bold text-sky-700">
                    ₹{(delayedAmount / 100000).toFixed(1)} Lakh (₹{delayedAmount.toLocaleString('en-IN')})
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={1000000}
                  step={50000}
                  value={delayedAmount}
                  onChange={(e) => setDelayedAmount(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹1.0L</span>
                  <span>₹7.0L (Default Largest)</span>
                  <span>₹10.0L</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-slate-700">Delay Duration</span>
                  <span className="font-mono font-bold text-sky-700">{delayDuration} Days</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={delayDuration}
                  onChange={(e) => setDelayDuration(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>5 Days</span>
                  <span>20 Days (Ideathon Pitch Demo)</span>
                  <span>60 Days</span>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedType === 'REVENUE_DROP' && (
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-700">Sales Inflow Contraction</span>
              <span className="font-mono font-bold text-rose-700">-{percentageChange}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={percentageChange}
              onChange={(e) => setPercentageChange(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>
        )}

        {selectedType === 'UNEXPECTED_EXPENSE' && (
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-700">Emergency Outflow Amount</span>
              <span className="font-mono font-bold text-rose-700">
                ₹{(unexpectedExpense / 100000).toFixed(1)} Lakh
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={500000}
              step={25000}
              value={unexpectedExpense}
              onChange={(e) => setUnexpectedExpense(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* CTA Button: SIMULATE SHOCK */}
      <div className="pt-2">
        <button
          onClick={handleRunSimulation}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Zap className="w-4 h-4 fill-current text-yellow-300" />
          <span>SIMULATE SHOCK & PROPAGATE CASCADE</span>
        </button>
        <p className="text-[11px] text-center text-slate-400 mt-2">
          Calculates downstream ripple across Cash, Suppliers, Inventory, and Production.
        </p>
      </div>
    </div>
  );
};
