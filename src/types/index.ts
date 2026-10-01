// FINSHIELD Data Models & TypeScript Contracts

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Company {
  id: string;
  name: string;
  industry: string;
  operatingCity: string;
  cashBalance: number; // in INR
  minimumCashReserve: number; // e.g., ₹3,00,000
  monthlyOperatingCost: number; // ₹5,20,000
  dailyBurnRate: number;
}

export interface Customer {
  id: string;
  name: string;
  receivableAmount: number;
  expectedPaymentDate: string; // ISO date
  paymentReliabilityScore: number; // 0 - 100
  historicalDelayDays: number;
  criticality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Receivable {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  invoiceNumber: string;
  dueDate: string;
  expectedDate: string;
  isOverdue: boolean;
  overdueDays: number;
}

export interface Supplier {
  id: string;
  name: string;
  payableAmount: number;
  dueDate: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  suppliesCategory: string; // e.g., "Alloy Rods", "Tooling Inserts"
  creditTermsDays: number;
  leadTimeDays: number;
}

export interface Payable {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  dueDate: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'RAW_MATERIAL' | 'UTILITIES' | 'LOGISTICS' | 'EQUIPMENT';
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  value: number;
  stockUnits: number;
  coverageDays: number;
  minimumThresholdDays: number;
  criticalMaterialDependency: string; // Linked supplier id
}

export interface OperationMetric {
  monthlyFixedCost: number;
  productionCapacityUtilized: number; // e.g., 85%
  workerCount: number;
  activeOrdersValue: number;
  dailyProductionValue: number;
}

export interface Loan {
  id: string;
  bankName: string;
  facilityType: 'TERM_LOAN' | 'WORKING_CAPITAL_OD';
  principalBalance: number;
  monthlyEMI: number;
  interestRate: number;
  nextEmiDate: string;
}

export interface CashPoint {
  date: string;
  displayDate: string;
  baselineCash: number;
  simulatedCash: number;
  safeReserve: number;
  netFlow: number;
  isHistorical: boolean;
}

export type ScenarioType = 
  | 'CUSTOMER_DELAY'
  | 'REVENUE_DROP'
  | 'SUPPLIER_COST_INCREASE'
  | 'UNEXPECTED_EXPENSE'
  | 'SUPPLIER_DISRUPTION'
  | 'LOAN_EMI_INCREASE';

export interface ScenarioConfig {
  type: ScenarioType;
  title: string;
  customerId?: string;
  supplierId?: string;
  delayedAmount: number;
  delayDurationDays: number;
  percentageChange?: number; // For revenue drop or cost increase
  unexpectedExpenseAmount?: number;
  interestRateBumpPercent?: number;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
}

export interface RiskBreakdown {
  score: number; // 0 - 100
  level: RiskLevel;
  primaryDrivers: string[];
}

export interface RiskAssessment {
  liquidityRisk: RiskBreakdown;
  supplierRisk: RiskBreakdown;
  inventoryRisk: RiskBreakdown;
  productionRisk: RiskBreakdown;
  resilienceScore: number; // 0 - 100 (weighted average of inverse risks)
  cashRunwayDays: number;
  daysOfWarning: number; // Projected days until liquidity buffer breached
  criticalAlertCount: number;
  explanation: {
    title: string;
    why: string[];
    whatHappensNext: string;
    whatShouldDo: string;
  };
}

export interface CascadeStep {
  step: number;
  entity: 'CUSTOMER' | 'RECEIVABLE' | 'CASH' | 'SUPPLIER' | 'INVENTORY' | 'PRODUCTION' | 'OPERATIONS';
  title: string;
  description: string;
  status: 'DELAYED' | 'HIGH RISK' | 'AT RISK' | 'MEDIUM RISK' | 'HALTED' | 'HEALTHY';
  timeframe: string;
  financialImpact: number;
}

export interface EarlyWarningAlert {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  cause: string;
  affectedComponent: string;
  estimatedTimeToImpactDays: number;
  recommendedAction: string;
}

export interface Recommendation {
  id: string;
  action: string;
  why: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  expectedEffect: string;
  projectedExposureReduction: number; // in INR
  resilienceBoost: number; // score points
  category: 'RECEIVABLE_ACCELERATION' | 'SUPPLIER_TERMS' | 'PROCUREMENT_DEFERRAL' | 'CREDIT_LINE' | 'DISCOUNTING';
  applied: boolean;
}

export interface SimulationResult {
  scenario: ScenarioConfig;
  baselineCashSeries: CashPoint[];
  simulatedCashSeries: CashPoint[];
  risks: RiskAssessment;
  earlyWarnings: EarlyWarningAlert[];
  cascadeSteps: CascadeStep[];
  affectedNodeIds: string[];
  cashExposure: number; // e.g. shortfall amount
  dangerZoneBreached: boolean;
  breachDate?: string;
  daysOfWarning: number;
}

export interface InterventionComparison {
  beforeRisks: RiskAssessment;
  afterRisks: RiskAssessment;
  beforeCashExposure: number;
  afterCashExposure: number;
  exposureReduced: number;
  resilienceScoreGain: number;
  appliedRecommendations: Recommendation[];
}

export interface MSMEDataSet {
  company: Company;
  customers: Customer[];
  receivables: Receivable[];
  suppliers: Supplier[];
  payables: Payable[];
  inventory: InventoryItem[];
  loans: Loan[];
  operations: OperationMetric;
  lastUpdated: string;
  isCustomUploaded: boolean;
  dataSourcesSummary?: {
    filesCount: number;
    recordsCount: number;
    formats: string[];
    needsReviewCount: number;
    qualityScore: number;
    lastUpdated: string;
  };
}

// Multi-Format Ingestion Contracts
export type DocumentFormat = 'IMAGE' | 'PDF' | 'DOCX' | 'CSV';

export type ExtractionStatus = 
  | 'PENDING' 
  | 'DETECTING' 
  | 'EXTRACTING' 
  | 'PARSING' 
  | 'NORMALIZING' 
  | 'VALIDATING' 
  | 'COMPLETED' 
  | 'ERROR';

export type ConfidenceTier = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ExtractedField {
  id: string;
  field: string;
  displayName: string;
  value: string | number | null;
  normalizedValue?: string | number;
  confidence: number; // 0.00 to 1.00
  confidenceTier: ConfidenceTier;
  sourceFile: string;
  sourceLocation: string; // e.g., "Page 2", "Row 128", "Table 2 Row 6", "OCR Block #3"
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  isDuplicate?: boolean;
  duplicateDetails?: string;
  matchedEntityId?: string;
  matchedEntityName?: string;
  matchedConfidence?: number;
  targetEntityType: 'CUSTOMER' | 'RECEIVABLE' | 'SUPPLIER' | 'PAYABLE' | 'INVENTORY' | 'TRANSACTION' | 'LOAN';
}

export interface ProcessedFile {
  id: string;
  fileName: string;
  fileSize: number;
  format: DocumentFormat;
  uploadedAt: string;
  status: ExtractionStatus;
  progress: number;
  stageMessage: string;
  recordsCount: number;
  highConfidenceCount: number;
  needsReviewCount: number;
  extractedFields: ExtractedField[];
  rawTextPreview?: string;
  warnings: string[];
  errorMessage?: string;
}

export interface EntityMatch {
  id: string;
  originalName: string;
  matchedName: string;
  confidence: number;
  entityType: 'CUSTOMER' | 'SUPPLIER';
  status: 'PENDING' | 'MERGED' | 'KEPT_SEPARATE';
}

export interface DuplicateRecordAlert {
  id: string;
  recordIdentifier: string; // e.g. "INV-2026-089"
  entityName: string;
  amount: number;
  date: string;
  sourceA: string;
  sourceB: string;
  status: 'PENDING' | 'SKIPPED' | 'IMPORTED';
}

export interface DataQualityReport {
  score: number; // 0 - 100
  totalRecords: number;
  highConfidence: number;
  needsReview: number;
  unresolved: number;
  missingFieldsCount: number;
  lowConfidenceOcrCount: number;
  duplicatesCount: number;
  unmatchedEntitiesCount: number;
}

export interface DetectedScenarioSuggestion {
  id: string;
  title: string;
  category: string;
  description: string;
  targetEntity: string;
  exposureAmount: number;
  scenarioConfig: ScenarioConfig;
}

export interface ImportHistoryItem {
  id: string;
  fileName: string;
  format: DocumentFormat;
  date: string;
  recordsExtracted: number;
  recordsAccepted: number;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
  warnings: string[];
}
