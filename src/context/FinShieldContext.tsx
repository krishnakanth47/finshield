import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  MSMEDataSet,
  ScenarioConfig,
  SimulationResult,
  Recommendation,
  InterventionComparison,
} from '../types';
import { INITIAL_MSME_DATA } from '../services/sampleData';
import { runSimulation, compareIntervention } from '../services/scenarioEngine';
import { generateRecommendations } from '../services/recommendationEngine';
import confetti from 'canvas-confetti';

interface FinShieldContextType {
  dataset: MSMEDataSet;
  scenario: ScenarioConfig | null;
  simulationResult: SimulationResult;
  recommendations: Recommendation[];
  interventionComparison: InterventionComparison | null;
  isIntervened: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Scenario actions
  setScenario: (scenario: ScenarioConfig | null) => void;
  simulateShock: (scenario: ScenarioConfig) => void;
  resetScenario: () => void;
  // Recommendation actions
  toggleRecommendation: (id: string) => void;
  applyAllRecommendations: () => void;
  resetRecommendations: () => void;
  // Data actions
  updateDataset: (updated: Partial<MSMEDataSet>) => void;
  resetToSampleData: () => void;
  // Guided Demo Tour
  isDemoTourActive: boolean;
  demoTourStep: number;
  startDemoTour: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  exitDemoTour: () => void;
}

const FinShieldContext = createContext<FinShieldContextType | undefined>(undefined);

export const FinShieldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataset, setDataset] = useState<MSMEDataSet>(INITIAL_MSME_DATA);
  const [scenario, setScenarioState] = useState<ScenarioConfig | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() =>
    generateRecommendations(INITIAL_MSME_DATA, undefined)
  );
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Guided demo tour state
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(false);
  const [demoTourStep, setDemoTourStep] = useState<number>(0);

  // Derived simulation result
  const simulationResult = useMemo(() => {
    return runSimulation(dataset, scenario || undefined, recommendations);
  }, [dataset, scenario, recommendations]);

  // Is at least one recommendation applied
  const isIntervened = useMemo(() => {
    return recommendations.some((r) => r.applied);
  }, [recommendations]);

  // Before vs After comparison
  const interventionComparison = useMemo(() => {
    if (!scenario) return null;
    return compareIntervention(dataset, scenario, recommendations);
  }, [dataset, scenario, recommendations]);

  const simulateShock = useCallback((newScenario: ScenarioConfig) => {
    setScenarioState(newScenario);
    // Generate fresh recommendations for this scenario
    const newRecs = generateRecommendations(dataset, newScenario);
    setRecommendations(newRecs);
  }, [dataset]);

  const resetScenario = useCallback(() => {
    setScenarioState(null);
    setRecommendations(generateRecommendations(dataset, undefined));
  }, [dataset]);

  const toggleRecommendation = useCallback((id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, applied: !rec.applied } : rec))
    );
  }, []);

  const applyAllRecommendations = useCallback(() => {
    setRecommendations((prev) => prev.map((rec) => ({ ...rec, applied: true })));
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0284c7', '#10b981', '#3b82f6'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const resetRecommendations = useCallback(() => {
    setRecommendations((prev) => prev.map((rec) => ({ ...rec, applied: false })));
  }, []);

  const updateDataset = useCallback((updated: Partial<MSMEDataSet>) => {
    setDataset((prev) => ({
      ...prev,
      ...updated,
      company: {
        ...prev.company,
        ...(updated.company || {}),
      },
    }));
  }, []);

  const resetToSampleData = useCallback(() => {
    setDataset(INITIAL_MSME_DATA);
    setScenarioState(null);
    setRecommendations(generateRecommendations(INITIAL_MSME_DATA, undefined));
  }, []);

  // Guided demo controls
  const startDemoTour = useCallback(() => {
    setIsDemoTourActive(true);
    setDemoTourStep(1);
    setActiveTab('dashboard');
    resetScenario();
  }, [resetScenario]);

  const exitDemoTour = useCallback(() => {
    setIsDemoTourActive(false);
    setDemoTourStep(0);
  }, []);

  const nextDemoStep = useCallback(() => {
    setDemoTourStep((current) => {
      const next = current + 1;
      if (next === 2) {
        // Step 2: Navigate to Digital Twin
        setActiveTab('digital-twin');
      } else if (next === 3) {
        // Step 3: Navigate to Simulate
        setActiveTab('simulate');
      } else if (next === 4) {
        // Step 4: Simulate Shock: Customer Payment delay ₹7L by 20 days
        simulateShock({
          type: 'CUSTOMER_DELAY',
          title: 'Customer Payment Delay',
          customerId: 'cust_apex',
          delayedAmount: 700000,
          delayDurationDays: 20,
          severity: 'SEVERE',
        });
        setActiveTab('simulate');
      } else if (next === 5) {
        // Step 5: Check Risk & Actions
        setActiveTab('actions');
      } else if (next === 6) {
        // Step 6: Apply interventions and show Before vs After comparison
        applyAllRecommendations();
        setActiveTab('simulate');
      } else if (next > 6) {
        setIsDemoTourActive(false);
        return 0;
      }
      return next;
    });
  }, [simulateShock, applyAllRecommendations]);

  const prevDemoStep = useCallback(() => {
    setDemoTourStep((current) => {
      const prev = Math.max(1, current - 1);
      if (prev === 1) setActiveTab('dashboard');
      if (prev === 2) setActiveTab('digital-twin');
      if (prev === 3) setActiveTab('simulate');
      if (prev === 4) setActiveTab('simulate');
      if (prev === 5) setActiveTab('actions');
      return prev;
    });
  }, []);

  return (
    <FinShieldContext.Provider
      value={{
        dataset,
        scenario,
        simulationResult,
        recommendations,
        interventionComparison,
        isIntervened,
        activeTab,
        setActiveTab,
        setScenario: setScenarioState,
        simulateShock,
        resetScenario,
        toggleRecommendation,
        applyAllRecommendations,
        resetRecommendations,
        updateDataset,
        resetToSampleData,
        isDemoTourActive,
        demoTourStep,
        startDemoTour,
        nextDemoStep,
        prevDemoStep,
        exitDemoTour,
      }}
    >
      {children}
    </FinShieldContext.Provider>
  );
};

export const useFinShield = () => {
  const context = useContext(FinShieldContext);
  if (!context) {
    throw new Error('useFinShield must be used within a FinShieldProvider');
  }
  return context;
};
