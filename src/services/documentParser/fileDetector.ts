import { DocumentFormat } from '../../types';

export interface FileDetectionResult {
  isValid: boolean;
  format?: DocumentFormat;
  mimeType: string;
  extension: string;
  errorMessage?: string;
}

export const detectFileFormat = (fileName: string, mimeType = ''): FileDetectionResult => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return {
      isValid: true,
      format: 'IMAGE',
      mimeType: mimeType || `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      extension: ext,
    };
  }

  if (ext === 'pdf') {
    return {
      isValid: true,
      format: 'PDF',
      mimeType: mimeType || 'application/pdf',
      extension: ext,
    };
  }

  if (ext === 'docx') {
    return {
      isValid: true,
      format: 'DOCX',
      mimeType: mimeType || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: ext,
    };
  }

  if (ext === 'csv') {
    return {
      isValid: true,
      format: 'CSV',
      mimeType: mimeType || 'text/csv',
      extension: ext,
    };
  }

  return {
    isValid: false,
    mimeType,
    extension: ext,
    errorMessage: `Unsupported file format (.${ext}). Supported formats: JPG, PNG, PDF, DOCX, CSV.`,
  };
};
