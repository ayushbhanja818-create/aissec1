import React from 'react';
import { DetectedSite } from '../../types/analysis';
import { CONTAINER_TYPES_META, RISK_CATEGORY_CONFIG } from '../../data/bengaluruSites';
import { exportSitesToCsv } from '../../utils/exportCsv';
import {
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  BarChart3,
  Layers,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface ReportsViewProps {
  sites: DetectedSite[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ sites }) => {
  const total = sites.length;
  const highRisk = sites.filter((s) => s.riskCategory === 'high');
  const mediumRisk = sites.filter((s) => s.riskCategory === 'medium');
  const lowRisk = sites.filter((s) => s.riskCategory === 'low');

  const inspected = sites.filter((s) => s.inspectionStatus === 'visited' || s.inspectionStatus === 'confirmed_breeding');
  const pending = sites.filter((s) => s.inspectionStatus === 'pending' || s.inspectionStatus === 'scheduled');
  const unableToInspect = sites.filter((s) => s.inspectionStatus === 'unable_to_inspect');
  const confirmedBreeding = sites.filter((s) => s.inspectionStatus === 'confirmed_breeding');

  // Breakdown by container type
  const typeCounts = {
    water_tank: sites.filter((s) => s.containerType === 'water_tank').length,
    drum: sites.filter((s) => s.containerType === 'drum').length,
    tyre: sites.filter((s) => s.containerType === 'tyre').length,
    coconut_shell: sites.filter((s) => s.containerType === 'coconut_shell').length,
    other_container: sites.filter((s) => s.containerType === 'other_container').length,
  };

  const handleExportFullManifest = () => {
    exportSitesToCsv(sites, 'TheLastBite_Bengaluru_Ward150_Manifest');
  };

  const handleExportHighRiskOnly = () => {
    exportSitesToCsv(highRisk, 'TheLastBite_Bengaluru_HighRisk_Priority');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header with Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Vector Control Documentation
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Surveillance Reports & Manifest Export
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            BBMP Ward 150 (Bellandur) Municipal Dengue Preparedness Manifest
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportHighRiskOnly}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-200 text-xs font-semibold rounded-xl shadow transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span>High-Risk CSV ({highRisk.length})</span>
          </button>

          <button
            type="button"
            onClick={handleExportFullManifest}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-950/50 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Full Manifest (CSV)</span>
          </button>
        </div>
      </div>

      {/* Model vs Ground Truth Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Risk Distribution */}
        <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>AI Model Prioritization Distribution</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{total} Sites</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400 font-semibold">High Priority (70–100)</span>
                <span className="font-mono text-slate-200 font-bold">
                  {highRisk.length} ({total > 0 ? ((highRisk.length / total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${total > 0 ? (highRisk.length / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-semibold">Medium Priority (40–69)</span>
                <span className="font-mono text-slate-200 font-bold">
                  {mediumRisk.length} ({total > 0 ? ((mediumRisk.length / total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${total > 0 ? (mediumRisk.length / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400 font-semibold">Low Priority (0–39)</span>
                <span className="font-mono text-slate-200 font-bold">
                  {lowRisk.length} ({total > 0 ? ((lowRisk.length / total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${total > 0 ? (lowRisk.length / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Field Confirmation Status */}
        <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Inspector Field Progress Status</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Ground-Truth Log</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Field Visited</span>
              <div className="text-2xl font-mono font-bold text-emerald-400">{inspected.length}</div>
              <span className="text-[10px] text-slate-500">Physical access verified</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Awaiting Crew</span>
              <div className="text-2xl font-mono font-bold text-amber-400">{pending.length}</div>
              <span className="text-[10px] text-slate-500">Pending / Scheduled</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Confirmed Larvae</span>
              <div className="text-2xl font-mono font-bold text-red-400">{confirmedBreeding.length}</div>
              <span className="text-[10px] text-slate-500">Larvicide administered</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Unable to Inspect</span>
              <div className="text-2xl font-mono font-bold text-purple-400">
                {unableToInspect.length}
              </div>
              <span className="text-[10px] text-slate-500">Premises locked / Access denied</span>
            </div>
          </div>
        </div>
      </div>

      {/* Container Taxonomy Breakdown Table */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Container Category Prevalence in Bellandur Survey</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(typeCounts).map(([key, count]) => {
            const meta = CONTAINER_TYPES_META[key as keyof typeof CONTAINER_TYPES_META];
            return (
              <div key={key} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-xs font-semibold text-white">{meta.label}</div>
                <div className="text-xl font-mono font-bold text-cyan-400">{count}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Base risk: {meta.defaultRiskWeight}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
