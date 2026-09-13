import React from 'react';
import type { AttendanceTier, AttendanceStatus } from '../../types';
import { getTierColorClasses } from '../../utils/attendance';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'tier' | 'status' | 'priority';
  tier?: AttendanceTier;
  status?: AttendanceStatus;
  priority?: 'Normal' | 'Important' | 'Urgent';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  tier,
  status,
  priority,
  className = '',
}) => {
  let styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (variant === 'tier' && tier) {
    const tierStyles = getTierColorClasses(tier);
    styleClasses = tierStyles.badge;
  } else if (variant === 'status' && status) {
    switch (status) {
      case 'Present':
        styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'Absent':
        styleClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'Late':
        styleClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'Excused':
        styleClasses = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
    }
  } else if (variant === 'priority' && priority) {
    switch (priority) {
      case 'Urgent':
        styleClasses = 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
        break;
      case 'Important':
        styleClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'Normal':
      default:
        styleClasses = 'bg-slate-100 text-slate-600 border-slate-200';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold border ${styleClasses} ${className}`}
    >
      {children}
    </span>
  );
};
