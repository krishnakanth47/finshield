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

  // Heuristic Schema Mappings
  const headerAliases: Record<string, { field: string; displayName: string; target: 'CUSTOMER' | 'RECEIVABLE' | 'SUPPLIER' | 'PAYABLE' | 'TRANSACTION' }> = {
    // Customer
    customer: { field: 'customer_name', displayName: 'Customer', target: 'CUSTOMER' },
    customername: { field: 'customer_name', displayName: 'Customer', target: 'CUSTOMER' },
    client: { field: 'customer_name', displayName: 'Customer', target: 'CUSTOMER' },
    client_name: { field: 'customer_name', displayName: 'Customer', target: 'CUSTOMER' },
    buyer: { field: 'customer_name', displayName: 'Customer', target: 'CUSTOMER' },
    buyername: { field: 'customer_name', displayName: 'Customer', target: 'CUSTOMER' },

    // Supplier
    supplier: { field: 'supplier_name', displayName: 'Supplier', target: 'SUPPLIER' },
    suppliername: { field: 'supplier_name', displayName: 'Supplier', target: 'SUPPLIER' },
    vendor: { field: 'supplier_name', displayName: 'Supplier', target: 'SUPPLIER' },
    vendorname: { field: 'supplier_name', displayName: 'Supplier', target: 'SUPPLIER' },

    // Invoice
    invoicenumber: { field: 'invoice_number', displayName: 'Invoice Number', target: 'RECEIVABLE' },
    inv_number: { field: 'invoice_number', displayName: 'Invoice Number', target: 'RECEIVABLE' },
    invnumber: { field: 'invoice_number', displayName: 'Invoice Number', target: 'RECEIVABLE' },
    inv_no: { field: 'invoice_number', displayName: 'Invoice Number', target: 'RECEIVABLE' },
    invoice: { field: 'invoice_number', displayName: 'Invoice Number', target: 'RECEIVABLE' },
    bill_no: { field: 'invoice_number', displayName: 'Invoice Number', target: 'RECEIVABLE' },

    // Amount
    amount: { field: 'invoice_amount', displayName: 'Amount', target: 'RECEIVABLE' },
    invoiceamount: { field: 'invoice_amount', displayName: 'Amount', target: 'RECEIVABLE' },
    inv_total: { field: 'invoice_amount', displayName: 'Amount', target: 'RECEIVABLE' },
    total: { field: 'invoice_amount', displayName: 'Amount', target: 'RECEIVABLE' },
    value: { field: 'invoice_amount', displayName: 'Amount', target: 'RECEIVABLE' },
    balance: { field: 'invoice_amount', displayName: 'Amount', target: 'RECEIVABLE' },
    receivableamount: { field: 'invoice_amount', displayName: 'Amount', target: 'RECEIVABLE' },
    payableamount: { field: 'payable_amount', displayName: 'Payable Amount', target: 'PAYABLE' },

    // Dates
    duedate: { field: 'due_date', displayName: 'Due Date', target: 'RECEIVABLE' },
    due: { field: 'due_date', displayName: 'Due Date', target: 'RECEIVABLE' },
    expecteddate: { field: 'due_date', displayName: 'Due Date', target: 'RECEIVABLE' },
    paymentdate: { field: 'due_date', displayName: 'Due Date', target: 'RECEIVABLE' },
    date: { field: 'transaction_date', displayName: 'Date', target: 'TRANSACTION' },
    invoicedate: { field: 'invoice_date', displayName: 'Invoice Date', target: 'RECEIVABLE' },
  };

  const detectedColumns: { index: number; field: string; displayName: string; target: 'CUSTOMER' | 'RECEIVABLE' | 'SUPPLIER' | 'PAYABLE' | 'TRANSACTION' }[] = [];

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
