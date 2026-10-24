import React, { useState } from 'react';
import { DetectedSite, InspectionStatus } from '../../types/analysis';
import { CONTAINER_TYPES_META, RISK_CATEGORY_CONFIG } from '../../data/bengaluruSites';
import { formatCoordinates } from '../../utils/formatters';
import {
  X,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Crosshair,
  Droplet,
  Sun,
  Layers,
  Save,
  UserCheck,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface SiteDetailModalProps {
  site: DetectedSite | null;
  onClose: () => void;
  onUpdateSite: (siteId: string, status: InspectionStatus, record?: any) => void;
}

export const SiteDetailModal: React.FC<SiteDetailModalProps> = ({
  site,
  onClose,
  onUpdateSite,
}) => {
  if (!site) return null;

  const [currentStatus, setCurrentStatus] = useState<InspectionStatus>(site.inspectionStatus);
  const [inspectorName, setInspectorName] = useState<string>(
    site.inspectionRecord?.inspectorName || 'Senior Health Inspector (BBMP Ward 150)'
  );
  const [observedCondition, setObservedCondition] = useState<string>(
    site.inspectionRecord?.observedCondition || ''
  );
  const [isWaterPresent, setIsWaterPresent] = useState<boolean>(
    site.inspectionRecord?.waterPresent ?? (site.factors.waterPresent === true)
  );
  const [isLarvaeObserved, setIsLarvaeObserved] = useState<boolean>(
    site.inspectionRecord?.larvaeObserved ?? false
  );
  const [larvicideApplied, setLarvicideApplied] = useState<boolean>(
    site.inspectionRecord?.larvicideApplied ?? false
  );
  const [larvicideType, setLarvicideType] = useState<string>(
    site.inspectionRecord?.larvicideType || 'Temephos (Abate 1SG)'
  );
  const [notes, setNotes] = useState<string>(site.inspectionRecord?.notes || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const meta = CONTAINER_TYPES_META[site.containerType];
  const riskConfig = RISK_CATEGORY_CONFIG[site.riskCategory];
  const { boundingBox } = site;

  const handleSave = () => {
    onUpdateSite(site.siteId, currentStatus, {
      inspectionDate: new Date().toISOString().split('T')[0],
      inspectorName,
      observedCondition,
      waterPresent: isWaterPresent,
      larvaeObserved: isLarvaeObserved,
      larvicideApplied,
      larvicideType: larvicideApplied ? larvicideType : undefined,
      notes,
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-cyan-400">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{site.siteId}</h3>
                <span
                  className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full border"
                  style={{
                    backgroundColor: `${riskConfig.color}20`,
                    borderColor: `${riskConfig.color}40`,
                    color: riskConfig.color,
                  }}
                >
                  {riskConfig.label} ({site.riskScore}/100)
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                  {(site.confidence * 100).toFixed(0)}% AI confidence
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {site.locationName} • <span className="text-cyan-400">{site.wardName}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[78vh] overflow-y-auto">
          {/* Left Column: Image with Bounding Box Overlay */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={site.imageUrl}
                alt={site.containerLabel}
                className="w-full h-full object-cover"
              />

              {/* Bounding Box Overlay */}
              <div
                className="absolute border-2 pointer-events-none transition-all duration-300"
                style={{
                  left: `${boundingBox.x}%`,
                  top: `${boundingBox.y}%`,
                  width: `${boundingBox.width}%`,
                  height: `${boundingBox.height}%`,
                  borderColor: riskConfig.color,
                  boxShadow: `0 0 14px ${riskConfig.color}80, inset 0 0 14px ${riskConfig.color}30`,
                }}
              >
                <div
                  className="absolute -top-6 left-0 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-white rounded shadow-md whitespace-nowrap flex items-center gap-1"
                  style={{ backgroundColor: riskConfig.color }}
                >
                  <Crosshair className="w-2.5 h-2.5" />
                  <span>
                    {meta.label} ({(site.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
                {/* Corner crosshairs */}
                <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
                <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />
              </div>

              {/* Drone telemetry tag */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 bg-slate-950/85 backdrop-blur-md rounded border border-slate-800 text-[10px] font-mono text-slate-300">
                <span>SURVEY: {site.imageName}</span>
                <span className="text-cyan-400">GSD: 1.1 cm/px</span>
              </div>
            </div>

            {/* Container Type Meta */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Indian Container Taxonomy
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">{meta.label}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{meta.indianContext}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Typical Capacity:</span>
                <span className="text-slate-200 font-medium">{meta.typicalWaterVolume}</span>
              </div>
            </div>

            {/* Recommended Protocol */}
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-xs space-y-1">
              <span className="font-bold text-cyan-300 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> BBMP Vector Control Protocol
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {meta.recommendedAction}
              </p>
            </div>
          </div>

          {/* Right Column: Score Breakdown & Inspection Management */}
          <div className="lg:col-span-6 space-y-4">
            {/* Risk Formula Breakdown */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Transparent Risk Scoring Factors
                </span>
                <span className="text-sm font-mono font-bold" style={{ color: riskConfig.color }}>
                  {site.riskScore} / 100
                </span>
              </div>

              {/* Contributing Factors */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-cyan-400" /> Container Morphology Weight
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">
                    {site.factors.containerWeight}/100
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Exposed to Rain / Open Access
                  </span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      site.factors.exposed ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {site.factors.exposed ? 'YES (Open)' : 'NO (Covered)'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-sky-400" /> Standing Water Observed / Reported
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {site.factors.waterPresent === true
                      ? 'YES'
                      : site.factors.waterPresent === false
                      ? 'NO'
                      : 'UNKNOWN (Unchecked)'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-purple-400" /> Residential Proximity Factor
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">
                    {site.factors.residentialProximity}/100
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-400">
                <span className="text-cyan-400 font-bold block mb-0.5">RULE-BASED FORMULA:</span>
                {site.factors.formula}
              </div>
            </div>

            {/* Geographic Localization */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Geographic Localization
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Coordinates:</span>
                {site.hasGps && site.coordinates ? (
                  <span className="font-mono text-cyan-300 font-semibold">
                    {formatCoordinates(site.coordinates)}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                    Location unavailable (Excluded from Map)
                  </span>
                )}
              </div>
            </div>

            {/* Field Inspection Management Form */}
            <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Field Inspector Record
                </span>
                <span className="text-[10px] text-slate-400">BBMP Field Protocol</span>
              </div>

              {/* Status Select Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                {(
                  [
                    { id: 'pending', label: 'Pending' },
                    { id: 'scheduled', label: 'Scheduled' },
                    { id: 'visited', label: 'Visited' },
                    { id: 'confirmed_breeding', label: 'Confirmed Habitat' },
                    { id: 'not_found', label: 'Not Found' },
                    { id: 'unable_to_inspect', label: 'Unable to Inspect' },
                  ] as const
                ).map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCurrentStatus(id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                      currentStatus === id
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Specific rule disclaimer */}
              {currentStatus === 'unable_to_inspect' && (
                <div className="p-2 bg-purple-950/40 border border-purple-500/30 rounded-lg text-[10px] text-purple-300 flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Protocol note: “Unable to inspect” is recorded for locked gates or denied access
                    and must NOT be treated as a negative finding.
                  </span>
                </div>
              )}

              {/* Field Observation Checklist */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                  <input
                    type="checkbox"
                    checked={isWaterPresent}
                    onChange={(e) => setIsWaterPresent(e.target.checked)}
                    className="accent-cyan-500 w-3.5 h-3.5"
                  />
                  <span className="text-slate-300 text-[11px]">Standing Water Present</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                  <input
                    type="checkbox"
                    checked={isLarvaeObserved}
                    onChange={(e) => setIsLarvaeObserved(e.target.checked)}
                    className="accent-red-500 w-3.5 h-3.5"
                  />
                  <span className="text-slate-300 text-[11px]">Larvae / Pupae Observed</span>
                </label>
              </div>

              {/* Larvicide Treatment */}
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={larvicideApplied}
                    onChange={(e) => setLarvicideApplied(e.target.checked)}
                    className="accent-teal-500 w-3.5 h-3.5"
                  />
                  <span className="text-slate-300 font-semibold text-[11px]">
                    Larvicide Treatment / Source Reduction Applied
                  </span>
                </label>

                {larvicideApplied && (
                  <select
                    value={larvicideType}
                    onChange={(e) => setLarvicideType(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                  >
                    <option value="Temephos (Abate 1SG)">Temephos (Abate 1SG) Granules</option>
                    <option value="Bti granules (Bacillus thuringiensis israelensis)">
                      Bti Granules (Bacterial Larvicide)
                    </option>
                    <option value="Physical source reduction / Inverted container">
                      Physical Source Reduction / Container Inversion
                    </option>
                  </select>
                )}
              </div>

              {/* Inspector Log Notes */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Inspector Observation Notes:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record observations, owner notification, or follow-up date..."
                  rows={2}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">
                  Propagates to inspection tasks and manifest.
                </span>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{showSavedToast ? 'Saved!' : 'Save Inspection Record'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
