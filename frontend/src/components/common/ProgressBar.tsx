import React from 'react';
import { getAttendanceTier, getTierColorClasses } from '../../utils/attendance';

interface ProgressBarProps {
  value: number; // 0 to 100
  threshold?: number; // default 75
  showThresholdMarker?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  threshold = 75,
  showThresholdMarker = true,
  className = '',
  size = 'md',
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const tier = getAttendanceTier(clamped);
  const { progress } = getTierColorClasses(tier);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size];

  return (
    <div className={`relative w-full ${className}`}>
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses} border border-slate-200/50`}>
        <div
          className={`${heightClasses} rounded-full transition-all duration-500 ease-out ${progress}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showThresholdMarker && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400/80 z-10"
          style={{ left: `${threshold}%` }}
          title={`Required Threshold: ${threshold}%`}
        />
      )}
    </div>
  );
};
