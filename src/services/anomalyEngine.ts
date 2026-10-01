import { MSMEDataSet, EarlyWarningAlert, ScenarioConfig, RiskAssessment } from '../types';

export const detectEarlyWarnings = (
  dataset: MSMEDataSet,
  scenario?: ScenarioConfig,
  risks?: RiskAssessment,
  breachDate?: string,
  daysOfWarning = 21
): EarlyWarningAlert[] => {
  const alerts: EarlyWarningAlert[] = [];

  if (!scenario) {
    // Baseline checks
    alerts.push({
      id: 'alrt_base_1',
      priority: 'LOW',
      title: 'Healthy Liquidity Runway',
      cause: 'Current cash balance (₹8.2L) and upcoming receivables satisfy near-term commitments.',
      affectedComponent: 'Cash & Working Capital',
      estimatedTimeToImpactDays: 41,
      recommendedAction: 'Continue scheduled collections from Apex Auto Systems and Delta Industrial.',
    });
    alerts.push({
      id: 'alrt_base_2',
      priority: 'MEDIUM',
      title: 'Customer Concentration Exposure',
      cause: 'Apex Auto Systems accounts for 60.8% of total outstanding receivables (₹7.0L of ₹11.5L).',
      affectedComponent: 'Receivables Portfolio',
      estimatedTimeToImpactDays: 30,
      recommendedAction: 'Diversify sales pipeline and explore non-recourse invoice discounting.',
    });
    return alerts;
  }

  // Shock scenario alerts
  if (scenario.type === 'CUSTOMER_DELAY') {
    alerts.push({
      id: 'alrt_shock_1',
      priority: 'CRITICAL',
      title: 'Projected Liquidity Deficit',
      cause: `${scenario.delayedAmount ? `₹${(scenario.delayedAmount / 100000).toFixed(1)}L` : 'Payment'} delay by largest customer creates cash breach below ₹3.0L safe reserve.`,
      affectedComponent: 'Cash Reserves',
      estimatedTimeToImpactDays: daysOfWarning,
      recommendedAction: 'Accelerate collection via bill discounting or utilize standby credit line.',
    });

    alerts.push({
      id: 'alrt_shock_2',
      priority: 'HIGH',
      title: 'Critical Supplier Default Risk',
      cause: 'SteelWorks India Ltd payable of ₹4.1L due in 10 days cannot be settled without receivable cash.',
      affectedComponent: 'Supplier Obligations (SteelWorks India)',
      estimatedTimeToImpactDays: 10,
      recommendedAction: 'Negotiate 15-day payment extension on non-critical suppliers to preserve cash for raw steel.',
    });

    alerts.push({
      id: 'alrt_shock_3',
      priority: 'HIGH',
      title: 'Alloy Steel Stockout Threat',
      cause: 'Inventory coverage (22 days) drops below 10-day safety limit if raw material delivery is held.',
      affectedComponent: 'Inventory (EN8 Forged Billets)',
      estimatedTimeToImpactDays: 18,
      recommendedAction: 'Defer low-priority fastener procurement and protect critical alloy billets order.',
    });

    alerts.push({
      id: 'alrt_shock_4',
      priority: 'MEDIUM',
      title: 'Production Line Disruption Warning',
      cause: 'Material starvation will force shutdown of CNC Turning lines, threatening ₹14.2L active order deliveries.',
      affectedComponent: 'Plant Operations & Order Fulfillment',
      estimatedTimeToImpactDays: 21,
      recommendedAction: 'Re-sequence assembly line to work on alternative backlog items.',
    });
  } else if (scenario.type === 'REVENUE_DROP') {
    alerts.push({
      id: 'alrt_shock_rev',
      priority: 'CRITICAL',
      title: 'Structural Revenue Erosion',
      cause: `${scenario.percentageChange || 30}% sudden drop in sales inflows while fixed costs remain constant.`,
      affectedComponent: 'Operating Cash Flow',
      estimatedTimeToImpactDays: 14,
      recommendedAction: 'Cut discretionary SG&A and activate secondary marketing channels.',
    });
  } else if (scenario.type === 'UNEXPECTED_EXPENSE') {
    alerts.push({
      id: 'alrt_shock_exp',
      priority: 'HIGH',
      title: 'Sudden Cash Drain',
      cause: `Unplanned expenditure of ₹${((scenario.unexpectedExpenseAmount || 250000) / 100000).toFixed(1)}L depletes liquidity buffer.`,
      affectedComponent: 'Cash Reserves',
      estimatedTimeToImpactDays: 7,
      recommendedAction: 'Drawdown short-term working capital overdraft.',
    });
  } else {
    alerts.push({
      id: 'alrt_shock_gen',
      priority: 'HIGH',
      title: 'Operational Stress Detected',
      cause: 'External shock parameters exceed baseline resilience tolerance.',
      affectedComponent: 'Working Capital',
      estimatedTimeToImpactDays: 15,
      recommendedAction: 'Review prioritized AI Prevention Plan.',
    });
  }

  return alerts;
};
