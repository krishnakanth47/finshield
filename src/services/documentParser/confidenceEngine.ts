import { ConfidenceTier, ExtractedField, DataQualityReport } from '../../types';

export const getConfidenceTier = (score: number): ConfidenceTier => {
  if (score >= 0.90) return 'HIGH';
  if (score >= 0.70) return 'MEDIUM';
  return 'LOW';
};

export const calculateDataQualityReport = (
  fields: ExtractedField[],
  duplicateCount = 0,
  unmatchedEntityCount = 0
): DataQualityReport => {
  if (fields.length === 0) {
    return {
      score: 100,
      totalRecords: 0,
      highConfidence: 0,
      needsReview: 0,
      unresolved: 0,
      missingFieldsCount: 0,
      lowConfidenceOcrCount: 0,
      duplicatesCount: 0,
      unmatchedEntitiesCount: 0,
    };
  }

  const highCount = fields.filter((f) => f.confidence >= 0.90).length;
  const mediumCount = fields.filter((f) => f.confidence >= 0.70 && f.confidence < 0.90).length;
  const lowCount = fields.filter((f) => f.confidence < 0.70).length;
  const missingCount = fields.filter((f) => f.value === null || f.value === 'unknown').length;
  const lowOcrCount = fields.filter((f) => f.confidence < 0.75 && f.sourceLocation.includes('OCR')).length;

  const total = fields.length;
  const averageConfidence = fields.reduce((acc, f) => acc + f.confidence, 0) / total;
  
  // Quality score formula: penalize for low confidence, missing values, and duplicates
  let qualityScore = Math.round(averageConfidence * 100);
  if (duplicateCount > 0) qualityScore = Math.max(10, qualityScore - duplicateCount * 3);
  if (missingCount > 0) qualityScore = Math.max(10, qualityScore - missingCount * 2);

  return {
    score: Math.min(100, Math.max(0, qualityScore)),
    totalRecords: total,
    highConfidence: highCount,
    needsReview: mediumCount + lowCount,
    unresolved: lowCount + missingCount + duplicateCount,
    missingFieldsCount: missingCount,
    lowConfidenceOcrCount: lowOcrCount,
    duplicatesCount: duplicateCount,
    unmatchedEntitiesCount: unmatchedEntityCount,
  };
};
