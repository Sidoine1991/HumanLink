import { MapPin } from 'lucide-react';

interface DistanceTagProps {
  distance: number;
  darkMode?: boolean;
}

export default function DistanceTag({ distance, darkMode }: DistanceTagProps) {
  const formatDistance = (dist: number) => {
    if (dist < 1) {
      return `${Math.round(dist * 1000)}m`;
    }
    return `${dist.toFixed(1)}km`;
  };

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
      darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
    }`}>
      <MapPin className="w-3 h-3" />
      <span className="text-xs">{formatDistance(distance)}</span>
    </div>
  );
}
