import { DetectedSite } from '../types/analysis';

export function exportSitesToCsv(sites: DetectedSite[], filenamePrefix = 'TheLastBite_Bengaluru_Manifest'): void {
  const headers = [
    'Priority Rank',
    'Site ID',
    'Image ID',
    'Container Type',
    'Container Label',
    'Confidence (%)',
    'Risk Score (0-100)',
    'Risk Category',
    'Ward Name',
    'Neighborhood',
    'Location Name',
    'Latitude',
    'Longitude',
    'GPS Status',
    'Inspection Status',
    'Exposed to Rain',
    'Water Present',
    'Recent Rain',
    'Shaded',
    'Neglected',
    'Inspector Name',
    'Larvae Observed',
    'Larvicide Applied',
    'Larvicide Type',
    'Detected At',
    'Field Notes',
  ];

  const escapeCsv = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = sites.map((site, index) => [
    index + 1,
    escapeCsv(site.siteId),
    escapeCsv(site.imageId),
    escapeCsv(site.containerType),
    escapeCsv(site.containerLabel),
    (site.confidence * 100).toFixed(1),
    site.riskScore,
    escapeCsv(site.riskCategory.toUpperCase()),
    escapeCsv(site.wardName),
    escapeCsv(site.neighborhood),
    escapeCsv(site.locationName),
    site.coordinates?.lat ?? 'Location unavailable',
    site.coordinates?.lng ?? 'Location unavailable',
    site.hasGps ? 'Available' : 'Unavailable',
    escapeCsv(site.inspectionStatus.toUpperCase().replace('_', ' ')),
    site.factors.exposed ? 'YES' : 'NO',
    site.factors.waterPresent === true ? 'YES' : site.factors.waterPresent === false ? 'NO' : 'UNKNOWN',
    site.factors.recentRain ? 'YES' : 'NO',
    site.factors.shaded ? 'YES' : 'NO',
    site.factors.neglected ? 'YES' : 'NO',
    escapeCsv(site.inspectionRecord?.inspectorName || 'Unassigned'),
    site.inspectionRecord?.larvaeObserved ? 'YES' : 'NO',
    site.inspectionRecord?.larvicideApplied ? 'YES' : 'NO',
    escapeCsv(site.inspectionRecord?.larvicideType || 'None'),
    escapeCsv(site.detectedAt),
    escapeCsv(site.inspectionRecord?.notes || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
