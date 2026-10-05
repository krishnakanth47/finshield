// FinShield Official Multi-Format Test Suite Files & Payloads

export interface TestSuiteFileDefinition {
  name: string;
  type: string;
  format: 'CSV' | 'PDF' | 'DOCX' | 'IMAGE';
  size: number;
  description: string;
  entityCount: number;
  highlightDetails: string;
  downloadUrl?: string;
  content: string;
}

export const OFFICIAL_TEST_FILES: TestSuiteFileDefinition[] = [
  {
    name: 'finshield_master_dataset.csv',
    type: 'text/csv',
    format: 'CSV',
    size: 746,
    description: 'Master enterprise ledger with 7 cross-domain financial rows across 5 critical risk dimensions.',
    entityCount: 7,
    highlightDetails: 'Receivables (Apex, Delta), Payables (SteelWorks, Precision), Inventory, SBI Loan, UPI Inflow',
    downloadUrl: '/sample_files/finshield_master_dataset.csv',
    content: `record_type,entity_id,name_or_item,category_or_type,date_or_due,amount_or_valuation_inr,status_or_metrics
RECEIVABLE,INV-1001,Apex Auto Systems Ltd,Customer Invoice,2026-09-25,700000,Delayed (20 days)
RECEIVABLE,INV-1002,Delta Industrial,Customer Invoice,2026-09-30,450000,On-Time
PAYABLE,PAY-2001,SteelWorks India (Critical),Supplier Payable,2026-10-02,410000,Critical Risk
PAYABLE,PAY-2002,Precision Materials,Supplier Payable,2026-10-08,210000,Medium Risk
INVENTORY,MAT-4001,Alloy Steel Forged Billets,Raw Material,2026-10-01,675000,21 Days Coverage
LOAN,LOAN-5001,State Bank of India,Working Capital EMI,2026-10-05,140000,Mandatory Reserve
TRANSACTION,TXN-6001,Apex Auto Systems Ltd,Bank Credit UPI,2026-09-01,350000,Running Balance: ₹8.5L`,
  },
  {
    name: 'invoice_sample.pdf',
    type: 'application/pdf',
    format: 'PDF',
    size: 3374,
    description: 'Scanned commercial invoice with line item table, buyer/vendor addresses, and delayed payment notice.',
    entityCount: 5,
    highlightDetails: 'Invoice ID #INV-1001, Apex Auto Systems Ltd, ₹7,00,000, Net 25 Days Due: 2026-09-25 (Delayed)',
    downloadUrl: '/sample_files/invoice_sample.pdf',
    content: `===================================================
                  COMMERCIAL INVOICE
===================================================
INVOICE ID: INV-1001
ISSUED DATE: 01 September 2026
DUE DATE: 25 September 2026

VENDOR / ISSUER:
Apex Auto Systems Ltd
Coimbatore Industrial Estate, Tamil Nadu

BILLED TO:
ABC Precision Components
MSME Unit ID: UDYAM-TN-02-0049120

---------------------------------------------------
ITEM DESCRIPTION                QTY    TOTAL (INR)
---------------------------------------------------
Precision Machined Component     1      7,00,000
Batch A-4 (Automotive Grade)
---------------------------------------------------
TOTAL AMOUNT DUE:               INR 7,00,000
PAYMENT TERMS:                  Net 25 Days
CURRENT STATUS:                 PENDING / DELAYED
===================================================`,
  },
  {
    name: 'contract_terms.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    format: 'DOCX',
    size: 37606,
    description: 'Procurement agreement with credit limits, 30-day payment window, and sole-source dependency risk clause.',
    entityCount: 6,
    highlightDetails: 'SteelWorks India (Critical), Credit Limit: ₹5,00,000, Net 30 Days, 2% Overdue Penalty, Single-Source EN24',
    downloadUrl: '/sample_files/contract_terms.docx',
    content: `SUPPLIER CREDIT & STRATEGIC SUPPLY AGREEMENT

Vendor Name: SteelWorks India (Critical Supplier)
Effective Date: 15 June 2026
Target Business: ABC Precision Components

TERMS & CONDITIONS:
1. Credit Facility: The vendor extends an unsecured credit line up to ₹5,00,000 for raw material procurement.
2. Standard Payment Window: Net 30 days from the invoice issuance date.
3. Penalty Clauses: A 2% monthly interest penalty applies automatically to overdue balances exceeding 30 days.
4. Single-Source Dependency: This supplier is classified as a single-source provider for Alloy Steel Forged Billets (Grade EN24). Any supply chain disruption directly impacts factory production continuity.

Current Outstanding Payable: ₹4,10,000
Payment Due Date: 2026-10-02
Criticality Rating: CRITICAL`,
  },
  {
    name: 'upi_receipt.png',
    type: 'image/png',
    format: 'IMAGE',
    size: 50088,
    description: 'Mobile banking UPI payment confirmation receipt snapshot for consumable supplies settlement.',
    entityCount: 6,
    highlightDetails: 'Transaction ID UPI/524890123489, Industrial Fasteners Hub, Rs. 1,50,000 / -, Status: COMPLETED',
    downloadUrl: '/sample_files/upi_receipt.png',
    content: `=========================================
      SUCCESSFUL UPI PAYMENT RECEIPT
=========================================
Transaction ID: UPI/524890123489
Date & Time: 12 September 2026, 14:32 IST

Paid To: Industrial Fasteners Hub
Category: Consumables & Shop Supplies
Payment Channel: Mobile UPI (Google Pay / PhonePe)

Amount Paid: Rs. 1,50,000 / -
Status: COMPLETED & VERIFIED
=========================================`,
  },
];

export const DEMO_FILES_METADATA = OFFICIAL_TEST_FILES;

export const createSyntheticDemoFiles = (): File[] => {
  return OFFICIAL_TEST_FILES.map((meta) => {
    const blob = new Blob([meta.content], { type: meta.type });
    return new File([blob], meta.name, { type: meta.type, lastModified: Date.now() });
  });
};
