import React from 'react';
import {
  Crosshair,
  Map,
  UploadCloud,
  ClipboardList,
  ShieldAlert,
  ArrowRight,
  Flame,
  Droplet,
  Layers,
  MapPin,
  Building,
} from 'lucide-react';
import { CONTAINER_TYPES_META } from '../../data/bengaluruSites';

interface HomeViewProps {
  onNavigate: (tab: any) => void;
  highRiskCount: number;
  totalContainers: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  highRiskCount,
  totalContainers,
}) => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Pilot Geographic Pill */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-lg">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>Bengaluru Urban District • BBMP Ward 150 (Bellandur Pilot)</span>
        </div>

        <div className="text-[11px] font-mono text-amber-300/90 flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Demo Mode — Simulated Data</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="space-y-4 text-center max-w-4xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-bold">
          The Last Bite — Dengue Habitat Intelligence
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          “Identify potential breeding habitats. Prioritize inspections. Help prevent dengue.”
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed pt-1">
          An AI-powered drone and aerial surveillance system deployed for Indian municipal corporations.
          We detect unsealed rooftop tanks, open water drums, discarded tyres, and coconut shell heaps
          across Bengaluru colonies to dispatch vector-control teams before dengue transmission cycles ignite.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            type="button"
            id="home-open-heatmap"
            onClick={() => onNavigate('map')}
            className="px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl shadow-cyan-950/60 flex items-center gap-2 transition cursor-pointer"
          >
            <Map className="w-4 h-4" />
            <span>Open Bengaluru Heatmap Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="home-upload-images"
            onClick={() => onNavigate('upload')}
            className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-bold text-xs sm:text-sm rounded-xl shadow transition cursor-pointer flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Upload Drone Survey</span>
          </button>

          <button
            type="button"
            id="home-view-tasks"
            onClick={() => onNavigate('inspection')}
            className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-bold text-xs sm:text-sm rounded-xl shadow transition cursor-pointer flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4 text-amber-400" />
            <span>Field Inspection Tasks</span>
          </button>
        </div>
      </div>

      {/* Transparent Disclaimer Box */}
      <div className="p-4 bg-slate-900/90 border border-cyan-500/30 rounded-2xl shadow-xl flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-cyan-300 uppercase tracking-wide">
            Public Health Transparency Notice
          </span>
          <p className="text-slate-300 leading-relaxed">
            The system identifies <strong>potential breeding-site containers</strong> (surrogates like
            uncovered water tanks, plastic drums, and discarded tyres), <strong>NOT mosquito larvae or confirmed dengue infections</strong>.
            Predicted risk prioritizes field inspections and must be distinguished from ground-truth
            larval sampling records.
          </p>
        </div>
      </div>

      {/* Bengaluru Vector Habitat Cards (Indian Context) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
              High-Risk Container Taxonomies
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Monsoon Breeding Micro-Habitats in Bengaluru
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {totalContainers} Detected in Bellandur Survey
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.values(CONTAINER_TYPES_META).map((meta) => (
            <div
              key={meta.id}
              className="p-4 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl space-y-2 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{meta.label}</span>
                <span className="text-[10px] font-mono font-bold text-cyan-400">
                  {meta.defaultRiskWeight}/100
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-3">
                {meta.indianContext}
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                Volume: <b className="text-slate-300">{meta.typicalWaterVolume}</b>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bengaluru Bellandur Geography Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
            <Building className="w-4 h-4" />
            <span>Green Glen & Haralur Road</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            High-density apartment complexes and independent homes where unsealed Sintex rooftop tanks
            and terrace saucers form discrete domestic breeding reservoirs.
          </p>
        </div>

        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
            <Droplet className="w-4 h-4" />
            <span>Bellandur Lake Fringe</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Stormwater drain inflows, tender coconut vendor heaps, and vacant plots holding rainwater
            create critical high-density micro-habitats.
          </p>
        </div>

        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold font-mono">
            <Layers className="w-4 h-4" />
            <span>ORR Commercial & Labor Sheds</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            200L blue HDPE water storage drums and tyre puncture garages along the Outer Ring Road
            corridor requiring prioritized BBMP health inspector visits.
          </p>
        </div>
      </div>
    </div>
  );
};
