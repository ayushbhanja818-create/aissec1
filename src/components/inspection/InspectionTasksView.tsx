import React, { useState } from 'react';
import { DetectedSite, InspectionStatus } from '../../types/analysis';
import { CONTAINER_TYPES_META, RISK_CATEGORY_CONFIG } from '../../data/bengaluruSites';
import {
  ClipboardList,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  Droplet,
  Bug,
  Eye,
  Building,
} from 'lucide-react';

interface InspectionTasksViewProps {
  sites: DetectedSite[];
  onSelectSite: (site: DetectedSite) => void;
  onUpdateStatus: (siteId: string, status: InspectionStatus, record?: any) => void;
}

export const InspectionTasksView: React.FC<InspectionTasksViewProps> = ({
  sites,
  onSelectSite,
  onUpdateStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<InspectionStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  // Compute model predictions vs field confirmation statistics
  const totalModelDetections = sites.length;
  const highRiskModelCount = sites.filter((s) => s.riskCategory === 'high').length;
  const pendingCount = sites.filter((s) => s.inspectionStatus === 'pending').length;
  const scheduledCount = sites.filter((s) => s.inspectionStatus === 'scheduled').length;
  const visitedCount = sites.filter(
    (s) => s.inspectionStatus === 'visited' || s.inspectionStatus === 'confirmed_breeding'
  ).length;
  const confirmedLarvaeCount = sites.filter(
    (s) => s.inspectionStatus === 'confirmed_breeding' || s.inspectionRecord?.larvaeObserved === true
  ).length;
  const unableToInspectCount = sites.filter((s) => s.inspectionStatus === 'unable_to_inspect').length;

  const filteredSites = sites.filter((s) => {
    if (statusFilter !== 'all' && s.inspectionStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.siteId.toLowerCase().includes(q) ||
        s.locationName.toLowerCase().includes(q) ||
        s.containerLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Municipal Health Department Dispatch
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            BBMP Vector Control Inspection Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track field crew ground-truth verification, larvicide administration, and source reduction.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
          Ward 150 (Bellandur) Field Unit
        </div>
      </div>

      {/* Model vs Ground-Truth Stats Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: AI Model Detections */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
            <span>AI Model Predictions</span>
            <Building className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalModelDetections}</span>
            <span className="text-xs text-red-400 font-mono">({highRiskModelCount} High Risk)</span>
          </div>
          <p className="text-[11px] text-slate-500">Unverified aerial container candidates</p>
        </div>

        {/* Stat 2: Ground Inspections Completed */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
            <span>Ground Visits Logged</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{visitedCount}</span>
            <span className="text-xs text-slate-400 font-mono">of {totalModelDetections}</span>
          </div>
          <p className="text-[11px] text-slate-500">Inspected by ward field health staff</p>
        </div>

        {/* Stat 3: Confirmed Breeding with Larvae */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
            <span>Confirmed Larvae</span>
            <Bug className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-400 font-mono">{confirmedLarvaeCount}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300">
              Active Larvicide
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Temephos / Bti treatments applied</p>
        </div>

        {/* Stat 4: Unable to Inspect (Locked/Access Denied) */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
            <span>Unable to Inspect</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-300 font-mono">
              {unableToInspectCount}
            </span>
            <span className="text-xs text-slate-500 font-mono">(Locked gates)</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Retained as high-concern; NOT treated as negative finding
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Site ID or neighborhood..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all', label: 'All Tasks' },
              { id: 'pending', label: 'Pending' },
              { id: 'scheduled', label: 'Scheduled' },
              { id: 'visited', label: 'Visited' },
              { id: 'confirmed_breeding', label: 'Confirmed Habitat' },
              { id: 'unable_to_inspect', label: 'Unable to Inspect' },
              { id: 'not_found', label: 'Not Found' },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setStatusFilter(id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer text-xs ${
                statusFilter === id
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.map((site) => {
          const meta = CONTAINER_TYPES_META[site.containerType];
          const riskConfig = RISK_CATEGORY_CONFIG[site.riskCategory];

          return (
            <div
              key={site.id}
              className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Site ID & Risk Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-cyan-400">{site.siteId}</span>
                    <span className="text-xs text-slate-400 font-mono">• {meta.label}</span>
                  </div>
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold uppercase rounded border"
                    style={{
                      backgroundColor: `${riskConfig.color}20`,
                      borderColor: `${riskConfig.color}40`,
                      color: riskConfig.color,
                    }}
                  >
                    Risk: {site.riskScore}/100
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-1">{site.containerLabel}</h4>
                <p className="text-xs text-slate-400 leading-snug">{site.locationName}</p>

                {/* Ground Truth Status Callout */}
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Current Field Status:</span>
                    <span className="font-mono font-bold text-cyan-300 uppercase">
                      {site.inspectionStatus.replace('_', ' ')}
                    </span>
                  </div>

                  {site.inspectionRecord?.larvaeObserved && (
                    <div className="text-[11px] text-red-400 flex items-center gap-1 font-semibold">
                      <Bug className="w-3.5 h-3.5" /> Larvae Confirmed in Field Sample
                    </div>
                  )}

                  {site.inspectionRecord?.larvicideApplied && (
                    <div className="text-[11px] text-teal-400 flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5" /> {site.inspectionRecord.larvicideType}
                    </div>
                  )}

                  {site.inspectionRecord?.notes && (
                    <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800">
                      “{site.inspectionRecord.notes}”
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <select
                  value={site.inspectionStatus}
                  onChange={(e) =>
                    onUpdateStatus(site.siteId, e.target.value as InspectionStatus)
                  }
                  className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="visited">Visited</option>
                  <option value="confirmed_breeding">Confirmed Habitat</option>
                  <option value="not_found">Not Found</option>
                  <option value="unable_to_inspect">Unable to Inspect</option>
                </select>

                <button
                  type="button"
                  onClick={() => onSelectSite(site)}
                  className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
