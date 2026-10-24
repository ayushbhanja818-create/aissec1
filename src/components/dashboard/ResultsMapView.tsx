import React, { useState } from 'react';
import {
  ContainerType,
  DetectedSite,
  InspectionStatus,
  RiskCategory,
} from '../../types/analysis';
import { BengaluruKpiCards } from './BengaluruKpiCards';
import { LeafletMap } from './LeafletMap';
import { FilterPanel } from './FilterPanel';
import { RankedSitesList } from './RankedSitesList';
import { SiteDetailModal } from './SiteDetailModal';

interface ResultsMapViewProps {
  sites: DetectedSite[];
  totalImages: number;
  onUpdateSite: (siteId: string, status: InspectionStatus, record?: any) => void;
}

export const ResultsMapView: React.FC<ResultsMapViewProps> = ({
  sites,
  totalImages,
  onUpdateSite,
}) => {
  const [selectedSite, setSelectedSite] = useState<DetectedSite | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<RiskCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ContainerType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<InspectionStatus | 'all'>('all');
  const [minRiskScore, setMinRiskScore] = useState<number>(0);

  // Calculated KPI stats
  const totalContainers = sites.length;
  const highPriorityCount = sites.filter((s) => s.riskScore >= 70).length;
  const awaitingInspectionCount = sites.filter(
    (s) => s.inspectionStatus === 'pending' || s.inspectionStatus === 'scheduled'
  ).length;

  // Filter logic
  const filteredSites = sites.filter((site) => {
    if (selectedRisk !== 'all' && site.riskCategory !== selectedRisk) return false;
    if (selectedType !== 'all' && site.containerType !== selectedType) return false;
    if (selectedStatus !== 'all' && site.inspectionStatus !== selectedStatus) return false;
    if (site.riskScore < minRiskScore) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = site.siteId.toLowerCase().includes(q);
      const matchLoc = site.locationName.toLowerCase().includes(q);
      const matchLabel = site.containerLabel.toLowerCase().includes(q);
      const matchNeigh = site.neighborhood.toLowerCase().includes(q);
      if (!matchId && !matchLoc && !matchLabel && !matchNeigh) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRisk('all');
    setSelectedType('all');
    setSelectedStatus('all');
    setMinRiskScore(0);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto">
      {/* 4 Summary KPI Cards */}
      <BengaluruKpiCards
        totalImages={totalImages}
        totalContainers={totalContainers}
        highPriorityCount={highPriorityCount}
        awaitingInspectionCount={awaitingInspectionCount}
        isSimulated={true}
      />

      {/* Main Grid: Central Map + Right-side Filters & Ranked Sites */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Central Map: 7-8 columns */}
        <div className="lg:col-span-8 flex flex-col h-[640px] xl:h-[720px]">
          <LeafletMap
            sites={filteredSites}
            selectedSite={selectedSite}
            onSelectSite={(site) => setSelectedSite(site)}
            centerCoords={{ lat: 12.9345, lng: 77.6740 }} // Bellandur center
          />
        </div>

        {/* Right Side Panel: 4-5 columns */}
        <div className="lg:col-span-4 space-y-4 flex flex-col">
          {/* Filters Panel */}
          <FilterPanel
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRisk={selectedRisk}
            onRiskChange={setSelectedRisk}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            minRiskScore={minRiskScore}
            onMinScoreChange={setMinRiskScore}
            onResetFilters={handleResetFilters}
            totalSites={sites.length}
            filteredSites={filteredSites.length}
          />

          {/* Ranked Sites List */}
          <RankedSitesList
            sites={filteredSites}
            selectedSite={selectedSite}
            onSelectSite={(site) => setSelectedSite(site)}
          />
        </div>
      </div>

      {/* Site Detail Inspector Modal */}
      <SiteDetailModal
        site={selectedSite}
        onClose={() => setSelectedSite(null)}
        onUpdateSite={onUpdateSite}
      />
    </div>
  );
};
