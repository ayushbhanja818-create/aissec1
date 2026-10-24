import React from 'react';
import { UploadedImage } from '../../types/analysis';
import { formatFileSize } from '../../utils/formatters';
import { Trash2, Image as ImageIcon, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImagePreviewListProps {
  images: UploadedImage[];
  onRemoveImage: (id: string) => void;
  onClearAll: () => void;
  onLoadSampleMission: () => void;
}

export const ImagePreviewList: React.FC<ImagePreviewListProps> = ({
  images,
  onRemoveImage,
  onClearAll,
  onLoadSampleMission,
}) => {
  const totalSizeBytes = images.reduce((acc, img) => acc + img.sizeBytes, 0);

  if (images.length === 0) {
    return (
      <div className="p-6 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-center space-y-3">
        <p className="text-xs text-slate-400">No images selected yet.</p>
        <div className="flex items-center justify-center">
          <button
            type="button"
            id="btn-load-sample-mission"
            onClick={onLoadSampleMission}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-teal-950/40 transition cursor-pointer"
          >
            Load Jurong West Drone Survey (6 Sample Images)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">Selected Survey Images</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-mono text-teal-400 font-bold">
            {images.length}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-mono">{formatFileSize(totalSizeBytes)} total</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLoadSampleMission}
            className="text-teal-400 hover:text-teal-300 text-xs font-medium transition cursor-pointer"
          >
            Reset to Sample Survey
          </button>
          <span className="text-slate-600">|</span>
          <button
            type="button"
            id="btn-clear-all-images"
            onClick={onClearAll}
            className="text-slate-400 hover:text-rose-400 text-xs font-medium transition cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Grid of image cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative flex items-center gap-3 p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl group hover:border-slate-700 transition"
          >
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
              <img
                src={img.previewUrl}
                alt={img.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-xs font-semibold text-slate-200 truncate" title={img.name}>
                {img.name}
              </h4>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                {formatFileSize(img.sizeBytes)}
              </p>

              <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                {img.detectedCoordinates ? (
                  <span className="text-teal-400 flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" /> GPS Tagged
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center gap-0.5">
                    <AlertCircle className="w-2.5 h-2.5" /> No GPS Tag
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRemoveImage(img.id)}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              title="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
