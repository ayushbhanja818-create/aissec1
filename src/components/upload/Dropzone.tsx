import React, { useRef, useState } from 'react';
import { UploadCloud, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxFileSizeMb?: number;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  maxFiles = 25,
  maxFileSizeMb = 50,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png'];

  const validateAndHandleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setValidationError(null);

    const validFiles: File[] = [];
    const rejected: string[] = [];

    Array.from(fileList).forEach((file) => {
      // Check file extension / MIME type
      const isAccepted =
        acceptedFormats.includes(file.type.toLowerCase()) ||
        file.name.match(/\.(jpg|jpeg|png)$/i);

      if (!isAccepted) {
        rejected.push(`${file.name} (unsupported format)`);
        return;
      }

      // Check max size
      if (file.size > maxFileSizeMb * 1024 * 1024) {
        rejected.push(`${file.name} (exceeds ${maxFileSizeMb}MB limit)`);
        return;
      }

      validFiles.push(file);
    });

    if (rejected.length > 0) {
      setValidationError(`Some files could not be added: ${rejected.join(', ')}`);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles.slice(0, maxFiles));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndHandleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-teal-400 bg-teal-950/20 scale-[1.01]'
            : 'border-slate-700 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          onChange={(e) => validateAndHandleFiles(e.target.files)}
          className="hidden"
        />

        <div className="p-4 mb-4 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-inner">
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white text-center">
          Upload Drone / Aerial Survey Imagery
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 text-center mt-1 max-w-md">
          Drag & drop high-resolution orthophotos or individual frames, or{' '}
          <span className="text-teal-400 underline font-semibold">browse files</span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-[11px] text-slate-500">
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
            JPG, JPEG, PNG
          </span>
          <span>•</span>
          <span>Max {maxFileSizeMb} MB per file</span>
          <span>•</span>
          <span>Batch upload up to {maxFiles} images</span>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
