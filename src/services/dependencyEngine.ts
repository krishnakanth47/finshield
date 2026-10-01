import { CascadeStep, MSMEDataSet, RiskAssessment, ScenarioConfig } from '../types';

export interface TwinNodeData {
  id: string;
  label: string;
  category: 'CUSTOMER' | 'RECEIVABLE' | 'CASH' | 'SUPPLIER' | 'INVENTORY' | 'PRODUCTION' | 'OPERATIONS';
  metricLabel: string;
  metricValue: string;
  status: 'HEALTHY' | 'DELAYED' | 'HIGH RISK' | 'AT RISK' | 'MEDIUM RISK' | 'CRITICAL';
  statusColor: string;
  riskScore: number;
  highlighted: boolean;
  cascadeIndex?: number;
  tooltip: string;
  details?: Record<string, string | number>;
  [key: string]: unknown;
}

export const generateCascadeSteps = (
  scenario?: ScenarioConfig,
  risks?: RiskAssessment
): CascadeStep[] => {
  if (!scenario || scenario.type !== 'CUSTOMER_DELAY') {
    return [];
  }

  const delayedAmt = scenario.delayedAmount || 700000;
  const delayDays = scenario.delayDurationDays || 20;

  return [
    {
      step: 1,
      entity: 'CUSTOMER',
      title: 'Customer Payment Delay',
      description: `Apex Auto Systems delays ₹${(delayedAmt / 100000).toFixed(1)}L payment by ${delayDays} days.`,
      status: 'DELAYED',
      timeframe: 'Day 0 to +5',
      financialImpact: delayedAmt,
    },
    {
      step: 2,
      entity: 'RECEIVABLE',
      title: 'Receivable Timing Shifts',
      description: `Invoice INV-2026-089 maturity extended from Day 5 to Day ${5 + delayDays}. Inflow blocked.`,
      status: 'DELAYED',
      timeframe: `Day 5 (+${delayDays}d)`,
      financialImpact: delayedAmt,
    },
    {
      step: 3,
      entity: 'CASH',
      title: 'Cash Buffer Depletion',
      description: `Operating cash drops from ₹8.2L to ₹2.1L, penetrating the ₹3.0L minimum safety threshold.`,
      status: 'HIGH RISK',
      timeframe: 'Day 12 - 18',
      financialImpact: 320000,
    },
    {
      step: 4,
      entity: 'SUPPLIER',
      title: 'Supplier Settlement Default',
      description: `Inability to clear ₹4.1L payable to critical raw steel vendor (SteelWorks India).`,
      status: 'AT RISK',
      timeframe: 'Day 10 - 15',
      financialImpact: 410000,
    },
    {
      step: 5,
      entity: 'INVENTORY',
      title: 'Material Starvation',
      description: `Grade EN8 alloy billet shipments frozen by vendor; inventory coverage shrinks to 6 days.`,
      status: 'MEDIUM RISK',
      timeframe: 'Day 18 - 22',
      financialImpact: 380000,
    },
    {
      step: 6,
      entity: 'PRODUCTION',
      title: 'Plant Line Disruption',
      description: `CNC Turning Centre shuts down due to raw material stockout; ₹14.2L order delivery halted.`,
      status: 'HIGH RISK',
      timeframe: 'Day 21+',
      financialImpact: 1420000,
    },
  ];
};

export const getTwinNodesAndEdges = (
  dataset: MSMEDataSet,
  scenario?: ScenarioConfig,
  risks?: RiskAssessment,
  isIntervened = false
) => {
  const isShocked = !!scenario;
  const isCustomerDelay = scenario?.type === 'CUSTOMER_DELAY';

  // Node statuses based on simulation state
  const customerStatus = isCustomerDelay ? 'DELAYED' : 'HEALTHY';
  const recStatus = isCustomerDelay ? 'DELAYED' : 'HEALTHY';
  const cashStatus = isIntervened ? 'HEALTHY' : (isShocked ? (risks?.liquidityRisk.level === 'HIGH' ? 'HIGH RISK' : 'MEDIUM RISK') : 'HEALTHY');
  const supStatus = isIntervened ? 'HEALTHY' : (isShocked ? (risks?.supplierRisk.level === 'HIGH' ? 'AT RISK' : 'MEDIUM RISK') : 'HEALTHY');
  const invStatus = isIntervened ? 'HEALTHY' : (isShocked ? (risks?.inventoryRisk.level === 'HIGH' ? 'HIGH RISK' : 'MEDIUM RISK') : 'HEALTHY');
  const prodStatus = isIntervened ? 'HEALTHY' : (isShocked ? (risks?.productionRisk.level === 'HIGH' ? 'HIGH RISK' : 'MEDIUM RISK') : 'HEALTHY');
  const opsStatus = isIntervened ? 'HEALTHY' : (isShocked ? 'AT RISK' : 'HEALTHY');

  const nodes: {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: TwinNodeData;
  }[] = [
    {
      id: 'node-customer',
      type: 'twinNode',
      position: { x: 50, y: 140 },
      data: {
        id: 'node-customer',
        label: 'Apex Auto Systems Ltd',
        category: 'CUSTOMER',
        metricLabel: 'Outstanding Receivable',
        metricValue: '₹7.00 Lakh',
        status: customerStatus,
        statusColor: isCustomerDelay ? 'text-amber-600 bg-amber-50 border-amber-300' : 'text-emerald-600 bg-emerald-50 border-emerald-300',
        riskScore: isCustomerDelay ? 85 : 12,
        highlighted: isCustomerDelay,
        cascadeIndex: 1,
        tooltip: 'Primary automotive OEM customer; contributes 60.8% of current month receivables.',
        details: {
          'Credit Terms': 'Net 30 Days',
          'Historical Delay': '4 Days avg',
          'Payment Reliability': '88/100',
          'Delayed Amount': isCustomerDelay ? '₹7,00,000' : '₹0',
        },
      },
    },
    {
      id: 'node-receivable',
      type: 'twinNode',
      position: { x: 310, y: 140 },
      data: {
        id: 'node-receivable',
        label: 'Receivables Portfolio',
        category: 'RECEIVABLE',
        metricLabel: 'Expected Collections',
        metricValue: '₹11.50 Lakh',
        status: recStatus,
        statusColor: isCustomerDelay ? 'text-amber-600 bg-amber-50 border-amber-300' : 'text-emerald-600 bg-emerald-50 border-emerald-300',
        riskScore: isCustomerDelay ? 82 : 15,
        highlighted: isCustomerDelay,
        cascadeIndex: 2,
        tooltip: 'Total scheduled inflows across 4 buyers over the next 30 days.',
        details: {
          'Total Invoices': '4 Active',
          'Overdue Amount': '₹0',
          'Upcoming In 7d': isCustomerDelay ? '₹0 (Delayed)' : '₹7,00,000',
          'Concentration Risk': 'HIGH (Apex = 61%)',
        },
      },
    },
    {
      id: 'node-cash',
      type: 'twinNode',
      position: { x: 570, y: 140 },
      data: {
        id: 'node-cash',
        label: 'Cash & Liquidity Buffer',
        category: 'CASH',
        metricLabel: 'Available Balance',
        metricValue: isShocked && !isIntervened ? '₹2.10 Lakh (Est.)' : `₹${(dataset.company.cashBalance / 100000).toFixed(2)} Lakh`,
        status: cashStatus,
        statusColor: cashStatus === 'HIGH RISK' ? 'text-rose-600 bg-rose-50 border-rose-300' : (cashStatus === 'HEALTHY' ? 'text-emerald-600 bg-emerald-50 border-emerald-300' : 'text-amber-600 bg-amber-50 border-amber-300'),
        riskScore: isShocked && !isIntervened ? 86 : 22,
        highlighted: isShocked,
        cascadeIndex: 3,
        tooltip: 'Operating bank balance and minimum reserve limit.',
        details: {
          'Current Balance': '₹8,20,000',
          'Minimum Safe Reserve': '₹3,00,000',
          'Daily Burn Rate': '₹17,333/day',
          'Runway (Normal)': '41 Days',
        },
      },
    },
    {
      id: 'node-supplier',
      type: 'twinNode',
      position: { x: 830, y: 140 },
      data: {
        id: 'node-supplier',
        label: 'SteelWorks India (Critical)',
        category: 'SUPPLIER',
        metricLabel: 'Upcoming Obligations',
        metricValue: '₹4.10 Lakh',
        status: supStatus,
        statusColor: supStatus === 'AT RISK' ? 'text-rose-600 bg-rose-50 border-rose-300' : (supStatus === 'HEALTHY' ? 'text-emerald-600 bg-emerald-50 border-emerald-300' : 'text-amber-600 bg-amber-50 border-amber-300'),
        riskScore: isShocked && !isIntervened ? 82 : 28,
        highlighted: isShocked,
        cascadeIndex: 4,
        tooltip: 'Single-source provider of specialized Grade EN8 forging alloy.',
        details: {
          'Payable Due Date': 'Day 10',
          'Credit Terms': 'Net 30 Days',
          'Lead Time': '14 Days',
          'Criticality': 'CRITICAL',
        },
      },
    },
    {
      id: 'node-inventory',
      type: 'twinNode',
      position: { x: 830, y: 350 },
      data: {
        id: 'node-inventory',
        label: 'Raw Materials & WIP',
        category: 'INVENTORY',
        metricLabel: 'Total Stock Valuation',
        metricValue: '₹6.80 Lakh',
        status: invStatus,
        statusColor: invStatus === 'MEDIUM RISK' || invStatus === 'HIGH RISK' ? 'text-amber-600 bg-amber-50 border-amber-300' : 'text-emerald-600 bg-emerald-50 border-emerald-300',
        riskScore: isShocked && !isIntervened ? 74 : 25,
        highlighted: isShocked,
        cascadeIndex: 5,
        tooltip: 'Inventory stock across EN8 billets, carbide inserts, and WIP shafts.',
        details: {
          'EN8 Billets Coverage': isShocked && !isIntervened ? '6 Days (Depleting)' : '22 Days',
          'Safety Minimum': '14 Days',
          'Total Stock Value': '₹6,80,000',
        },
      },
    },
    {
      id: 'node-production',
      type: 'twinNode',
      position: { x: 450, y: 350 },
      data: {
        id: 'node-production',
        label: 'CNC Machining Plant',
        category: 'PRODUCTION',
        metricLabel: 'Capacity Utilization',
        metricValue: isShocked && !isIntervened ? 'Disruption Risk' : '84% Active',
        status: prodStatus,
        statusColor: prodStatus === 'HIGH RISK' ? 'text-rose-600 bg-rose-50 border-rose-300' : 'text-emerald-600 bg-emerald-50 border-emerald-300',
        riskScore: isShocked && !isIntervened ? 80 : 18,
        highlighted: isShocked,
        cascadeIndex: 6,
        tooltip: 'Precision Turning & Milling lines with 28 skilled technicians.',
        details: {
          'Active Orders Value': '₹14,20,000',
          'Daily Output': '₹52,000',
          'Projected Stoppage': isShocked && !isIntervened ? 'Day 21 (without action)' : 'None',
        },
      },
    },
    {
      id: 'node-operations',
      type: 'twinNode',
      position: { x: 100, y: 350 },
      data: {
        id: 'node-operations',
        label: 'Business Operations',
        category: 'OPERATIONS',
        metricLabel: 'Monthly Fixed Burn',
        metricValue: '₹5.20 Lakh',
        status: opsStatus,
        statusColor: opsStatus === 'AT RISK' ? 'text-amber-600 bg-amber-50 border-amber-300' : 'text-emerald-600 bg-emerald-50 border-emerald-300',
        riskScore: isShocked && !isIntervened ? 65 : 20,
        highlighted: isShocked,
        cascadeIndex: 7,
        tooltip: 'Payroll, factory lease, power utilities, and debt servicing obligations.',
        details: {
          'Monthly Payroll': '₹3,40,000',
          'Factory Lease & Power': '₹1,35,000',
          'Loan EMI': '₹45,000',
        },
      },
    },
  ];

  const edges = [
    {
      id: 'e-cust-rec',
      source: 'node-customer',
      target: 'node-receivable',
      animated: isCustomerDelay,
      style: {
        stroke: isCustomerDelay ? '#f59e0b' : '#94a3b8',
        strokeWidth: isCustomerDelay ? 3 : 2,
      },
    },
    {
      id: 'e-rec-cash',
      source: 'node-receivable',
      target: 'node-cash',
      animated: isShocked,
      style: {
        stroke: isShocked ? (isIntervened ? '#10b981' : '#f43f5e') : '#94a3b8',
        strokeWidth: isShocked ? 3 : 2,
      },
    },
    {
      id: 'e-cash-sup',
      source: 'node-cash',
      target: 'node-supplier',
      animated: isShocked,
      style: {
        stroke: isShocked ? (isIntervened ? '#10b981' : '#f43f5e') : '#94a3b8',
        strokeWidth: isShocked ? 3 : 2,
      },
    },
    {
      id: 'e-sup-inv',
      source: 'node-supplier',
      target: 'node-inventory',
      animated: isShocked,
      style: {
        stroke: isShocked ? '#f59e0b' : '#94a3b8',
        strokeWidth: isShocked ? 2.5 : 2,
      },
    },
    {
      id: 'e-inv-prod',
      source: 'node-inventory',
      target: 'node-production',
      animated: isShocked,
      style: {
        stroke: isShocked ? (isIntervened ? '#10b981' : '#f43f5e') : '#94a3b8',
        strokeWidth: isShocked ? 3 : 2,
      },
    },
    {
      id: 'e-prod-ops',
      source: 'node-production',
      target: 'node-operations',
      animated: isShocked,
      style: {
        stroke: isShocked ? '#f59e0b' : '#94a3b8',
        strokeWidth: 2,
      },
    },
    {
      id: 'e-ops-cash',
      source: 'node-operations',
      target: 'node-cash',
      animated: false,
      style: {
        stroke: '#cbd5e1',
        strokeDasharray: '4 4',
        strokeWidth: 1.5,
      },
    },
  ];

  return { nodes, edges };
};
