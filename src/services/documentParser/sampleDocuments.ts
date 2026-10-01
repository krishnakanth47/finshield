// Sample multi-format demo documents representing messy real-world MSME data

export const DEMO_FILES_METADATA = [
  {
    name: 'sample_invoice.pdf',
    type: 'application/pdf',
    format: 'PDF',
    size: 24580,
    content: `%PDF-1.4
TAX INVOICE - APEX AUTO SYSTEMS LTD
INVOICE NUMBER: INV-PDF-2026-904
DATE: 2026-10-15
BUYER: Apex Auto Systems Ltd
SUPPLIER: ABC Precision Components
LINE ITEMS:
1. Precision EN8 Forged Transmission Shafts - Qty: 400 - Total: ₹7,00,000
SUBTOTAL: ₹7,00,000
GST (18%): ₹1,26,000
TOTAL INVOICE AMOUNT: ₹7,00,000
PAYMENT TERMS: NET 30 DAYS
DUE DATE: 2026-11-14
PAYMENT STATUS: UNPAID / OUTSTANDING`,
  },
  {
    name: 'sample_bank_statement.csv',
    type: 'text/csv',
    format: 'CSV',
    size: 14820,
    content: `Date,Description,Transaction_Type,Amount,Balance,Reference
2026-10-01,Opening Balance,CREDIT,820000,820000,INIT-BAL
2026-10-03,Factory Electric Power MSEB,DEBIT,45000,775000,TX-901
2026-10-05,Delta Industrial Collections,CREDIT,220000,995000,TX-902
2026-10-07,CNC Machinist Weekly Wages,DEBIT,85000,910000,TX-903
2026-10-10,TechParts Sensor Supplies,DEBIT,90000,820000,TX-904`,
  },
  {
    name: 'sample_supplier_statement.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    format: 'DOCX',
    size: 32150,
    content: `FINANCIAL OPERATIONS & SUPPLIER STATEMENT REPORT
COMPANY: ABC Precision Components
SUPPLIER: SteelWorks India Ltd
CATEGORY: Grade EN8 Alloy Steel Forgings
PAYABLE AMOUNT: ₹4,10,000
DUE DATE: 2026-10-31
CRITICALITY: CRITICAL - Single source for CNC turning shafts
SECONDARY SUPPLIER: Precision Materials Co - Payable: ₹2,40,000 - Due: 2026-11-08
INVENTORY VALUATION: Current Raw Material Value: ₹6,80,000`,
  },
  {
    name: 'sample_inventory_bill.jpg',
    type: 'image/jpeg',
    format: 'IMAGE',
    size: 48920,
    content: `TAX INVOICE / PURCHASE BILL
INVOICE NO: INV-PHOTO-782
DATE: 2026-10-18
BUYER: Apex Auto Systems Ltd
SELLER: ABC Precision Components
ITEMS:
1. Precision Turned Gear Shafts EN8 - ₹7,00,000
GST (18%): ₹1,26,000
TOTAL AMOUNT: ₹7,00,000
DUE DATE: 2026-11-05
PAYMENT STATUS: OUTSTANDING`,
  },
];

export const createSyntheticDemoFiles = (): File[] => {
  return DEMO_FILES_METADATA.map((meta) => {
    const blob = new Blob([meta.content], { type: meta.type });
    return new File([blob], meta.name, { type: meta.type, lastModified: Date.now() });
  });
};
