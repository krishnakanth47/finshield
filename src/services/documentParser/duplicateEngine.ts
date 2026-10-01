import { DuplicateRecordAlert, ExtractedField, MSMEDataSet } from '../../types';

export const detectDuplicates = (
  newFields: ExtractedField[],
  existingDataset: MSMEDataSet,
  previouslyExtractedFields: ExtractedField[] = []
): { duplicates: DuplicateRecordAlert[]; flaggedFields: ExtractedField[] } => {
  const duplicates: DuplicateRecordAlert[] = [];
  const flaggedFields: ExtractedField[] = [];

  // Index existing invoices
  const existingInvoices = new Map<string, { entity: string; amount: number; date: string }>();
  existingDataset.receivables.forEach((rec) => {
    const key = `${rec.invoiceNumber.toLowerCase().trim()}_${rec.amount}`;
    existingInvoices.set(key, {
      entity: rec.customerName,
      amount: rec.amount,
      date: rec.dueDate,
    });
  });

  // Group incoming fields by invoice identifier if present
  const invoiceGroups = new Map<string, { invNumber?: string; customer?: string; amount?: number; date?: string; sourceFile?: string; fields: ExtractedField[] }>();

  newFields.forEach((field) => {
    // Generate a group id based on source file and location
    const groupId = `${field.sourceFile}_${field.sourceLocation.split(' ')[0]}`;
    if (!invoiceGroups.has(groupId)) {
      invoiceGroups.set(groupId, { fields: [] });
    }
    const group = invoiceGroups.get(groupId)!;
    group.fields.push(field);
    group.sourceFile = field.sourceFile;

    if (field.field === 'invoice_number' && typeof field.value === 'string') {
      group.invNumber = field.value;
    }
    if ((field.field === 'customer_name' || field.field === 'entity_name') && typeof field.value === 'string') {
      group.customer = field.value;
    }
    if ((field.field === 'invoice_amount' || field.field === 'amount') && typeof field.value === 'number') {
      group.amount = field.value;
    }
    if (field.field === 'due_date' && typeof field.value === 'string') {
      group.date = field.value;
    }
  });

  // Check each group against existing and previous
  invoiceGroups.forEach((group, groupId) => {
    if (group.invNumber && group.amount) {
      const matchKey = `${group.invNumber.toLowerCase().trim()}_${group.amount}`;
      if (existingInvoices.has(matchKey)) {
        const existing = existingInvoices.get(matchKey)!;
        const alertId = `dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        
        duplicates.push({
          id: alertId,
          recordIdentifier: group.invNumber,
          entityName: group.customer || existing.entity,
          amount: group.amount,
          date: group.date || existing.date,
          sourceA: group.sourceFile || 'Uploaded Document',
          sourceB: `Existing Ledger (${existing.entity})`,
          status: 'PENDING',
        });

        group.fields.forEach((f) => {
          f.isDuplicate = true;
          f.duplicateDetails = `Matches existing record ${group.invNumber} (${existing.entity})`;
        });
      }
    }
  });

  return { duplicates, flaggedFields: newFields };
};
