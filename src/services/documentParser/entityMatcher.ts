import { EntityMatch, MSMEDataSet } from '../../types';

// Normalized string cleaner for entity matching
const cleanEntityName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\b(pvt|ltd|limited|private|corp|corporation|inc|llp|co|company|india)\b/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
};

export const computeStringSimilarity = (str1: string, str2: string): number => {
  const s1 = cleanEntityName(str1);
  const s2 = cleanEntityName(str2);

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  // Check substring containment
  if (s1.includes(s2) || s2.includes(s1)) {
    const longer = Math.max(s1.length, s2.length);
    const shorter = Math.min(s1.length, s2.length);
    return Math.round((shorter / longer) * 100) / 100;
  }

  // Bigram token overlap
  const getBigrams = (str: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
  };

  const b1 = getBigrams(s1);
  const b2 = getBigrams(s2);
  let intersection = 0;

  b1.forEach((bg) => {
    if (b2.has(bg)) intersection++;
  });

  const total = b1.size + b2.size;
  if (total === 0) return 0.0;

  return Math.round(((2.0 * intersection) / total) * 100) / 100;
};

export const findEntityMatches = (
  candidateNames: { name: string; type: 'CUSTOMER' | 'SUPPLIER' }[],
  dataset: MSMEDataSet
): EntityMatch[] => {
  const matches: EntityMatch[] = [];
  const processedPairs = new Set<string>();

  const knownCustomers = dataset.customers.map((c) => c.name);
  const knownSuppliers = dataset.suppliers.map((s) => s.name);

  candidateNames.forEach(({ name, type }) => {
    const knownList = type === 'CUSTOMER' ? knownCustomers : knownSuppliers;

    knownList.forEach((known) => {
      const pairKey = `${cleanEntityName(name)}_${cleanEntityName(known)}`;
      if (processedPairs.has(pairKey)) return;

      const sim = computeStringSimilarity(name, known);
      // If similarity between 70% and 99% (i.e. close match, not identical)
      if (sim >= 0.70 && sim < 1.0) {
        processedPairs.add(pairKey);
        matches.push({
          id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          originalName: name,
          matchedName: known,
          confidence: Math.round(sim * 100),
          entityType: type,
          status: 'PENDING',
        });
      }
    });
  });

  return matches;
};
