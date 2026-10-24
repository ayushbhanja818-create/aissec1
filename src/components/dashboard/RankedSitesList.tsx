import React from 'react';
import { DetectedSite } from '../../types/analysis';
import { CONTAINER_TYPES_META, RISK_CATEGORY_CONFIG } from '../../data/bengaluruSites';
import { Eye, Clock, Calendar, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RankedSitesListProps {
  sites: DetectedSite[];
  selectedSite: DetectedSite | null;
  onSelectSite: (site: DetectedSite) => void;
}

export const RankedSitesList: React.FC<RankedSitesListProps> = ({
  sites,
  selectedSite,
  onSelectSite,
}) => {
  // Sort descending by risk score
  const sortedSites = [...sites].sort((a, b) => b.riskScore - a.riskScore);

  if (sortedSites.length === 0) {
    return (
      <div className="p-8 bg-slate-900/60 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
        No potential breeding sites match the active filters.
      </div>
    );
  }

  const getStatusBadge = (status: DetectedSite['inspectionStatus']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300">
            Pending
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sky-500/15 border border-sky-500/30 text-sky-300">
            Scheduled
          </span>
        );
      case 'visited':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-teal-500/15 border border-teal-500/30 text-teal-300">
            Visited
          </span>
        );
      case 'confirmed_breeding':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 border border-red-500/40 text-red-300">
            Confirmed Habitat
          </span>
        );
      case 'not_found':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 border border-slate-700 text-slate-400">
            Not Found
          </span>
        );
      case 'unable_to_inspect':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/15 border border-purple-500/30 text-purple-300">
            Unable to Inspect
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Ranked Inspection Queue
          </h3>
          <p className="text-[10px] text-slate-400">Prioritized by rule-based composite risk</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-400 font-bold">
          {sortedSites.length} Sites
        </span>
      </div>

      {/* Scrollable Table List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
        {sortedSites.map((site, index) => {
          const meta = CONTAINER_TYPES_META[site.containerType];
          const riskConfig = RISK_CATEGORY_CONFIG[site.riskCategory];
          const isSelected = selectedSite?.id === site.id;

          return (
            <div
              key={site.id}
              onClick={() => onSelectSite(site)}
              className={`p-3 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs ${
                isSelected
                  ? 'bg-cyan-950/40 border-l-4 border-l-cyan-400'
                  : 'hover:bg-slate-800/50'
              }`}
            >
              {/* Left: Rank & Site ID */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                    index < 3
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {index + 1}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-cyan-300 text-[11px]">
                      {site.siteId}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                      {meta.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                    {site.neighborhood}
                  </div>
                </div>
              </div>

              {/* Middle: Risk meter & Score */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${site.riskScore}%`,
                      backgroundColor: riskConfig.color,
                    }}
                  />
                </div>

                <span
                  className="font-mono font-extrabold text-xs w-7 text-right"
                  style={{ color: riskConfig.color }}
                >
                  {site.riskScore}
                </span>

                {/* Status Badge */}
                <div className="shrink-0">{getStatusBadge(site.inspectionStatus)}</div>

                {/* Inspect Action */}
                <button
                  type="button"
                  title="Inspect site details"
                  className="p-1 hover:text-cyan-400 text-slate-500 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
