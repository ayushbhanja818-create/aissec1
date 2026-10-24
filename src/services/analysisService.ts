import {
  AnalysisProgress,
  AnalysisStep,
  ContainerType,
  DetectedSite,
  InspectionStatus,
  RiskCategory,
  SurveyDataset,
  SurveyMetadataInput,
  UploadedImage,
} from '../types/analysis';
import { BENGALURU_SITES, CONTAINER_TYPES_META } from '../data/bengaluruSites';

class AnalysisService {
  private engineVersion = 'YOLOv8x-SAHI (Mock Inference Pilot v3.1)';

  public async analyzeImages(
    images: UploadedImage[],
    metadata?: SurveyMetadataInput,
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<SurveyDataset> {
    const totalImages = images.length;
    const logs: string[] = [];

    const reportProgress = (
      step: AnalysisStep,
      progressPercent: number,
      message: string,
      currentImageIndex: number
    ) => {
      const timestamp = new Date().toLocaleTimeString();
      logs.push(`[${timestamp}] ${message}`);
      if (onProgress) {
        onProgress({
          step,
          progressPercent,
          message,
          logs: [...logs],
          currentImageIndex,
          totalImages,
        });
      }
    };

    reportProgress('validating', 15, 'Validating orthomosaic resolution and RGB bands (GSD check)...', 0);
    await this.delay(300);

    reportProgress('detecting', 45, 'Running YOLOv8x sliced detection (SAHI windowing) for breeding containers...', 1);
    await this.delay(400);

    reportProgress('assessing_risk', 75, 'Applying multi-factor risk formula (capacity, exposure, rainfall, proximity)...', totalImages);
    await this.delay(300);

    reportProgress('generating_heatmap', 90, 'Synthesizing Bengaluru GIS risk surface and cluster coordinates...', totalImages);
    await this.delay(200);

    reportProgress('completed', 100, `Simulated inference complete. Identified potential breeding containers.`, totalImages);

    // Return current Bengaluru dataset with updated total
    const highRiskCount = BENGALURU_SITES.filter((s) => s.riskCategory === 'high').length;
    const mediumRiskCount = BENGALURU_SITES.filter((s) => s.riskCategory === 'medium').length;
    const lowRiskCount = BENGALURU_SITES.filter((s) => s.riskCategory === 'low').length;
    const pendingInspectionCount = BENGALURU_SITES.filter(
      (s) => s.inspectionStatus === 'pending' || s.inspectionStatus === 'scheduled'
    ).length;

    return {
      surveyId: `SURVEY-BLR-${Date.now().toString(36).toUpperCase()}`,
      surveyName: metadata?.locationName || 'BBMP Ward 150 (Bellandur) Survey',
      city: 'Bengaluru',
      state: 'Karnataka',
      ward: 'Ward 150 - Bellandur',
      analyzedAt: new Date().toISOString(),
      totalImages,
      totalContainersDetected: BENGALURU_SITES.length,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      pendingInspectionCount,
      sites: BENGALURU_SITES,
      isSimulated: true,
      engineVersion: this.engineVersion,
      processingTimeMs: 1250,
    };
  }

  public getBengaluruSites(): DetectedSite[] {
    return BENGALURU_SITES;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const analysisService = new AnalysisService();
