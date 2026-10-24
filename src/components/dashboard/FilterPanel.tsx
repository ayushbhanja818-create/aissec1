import React from 'react';
import { ContainerType, InspectionStatus, RiskCategory } from '../../types/analysis';
import { CONTAINER_TYPES_META } from '../../data/bengaluruSites';
import { Search, Filter, RotateCcw, Sliders } from 'lucide-react';

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRisk: RiskCategory | 'all';
  onRiskChange: (risk: RiskCategory | 'all') => void;
  selectedType: ContainerType | 'all';
  onTypeChange: (t: ContainerType | 'all') => void;
  selectedStatus: InspectionStatus | 'all';
  onStatusChange: (status: InspectionStatus | 'all') => void;
  minRiskScore: number;
  onMinScoreChange: (score: number) => void;
  onResetFilters: () => void;
  totalSites: number;
  filteredSites: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery,
  onSearchChange,
  selectedRisk,
  onRiskChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  minRiskScore,
  onMinScoreChange,
  onResetFilters,
  totalSites,
  filteredSites,
}) => {
  return (
    <div className="p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Habitat Risk Filters
          </h3>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Search by Site ID or Location
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="e.g. BLR-BEL-001 or Green Glen..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Risk Category Segmented Buttons */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Risk Category
        </label>
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'high', label: 'High' },
              { id: 'medium', label: 'Med' },
              { id: 'low', label: 'Low' },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onRiskChange(id)}
              className={`py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                selectedRisk === id
                  ? id === 'high'
                    ? 'bg-red-500/30 text-red-300 border border-red-500/50 shadow-sm'
                    : id === 'medium'
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-sm'
                    : id === 'low'
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Container Type Dropdown */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Container Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as ContainerType | 'all')}
          className="w-full px-3 py-1.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Container Types</option>
          {Object.values(CONTAINER_TYPES_META).map((meta) => (
            <option key={meta.id} value={meta.id}>
              {meta.label}
            </option>
          ))}
        </select>
      </div>

      {/* Inspection Status Dropdown */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Inspection Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value as InspectionStatus | 'all')}
          className="w-full px-3 py-1.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Inspection Statuses</option>
          <option value="pending">Pending</option>
          <option value="scheduled">Scheduled</option>
          <option value="visited">Visited</option>
          <option value="confirmed_breeding">Confirmed Potential Habitat</option>
          <option value="not_found">Not Found</option>
          <option value="unable_to_inspect">Unable to Inspect</option>
        </select>
      </div>

      {/* Minimum Risk Score Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Sliders className="w-3 h-3 text-cyan-400" /> Min Risk Score:
          </span>
          <span className="font-mono text-cyan-300 font-bold text-xs">{minRiskScore}/100</span>
        </div>
        <input
          type="range"
          min={0}
          max={95}
          step={5}
          value={minRiskScore}
          onChange={(e) => onMinScoreChange(parseInt(e.target.value) || 0)}
          className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0 (All)</span>
          <span>40 (Med+)</span>
          <span>70 (High)</span>
        </div>
      </div>

      {/* Counter Summary */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Active Filters:</span>
        <span>
          <b className="text-cyan-400">{filteredSites}</b> of {totalSites} sites
        </span>
      </div>
    </div>
  );
};
