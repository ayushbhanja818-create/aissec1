import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { UploadedImage, DetectedSite } from '../../types/analysis';
import { formatFileSize } from '../../utils/formatters';

interface UploadViewProps {
  onAnalyzeImages: (images: UploadedImage[]) => void;
  onImportCsv: (csvContent: string) => void;
  onLoadBengaluruSample: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onAnalyzeImages,
  onImportCsv,
  onLoadBengaluruSample,
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setValidationError(null);

    const newItems: UploadedImage[] = [];
    Array.from(files).forEach((file, idx) => {
      if (!file.name.match(/\.(jpg|jpeg|png)$/i)) {
        setValidationError('Only JPG, JPEG, and PNG images are supported.');
        return;
      }

      newItems.push({
        id: `img-${Date.now()}-${idx}`,
        file,
        name: file.name,
        sizeBytes: file.size,
        previewUrl: URL.createObjectURL(file),
        uploadTimestamp: new Date().toISOString(),
        status: 'ready',
      });
    });

    setImages((prev) => [...prev, ...newItems]);
  };

  const handleCsvFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.endsWith('.csv')) {
      setValidationError('Please upload a valid .csv file containing detection records.');
      return;
    }

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onImportCsv(content);
      }
    };
    reader.readAsText(file);
  };

  const handleStartInference = () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onAnalyzeImages(images);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          Drone / Aerial Imagery & Metadata Ingestion
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ingest Drone Surveys & Geotagged Detections
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Upload orthomosaic image frames or CSV manifests. Runs the YOLOv8-SAHI sliced inference
          pipeline with transparent rule-based risk scoring.
        </p>
      </div>

      {/* Transparent Model Disclaimer */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 uppercase tracking-wide">
            Inference Architecture Transparency
          </span>
          <p className="text-amber-200/90 leading-relaxed">
            The intended deployment pipeline runs a YOLOv8x model with SAHI (Sliced Aided Hyper Inference)
            for high-resolution drone orthophoto frames. In this demo environment without live GPU weights,
            inference runs in <strong>clearly labeled simulated mock mode</strong> with verified Bengaluru
            habitat parameters.
          </p>
        </div>
      </div>

      {/* Dual Ingestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Aerial Image Upload */}
        <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm">
              <UploadCloud className="w-5 h-5" />
              <span>Aerial Drone Frames (JPG, PNG)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload drone photography tiles. System extracts EXIF GPS if available, runs object
              recognition, and generates bounding box overlays.
            </p>

            <div
              onClick={() => imageInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-xl cursor-pointer text-center bg-slate-950/60 transition group"
            >
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={(e) => handleImageFiles(e.target.files)}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 mx-auto text-slate-500 group-hover:text-cyan-400 transition" />
              <p className="text-xs font-semibold text-slate-200 mt-2">
                Click to browse drone photos
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">JPG, JPEG, PNG up to 50MB</p>
            </div>

            {images.length > 0 && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-300">
                  {images.length} image(s) selected
                </span>
                <span className="text-cyan-400 font-mono">
                  {formatFileSize(images.reduce((acc, i) => acc + i.sizeBytes, 0))}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleStartInference}
            disabled={images.length === 0 || isProcessing}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              images.length > 0 && !isProcessing
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/50'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Simulating YOLOv8 Inference...' : `Analyze ${images.length} Images`}</span>
          </button>
        </div>

        {/* Card 2: CSV Metadata Ingestion */}
        <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-teal-400 font-bold text-sm">
              <FileSpreadsheet className="w-5 h-5" />
              <span>Inspection Manifest (CSV)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload pre-processed drone CSV with columns: <code className="text-teal-300 font-mono">site_id, container_type, confidence, latitude, longitude, risk_score</code>.
            </p>

            <div
              onClick={() => csvInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-slate-700 hover:border-teal-400 rounded-xl cursor-pointer text-center bg-slate-950/60 transition group"
            >
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => handleCsvFile(e.target.files)}
                className="hidden"
              />
              <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-500 group-hover:text-teal-400 transition" />
              <p className="text-xs font-semibold text-slate-200 mt-2">
                Click to upload survey CSV
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Compatible with QGIS / DroneDeploy logs</p>
            </div>

            {csvFileName && (
              <div className="p-3 bg-teal-950/30 rounded-xl border border-teal-500/40 text-xs flex items-center gap-2 text-teal-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="truncate">Loaded: {csvFileName}</span>
              </div>
            )}
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            CSV records without coordinates are marked “Location unavailable” and kept off the map.
          </div>
        </div>
      </div>

      {/* Quick Load Pre-Configured Bengaluru Mission */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
            One-Click Demonstration
          </span>
          <h3 className="text-base font-bold text-white">
            Bengaluru Ward 150 (Bellandur) Survey Dataset
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Loads 12 georeferenced aerial detections across Green Glen Layout, Bellandur Lake fringe,
            and Ecospace ORR corridor with verified Indian container taxonomy.
          </p>
        </div>

        <button
          type="button"
          onClick={onLoadBengaluruSample}
          className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/60 transition shrink-0 cursor-pointer"
        >
          Load Bellandur Survey & View Map
        </button>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
