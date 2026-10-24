import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { DetectedSite, GeoCoordinates } from '../../types/analysis';
import {
  CONTAINER_TYPES_META,
  RISK_CATEGORY_CONFIG,
  BENGALURU_WARD_ZONES,
} from '../../data/bengaluruSites';
import {
  Map,
  Layers,
  Flame,
  Navigation,
  AlertCircle,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  ShieldAlert,
  Search,
} from 'lucide-react';

interface LeafletMapProps {
  sites: DetectedSite[];
  selectedSite: DetectedSite | null;
  onSelectSite: (site: DetectedSite) => void;
  centerCoords?: GeoCoordinates;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  centerCoords,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<any>(null);
  const coverageLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // View option toggles
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showMarkers, setShowMarkers] = useState<boolean>(true);
  const [showCoverage, setShowCoverage] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<'dark' | 'osm' | 'satellite'>('dark');

  // Filter sites with valid coordinates
  const mappedSites = sites.filter(
    (s): s is DetectedSite & { coordinates: NonNullable<DetectedSite['coordinates']> } =>
      Boolean(s.coordinates && typeof s.coordinates.lat === 'number' && typeof s.coordinates.lng === 'number')
  );

  const unmappedCount = sites.length - mappedSites.length;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Bengaluru Bellandur default coordinates
    const defaultLat = centerCoords?.lat ?? 12.9345;
    const defaultLng = centerCoords?.lng ?? 77.6740;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    });

    const tileUrl =
      mapStyle === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : mapStyle === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution:
        mapStyle === 'dark'
          ? '&copy; CARTO &copy; OpenStreetMap'
          : mapStyle === 'satellite'
          ? '&copy; Esri World Imagery'
          : '&copy; OpenStreetMap contributors',
    }).addTo(map);

    tileLayerRef.current = tiles;
    markersLayerRef.current = L.layerGroup().addTo(map);
    coverageLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Map Tiles
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    let newUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let newAttr = '&copy; CARTO &copy; OpenStreetMap';

    if (mapStyle === 'osm') {
      newUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      newAttr = '&copy; OpenStreetMap contributors';
    } else if (mapStyle === 'satellite') {
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      newAttr = '&copy; Esri World Imagery';
    }

    const newTiles = L.tileLayer(newUrl, {
      maxZoom: 19,
      attribution: newAttr,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTiles;
  }, [mapStyle]);

  // Update Heatmap Layer using leaflet.heat
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (!showHeatmap || mappedSites.length === 0) return;

    // Build heat points: [lat, lng, intensity]
    const heatData = mappedSites.map((s) => [
      s.coordinates.lat,
      s.coordinates.lng,
      Math.max(0.2, s.riskScore / 100),
    ]);

    try {
      const heat = (L as any).heatLayer(heatData, {
        radius: 35,
        blur: 25,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.2: '#10B981', // green low
          0.5: '#F59E0B', // amber medium
          0.8: '#EF4444', // red high
          1.0: '#991B1B', // deep crimson
        },
      });

      heat.addTo(map);
      heatLayerRef.current = heat;
    } catch (e) {
      console.warn('Leaflet.heat initialization fallback:', e);
    }
  }, [mappedSites.length, showHeatmap]);

  // Update Inspection Coverage Zone Polygons
  useEffect(() => {
    const coverageLayer = coverageLayerRef.current;
    if (!coverageLayer) return;

    coverageLayer.clearLayers();

    if (!showCoverage) return;

    BENGALURU_WARD_ZONES.forEach((zone) => {
      const polygon = L.polygon(zone.bounds, {
        color: '#06B6D4',
        weight: 2,
        fillColor: '#0891B2',
        fillOpacity: 0.12,
        dashArray: '4, 6',
      });

      polygon.bindPopup(`
        <div class="p-1 text-slate-100">
          <div class="text-xs font-bold text-cyan-400 font-mono">${zone.name}</div>
          <div class="text-[11px] text-slate-300 mt-1">Ward 150 - Bellandur Sub-Sector</div>
          <div class="text-[10px] text-slate-400 mt-1">
            Containers: <b class="text-white">${zone.totalContainers}</b> | High Risk: <b class="text-red-400">${zone.highRiskCount}</b>
          </div>
        </div>
      `);

      polygon.addTo(coverageLayer);
    });
  }, [showCoverage]);

  // Update Site Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (!showMarkers || mappedSites.length === 0) return;

    mappedSites.forEach((site) => {
      const { lat, lng } = site.coordinates;
      const config = RISK_CATEGORY_CONFIG[site.riskCategory];
      const isSelected = selectedSite?.id === site.id;

      // Status indicator icon
      const statusColor =
        site.inspectionStatus === 'confirmed_breeding'
          ? '#EF4444'
          : site.inspectionStatus === 'visited'
          ? '#10B981'
          : site.inspectionStatus === 'scheduled'
          ? '#0EA5E9'
          : '#F59E0B';

      const pulseRing =
        site.riskCategory === 'high'
          ? `<span class="absolute -inset-2 rounded-full animate-ping opacity-60" style="background-color: ${config.color}"></span>`
          : '';

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110'
        }">
          ${pulseRing}
          <div class="relative w-8 h-8 rounded-full flex items-center justify-center shadow-2xl border-2"
               style="background-color: #0B132B; border-color: ${isSelected ? '#FFFFFF' : config.color};">
            <div class="w-3.5 h-3.5 rounded-full" style="background-color: ${config.color}"></div>
          </div>
          <div class="absolute -bottom-5 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight bg-slate-950/95 text-slate-200 border border-slate-700 pointer-events-none whitespace-nowrap shadow-md">
            ${site.riskScore}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-risk-icon',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Rich Bengaluru Vector Surveillance Popup
      const meta = CONTAINER_TYPES_META[site.containerType];
      const popupHtml = document.createElement('div');
      popupHtml.className = 'p-1 text-slate-100 max-w-xs';
      popupHtml.innerHTML = `
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-xs font-mono font-bold text-cyan-400">${site.siteId}</span>
          <span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded" style="background-color: ${config.color}20; color: ${config.color}; border: 1px solid ${config.color}50;">
            ${config.label} (${site.riskScore}/100)
          </span>
        </div>
        <div class="text-xs font-bold text-white mb-0.5">${site.containerLabel}</div>
        <div class="text-[11px] text-slate-400 mb-2">${site.locationName}</div>
        
        <div class="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-900/90 p-2 rounded-lg mb-2 border border-slate-800 font-mono">
          <div><span class="text-slate-400">Class:</span> <span class="text-slate-200">${meta.label}</span></div>
          <div><span class="text-slate-400">Confidence:</span> <span class="text-teal-400">${(site.confidence * 100).toFixed(0)}%</span></div>
          <div><span class="text-slate-400">Status:</span> <span class="text-amber-300 font-bold">${site.inspectionStatus.toUpperCase().replace('_', ' ')}</span></div>
          <div><span class="text-slate-400">Coords:</span> <span class="text-slate-300">${lat.toFixed(4)}, ${lng.toFixed(4)}</span></div>
        </div>

        <button id="inspect-popup-btn-${site.id}" class="w-full py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow cursor-pointer">
          View Details & Inspector Log
        </button>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-popup', minWidth: 260 });

      marker.on('click', () => {
        onSelectSite(site);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`inspect-popup-btn-${site.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            onSelectSite(site);
          };
        }
      });

      marker.addTo(markersLayer);
    });
  }, [mappedSites.length, showMarkers, selectedSite?.id]);

  // Pan to selected site if changed
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedSite || !selectedSite.coordinates) return;
    mapInstanceRef.current.setView(
      [selectedSite.coordinates.lat, selectedSite.coordinates.lng],
      17,
      { animate: true }
    );
  }, [selectedSite?.id]);

  // Reset to Bengaluru Extent
  const handleResetBengaluru = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([12.9345, 77.6740], 14, { animate: true });
  };

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col">
      {/* Top Map Floating Controls */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer View Mode Toggles (Heatmap / Markers / Coverage) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-xl pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              showHeatmap
                ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-rose-400' : 'text-slate-400'}`} />
            <span>Heatmap {showHeatmap ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMarkers(!showMarkers)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              showMarkers
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${showMarkers ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span>Site Markers {showMarkers ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCoverage(!showCoverage)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              showCoverage
                ? 'bg-teal-500/25 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${showCoverage ? 'text-teal-400' : 'text-slate-400'}`} />
            <span>Ward Sectors</span>
          </button>
        </div>

        {/* Right: Map Style & Recenter Bengaluru */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1 p-1 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-xl">
            <button
              type="button"
              onClick={() => setMapStyle('dark')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                mapStyle === 'dark' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Dark GIS
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                mapStyle === 'satellite' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('osm')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                mapStyle === 'osm' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              OSM Road
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetBengaluru}
            title="Reset to Bellandur, Bengaluru extent"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl shadow-xl text-xs font-semibold transition"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Reset Bengaluru</span>
          </button>
        </div>
      </div>

      {/* Main Leaflet Container */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Unmapped GPS Warning Banner */}
      {unmappedCount > 0 && (
        <div className="absolute top-16 left-3 z-[1000] max-w-sm p-3 bg-amber-950/90 backdrop-blur-md border border-amber-500/40 rounded-xl shadow-2xl text-amber-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300">
              {unmappedCount} Site without GPS Excluded from Map
            </div>
            <p className="text-[11px] text-amber-200/80 mt-0.5 leading-snug">
              Displayed as “Location unavailable” in ranked inspection manifest below as per protocol.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] p-2.5 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl text-xs text-slate-300 flex items-center gap-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          Risk Scale:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
          <span className="text-[11px]">High (70–100)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
          <span className="text-[11px]">Medium (40–69)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-[11px]">Low (0–39)</span>
        </div>
      </div>

      {/* Map Context Watermark */}
      <div className="absolute bottom-3 right-3 z-[1000] px-3 py-1 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow">
        <span>Bengaluru, Karnataka (Ward 150 - Bellandur)</span>
      </div>
    </div>
  );
};
