// FINSHIELD Financial Data Normalizer
// Normalizes currency, dates, and numbers without fabricating values

export const normalizeCurrency = (val: string | number | null | undefined): { amount: number | null; raw: string } => {
  if (val === null || val === undefined) return { amount: null, raw: 'unknown' };
  if (typeof val === 'number') return { amount: val, raw: String(val) };

  const raw = String(val).trim();
  if (!raw || raw.toLowerCase() === 'unknown' || raw.toLowerCase() === 'n/a') {
    return { amount: null, raw: 'unknown' };
  }

  // Check for Indian Lakh notation: e.g. "₹7.25 Lakh", "7 Lakh", "7.00L"
  const lakhMatch = raw.match(/([\d.]+)\s*(?:lakh|lac|l)/i);
  if (lakhMatch) {
    const num = parseFloat(lakhMatch[1]);
    if (!isNaN(num)) {
      return { amount: Math.round(num * 100000), raw };
    }
  }

  // Check for Crore notation: e.g. "1.5 Cr", "1.5 Crore"
  const crMatch = raw.match(/([\d.]+)\s*(?:crore|cr)/i);
  if (crMatch) {
    const num = parseFloat(crMatch[1]);
    if (!isNaN(num)) {
      return { amount: Math.round(num * 10000000), raw };
    }
  }

  // Remove currency symbols (₹, INR, Rs., $, commas, etc.)
  const cleaned = raw.replace(/[₹$€£\s,]|INR|Rs\.?/gi, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) {
    return { amount: null, raw };
  }

  return { amount: Math.round(parsed), raw };
};

export const normalizeDate = (val: string | null | undefined): string | null => {
  if (!val) return null;
  const raw = val.trim();
  if (!raw || raw.toLowerCase() === 'unknown') return null;

  // Pattern 1: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  // Pattern 2: DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Pattern 3: DD-Mon-YYYY (e.g. 20-Oct-2026 or 20 Oct 2026)
  const monthNames: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };
  const namedMatch = raw.match(/^(\d{1,2})[\s/-]([a-zA-Z]{3})[\s/-](\d{4})$/);
  if (namedMatch) {
    const day = namedMatch[1].padStart(2, '0');
    const mon = monthNames[namedMatch[2].toLowerCase()];
    const year = namedMatch[3];
    if (mon) {
      return `${year}-${mon}-${day}`;
    }
  }

  // Fallback to JS Date parse
  const parsed = new Date(raw);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return null;
};

export const formatINR = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return 'Unknown';
  return `₹${val.toLocaleString('en-IN')}`;
};

export const formatLakh = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return 'Unknown';
  return `₹${(val / 100000).toFixed(2)}L`;
};
