import { MSMEDataSet, Customer, Receivable, Supplier, Payable, InventoryItem } from '../types';

export interface CSVParseResult {
  success: boolean;
  message: string;
  rowCount: number;
  warnings: string[];
  parsedData?: Partial<MSMEDataSet>;
}

export const SAMPLE_CSV_RECEIVABLES = `CustomerName,InvoiceNumber,Amount,DueDate,ReliabilityScore,Criticality
Apex Auto Systems Ltd,INV-2026-089,700000,2026-10-06,88,HIGH
Delta Industrial Equipments,INV-2026-092,220000,2026-10-13,92,MEDIUM
Nova Engineering Corp,INV-2026-094,150000,2026-10-23,80,MEDIUM
Prime Components Pvt Ltd,INV-2026-097,80000,2026-10-29,95,LOW`;

export const SAMPLE_CSV_PAYABLES = `SupplierName,PayableAmount,DueDate,SuppliesCategory,Criticality
SteelWorks India Ltd,410000,2026-10-11,Grade EN8 Alloy Steel Forgings,CRITICAL
Precision Materials Co,240000,2026-10-19,CNC Carbide Turning Inserts,HIGH
TechParts Supply Hub,180000,2026-10-26,Industrial Sensors & Bearings,MEDIUM
Industrial Fasteners Ltd,140000,2026-10-31,High-Tensile Fasteners & Washers,LOW`;

export const SAMPLE_CSV_COMBINED = `Type,EntityName,Amount,DueDate,Category,Criticality,ReliabilityOrCoverage
RECEIVABLE,Apex Auto Systems Ltd,700000,2026-10-06,Automotive OEM,HIGH,88
RECEIVABLE,Delta Industrial Equipments,220000,2026-10-13,Machinery,MEDIUM,92
RECEIVABLE,Nova Engineering Corp,150000,2026-10-23,Defense Tier-2,MEDIUM,80
RECEIVABLE,Prime Components Pvt Ltd,80000,2026-10-29,Industrial,LOW,95
PAYABLE,SteelWorks India Ltd,410000,2026-10-11,Raw Steel Billets,CRITICAL,30
PAYABLE,Precision Materials Co,240000,2026-10-19,Carbide Tooling,HIGH,45
PAYABLE,TechParts Supply Hub,180000,2026-10-26,Sensors,MEDIUM,30
PAYABLE,Industrial Fasteners Ltd,140000,2026-10-31,Fasteners,LOW,30
INVENTORY,EN8 Alloy Steel Forged Billets,380000,2026-10-15,Raw Material,HIGH,22
INVENTORY,Tungsten Carbide CNC Inserts,180000,2026-10-18,Consumable,HIGH,18
INVENTORY,Finished Transmission Shafts,120000,2026-10-20,WIP,MEDIUM,12`;

export const parseFinancialCSV = (csvContent: string): CSVParseResult => {
  if (!csvContent || !csvContent.trim()) {
    return {
      success: false,
      message: 'Empty financial data file provided. Please upload a valid CSV.',
      rowCount: 0,
      warnings: [],
    };
  }

  const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) {
    return {
      success: false,
      message: 'Unable to process file: Header row or data rows missing.',
      rowCount: 0,
      warnings: ['File contains insufficient rows.'],
    };
  }

  const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const warnings: string[] = [];

  // Detect format
  const isCombined = header.includes('type') && header.includes('entityname') && header.includes('amount');
  const isReceivables = header.includes('customername') && header.includes('amount');
  const isPayables = header.includes('suppliername') && header.includes('payableamount');

  if (!isCombined && !isReceivables && !isPayables) {
    return {
      success: false,
      message: 'Unable to process this file. Required fields are missing (e.g. EntityName/CustomerName, Amount, DueDate).',
      rowCount: lines.length - 1,
      warnings: ['Header does not match supported schemas: Combined, Receivables, or Payables.'],
    };
  }

  const parsedReceivables: Receivable[] = [];
  const parsedCustomers: Customer[] = [];
  const parsedPayables: Payable[] = [];
  const parsedSuppliers: Supplier[] = [];
  const parsedInventory: InventoryItem[] = [];

  let dataRowCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map((cell) => cell.trim());
    if (row.length < 3) continue;
    dataRowCount++;

    if (isCombined) {
      const type = row[0].toUpperCase();
      const entityName = row[1];
      const amount = parseFloat(row[2]) || 0;
      const dueDate = row[3] || new Date().toISOString().split('T')[0];
      const category = row[4] || 'GENERAL';
      const criticality = (row[5]?.toUpperCase() || 'MEDIUM') as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      const extraVal = parseFloat(row[6]) || 30;

      if (type === 'RECEIVABLE') {
        const custId = `cust_up_${i}`;
        parsedCustomers.push({
          id: custId,
          name: entityName,
          receivableAmount: amount,
          expectedPaymentDate: dueDate,
          paymentReliabilityScore: extraVal || 85,
          historicalDelayDays: 3,
          criticality: criticality === 'CRITICAL' ? 'HIGH' : criticality,
        });
        parsedReceivables.push({
          id: `rec_up_${i}`,
          customerId: custId,
          customerName: entityName,
          amount,
          invoiceNumber: `INV-IMP-${100 + i}`,
          dueDate,
          expectedDate: dueDate,
          isOverdue: false,
          overdueDays: 0,
        });
      } else if (type === 'PAYABLE') {
        const supId = `sup_up_${i}`;
        parsedSuppliers.push({
          id: supId,
          name: entityName,
          payableAmount: amount,
          dueDate,
          criticality,
          suppliesCategory: category,
          creditTermsDays: extraVal || 30,
          leadTimeDays: 7,
        });
        parsedPayables.push({
          id: `pay_up_${i}`,
          supplierId: supId,
          supplierName: entityName,
          amount,
          dueDate,
          criticality,
          category: 'RAW_MATERIAL',
        });
      } else if (type === 'INVENTORY') {
        parsedInventory.push({
          id: `inv_up_${i}`,
          sku: `SKU-IMP-${100 + i}`,
          name: entityName,
          value: amount,
          stockUnits: Math.round(amount / 400),
          coverageDays: extraVal || 20,
          minimumThresholdDays: 14,
          criticalMaterialDependency: 'sup_up_1',
        });
      }
    } else if (isReceivables) {
      const custName = row[0];
      const invNum = row[1];
      const amount = parseFloat(row[2]) || 0;
      const dueDate = row[3] || new Date().toISOString().split('T')[0];
      const score = parseFloat(row[4]) || 85;
      const criticality = (row[5]?.toUpperCase() || 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW';

      const custId = `cust_up_${i}`;
      parsedCustomers.push({
        id: custId,
        name: custName,
        receivableAmount: amount,
        expectedPaymentDate: dueDate,
        paymentReliabilityScore: score,
        historicalDelayDays: 3,
        criticality,
      });
      parsedReceivables.push({
        id: `rec_up_${i}`,
        customerId: custId,
        customerName: custName,
        amount,
        invoiceNumber: invNum || `INV-IMP-${100 + i}`,
        dueDate,
        expectedDate: dueDate,
        isOverdue: false,
        overdueDays: 0,
      });
    } else if (isPayables) {
      const supName = row[0];
      const amount = parseFloat(row[1]) || 0;
      const dueDate = row[2] || new Date().toISOString().split('T')[0];
      const category = row[3] || 'Raw Material';
      const criticality = (row[4]?.toUpperCase() || 'MEDIUM') as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

      const supId = `sup_up_${i}`;
      parsedSuppliers.push({
        id: supId,
        name: supName,
        payableAmount: amount,
        dueDate,
        criticality,
        suppliesCategory: category,
        creditTermsDays: 30,
        leadTimeDays: 7,
      });
      parsedPayables.push({
        id: `pay_up_${i}`,
        supplierId: supId,
        supplierName: supName,
        amount,
        dueDate,
        criticality,
        category: 'RAW_MATERIAL',
      });
    }
  }

  if (dataRowCount === 0) {
    return {
      success: false,
      message: 'No valid data rows found in the CSV.',
      rowCount: 0,
      warnings: ['No records could be parsed.'],
    };
  }

  return {
    success: true,
    message: `Successfully validated and parsed ${dataRowCount} financial records.`,
    rowCount: dataRowCount,
    warnings,
    parsedData: {
      customers: parsedCustomers.length > 0 ? parsedCustomers : undefined,
      receivables: parsedReceivables.length > 0 ? parsedReceivables : undefined,
      suppliers: parsedSuppliers.length > 0 ? parsedSuppliers : undefined,
      payables: parsedPayables.length > 0 ? parsedPayables : undefined,
      inventory: parsedInventory.length > 0 ? parsedInventory : undefined,
      isCustomUploaded: true,
      lastUpdated: new Date().toISOString(),
    },
  };
};
