import { CashPoint, MSMEDataSet, ScenarioConfig, Recommendation } from '../types';

export interface ForecastOptions {
  dataset: MSMEDataSet;
  scenario?: ScenarioConfig;
  appliedRecommendations?: Recommendation[];
}

export const generateCashForecast = ({
  dataset,
  scenario,
  appliedRecommendations = [],
}: ForecastOptions): {
  series: CashPoint[];
  dangerZoneBreached: boolean;
  breachDate?: string;
  daysOfWarning: number;
  minimumCashReached: number;
  exposureAmount: number;
} => {
  const currentCash = dataset.company.cashBalance;
  const safeReserve = dataset.company.minimumCashReserve;
  const dailyBurn = dataset.company.dailyBurnRate; // ~₹17,333/day
  
  const series: CashPoint[] = [];
  const now = new Date();

  // 1. Generate Past 30 Days (Historical actuals)
  // Reconstruct backwards smoothly
  let pastCash = currentCash - 85000; // was around ₹7.35L 30 days ago
  for (let i = 30; i >= 1; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    
    // Some small daily fluctuations
    const dailyDelta = (Math.sin(i * 0.7) * 22000) - (i % 7 === 0 ? 45000 : -18000);
    pastCash = Math.max(350000, pastCash + dailyDelta * 0.15);
    
    series.push({
      date: dateStr,
      displayDate,
      baselineCash: Math.round(pastCash),
      simulatedCash: Math.round(pastCash),
      safeReserve,
      netFlow: Math.round(dailyDelta),
      isHistorical: true,
    });
  }

  // Day 0: Today
  series.push({
    date: now.toISOString().split('T')[0],
    displayDate: 'Today',
    baselineCash: currentCash,
    simulatedCash: currentCash,
    safeReserve,
    netFlow: 0,
    isHistorical: false,
  });

  // 2. Generate Next 90 Days (Projected)
  let baselineRunningCash = currentCash;
  let simulatedRunningCash = currentCash;
  let dangerZoneBreached = false;
  let breachDate: string | undefined = undefined;
  let daysOfWarning = 90;
  let minSimulatedCash = currentCash;

  // Pre-calculate daily scheduled inflows and outflows
  // Baseline scheduled
  const baselineInflows: { [dayOffset: number]: number } = {};
  const baselineOutflows: { [dayOffset: number]: number } = {};

  dataset.receivables.forEach((rec) => {
    const diffDays = Math.max(1, Math.round((new Date(rec.expectedDate).getTime() - now.getTime()) / 86400000));
    baselineInflows[diffDays] = (baselineInflows[diffDays] || 0) + rec.amount;
  });

  dataset.payables.forEach((pay) => {
    const diffDays = Math.max(1, Math.round((new Date(pay.dueDate).getTime() - now.getTime()) / 86400000));
    baselineOutflows[diffDays] = (baselineOutflows[diffDays] || 0) + pay.amount;
  });

  // Add Loan EMI (due day 15)
  baselineOutflows[15] = (baselineOutflows[15] || 0) + dataset.loans.reduce((sum, l) => sum + l.monthlyEMI, 0);

  // Shock impacts
  const simulatedInflows: { [dayOffset: number]: number } = { ...baselineInflows };
  const simulatedOutflows: { [dayOffset: number]: number } = { ...baselineOutflows };

  if (scenario) {
    if (scenario.type === 'CUSTOMER_DELAY') {
      const delayDays = scenario.delayDurationDays;
      const delayedAmt = scenario.delayedAmount;
      // Find the receivable corresponding to delayed customer
      const custRec = dataset.receivables.find((r) => !scenario.customerId || r.customerId === scenario.customerId) || dataset.receivables[0];
      const originalDay = Math.max(1, Math.round((new Date(custRec.expectedDate).getTime() - now.getTime()) / 86400000));
      
      // Remove from original day, move to originalDay + delayDays
      simulatedInflows[originalDay] = Math.max(0, (simulatedInflows[originalDay] || 0) - delayedAmt);
      const newDay = originalDay + delayDays;
      simulatedInflows[newDay] = (simulatedInflows[newDay] || 0) + delayedAmt;
    } else if (scenario.type === 'REVENUE_DROP') {
      const dropPct = (scenario.percentageChange || 30) / 100;
      Object.keys(simulatedInflows).forEach((day) => {
        simulatedInflows[Number(day)] = Math.round(simulatedInflows[Number(day)] * (1 - dropPct));
      });
    } else if (scenario.type === 'SUPPLIER_COST_INCREASE') {
      const hikePct = (scenario.percentageChange || 20) / 100;
      Object.keys(simulatedOutflows).forEach((day) => {
        simulatedOutflows[Number(day)] = Math.round(simulatedOutflows[Number(day)] * (1 + hikePct));
      });
    } else if (scenario.type === 'UNEXPECTED_EXPENSE') {
      const expense = scenario.unexpectedExpenseAmount || 250000;
      simulatedOutflows[7] = (simulatedOutflows[7] || 0) + expense;
    } else if (scenario.type === 'LOAN_EMI_INCREASE') {
      const bump = (scenario.interestRateBumpPercent || 3) * 8000;
      simulatedOutflows[15] = (simulatedOutflows[15] || 0) + bump;
      simulatedOutflows[45] = (simulatedOutflows[45] || 0) + bump;
    }
  }

  // Apply Recommendations Effects if any are applied
  appliedRecommendations.forEach((rec) => {
    if (!rec.applied) return;
    if (rec.category === 'RECEIVABLE_ACCELERATION') {
      // Speeds up delayed payment or advances 70% of receivable at day 7 via bill discounting
      const acceleratedAmt = rec.projectedExposureReduction || 450000;
      simulatedInflows[7] = (simulatedInflows[7] || 0) + acceleratedAmt;
      // Deduct from day 25
      simulatedInflows[25] = Math.max(0, (simulatedInflows[25] || 0) - acceleratedAmt);
    } else if (rec.category === 'SUPPLIER_TERMS') {
      // Postpones supplier payable by 15 days
      const deferredPayable = 250000;
      simulatedOutflows[10] = Math.max(0, (simulatedOutflows[10] || 0) - deferredPayable);
      simulatedOutflows[25] = (simulatedOutflows[25] || 0) + deferredPayable;
    } else if (rec.category === 'PROCUREMENT_DEFERRAL') {
      // Cuts non-critical procurement by ₹1.2L
      simulatedOutflows[18] = Math.max(0, (simulatedOutflows[18] || 0) - 120000);
    } else if (rec.category === 'CREDIT_LINE') {
      // Injects ₹2.5L emergency overdraft liquidity buffer at day 5
      simulatedInflows[5] = (simulatedInflows[5] || 0) + 250000;
    }
  });

  // Calculate forward for 90 days
  for (let day = 1; day <= 90; day++) {
    const d = new Date(now.getTime() + day * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

    // Baseline calculation
    const baseIn = baselineInflows[day] || 0;
    const baseOut = (baselineOutflows[day] || 0) + dailyBurn;
    baselineRunningCash = baselineRunningCash + baseIn - baseOut;
    // Add periodic minor revenue for recurring customers
    if (day % 14 === 0) baselineRunningCash += 140000;

    // Simulated calculation
    const simIn = simulatedInflows[day] || 0;
    const simOut = (simulatedOutflows[day] || 0) + dailyBurn;
    simulatedRunningCash = simulatedRunningCash + simIn - simOut;
    if (day % 14 === 0) simulatedRunningCash += 140000;

    if (simulatedRunningCash < minSimulatedCash) {
      minSimulatedCash = simulatedRunningCash;
    }

    // Check breach of minimum safe cash reserve
    if (simulatedRunningCash < safeReserve && !dangerZoneBreached) {
      dangerZoneBreached = true;
      breachDate = displayDate;
      daysOfWarning = day;
    }

    series.push({
      date: dateStr,
      displayDate,
      baselineCash: Math.round(baselineRunningCash),
      simulatedCash: Math.round(simulatedRunningCash),
      safeReserve,
      netFlow: Math.round(simIn - simOut),
      isHistorical: false,
    });
  }

  const exposureAmount = Math.max(0, safeReserve - minSimulatedCash);

  return {
    series,
    dangerZoneBreached,
    breachDate,
    daysOfWarning: dangerZoneBreached ? daysOfWarning : 90,
    minimumCashReached: Math.round(minSimulatedCash),
    exposureAmount: Math.round(exposureAmount),
  };
};
