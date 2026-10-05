import React, { useState } from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { OFFICIAL_TEST_FILES, TestSuiteFileDefinition } from '../../services/documentParser/sampleDocuments';
import { 
  FileSpreadsheet, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Zap, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  Layers, 
  ShieldAlert, 
  ArrowDownToLine, 
  BadgeCheck 
} from 'lucide-react';

export const SampleMultimodalTestSuite: React.FC = () => {
  const { handleUploadFiles, isProcessingFiles } = useFinShield();
  const [selectedFileForModal, setSelectedFileForModal] = useState<TestSuiteFileDefinition | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadSuccessMap, setDownloadSuccessMap] = useState<Record<string, boolean>>({});

  // Helper to trigger browser download of a test file
  const downloadFile = async (fileDef: TestSuiteFileDefinition) => {
    try {
      // If static file is available in public folder, download it directly
      if (fileDef.downloadUrl) {
        const response = await fetch(fileDef.downloadUrl);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileDef.name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          triggerDownloadNotice(fileDef.name);
          return;
        }
      }
    } catch {
      // Fallback to text blob
    }

    // Fallback: Generate blob from content
    const blob = new Blob([fileDef.content], { type: fileDef.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileDef.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerDownloadNotice(fileDef.name);
  };

  const triggerDownloadNotice = (filename: string) => {
    setDownloadSuccessMap((prev) => ({ ...prev, [filename]: true }));
    setTimeout(() => {
      setDownloadSuccessMap((prev) => ({ ...prev, [filename]: false }));
    }, 2500);
  };

  // Download all 4 files
  const downloadAllFiles = async () => {
    for (const fileDef of OFFICIAL_TEST_FILES) {
      await downloadFile(fileDef);
      // Brief pause between browser download prompts
      await new Promise((r) => setTimeout(r, 200));
    }
  };

  // Instant Ingest for a single file
  const handleInstantTestSingle = async (fileDef: TestSuiteFileDefinition) => {
    try {
      // Check if we can fetch binary blob from public path for maximum realism
      if (fileDef.downloadUrl) {
        const res = await fetch(fileDef.downloadUrl);
        if (res.ok) {
          const blob = await res.blob();
          const file = new File([blob], fileDef.name, { type: fileDef.type });
          await handleUploadFiles([file]);
          return;
        }
      }
    } catch {
      // Fallback
    }

    const blob = new Blob([fileDef.content], { type: fileDef.type });
    const file = new File([blob], fileDef.name, { type: fileDef.type });
    await handleUploadFiles([file]);
  };

  // Instant Ingest for all 4 files simultaneously
  const handleInstantTestAll = async () => {
    const filesToUpload: File[] = [];

    for (const fileDef of OFFICIAL_TEST_FILES) {
      let createdFile: File | null = null;
      try {
        if (fileDef.downloadUrl) {
          const res = await fetch(fileDef.downloadUrl);
          if (res.ok) {
            const blob = await res.blob();
            createdFile = new File([blob], fileDef.name, { type: fileDef.type });
          }
        }
      } catch {
        // Fallback
      }

      if (!createdFile) {
        const blob = new Blob([fileDef.content], { type: fileDef.type });
        createdFile = new File([blob], fileDef.name, { type: fileDef.type });
      }
      filesToUpload.push(createdFile);
    }

    await handleUploadFiles(filesToUpload);
  };

  const handleCopyModalText = () => {
    if (!selectedFileForModal) return;
    navigator.clipboard.writeText(selectedFileForModal.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFormatBadge = (format: TestSuiteFileDefinition['format']) => {
    switch (format) {
      case 'CSV':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
            CSV LEDGER
          </span>
        );
      case 'PDF':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
            <FileText className="w-3 h-3 text-sky-600" />
            PDF INVOICE
          </span>
        );
      case 'DOCX':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <FileText className="w-3 h-3 text-indigo-600" />
            WORD CONTRACT
          </span>
        );
      case 'IMAGE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <ImageIcon className="w-3 h-3 text-purple-600" />
            IMAGE / UPI OCR
          </span>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-slate-50/60 to-sky-50/40 rounded-2xl border border-slate-200/90 p-6 shadow-subtle space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Sample Multimodal Files & Download Test Suite
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Ready to Ingest
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Download or instantly trigger ingestion testing for our official mock test files across CSV, PDF, Word, and Image formats.
              </p>
            </div>
          </div>
        </div>

        {/* Global Batch Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadAllFiles}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
            title="Download all 4 sample files sequentially to your local disk"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-slate-600" />
            <span>Download All 4 Files</span>
          </button>

          <button
            onClick={handleInstantTestAll}
            disabled={isProcessingFiles}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 shadow-md shadow-sky-600/20 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            title="Feeds all 4 multi-format test documents directly into FINSHIELD's live extraction pipeline"
          >
            <Zap className="w-4 h-4 text-yellow-300 fill-current animate-pulse" />
            <span>Instant Test Suite (All 4 Files)</span>
          </button>
        </div>
      </div>

      {/* 4 Multi-Format Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {OFFICIAL_TEST_FILES.map((fileDef) => {
          const isDownloaded = downloadSuccessMap[fileDef.name];

          return (
            <div
              key={fileDef.name}
              className="bg-white rounded-xl border border-slate-200/90 hover:border-sky-300 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                {/* Header Badge & Action Icons */}
                <div className="flex items-center justify-between">
                  {getFormatBadge(fileDef.format)}
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    {(fileDef.size / 1024).toFixed(1)} KB
                  </span>
                </div>

                {/* File Title */}
                <div>
                  <h4 className="text-xs font-bold font-mono text-slate-900 truncate" title={fileDef.name}>
                    {fileDef.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {fileDef.description}
                  </p>
                </div>

                {/* Highlights Pill */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold text-slate-700">Key Extraction Fields:</span>
                    <span className="font-mono font-bold text-sky-600 text-[10px]">{fileDef.entityCount} Entities</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-mono leading-snug">
                    {fileDef.highlightDetails}
                  </p>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  {/* Download Button */}
                  <button
                    onClick={() => downloadFile(fileDef)}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    {isDownloaded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Saved!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Download</span>
                      </>
                    )}
                  </button>

                  {/* Preview Payload Button */}
                  <button
                    onClick={() => setSelectedFileForModal(fileDef)}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                    <span>Inspect</span>
                  </button>
                </div>

                {/* Instant Ingest & Test Single */}
                <button
                  onClick={() => handleInstantTestSingle(fileDef)}
                  disabled={isProcessingFiles}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition"
                >
                  <Zap className="w-3 h-3 text-yellow-300 fill-current" />
                  <span>Instant Test Ingest</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Callout Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900">
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <b>Standardized Ingestion Benchmark:</b> These mock files contain cross-referencing customer IDs (Apex Auto Systems Ltd #INV-1001), supplier single-source covenants (SteelWorks India), and UPI transaction receipts to test FINSHIELD's entity resolution & risk simulator.
          </span>
        </div>
      </div>

      {/* Inspect Payload & OCR Text Modal */}
      {selectedFileForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                {getFormatBadge(selectedFileForModal.format)}
                <div>
                  <h3 className="text-sm font-bold font-mono text-slate-900">
                    {selectedFileForModal.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Raw document stream & extraction payload preview
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFileForModal(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700">Target Digital Twin Entities Mapped:</span>
                <p className="text-slate-600 font-mono text-[11px]">{selectedFileForModal.highlightDetails}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Raw Document Payload / OCR Text:</span>
                  <button
                    onClick={handleCopyModalText}
                    className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Raw Text'}</span>
                  </button>
                </div>

                <pre className="p-3.5 rounded-xl bg-slate-900 text-sky-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 whitespace-pre-wrap max-h-72">
                  {selectedFileForModal.content}
                </pre>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => downloadFile(selectedFileForModal)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Download File</span>
              </button>

              <button
                onClick={() => {
                  handleInstantTestSingle(selectedFileForModal);
                  setSelectedFileForModal(null);
                }}
                disabled={isProcessingFiles}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300 fill-current" />
                <span>Test Ingestion in Pipeline</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
