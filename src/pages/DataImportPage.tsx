import React, { useState } from 'react';
import { useFinShield } from '../context/FinShieldContext';
import { MultiFormatUploader } from '../components/data/MultiFormatUploader';
import { SampleMultimodalTestSuite } from '../components/data/SampleMultimodalTestSuite';
import { DataReviewTable } from '../components/data/DataReviewTable';
import { DataQualityCard } from '../components/data/DataQualityCard';
import { EntityResolutionModal } from '../components/data/EntityResolutionModal';
import { DetectedScenariosCard } from '../components/data/DetectedScenariosCard';
import { ImportHistoryTable } from '../components/data/ImportHistoryTable';
import { 
  parseFinancialCSV, 
  SAMPLE_CSV_COMBINED, 
  SAMPLE_CSV_RECEIVABLES, 
  SAMPLE_CSV_PAYABLES, 
  CSVParseResult 
} from '../services/csvParser';
import { 
  Database, 
  Download, 
  RotateCcw, 
  ArrowRight, 
  FileCode, 
  Layers, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const DataImportPage: React.FC = () => {
  const { dataset, resetToSampleData, setActiveTab, extractedFields } = useFinShield();
  const [csvText, setCsvText] = useState<string>('');
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [showAdvancedCsv, setShowAdvancedCsv] = useState<boolean>(false);

  const handleDownloadSample = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                FINANCIAL DATA CENTER
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload financial data in any supported format. FINSHIELD extracts, validates, and converts it into a unified financial intelligence model.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {dataset.isCustomUploaded && (
            <button
              onClick={resetToSampleData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to ABC Baseline</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
          >
            <span>View Executive Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Official Downloadable Test Suite & Multimodal Sandbox */}
      <SampleMultimodalTestSuite />

      {/* Multi-Format Ingestion Uploader */}
      <MultiFormatUploader />

      {/* Entity Matching & Duplicate Resolutions */}
      <EntityResolutionModal />

      {/* Data Quality & Diagnostic Score Card */}
      <DataQualityCard />

      {/* Auto-Detected Scenarios derived from ingested documents */}
      <DetectedScenariosCard />

      {/* Review & Validate Extracted Data Table */}
      <DataReviewTable />

      {/* Document Ingestion Audit History */}
      <ImportHistoryTable />

      {/* Collapsible Direct CSV Editor & Template Downloader */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-slate-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Raw CSV Template Downloads & Schema Inspector
            </h4>
          </div>

          <button
            onClick={() => setShowAdvancedCsv(!showAdvancedCsv)}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700"
          >
            {showAdvancedCsv ? 'Hide CSV Tools' : 'Show CSV Tools'}
          </button>
        </div>

        {showAdvancedCsv && (
          <div className="space-y-4 pt-2 border-t border-slate-100 animate-fade-in text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleDownloadSample(SAMPLE_CSV_COMBINED, 'finshield_msme_dataset.csv')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-300 transition text-slate-700"
              >
                <span>Full MSME Dataset (.CSV)</span>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleDownloadSample(SAMPLE_CSV_RECEIVABLES, 'finshield_receivables.csv')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-300 transition text-slate-700"
              >
                <span>Customer Invoices (.CSV)</span>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleDownloadSample(SAMPLE_CSV_PAYABLES, 'finshield_payables.csv')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-300 transition text-slate-700"
              >
                <span>Supplier Obligations (.CSV)</span>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
