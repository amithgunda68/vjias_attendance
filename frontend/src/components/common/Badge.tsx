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
  let styleClasses = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  if (variant === 'tier' && tier) {
    const tierStyles = getTierColorClasses(tier);
    styleClasses = tierStyles.badge;
  } else if (variant === 'status' && status) {
    switch (status) {
      case 'Present':
        styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60';
        break;
      case 'Absent':
        styleClasses = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60';
        break;
      case 'Late':
        styleClasses = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60';
        break;
      case 'Excused':
        styleClasses = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60';
        break;
    }
  } else if (variant === 'priority' && priority) {
    switch (priority) {
      case 'Urgent':
        styleClasses = 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60';
        break;
      case 'Important':
        styleClasses = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60';
        break;
      case 'Normal':
      default:
        styleClasses = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
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
