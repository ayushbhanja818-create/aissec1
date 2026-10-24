export type ContainerType =
  | 'water_tank'
  | 'drum'
  | 'tyre'
  | 'coconut_shell'
  | 'other_container';

export type RiskCategory = 'high' | 'medium' | 'low';

export type InspectionStatus =
  | 'pending'
  | 'scheduled'
  | 'visited'
  | 'confirmed_breeding'
  | 'not_found'
  | 'unable_to_inspect'
  | 'inspected'
  | 'cleared';

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RiskFactors {
  containerWeight: number; // 0-100
  exposed: boolean;
  waterPresent: boolean | 'unknown';
  recentRain: boolean;
  shaded: boolean;
  neglected: boolean;
  residentialProximity: number; // 0-100
  formula: string;
}

export interface InspectionRecord {
  inspectionDate?: string;
  inspectorName?: string;
  observedCondition?: string;
  waterPresent?: boolean;
  larvaeObserved?: boolean;
  larvicideApplied?: boolean;
  larvicideType?: string; // 'Temephos (Abate 1SG)' | 'Bti granules' | 'Physical source reduction'
  notes?: string;
}

export interface DetectedSite {
  id: string;
  siteId: string;
  imageId: string;
  imageName: string;
  imageUrl: string;
  containerType: ContainerType;
  containerLabel: string;
  confidence: number;
  riskScore: number; // 0 to 100
  riskCategory: RiskCategory;
  locationName: string;
  neighborhood: string;
  wardName: string; // e.g. "Ward 150 - Bellandur"
  coordinates: GeoCoordinates | null;
  hasGps: boolean;
  boundingBox: BoundingBox;
  factors: RiskFactors;
  inspectionStatus: InspectionStatus;
  inspectionRecord?: InspectionRecord;
  detectedAt: string;
  // Aliases for compatibility
  containerClass?: ContainerType;
  riskLevel?: RiskCategory;
  riskBreakdown?: any;
}

export interface UploadedImage {
  id: string;
  file?: File;
  name: string;
  sizeBytes: number;
  previewUrl: string;
  detectedCoordinates?: GeoCoordinates | null;
  locationName?: string;
  surveyDate?: string;
  uploadTimestamp: string;
  status: 'ready' | 'processing' | 'completed' | 'error';
}

export interface SurveyDataset {
  surveyId: string;
  surveyName: string;
  city: string; // "Bengaluru"
  state: string; // "Karnataka"
  ward: string; // "Ward 150 - Bellandur"
  analyzedAt: string;
  totalImages: number;
  totalContainersDetected: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  pendingInspectionCount: number;
  sites: DetectedSite[];
  isSimulated: boolean;
  engineVersion: string;
  processingTimeMs?: number;
}

export interface WardCoverageZone {
  id: string;
  name: string;
  center: GeoCoordinates;
  bounds: [number, number][];
  totalContainers: number;
  highRiskCount: number;
  surveyStatus: 'surveyed' | 'in_progress' | 'pending';
}

// Aliases for backward compatibility
export type ContainerClass = ContainerType;
export type RiskLevel = RiskCategory;
export type DetectedContainer = DetectedSite;
export type AnalysisResult = SurveyDataset;

export type AnalysisStep =
  | 'idle'
  | 'validating'
  | 'detecting'
  | 'assessing_risk'
  | 'generating_heatmap'
  | 'completed'
  | 'error';

export interface AnalysisProgress {
  step: AnalysisStep;
  progressPercent: number;
  message: string;
  logs: string[];
  currentImageIndex: number;
  totalImages: number;
}

export interface SurveyMetadataInput {
  locationName: string;
  surveyDate: string;
  hasGps: boolean;
  gpsLatitude?: string;
  gpsLongitude?: string;
  flightAltitude?: number;
  notes?: string;
}

export interface PresetMission {
  id: string;
  name: string;
  region: string;
  country: string;
  description: string;
  droneModel: string;
  altitudeMeters: number;
  imageCount: number;
  centerCoordinates: GeoCoordinates;
  sampleImages: UploadedImage[];
  defaultDetections: DetectedSite[];
}
