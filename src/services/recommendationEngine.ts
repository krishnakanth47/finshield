import { Recommendation, ScenarioConfig, MSMEDataSet } from '../types';

export const generateRecommendations = (
  dataset: MSMEDataSet,
  scenario?: ScenarioConfig
): Recommendation[] => {
  if (!scenario) {
    return [
      {
        id: 'rec_opt_1',
        action: 'Setup MSME TReDS Factoring Facility',
        why: 'Apex Auto Systems represents 60.8% of receivables. Factoring ensures predictable T+2 settlements.',
        priority: 'MEDIUM',
        expectedEffect: 'Insulates company against future single-customer delay shocks.',
        projectedExposureReduction: 350000,
        resilienceBoost: 8,
        category: 'DISCOUNTING',
        applied: false,
      },
      {
        id: 'rec_opt_2',
        action: 'Renegotiate Net-45 Terms with SteelWorks India',
        why: 'Extending credit from 30 to 45 days increases working capital buffer by ₹4.1L.',
        priority: 'LOW',
        expectedEffect: 'Smoothes out monthly cash flow troughs.',
        projectedExposureReduction: 200000,
        resilienceBoost: 5,
        category: 'SUPPLIER_TERMS',
        applied: false,
      },
    ];
  }

  // If customer payment delay scenario
  if (scenario.type === 'CUSTOMER_DELAY') {
    const delayedAmt = scenario.delayedAmount;
    return [
      {
        id: 'rec_action_1',
        action: 'Accelerate Collection via Invoice Discounting / TReDS',
        why: 'Discounting the ₹7.0L invoice unlocks 80% immediate cash (₹5.6L) within 48 hours, bridging the 20-day liquidity deficit.',
        priority: 'CRITICAL',
        expectedEffect: 'Immediately injects ₹5,60,000 cash; prevents dropping below ₹3.0L safe reserve.',
        projectedExposureReduction: Math.round(delayedAmt * 0.75),
        resilienceBoost: 22,
        category: 'RECEIVABLE_ACCELERATION',
        applied: false,
      },
      {
        id: 'rec_action_2',
        action: 'Negotiate 15-Day Supplier Extension on Non-Critical Payables',
        why: 'Precision Materials and TechParts are secondary suppliers. Extending ₹4.2L payables by 15 days defers outflows past the collection crunch.',
        priority: 'HIGH',
        expectedEffect: 'Preserves ₹2,50,000 immediate cash for critical SteelWorks India alloy steel payments.',
        projectedExposureReduction: 250000,
        resilienceBoost: 16,
        category: 'SUPPLIER_TERMS',
        applied: false,
      },
      {
        id: 'rec_action_3',
        action: 'Defer Non-Critical Fastener & Consumables Procurement',
        why: 'Fastener inventory has 30 days coverage. Delaying ₹1.2L replenishment order conserves cash without impacting production.',
        priority: 'MEDIUM',
        expectedEffect: 'Saves ₹1,20,000 in immediate cash outflows over the next 14 days.',
        projectedExposureReduction: 120000,
        resilienceBoost: 9,
        category: 'PROCUREMENT_DEFERRAL',
        applied: false,
      },
      {
        id: 'rec_action_4',
        action: 'Drawdown Emergency Working Capital Overdraft Buffer',
        why: 'Utilizing pre-approved HDFC OD facility provides an instant ₹2.5L liquidity cushion until delayed customer wire arrives.',
        priority: 'MEDIUM',
        expectedEffect: 'Eliminates operational disruption risk and keeps resilience score above 75.',
        projectedExposureReduction: 250000,
        resilienceBoost: 11,
        category: 'CREDIT_LINE',
        applied: false,
      },
    ];
  }

  // Generic shock recommendations
  return [
    {
      id: 'rec_action_gen_1',
      action: 'Activate Standby Working Capital Line',
      why: 'Drawdown available buffer to offset sudden cash compression.',
      priority: 'CRITICAL',
      expectedEffect: 'Restores operating cash runway above 35 days.',
      projectedExposureReduction: 300000,
      resilienceBoost: 18,
      category: 'CREDIT_LINE',
      applied: false,
    },
    {
      id: 'rec_action_gen_2',
      action: 'Implement Immediate Discretionary Spend Freeze',
      why: 'Halts non-essential administrative and maintenance expenditures.',
      priority: 'HIGH',
      expectedEffect: 'Reduces monthly burn rate by ₹65,000.',
      projectedExposureReduction: 150000,
      resilienceBoost: 12,
      category: 'PROCUREMENT_DEFERRAL',
      applied: false,
    },
  ];
};
