import { GeoCoordinates, RiskCategory } from '../types/analysis';

export function formatCoordinates(coords: GeoCoordinates | null): string {
  if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number') {
    return 'Location unavailable';
  }

  const latHemisphere = coords.lat >= 0 ? 'N' : 'S';
  const lngHemisphere = coords.lng >= 0 ? 'E' : 'W';

  return `${Math.abs(coords.lat).toFixed(4)}° ${latHemisphere}, ${Math.abs(coords.lng).toFixed(4)}° ${lngHemisphere}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getRiskColorClass(level: RiskCategory): {
  bg: string;
  border: string;
  text: string;
  dot: string;
} {
  switch (level) {
    case 'high':
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        dot: 'bg-red-500',
      };
    case 'medium':
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        dot: 'bg-amber-500',
      };
    case 'low':
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        dot: 'bg-emerald-500',
      };
  }
}
