import React, { useState } from 'react';
import { useFinShield } from '../context/FinShieldContext';
import { 
  parseFinancialCSV, 
  SAMPLE_CSV_COMBINED, 
  SAMPLE_CSV_RECEIVABLES, 
  SAMPLE_CSV_PAYABLES, 
  CSVParseResult 
} from '../services/csvParser';
import { 
  Database, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  RotateCcw, 
  ArrowRight, 
  Table 
} from 'lucide-react';

export const DataImportPage: React.FC = () => {
  const { dataset, updateDataset, resetToSampleData, setActiveTab } = useFinShield();
  const [csvText, setCsvText] = useState<string>('');
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      const result = parseFinancialCSV(content);
      setParseResult(result);
      if (result.success && result.parsedData) {
        updateDataset(result.parsedData);
      }
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleProcessManualText = () => {
    if (!csvText.trim()) {
      setParseResult({
        success: false,
        message: 'No financial data entered. Please paste CSV or choose a sample.',
        rowCount: 0,
        warnings: [],
      });
      return;
    }
    setIsProcessing(true);
    const result = parseFinancialCSV(csvText);
    setParseResult(result);
    if (result.success && result.parsedData) {
      updateDataset(result.parsedData);
    }
    setIsProcessing(false);
  };

  const handleLoadSample = (sampleType: 'COMBINED' | 'RECEIVABLES' | 'PAYABLES') => {
    let sample = SAMPLE_CSV_COMBINED;
    if (sampleType === 'RECEIVABLES') sample = SAMPLE_CSV_RECEIVABLES;
    if (sampleType === 'PAYABLES') sample = SAMPLE_CSV_PAYABLES;

    setCsvText(sample);
    const result = parseFinancialCSV(sample);
    setParseResult(result);
    if (result.success && result.parsedData) {
      updateDataset(result.parsedData);
    }
  };

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
                MSME Financial Data Ingestion Hub
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload or stream financial ledgers to synchronize the digital twin and risk calculations.
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
              <span>Reset to ABC Precision Baseline</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
          >
            <span>View Updated Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upload Zone & Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Drag and Drop & Manual Input */}
        <div className="lg:col-span-2 space-y-4">
          {/* File input card */}
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-8 text-center hover:border-sky-400 transition bg-slate-50/50">
            <UploadCloud className="w-10 h-10 text-sky-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">
              Upload Financial Dataset (.CSV)
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Supports Receivables, Payables, and Combined Value-Chain CSV exports from Tally, Zoho Books, or custom spreadsheets.
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <label className="cursor-pointer px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-sm transition">
                <span>Select Local CSV File</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          {/* Direct CSV Text Area */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase">
                Direct CSV Data Inspector / Editor
              </h4>
              <button
                onClick={handleProcessManualText}
                disabled={isProcessing}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50"
              >
                {isProcessing ? 'Parsing...' : 'Parse & Synchronize Model'}
              </button>
            </div>

            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Paste comma-separated financial records here..."
              className="w-full font-mono text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
            />
          </div>

          {/* Validation Status Box */}
          {parseResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 animate-fade-in ${
                parseResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {parseResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span className="font-bold text-sm">{parseResult.message}</span>
              </div>

              {parseResult.warnings.length > 0 && (
                <div className="pl-7 space-y-1 text-[11px] text-slate-600">
                  {parseResult.warnings.map((w, idx) => (
                    <div key={idx}>• {w}</div>
                  ))}
                </div>
              )}

              {parseResult.success && (
                <div className="pl-7 pt-2 flex items-center gap-4 text-xs font-semibold text-emerald-800">
                  <span>Parsed Rows: {parseResult.rowCount}</span>
                  <span>Digital Twin: Synchronized</span>
                  <span>Risk Engine: Recalculated</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Download Templates & Samples */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase">
              Quick Load Sample Datasets
            </h4>
            <p className="text-xs text-slate-500">
              Instantly test FINSHIELD with realistic synthetic MSME balance sheet profiles.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleLoadSample('COMBINED')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition text-xs"
              >
                <div className="font-bold text-slate-900">Combined Value Chain (All Entities)</div>
                <div className="text-[11px] text-slate-500">Receivables, payables, and inventory stock</div>
              </button>

              <button
                type="button"
                onClick={() => handleLoadSample('RECEIVABLES')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition text-xs"
              >
                <div className="font-bold text-slate-900">Customer Invoices (Receivables)</div>
                <div className="text-[11px] text-slate-500">Apex Auto, Delta Industrial, Nova Engg</div>
              </button>

              <button
                type="button"
                onClick={() => handleLoadSample('PAYABLES')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition text-xs"
              >
                <div className="font-bold text-slate-900">Supplier Obligations (Payables)</div>
                <div className="text-[11px] text-slate-500">SteelWorks India, Precision Materials</div>
              </button>
            </div>
          </div>

          {/* Download CSV Templates */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Templates</span>
            </h4>
            <p className="text-xs text-slate-500">
              Export standard CSV templates formatted for FINSHIELD ingestion.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleDownloadSample(SAMPLE_CSV_COMBINED, 'finshield_msme_dataset.csv')}
                className="w-full flex items-center justify-between text-xs text-slate-700 bg-white border border-slate-200 p-2.5 rounded-lg hover:border-slate-300 transition"
              >
                <span>Full MSME Dataset.csv</span>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleDownloadSample(SAMPLE_CSV_RECEIVABLES, 'finshield_receivables.csv')}
                className="w-full flex items-center justify-between text-xs text-slate-700 bg-white border border-slate-200 p-2.5 rounded-lg hover:border-slate-300 transition"
              >
                <span>Receivables Template.csv</span>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
