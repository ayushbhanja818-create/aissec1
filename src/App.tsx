import React, { useState } from 'react';
import {
  ContainerType,
  DetectedSite,
  InspectionStatus,
  RiskCategory,
  UploadedImage,
} from './types/analysis';
import { BENGALURU_SITES, CONTAINER_TYPES_META } from './data/bengaluruSites';

import { Sidebar, ActiveTab } from './components/common/Sidebar';
import { HomeView } from './components/home/HomeView';
import { UploadView } from './components/upload/UploadView';
import { ResultsMapView } from './components/dashboard/ResultsMapView';
import { InspectionTasksView } from './components/inspection/InspectionTasksView';
import { ReportsView } from './components/reports/ReportsView';
import { AboutView } from './components/about/AboutView';
import { SiteDetailModal } from './components/dashboard/SiteDetailModal';

export function App() {
  // Highlight "Results & Map" as default as requested in Section 4!
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');

  // Master Bengaluru survey dataset
  const [sites, setSites] = useState<DetectedSite[]>(BENGALURU_SITES);
  const [totalImages, setTotalImages] = useState<number>(12);
  const [modalSite, setModalSite] = useState<DetectedSite | null>(null);

  // Derived counts for sidebar badges
  const highRiskCount = sites.filter((s) => s.riskCategory === 'high').length;
  const pendingCount = sites.filter(
    (s) => s.inspectionStatus === 'pending' || s.inspectionStatus === 'scheduled'
  ).length;

  // Update site status and inspector record
  const handleUpdateSite = (siteId: string, status: InspectionStatus, record?: any) => {
    setSites((prev) =>
      prev.map((s) => {
        if (s.siteId === siteId) {
          return {
            ...s,
            inspectionStatus: status,
            inspectionRecord: record
              ? {
                  ...s.inspectionRecord,
                  ...record,
                }
              : s.inspectionRecord,
          };
        }
        return s;
      })
    );

    if (modalSite && modalSite.siteId === siteId) {
      setModalSite((prev) =>
        prev
          ? {
              ...prev,
              inspectionStatus: status,
              inspectionRecord: record
                ? {
                    ...prev.inspectionRecord,
                    ...record,
                  }
                : prev.inspectionRecord,
            }
          : null
      );
    }
  };

  // CSV Import handler
  const handleImportCsv = (csvText: string) => {
    try {
      const lines = csvText.trim().split(/\r?\n/);
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
      const newSites: DetectedSite[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx] || '';
        });

        const siteId = row['site_id'] || row['site id'] || `BLR-IMP-${String(i).padStart(3, '0')}`;
        const rawType = (row['container_type'] || row['container type'] || 'other_container').toLowerCase();

        let containerType: ContainerType = 'other_container';
        if (rawType.includes('water') || rawType.includes('tank') || rawType.includes('sintex')) containerType = 'water_tank';
        else if (rawType.includes('drum') || rawType.includes('barrel')) containerType = 'drum';
        else if (rawType.includes('tyre') || rawType.includes('tire')) containerType = 'tyre';
        else if (rawType.includes('coconut')) containerType = 'coconut_shell';

        const rawScore = parseInt(row['risk_score'] || row['risk score'] || '65') || 65;
        let riskCategory: RiskCategory = 'medium';
        if (rawScore >= 70) riskCategory = 'high';
        else if (rawScore < 40) riskCategory = 'low';

        const latVal = parseFloat(row['latitude'] || row['lat'] || '');
        const lngVal = parseFloat(row['longitude'] || row['lng'] || row['lon'] || '');
        const hasGps = !isNaN(latVal) && !isNaN(lngVal);

        const newSite: DetectedSite = {
          id: `imp-${Date.now()}-${i}`,
          siteId,
          imageId: row['image_id'] || `IMG_IMP_${i}`,
          imageName: `SURVEY_TILE_${siteId}.jpg`,
          imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
          containerType,
          containerLabel: `${CONTAINER_TYPES_META[containerType].label} (${siteId})`,
          confidence: parseFloat(row['confidence'] || '0.85') || 0.85,
          riskScore: rawScore,
          riskCategory,
          locationName: row['location_name'] || row['neighborhood'] || (hasGps ? 'Imported Survey Location' : 'Location unavailable'),
          neighborhood: row['neighborhood'] || 'Bellandur Sub-Sector',
          wardName: 'Ward 150 - Bellandur',
          coordinates: hasGps ? { lat: latVal, lng: lngVal } : null,
          hasGps,
          boundingBox: { x: 30, y: 30, width: 30, height: 30 },
          factors: {
            containerWeight: CONTAINER_TYPES_META[containerType].defaultRiskWeight,
            exposed: row['exposed'] ? row['exposed'].toLowerCase() === 'yes' || row['exposed'] === 'true' : true,
            waterPresent: row['water_present'] ? row['water_present'].toLowerCase() === 'yes' : 'unknown',
            recentRain: true,
            shaded: false,
            neglected: true,
            residentialProximity: 80,
            formula: `Imported Rule Risk: ${rawScore}/100`,
          },
          inspectionStatus: 'pending',
          detectedAt: new Date().toISOString(),
        };

        newSites.push(newSite);
      }

      if (newSites.length > 0) {
        setSites(newSites);
        setTotalImages(Math.max(newSites.length, 6));
        setActiveTab('map');
      }
    } catch (e) {
      console.error('Error importing CSV:', e);
    }
  };

  // Analyze uploaded images handler
  const handleAnalyzeImages = (uploaded: UploadedImage[]) => {
    setTotalImages(uploaded.length);
    setActiveTab('map');
  };

  // Reload Bellandur sample
  const handleLoadBengaluruSample = () => {
    setSites(BENGALURU_SITES);
    setTotalImages(12);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Left Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pendingCount={pendingCount}
        highRiskCount={highRiskCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Minimal Pilot Bar */}
        <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Bruhat Bengaluru Mahanagara Palike (BBMP)
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
              Ward 150 - Bellandur
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>YOLOv8-SAHI (Mock Inference)</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1">
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <HomeView
              onNavigate={(tab) => setActiveTab(tab)}
              highRiskCount={highRiskCount}
              totalContainers={sites.length}
            />
          )}

          {/* TAB 2: UPLOAD */}
          {activeTab === 'upload' && (
            <UploadView
              onAnalyzeImages={handleAnalyzeImages}
              onImportCsv={handleImportCsv}
              onLoadBengaluruSample={handleLoadBengaluruSample}
            />
          )}

          {/* TAB 3: RESULTS & MAP (MAIN HEATMAP DASHBOARD) */}
          {activeTab === 'map' && (
            <ResultsMapView
              sites={sites}
              totalImages={totalImages}
              onUpdateSite={handleUpdateSite}
            />
          )}

          {/* TAB 4: INSPECTION TASKS */}
          {activeTab === 'inspection' && (
            <InspectionTasksView
              sites={sites}
              onSelectSite={(site) => setModalSite(site)}
              onUpdateStatus={handleUpdateSite}
            />
          )}

          {/* TAB 5: REPORTS & EXPORT */}
          {activeTab === 'reports' && <ReportsView sites={sites} />}

          {/* TAB 6: ABOUT & SDGS */}
          {activeTab === 'about' && <AboutView />}
        </main>
      </div>

      {/* Global Site Inspector Modal if triggered from Inspection view */}
      {modalSite && (
        <SiteDetailModal
          site={modalSite}
          onClose={() => setModalSite(null)}
          onUpdateSite={handleUpdateSite}
        />
      )}
    </div>
  );
}

export default App;
