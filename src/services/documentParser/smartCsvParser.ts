import { ExtractedField } from '../../types';
import { normalizeCurrency, normalizeDate } from './normalizer';
import { getConfidenceTier } from './confidenceEngine';

export interface ColumnMapping {
  csvHeader: string;
  mappedField: string;
  displayName: string;
  confidence: number;
}

export interface SmartCSVResult {
  mappings: ColumnMapping[];
  rowCount: number;
  fields: ExtractedField[];
  warnings: string[];
}

export const parseSmartCSV = (csvContent: string, fileName: string): SmartCSVResult => {
  const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const warnings: string[] = [];
  const fields: ExtractedField[] = [];
  const mappings: ColumnMapping[] = [];

  if (lines.length < 2) {
    return {
      mappings: [],
      rowCount: 0,
      fields: [],
      warnings: ['CSV file contains no data rows.'],
    };
  }

  const rawHeaders = lines[0].split(',').map((h) => h.trim());
  const normalizedHeaders = rawHeaders.map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, ''));

  // Check if this is the finshield_master_dataset schema
  // record_type,entity_id,name_or_item,category_or_type,date_or_due,amount_or_valuation_inr,status_or_metrics
  const isFinShieldMaster = 
    normalizedHeaders.includes('record_type') && 
    (normalizedHeaders.includes('name_or_item') || normalizedHeaders.includes('entity_id'));

  if (isFinShieldMaster) {
    let rowCount = 0;
    const headerIndices: Record<string, number> = {};
    normalizedHeaders.forEach((h, idx) => {
      headerIndices[h] = idx;
    });

    mappings.push(
      { csvHeader: 'record_type', mappedField: 'record_type', displayName: 'Entity Category Type', confidence: 1.0 },
      { csvHeader: 'entity_id', mappedField: 'entity_id', displayName: 'Reference / Invoice ID', confidence: 0.99 },
      { csvHeader: 'name_or_item', mappedField: 'name_or_item', displayName: 'Counterparty / Asset Name', confidence: 0.98 },
      { csvHeader: 'category_or_type', mappedField: 'category_or_type', displayName: 'Classification', confidence: 0.95 },
      { csvHeader: 'date_or_due', mappedField: 'due_date', displayName: 'Maturity / Event Date', confidence: 0.97 },
      { csvHeader: 'amount_or_valuation_inr', mappedField: 'amount', displayName: 'Financial Value (INR)', confidence: 0.99 },
      { csvHeader: 'status_or_metrics', mappedField: 'status_or_metrics', displayName: 'Risk / Operational Metrics', confidence: 0.94 }
    );

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map((c) => c.trim());
      if (row.length < 3) continue;
      rowCount++;

      const recType = (row[headerIndices['record_type']] || '').toUpperCase();
      const entityId = row[headerIndices['entity_id']] || `ID-${i}`;
      const nameOrItem = row[headerIndices['name_or_item']] || 'Unknown Entity';
      const category = row[headerIndices['category_or_type']] || '';
      const dateStr = row[headerIndices['date_or_due']] || '';
      const amountRaw = row[headerIndices['amount_or_valuation_inr']] || '0';
      const statusOrMetric = row[headerIndices['status_or_metrics']] || '';

      const normAmount = normalizeCurrency(amountRaw).amount || parseFloat(amountRaw.replace(/[^\d.]/g, '')) || 0;
      const normDate = normalizeDate(dateStr) || dateStr;

      // Map target entity type
      let targetEntity: 'RECEIVABLE' | 'CUSTOMER' | 'SUPPLIER' | 'PAYABLE' | 'INVENTORY' | 'LOAN' | 'TRANSACTION' = 'RECEIVABLE';
      if (recType.includes('RECEIVABLE')) targetEntity = 'RECEIVABLE';
      else if (recType.includes('PAYABLE')) targetEntity = 'PAYABLE';
      else if (recType.includes('INVENTORY')) targetEntity = 'INVENTORY';
      else if (recType.includes('LOAN')) targetEntity = 'LOAN';
      else if (recType.includes('TRANSACTION')) targetEntity = 'TRANSACTION';

      // 1. Entity / Name Field
      fields.push({
        id: `csv_ms_${i}_name`,
        field: recType.includes('PAYABLE') ? 'supplier_name' : recType.includes('RECEIVABLE') ? 'customer_name' : 'entity_name',
        displayName: recType.includes('PAYABLE') ? 'Supplier Name' : recType.includes('RECEIVABLE') ? 'Customer Name' : 'Asset / Entity',
        value: nameOrItem,
        confidence: 0.98,
        confidenceTier: 'HIGH',
        sourceFile: fileName,
        sourceLocation: `Row ${i} (${recType})`,
        status: 'APPROVED',
        targetEntityType: targetEntity,
      });

      // 2. Reference / Invoice ID
      fields.push({
        id: `csv_ms_${i}_id`,
        field: recType.includes('PAYABLE') ? 'payable_id' : recType.includes('RECEIVABLE') ? 'invoice_number' : 'reference_id',
        displayName: recType.includes('RECEIVABLE') ? 'Invoice ID' : 'Reference / Obligation ID',
        value: entityId,
        confidence: 0.99,
        confidenceTier: 'HIGH',
        sourceFile: fileName,
        sourceLocation: `Row ${i} (${recType})`,
        status: 'APPROVED',
        targetEntityType: targetEntity,
      });

      // 3. Amount Field
      fields.push({
        id: `csv_ms_${i}_amt`,
        field: recType.includes('PAYABLE') ? 'payable_amount' : recType.includes('RECEIVABLE') ? 'invoice_amount' : recType.includes('INVENTORY') ? 'inventory_value' : 'amount',
        displayName: recType.includes('INVENTORY') ? 'Valuation (INR)' : 'Amount (INR)',
        value: normAmount,
        normalizedValue: normAmount,
        confidence: 0.99,
        confidenceTier: 'HIGH',
        sourceFile: fileName,
        sourceLocation: `Row ${i} (${recType})`,
        status: 'APPROVED',
        targetEntityType: targetEntity,
      });

      // 4. Due Date
      if (normDate) {
        fields.push({
          id: `csv_ms_${i}_date`,
          field: 'due_date',
          displayName: 'Due / Event Date',
          value: normDate,
          normalizedValue: normDate,
          confidence: 0.97,
          confidenceTier: 'HIGH',
          sourceFile: fileName,
          sourceLocation: `Row ${i} (${recType})`,
          status: 'APPROVED',
          targetEntityType: targetEntity,
        });
      }

      // 5. Status / Metric
      if (statusOrMetric) {
        fields.push({
          id: `csv_ms_${i}_status`,
          field: 'status_or_metrics',
          displayName: 'Risk / Status Tag',
          value: statusOrMetric,
          confidence: 0.95,
          confidenceTier: 'HIGH',
          sourceFile: fileName,
          sourceLocation: `Row ${i} (${recType})`,
          status: 'APPROVED',
          targetEntityType: targetEntity,
        });
      }
    }

    return {
      mappings,
      rowCount,
      fields,
      warnings,
    };
  }

  // Standard Generic Heuristic Column Mapping Fallback
  const headerAliases: Record<string, { field: string; displayName: string; target: 'CUSTOMER' | 'RECEIVABLE' | 'SUPPLIER' | 'PAYABLE' | 'TRANSACTION' | 'INVENTORY' | 'LOAN' }> = {
    customer: { field: 'customer_name', displayName: 'Customer', target: 'CUSTOMER' },
    customername: { field: 'customer_name', displayName: 'Customer', target: 'CUSTOMER' },
    client: { field: 'customer_name', displayName: 'Customer', target: 'CUSTOMER' },
    buyer: { field: 'customer_name', displayName: 'Customer', target: 'CUSTOMER' },
    supplier: { field: 'supplier_name', displayName: 'Supplier', target: 'SUPPLIER' },
    suppliername: { field: 'supplier_name', displayName: 'Supplier', target: 'SUPPLIER' },
    vendor: { field: 'supplier_name', displayName: 'Supplier', target: 'SUPPLIER' },
    vendorname: { field: 'supplier_name', displayName: 'Supplier', target: 'SUPPLIER' },
    invoicenumber: { field: 'invoice_number', displayName: 'Invoice Number', target: 'RECEIVABLE' },
    inv_number: { field: 'invoice_number', displayName: 'Invoice Number', target: 'RECEIVABLE' },
    invnumber: { field: 'invoice_number', displayName: 'Invoice Number', target: 'RECEIVABLE' },
    inv_no: { field: 'invoice_number', displayName: 'Invoice Number', target: 'RECEIVABLE' },
    invoiceid: { field: 'invoice_number', displayName: 'Invoice Number', target: 'RECEIVABLE' },
    amount: { field: 'invoice_amount', displayName: 'Amount', target: 'RECEIVABLE' },
    invoiceamount: { field: 'invoice_amount', displayName: 'Amount', target: 'RECEIVABLE' },
    payableamount: { field: 'payable_amount', displayName: 'Payable Amount', target: 'PAYABLE' },
    duedate: { field: 'due_date', displayName: 'Due Date', target: 'RECEIVABLE' },
    date: { field: 'transaction_date', displayName: 'Date', target: 'TRANSACTION' },
  };

  const detectedColumns: { index: number; field: string; displayName: string; target: 'CUSTOMER' | 'RECEIVABLE' | 'SUPPLIER' | 'PAYABLE' | 'TRANSACTION' | 'INVENTORY' | 'LOAN' }[] = [];

  rawHeaders.forEach((rawH, idx) => {
    const key = rawH.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const matched = headerAliases[key];
    if (matched) {
      detectedColumns.push({ index: idx, ...matched });
      mappings.push({
        csvHeader: rawH,
        mappedField: matched.field,
        displayName: matched.displayName,
        confidence: 0.98,
      });
    } else {
      mappings.push({
        csvHeader: rawH,
        mappedField: 'custom_field',
        displayName: rawH,
        confidence: 0.65,
      });
    }
  });

  let rowCount = 0;
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map((c) => c.trim());
    if (row.length < 2) continue;
    rowCount++;

    detectedColumns.forEach((col) => {
      const cellVal = row[col.index];
      if (!cellVal) return;

      let processedVal: string | number = cellVal;
      let normVal: string | number | undefined = undefined;
      let conf = 0.95;

      if (col.field.includes('amount') || col.field.includes('total') || col.field.includes('value')) {
        const norm = normalizeCurrency(cellVal);
        if (norm.amount !== null) {
          processedVal = norm.amount;
          normVal = norm.amount;
        } else {
          conf = 0.62;
        }
      } else if (col.field.includes('date')) {
        const normD = normalizeDate(cellVal);
        if (normD) {
          processedVal = normD;
          normVal = normD;
        } else {
          conf = 0.70;
        }
      }

      fields.push({
        id: `csv_${Date.now()}_${i}_${col.index}`,
        field: col.field,
        displayName: col.displayName,
        value: processedVal,
        normalizedValue: normVal,
        confidence: conf,
        confidenceTier: getConfidenceTier(conf),
        sourceFile: fileName,
        sourceLocation: `Row ${i}`,
        status: 'PENDING',
        targetEntityType: col.target,
      });
    });
  }

  return {
    mappings,
    rowCount,
    fields,
    warnings,
  };
};
