import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  MSMEDataSet,
  ScenarioConfig,
  SimulationResult,
  Recommendation,
  InterventionComparison,
  ProcessedFile,
  ExtractedField,
  DataQualityReport,
  DuplicateRecordAlert,
  EntityMatch,
  DetectedScenarioSuggestion,
  ImportHistoryItem,
} from '../types';
import { INITIAL_MSME_DATA } from '../services/sampleData';
import { runSimulation, compareIntervention } from '../services/scenarioEngine';
import { generateRecommendations } from '../services/recommendationEngine';
import { 
  processSingleFile, 
  commitApprovedFieldsToDataset, 
  detectScenarioSuggestions 
} from '../services/documentParser/multiFormatPipeline';
import { calculateDataQualityReport } from '../services/documentParser/confidenceEngine';
import { findEntityMatches } from '../services/documentParser/entityMatcher';
import { createSyntheticDemoFiles } from '../services/documentParser/sampleDocuments';
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
  // Multi-Format Ingestion State & Actions
  processedFiles: ProcessedFile[];
  isProcessingFiles: boolean;
  overallProgress: number;
  currentStage: string;
  extractedFields: ExtractedField[];
  dataQualityReport: DataQualityReport;
  duplicateAlerts: DuplicateRecordAlert[];
  entityMatches: EntityMatch[];
  scenarioSuggestions: DetectedScenarioSuggestion[];
  importHistory: ImportHistoryItem[];
  commitSuccessMessage: string | null;
  handleUploadFiles: (files: File[]) => Promise<void>;
  handleLoadMultiFormatDemoBundle: () => Promise<void>;
  updateFieldStatus: (fieldId: string, status: 'APPROVED' | 'REJECTED') => void;
  updateFieldValue: (fieldId: string, newValue: string | number) => void;
  approveAllHighConfidence: () => void;
  commitApprovedData: () => void;
  resolveDuplicate: (alertId: string, action: 'SKIPPED' | 'IMPORTED') => void;
  resolveEntityMatch: (matchId: string, action: 'MERGED' | 'KEPT_SEPARATE') => void;
  activateSuggestedScenario: (suggestion: DetectedScenarioSuggestion) => void;
  clearCommitSuccessMessage: () => void;
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

  // Multi-Format Ingestion State
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState<boolean>(false);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<string>('Ready for multi-format upload');
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [duplicateAlerts, setDuplicateAlerts] = useState<DuplicateRecordAlert[]>([]);
  const [entityMatches, setEntityMatches] = useState<EntityMatch[]>([]);
  const [scenarioSuggestions, setScenarioSuggestions] = useState<DetectedScenarioSuggestion[]>(() =>
    detectScenarioSuggestions(INITIAL_MSME_DATA)
  );
  const [commitSuccessMessage, setCommitSuccessMessage] = useState<string | null>(null);
  const [importHistory, setImportHistory] = useState<ImportHistoryItem[]>([
    {
      id: 'hist_init_1',
      fileName: 'bank_statement.csv',
      format: 'CSV',
      date: 'Today, 09:30 AM',
      recordsExtracted: 128,
      recordsAccepted: 128,
      status: 'SUCCESS',
      warnings: [],
    },
    {
      id: 'hist_init_2',
      fileName: 'sales_invoice.pdf',
      format: 'PDF',
      date: 'Today, 09:32 AM',
      recordsExtracted: 14,
      recordsAccepted: 14,
      status: 'SUCCESS',
      warnings: [],
    },
    {
      id: 'hist_init_3',
      fileName: 'supplier_report.docx',
      format: 'DOCX',
      date: 'Today, 09:35 AM',
      recordsExtracted: 8,
      recordsAccepted: 8,
      status: 'SUCCESS',
      warnings: [],
    },
  ]);

  // Derived Data Quality Report
  const dataQualityReport = useMemo(() => {
    return calculateDataQualityReport(extractedFields, duplicateAlerts.length, entityMatches.length);
  }, [extractedFields, duplicateAlerts.length, entityMatches.length]);

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
    setScenarioSuggestions(detectScenarioSuggestions(INITIAL_MSME_DATA));
  }, []);

  // Multi-Format Ingestion Processor
  const handleUploadFiles = useCallback(async (files: File[]) => {
    if (!files.length) return;
    setIsProcessingFiles(true);
    setOverallProgress(10);
    setCurrentStage(`Initiating ingestion pipeline for ${files.length} documents...`);

    const newProcessed: ProcessedFile[] = [];
    const allExtracted: ExtractedField[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const stepPct = Math.round(15 + ((i + 1) / files.length) * 75);
      setOverallProgress(stepPct);
      setCurrentStage(`Extracting fields from ${file.name}...`);

      const result = await processSingleFile(file, dataset, (_id, _p, msg) => {
        setCurrentStage(msg);
      });

      newProcessed.push(result);
      allExtracted.push(...result.extractedFields);
    }

    setOverallProgress(95);
    setCurrentStage('Detecting entity variations and cross-document duplicates...');

    // Detect Entity Matches
    const candidateEntities = allExtracted
      .filter((f) => f.field === 'customer_name' || f.field === 'supplier_name')
      .map((f) => ({
        name: String(f.value || ''),
        type: f.field === 'customer_name' ? ('CUSTOMER' as const) : ('SUPPLIER' as const),
      }))
      .filter((c) => c.name.length > 2);

    const matches = findEntityMatches(candidateEntities, dataset);
    setEntityMatches(matches);

    // Update state
    setProcessedFiles((prev) => [...prev, ...newProcessed]);
    setExtractedFields((prev) => [...prev, ...allExtracted]);

    // Record in history
    const newHistoryItems: ImportHistoryItem[] = newProcessed.map((pf) => ({
      id: `hist_${Date.now()}_${pf.id}`,
      fileName: pf.fileName,
      format: pf.format,
      date: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      recordsExtracted: pf.recordsCount,
      recordsAccepted: 0,
      status: pf.status === 'COMPLETED' ? 'SUCCESS' : 'ERROR',
      warnings: pf.warnings,
    }));
    setImportHistory((prev) => [...newHistoryItems, ...prev]);

    setOverallProgress(100);
    setCurrentStage(`Multi-format processing complete: ${allExtracted.length} fields awaiting review.`);
    setIsProcessingFiles(false);
  }, [dataset]);

  // Load Multi-Format Demo Bundle
  const handleLoadMultiFormatDemoBundle = useCallback(async () => {
    const demoFiles = createSyntheticDemoFiles();
    await handleUploadFiles(demoFiles);
  }, [handleUploadFiles]);

  const updateFieldStatus = useCallback((fieldId: string, status: 'APPROVED' | 'REJECTED') => {
    setExtractedFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, status } : f))
    );
  }, []);

  const updateFieldValue = useCallback((fieldId: string, newValue: string | number) => {
    setExtractedFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, value: newValue, normalizedValue: newValue } : f))
    );
  }, []);

  const approveAllHighConfidence = useCallback(() => {
    setExtractedFields((prev) =>
      prev.map((f) => (f.confidence >= 0.85 ? { ...f, status: 'APPROVED' } : f))
    );
  }, []);

  const commitApprovedData = useCallback(() => {
    const approved = extractedFields.filter((f) => f.status === 'APPROVED');
    if (approved.length === 0) return;

    const updated = commitApprovedFieldsToDataset(approved, dataset, processedFiles);
    setDataset(updated);

    // Update scenario suggestions
    const newSuggestions = detectScenarioSuggestions(updated);
    setScenarioSuggestions(newSuggestions);

    // Update import history accepted counts
    setImportHistory((prev) =>
      prev.map((item) => ({ ...item, recordsAccepted: item.recordsExtracted }))
    );

    setCommitSuccessMessage(
      `Financial Digital Twin updated: Ingested ${approved.length} approved records across ${processedFiles.length} multi-format documents.`
    );

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#10b981', '#f59e0b'],
      });
    } catch {
      // Confetti fallback
    }
  }, [extractedFields, dataset, processedFiles]);

  const resolveDuplicate = useCallback((alertId: string, action: 'SKIPPED' | 'IMPORTED') => {
    setDuplicateAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: action } : a))
    );
  }, []);

  const resolveEntityMatch = useCallback((matchId: string, action: 'MERGED' | 'KEPT_SEPARATE') => {
    setEntityMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, status: action } : m))
    );
  }, []);

  const activateSuggestedScenario = useCallback((suggestion: DetectedScenarioSuggestion) => {
    simulateShock(suggestion.scenarioConfig);
    setActiveTab('simulate');
  }, [simulateShock]);

  const clearCommitSuccessMessage = useCallback(() => {
    setCommitSuccessMessage(null);
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
        setActiveTab('digital-twin');
      } else if (next === 3) {
        setActiveTab('data');
      } else if (next === 4) {
        setActiveTab('simulate');
        simulateShock({
          type: 'CUSTOMER_DELAY',
          title: 'Customer Payment Delay',
          customerId: 'cust_apex',
          delayedAmount: 700000,
          delayDurationDays: 20,
          severity: 'SEVERE',
        });
      } else if (next === 5) {
        setActiveTab('actions');
      } else if (next === 6) {
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
      if (prev === 3) setActiveTab('data');
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
        // Multi-format ingestion
        processedFiles,
        isProcessingFiles,
        overallProgress,
        currentStage,
        extractedFields,
        dataQualityReport,
        duplicateAlerts,
        entityMatches,
        scenarioSuggestions,
        importHistory,
        commitSuccessMessage,
        handleUploadFiles,
        handleLoadMultiFormatDemoBundle,
        updateFieldStatus,
        updateFieldValue,
        approveAllHighConfidence,
        commitApprovedData,
        resolveDuplicate,
        resolveEntityMatch,
        activateSuggestedScenario,
        clearCommitSuccessMessage,
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
