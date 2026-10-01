import { 
  DocumentFormat, 
  ExtractedField, 
  ProcessedFile, 
  MSMEDataSet, 
  EntityMatch, 
  DuplicateRecordAlert,
  DetectedScenarioSuggestion,
  Customer,
  Receivable,
  Supplier,
  Payable,
  InventoryItem
} from '../../types';
import { detectFileFormat } from './fileDetector';
import { extractFromImage } from './ocrService';
import { extractFromPDF } from './pdfParser';
import { extractFromDOCX } from './docxParser';
import { parseSmartCSV } from './smartCsvParser';
import { calculateDataQualityReport } from './confidenceEngine';
import { detectDuplicates } from './duplicateEngine';
import { findEntityMatches } from './entityMatcher';

export interface PipelineProgressCallback {
  (fileId: string, progress: number, stageMessage: string): void;
}

export const processSingleFile = async (
  file: File,
  dataset: MSMEDataSet,
  onProgress?: PipelineProgressCallback
): Promise<ProcessedFile> => {
  const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const detection = detectFileFormat(file.name, file.type);

  if (!detection.isValid || !detection.format) {
    return {
      id: fileId,
      fileName: file.name,
      fileSize: file.size,
      format: 'PDF',
      uploadedAt: new Date().toISOString(),
      status: 'ERROR',
      progress: 0,
      stageMessage: detection.errorMessage || 'Unsupported file format',
      recordsCount: 0,
      highConfidenceCount: 0,
      needsReviewCount: 0,
      extractedFields: [],
      warnings: [detection.errorMessage || 'File format not supported'],
      errorMessage: detection.errorMessage,
    };
  }

  const format = detection.format;
  onProgress?.(fileId, 15, `Detected ${format} format. Initializing extraction engine...`);

  let fields: ExtractedField[] = [];
  const warnings: string[] = [];
  let rawText = '';

  try {
    if (format === 'IMAGE') {
      onProgress?.(fileId, 40, 'Running image preprocessing & OCR field detection...');
      const res = await extractFromImage(file, file.name);
      fields = res.fields;
      warnings.push(...res.warnings);
      rawText = res.rawText;
    } else if (format === 'PDF') {
      onProgress?.(fileId, 45, 'Parsing PDF document stream & line items...');
      const res = await extractFromPDF(file, file.name);
      fields = res.fields;
      warnings.push(...res.warnings);
      rawText = res.rawText;
    } else if (format === 'DOCX') {
      onProgress?.(fileId, 50, 'Extracting Word report sections & tables...');
      const res = await extractFromDOCX(file, file.name);
      fields = res.fields;
      warnings.push(...res.warnings);
      rawText = res.rawText;
    } else if (format === 'CSV') {
      onProgress?.(fileId, 55, 'Executing schema mapping & column detection...');
      const text = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsText(file);
      });
      const res = parseSmartCSV(text, file.name);
      fields = res.fields;
      warnings.push(...res.warnings);
      rawText = text.slice(0, 500);
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Extraction failed';
    return {
      id: fileId,
      fileName: file.name,
      fileSize: file.size,
      format,
      uploadedAt: new Date().toISOString(),
      status: 'ERROR',
      progress: 0,
      stageMessage: 'Extraction failed: check document clarity or format.',
      recordsCount: 0,
      highConfidenceCount: 0,
      needsReviewCount: 0,
      extractedFields: [],
      warnings: [errorMsg],
      errorMessage: errorMsg,
    };
  }

  onProgress?.(fileId, 80, 'Normalizing financial entities and checking duplicates...');
  
  // Run duplicate check
  const dupResult = detectDuplicates(fields, dataset);
  fields = dupResult.flaggedFields;

  onProgress?.(fileId, 100, 'Extraction and confidence validation complete.');

  const highConf = fields.filter((f) => f.confidence >= 0.90).length;
  const needsRev = fields.filter((f) => f.confidence < 0.90).length;

  return {
    id: fileId,
    fileName: file.name,
    fileSize: file.size,
    format,
    uploadedAt: new Date().toISOString(),
    status: 'COMPLETED',
    progress: 100,
    stageMessage: `Successfully extracted ${fields.length} financial fields.`,
    recordsCount: fields.length,
    highConfidenceCount: highConf,
    needsReviewCount: needsRev,
    extractedFields: fields,
    rawTextPreview: rawText.slice(0, 300),
    warnings,
  };
};

export const commitApprovedFieldsToDataset = (
  approvedFields: ExtractedField[],
  currentDataset: MSMEDataSet,
  processedFiles: ProcessedFile[]
): MSMEDataSet => {
  const updated = { ...currentDataset };
  const newReceivables: Receivable[] = [...updated.receivables];
  const newCustomers: Customer[] = [...updated.customers];
  const newSuppliers: Supplier[] = [...updated.suppliers];
  const newPayables: Payable[] = [...updated.payables];
  const newInventory: InventoryItem[] = [...updated.inventory];

  // Group approved fields by source location to create coherent entities
  const groupedBySource = new Map<string, Record<string, string | number>>();
  approvedFields.forEach((f) => {
    if (f.status !== 'APPROVED') return;
    const groupKey = `${f.sourceFile}_${f.sourceLocation}`;
    if (!groupedBySource.has(groupKey)) {
      groupedBySource.set(groupKey, {});
    }
    const grp = groupedBySource.get(groupKey)!;
    grp[f.field] = f.normalizedValue !== undefined ? f.normalizedValue : (f.value || '');
  });

  groupedBySource.forEach((props, groupKey) => {
    // If Receivable / Invoice
    if (props['invoice_amount'] || props['amount']) {
      const amt = Number(props['invoice_amount'] || props['amount'] || 0);
      const custName = String(props['customer_name'] || props['entity_name'] || 'Apex Auto Systems Ltd');
      const invNum = String(props['invoice_number'] || `INV-EXT-${Math.floor(100 + Math.random() * 900)}`);
      const dueDate = String(props['due_date'] || new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0]);

      // Check if already in receivables
      const exists = newReceivables.some((r) => r.invoiceNumber === invNum && r.amount === amt);
      if (!exists && amt > 0) {
        let cust = newCustomers.find((c) => c.name.toLowerCase() === custName.toLowerCase());
        if (!cust) {
          const custId = `cust_ext_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
          cust = {
            id: custId,
            name: custName,
            receivableAmount: amt,
            expectedPaymentDate: dueDate,
            paymentReliabilityScore: 88,
            historicalDelayDays: 3,
            criticality: amt >= 500000 ? 'HIGH' : 'MEDIUM',
          };
          newCustomers.push(cust);
        } else {
          cust.receivableAmount += amt;
        }

        newReceivables.push({
          id: `rec_ext_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          customerId: cust.id,
          customerName: cust.name,
          amount: amt,
          invoiceNumber: invNum,
          dueDate,
          expectedDate: dueDate,
          isOverdue: false,
          overdueDays: 0,
        });
      }
    }

    // If Supplier / Payable
    if (props['payable_amount']) {
      const payAmt = Number(props['payable_amount'] || 0);
      const supName = String(props['supplier_name'] || 'SteelWorks India Ltd');
      const dueDate = String(props['due_date'] || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
      const criticality = (String(props['supplier_criticality'] || 'CRITICAL').toUpperCase() as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW');

      let sup = newSuppliers.find((s) => s.name.toLowerCase() === supName.toLowerCase());
      if (!sup) {
        const supId = `sup_ext_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
        sup = {
          id: supId,
          name: supName,
          payableAmount: payAmt,
          dueDate,
          criticality,
          suppliesCategory: 'Automotive Grade Steel Billets',
          creditTermsDays: 30,
          leadTimeDays: 14,
        };
        newSuppliers.push(sup);
      }

      newPayables.push({
        id: `pay_ext_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        supplierId: sup.id,
        supplierName: sup.name,
        amount: payAmt,
        dueDate,
        criticality,
        category: 'RAW_MATERIAL',
      });
    }

    // If Inventory
    if (props['inventory_value']) {
      const invVal = Number(props['inventory_value'] || 0);
      if (invVal > 0) {
        const exists = newInventory.some((i) => i.name.includes('Ingested Stock'));
        if (!exists) {
          newInventory.push({
            id: `inv_ext_${Date.now()}`,
            sku: 'SKU-EXT-STOCK',
            name: 'Ingested Raw Material Stock',
            value: invVal,
            stockUnits: Math.round(invVal / 500),
            coverageDays: 20,
            minimumThresholdDays: 14,
            criticalMaterialDependency: newSuppliers[0]?.id || 'sup_steelworks',
          });
        }
      }
    }
  });

  // Calculate Data Sources Summary
  const formatsSet = new Set<string>();
  let totalRecs = 0;
  processedFiles.forEach((pf) => {
    formatsSet.add(pf.format);
    totalRecs += pf.recordsCount;
  });

  const allFields = processedFiles.flatMap((pf) => pf.extractedFields);
  const quality = calculateDataQualityReport(allFields);

  return {
    ...updated,
    customers: newCustomers,
    receivables: newReceivables,
    suppliers: newSuppliers,
    payables: newPayables,
    inventory: newInventory,
    lastUpdated: new Date().toISOString(),
    isCustomUploaded: true,
    dataSourcesSummary: {
      filesCount: processedFiles.length,
      recordsCount: totalRecs || approvedFields.length,
      formats: Array.from(formatsSet),
      needsReviewCount: quality.needsReview,
      qualityScore: quality.score,
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  };
};

export const detectScenarioSuggestions = (dataset: MSMEDataSet): DetectedScenarioSuggestion[] => {
  const suggestions: DetectedScenarioSuggestion[] = [];

  // Suggestion 1: Largest Customer Delay
  const largestCustomer = [...dataset.customers].sort((a, b) => b.receivableAmount - a.receivableAmount)[0];
  if (largestCustomer) {
    suggestions.push({
      id: 'scen_sug_1',
      title: `${largestCustomer.name} Payment Delay`,
      category: 'Customer Concentration Shock',
      description: `${largestCustomer.name} accounts for ₹${(largestCustomer.receivableAmount / 100000).toFixed(1)}L of receivables. A 20-day collection delay risks liquidity buffer breach.`,
      targetEntity: largestCustomer.name,
      exposureAmount: largestCustomer.receivableAmount,
      scenarioConfig: {
        type: 'CUSTOMER_DELAY',
        title: `${largestCustomer.name} Payment Delay`,
        customerId: largestCustomer.id,
        delayedAmount: largestCustomer.receivableAmount,
        delayDurationDays: 20,
        severity: 'SEVERE',
      },
    });
  }

  // Suggestion 2: Critical Supplier Payable Default
  const criticalSup = dataset.suppliers.find((s) => s.criticality === 'CRITICAL') || dataset.suppliers[0];
  if (criticalSup) {
    suggestions.push({
      id: 'scen_sug_2',
      title: `${criticalSup.name} Raw Material Price Surge`,
      category: 'Supplier Price Surge Shock',
      description: `Critical dependency on ${criticalSup.suppliesCategory}. A 20% price surge increases working capital requirements.`,
      targetEntity: criticalSup.name,
      exposureAmount: Math.round(criticalSup.payableAmount * 0.20),
      scenarioConfig: {
        type: 'SUPPLIER_COST_INCREASE',
        title: `${criticalSup.name} Cost Surge (+20%)`,
        supplierId: criticalSup.id,
        delayedAmount: criticalSup.payableAmount,
        delayDurationDays: 15,
        percentageChange: 20,
        severity: 'MODERATE',
      },
    });
  }

  // Suggestion 3: General Sales Contraction
  suggestions.push({
    id: 'scen_sug_3',
    title: 'Macro Sales Inflow Drop (-30%)',
    category: 'Demand Contraction Shock',
    description: 'Models a 30% reduction across all customer purchases while fixed factory payroll burn continues.',
    targetEntity: 'All Customers',
    exposureAmount: Math.round(dataset.receivables.reduce((sum, r) => sum + r.amount, 0) * 0.30),
    scenarioConfig: {
      type: 'REVENUE_DROP',
      title: 'Sales Contraction Shock (-30%)',
      delayedAmount: 0,
      delayDurationDays: 30,
      percentageChange: 30,
      severity: 'SEVERE',
    },
  });

  return suggestions;
};
