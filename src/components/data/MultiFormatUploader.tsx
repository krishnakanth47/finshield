import React, { useRef, useState } from 'react';
import { useFinShield } from '../../context/FinShieldContext';
import { 
  UploadCloud, 
  FileText, 
  FileSpreadsheet, 
  FileCheck2, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Zap, 
  FolderSync 
} from 'lucide-react';

export const MultiFormatUploader: React.FC = () => {
  const { 
    handleUploadFiles, 
    handleLoadMultiFormatDemoBundle, 
    isProcessingFiles, 
    overallProgress, 
    currentStage, 
    processedFiles 
  } = useFinShield();

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      handleUploadFiles(filesArray);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      handleUploadFiles(filesArray);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Multi-Format Financial Document Ingestion
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
              Universal Input
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Accepts messy real-world MSME files. Extracts, normalizes, and connects records into the Digital Twin.
          </p>
        </div>

        {/* 1-Click Multi-Format Demo Bundle Button */}
        <button
          onClick={() => handleLoadMultiFormatDemoBundle()}
          disabled={isProcessingFiles}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-sky-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <Zap className="w-4 h-4 fill-current text-yellow-300" />
          <span>Load Multi-Format Demo Bundle (4 Files)</span>
        </button>
      </div>

      {/* Large Drag and Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-sky-500 bg-sky-50/60 ring-4 ring-sky-100'
            : 'border-slate-300 hover:border-sky-400 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.csv,.docx,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={onFileSelect}
        />

        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-sm font-bold text-slate-900">
            Drag & Drop Financial Files Here
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            or <span className="font-semibold text-sky-600 underline">browse your local drive</span> to upload multiple documents together.
          </p>

          {/* Supported Format Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-slate-600">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
              <ImageIcon className="w-3.5 h-3.5 text-purple-600" /> JPG / PNG / WEBP
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
              <FileText className="w-3.5 h-3.5 text-rose-600" /> Multi-Page PDF
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
              <FileText className="w-3.5 h-3.5 text-blue-600" /> Word / DOCX
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> CSV Ledgers
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Processing Pipeline Visualizer */}
      {isProcessingFiles && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                ACTIVE EXTRACTION PIPELINE
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-sky-300">
              {overallProgress}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>{currentStage}</span>
            <span className="text-[11px] text-slate-500 font-mono">
              OCR & Layout Detection
            </span>
          </div>
        </div>
      )}

      {/* Uploaded Files Summary Strip */}
      {processedFiles.length > 0 && !isProcessingFiles && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Processed Documents ({processedFiles.length})
            </span>
            <span className="text-slate-500 font-mono">
              Ready for validation & model sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
            {processedFiles.map((pf) => (
              <div
                key={pf.id}
                className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] font-bold uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {pf.format}
                  </span>
                  <span className="truncate font-medium text-slate-800" title={pf.fileName}>
                    {pf.fileName}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-emerald-600 font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{pf.recordsCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
