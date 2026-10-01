import { MSMEDataSet, RiskAssessment, ScenarioConfig, Recommendation, RiskLevel } from '../types';

export interface RiskEngineParams {
  dataset: MSMEDataSet;
  scenario?: ScenarioConfig;
  daysOfWarning: number;
  minimumCashReached: number;
  dangerZoneBreached: boolean;
  appliedRecommendations?: Recommendation[];
}

export const computeRiskAssessment = ({
  dataset,
  scenario,
  daysOfWarning,
  minimumCashReached,
  dangerZoneBreached,
  appliedRecommendations = [],
}: RiskEngineParams): RiskAssessment => {
  const activeActionsCount = appliedRecommendations.filter((r) => r.applied).length;
  
  // Baseline stats
  const cash = dataset.company.cashBalance;
  const safeReserve = dataset.company.minimumCashReserve;
  const payablesTotal = dataset.payables.reduce((acc, p) => acc + p.amount, 0); // ₹9.7L
  const receivablesTotal = dataset.receivables.reduce((acc, r) => acc + r.amount, 0); // ₹11.5L
  
  // 1. Compute Liquidity Risk (0 - 100, where higher is riskier)
  let liquidityRiskScore = 22; // Healthy baseline
  const liquidityDrivers: string[] = [];

  if (!scenario) {
    liquidityDrivers.push(`Cash buffer of ₹${(cash / 100000).toFixed(1)}L covers obligations comfortably`);
    liquidityDrivers.push(`Net upcoming cash flow positive (+₹${((receivablesTotal - payablesTotal) / 100000).toFixed(1)}L)`);
  } else {
    if (scenario.type === 'CUSTOMER_DELAY') {
      const delayedAmt = scenario.delayedAmount;
      const delayDays = scenario.delayDurationDays;

      if (delayDays >= 20 && delayedAmt >= 500000) {
        liquidityRiskScore = 86; // HIGH / CRITICAL
        liquidityDrivers.push(`₹${(delayedAmt / 100000).toFixed(1)}L receivable delayed by ${delayDays} days`);
        liquidityDrivers.push(`₹${(payablesTotal / 100000).toFixed(1)}L obligations due before delayed collection`);
        liquidityDrivers.push(`Cash buffer falls below safe reserve threshold (₹${(safeReserve / 100000).toFixed(1)}L) in ${daysOfWarning} days`);
        liquidityDrivers.push(`Projected liquidity deficit of ₹${(Math.max(0, safeReserve - minimumCashReached) / 100000).toFixed(1)}L`);
      } else if (delayDays >= 10) {
        liquidityRiskScore = 58;
        liquidityDrivers.push(`₹${(delayedAmt / 100000).toFixed(1)}L payment delayed by ${delayDays} days`);
        liquidityDrivers.push(`Cash buffer tightens near minimum safety margin`);
      }
    } else if (scenario.type === 'REVENUE_DROP') {
      liquidityRiskScore = 78;
      liquidityDrivers.push(`Immediate ${scenario.percentageChange || 30}% reduction in sales inflow`);
      liquidityDrivers.push(`Operating burn rate continues at ₹${(dataset.company.monthlyOperatingCost / 100000).toFixed(1)}L/month`);
    } else if (scenario.type === 'UNEXPECTED_EXPENSE') {
      liquidityRiskScore = 72;
      liquidityDrivers.push(`Unbudgeted liquidity outflow of ₹${((scenario.unexpectedExpenseAmount || 250000) / 100000).toFixed(1)}L`);
    } else if (scenario.type === 'SUPPLIER_COST_INCREASE') {
      liquidityRiskScore = 65;
      liquidityDrivers.push(`Supplier price surge compresses working capital buffer`);
    } else {
      liquidityRiskScore = 60;
      liquidityDrivers.push(`Financial stress scenario triggered`);
    }
  }

  // 2. Compute Supplier Risk (0 - 100)
  let supplierRiskScore = 28;
  const supplierDrivers: string[] = [];

  if (!scenario) {
    supplierDrivers.push('Supplier accounts current; 30-day terms in good standing');
    supplierDrivers.push('Critical raw material supply chain operational');
  } else if (liquidityRiskScore > 75) {
    supplierRiskScore = 82;
    supplierDrivers.push('Default risk on ₹4.1L SteelWorks India critical invoice due in 10 days');
    supplierDrivers.push('Potential freeze on alloy steel shipments if payable delayed >7 days');
    supplierDrivers.push('Credit terms at risk of downgrade from Net-30 to Cash-On-Delivery');
  } else if (liquidityRiskScore > 50) {
    supplierRiskScore = 55;
    supplierDrivers.push('Delayed supplier settlements may impact future discount rates');
  }

  // 3. Compute Inventory Risk (0 - 100)
  let inventoryRiskScore = 25;
  const inventoryDrivers: string[] = [];

  if (!scenario) {
    inventoryDrivers.push('Alloy steel stock coverage at 22 days (above 14-day threshold)');
    inventoryDrivers.push('Carbide inserts stock sufficient for 18 production days');
  } else if (supplierRiskScore > 70) {
    inventoryRiskScore = 74;
    inventoryDrivers.push('Alloy steel raw material replenishment halted within 14 days');
    inventoryDrivers.push('Stock coverage drops below 10-day safety buffer by day 18');
    inventoryDrivers.push('Single-source dependency on Grade EN8 steel exposes plant');
  } else if (supplierRiskScore > 50) {
    inventoryRiskScore = 48;
    inventoryDrivers.push('Buffer inventory will be consumed faster than standard lead time');
  }

  // 4. Compute Production Risk (0 - 100)
  let productionRiskScore = 18;
  const productionDrivers: string[] = [];

  if (!scenario) {
    productionDrivers.push('84% capacity utilization operating without supply constraints');
    productionDrivers.push('Active customer order delivery schedules on track');
  } else if (inventoryRiskScore > 65) {
    productionRiskScore = 80;
    productionDrivers.push('Projected line stoppage at CNC Turning Centre in 21 days');
    productionDrivers.push('₹14.2L active order deliveries threatened with SLA penalties');
    productionDrivers.push('Idle labor overhead of 28 workers during stockout');
  } else if (inventoryRiskScore > 40) {
    productionRiskScore = 45;
    productionDrivers.push('Production scheduling re-sequenced to preserve steel stock');
  }

  // Apply Action Reductions if interventions are enabled
  if (activeActionsCount > 0) {
    const boostFactor = Math.min(0.75, activeActionsCount * 0.28);
    liquidityRiskScore = Math.round(liquidityRiskScore * (1 - boostFactor));
    supplierRiskScore = Math.round(supplierRiskScore * (1 - boostFactor * 1.1));
    inventoryRiskScore = Math.round(inventoryRiskScore * (1 - boostFactor * 0.9));
    productionRiskScore = Math.round(productionRiskScore * (1 - boostFactor * 1.15));

    liquidityDrivers.unshift(`[INTERVENTION] Bill discounting + terms renegotiation restored buffer`);
    supplierDrivers.unshift(`[INTERVENTION] 15-day supplier extension agreed on non-critical payables`);
    inventoryDrivers.unshift(`[INTERVENTION] Critical alloy steel procurement safeguarded`);
    productionDrivers.unshift(`[INTERVENTION] Line continuity preserved; no SLA breach`);
  }

  const getLevel = (score: number): RiskLevel => {
    if (score >= 70) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  };

  // Financial Resilience Score: Inverse weighted average of the 4 risk pillars (0 - 100)
  // Higher resilience score is better
  const weightedRisk = 
    liquidityRiskScore * 0.40 + 
    supplierRiskScore * 0.25 + 
    inventoryRiskScore * 0.20 + 
    productionRiskScore * 0.15;
  
  const resilienceScore = Math.max(10, Math.min(95, Math.round(100 - weightedRisk)));

  // Cash runway calculation
  const burn = dataset.company.dailyBurnRate;
  const runwayDays = Math.max(1, Math.round(Math.max(0, minimumCashReached) / burn));

  // Critical alerts count
  const criticalCount = [
    liquidityRiskScore >= 70,
    supplierRiskScore >= 70,
    inventoryRiskScore >= 70,
    productionRiskScore >= 70,
    dangerZoneBreached,
  ].filter(Boolean).length;

  return {
    liquidityRisk: {
      score: liquidityRiskScore,
      level: getLevel(liquidityRiskScore),
      primaryDrivers: liquidityDrivers,
    },
    supplierRisk: {
      score: supplierRiskScore,
      level: getLevel(supplierRiskScore),
      primaryDrivers: supplierDrivers,
    },
    inventoryRisk: {
      score: inventoryRiskScore,
      level: getLevel(inventoryRiskScore),
      primaryDrivers: inventoryDrivers,
    },
    productionRisk: {
      score: productionRiskScore,
      level: getLevel(productionRiskScore),
      primaryDrivers: productionDrivers,
    },
    resilienceScore,
    cashRunwayDays: runwayDays,
    daysOfWarning,
    criticalAlertCount: criticalCount,
    explanation: {
      title: scenario 
        ? `${scenario.title} Cascade Analysis`
        : 'Baseline Business Health Analysis',
      why: scenario 
        ? liquidityDrivers.slice(0, 3) 
        : ['Consistent customer collection cycles', 'Working capital buffer covers scheduled payables'],
      whatHappensNext: scenario 
        ? `Liquidity buffer compresses. In ${daysOfWarning} days, cash drops to critical reserve, propagating to supplier default and a projected plant stoppage in 21 days.`
        : 'Operations remain stable with 41-day cash runway and full production continuity.',
      whatShouldDo: scenario
        ? 'Execute the 4-step AI Prevention Plan immediately: prioritize receivable discounting and negotiate a 15-day supplier extension.'
        : 'Maintain monitoring. Consider establishing pre-approved factoring limits to mitigate customer concentration.',
    },
  };
};
