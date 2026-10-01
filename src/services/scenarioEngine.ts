import {
  MSMEDataSet,
  ScenarioConfig,
  SimulationResult,
  Recommendation,
  InterventionComparison,
} from '../types';
import { generateCashForecast } from './forecastEngine';
import { computeRiskAssessment } from './riskEngine';
import { detectEarlyWarnings } from './anomalyEngine';
import { generateRecommendations } from './recommendationEngine';
import { generateCascadeSteps } from './dependencyEngine';

export const runSimulation = (
  dataset: MSMEDataSet,
  scenario?: ScenarioConfig,
  appliedRecommendations: Recommendation[] = []
): SimulationResult => {
  // 1. Forecast cash trajectories
  const forecast = generateCashForecast({
    dataset,
    scenario,
    appliedRecommendations,
  });

  // 2. Compute risks
  const risks = computeRiskAssessment({
    dataset,
    scenario,
    daysOfWarning: forecast.daysOfWarning,
    minimumCashReached: forecast.minimumCashReached,
    dangerZoneBreached: forecast.dangerZoneBreached,
    appliedRecommendations,
  });

  // 3. Detect early warnings
  const earlyWarnings = detectEarlyWarnings(
    dataset,
    scenario,
    risks,
    forecast.breachDate,
    forecast.daysOfWarning
  );

  // 4. Cascade steps
  const cascadeSteps = generateCascadeSteps(scenario, risks);

  // Affected nodes
  const affectedNodeIds = scenario
    ? ['node-customer', 'node-receivable', 'node-cash', 'node-supplier', 'node-inventory', 'node-production']
    : [];

  return {
    scenario: scenario || {
      type: 'CUSTOMER_DELAY',
      title: 'Baseline Healthy State',
      delayedAmount: 0,
      delayDurationDays: 0,
      severity: 'MILD',
    },
    baselineCashSeries: forecast.series,
    simulatedCashSeries: forecast.series,
    risks,
    earlyWarnings,
    cascadeSteps,
    affectedNodeIds,
    cashExposure: forecast.exposureAmount,
    dangerZoneBreached: forecast.dangerZoneBreached,
    breachDate: forecast.breachDate,
    daysOfWarning: forecast.daysOfWarning,
  };
};

export const compareIntervention = (
  dataset: MSMEDataSet,
  scenario: ScenarioConfig,
  appliedRecommendations: Recommendation[]
): InterventionComparison => {
  // Unmitigated shock
  const beforeResult = runSimulation(dataset, scenario, []);
  
  // Mitigated shock with active interventions
  const afterResult = runSimulation(dataset, scenario, appliedRecommendations);

  const exposureReduced = Math.max(0, beforeResult.cashExposure - afterResult.cashExposure);
  const resilienceScoreGain = afterResult.risks.resilienceScore - beforeResult.risks.resilienceScore;

  return {
    beforeRisks: beforeResult.risks,
    afterRisks: afterResult.risks,
    beforeCashExposure: beforeResult.cashExposure,
    afterCashExposure: afterResult.cashExposure,
    exposureReduced,
    resilienceScoreGain,
    appliedRecommendations,
  };
};
