import type { AttendanceTier } from '../types';

/**
 * Calculates attendance percentage safely.
 * Handles zero classes and avoids floating point display issues.
 */
export function calculatePercentage(present: number, total: number): number {
  if (total <= 0) return 0;
  const raw = (present / total) * 100;
  return Math.round(raw * 10) / 10;
}

/**
 * Returns the attendance tier according to configured institutional thresholds.
 * Section 8:
 * - 90% - 100%: Excellent
 * - 80% - 89.9%: Good
 * - 75% - 79.9%: Warning
 * - Below 75%: Critical
 */
export function getAttendanceTier(percentage: number): AttendanceTier {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Good';
  if (percentage >= 75) return 'Warning';
  return 'Critical';
}

/**
 * Returns color classes for the tier badge.
 */
export function getTierColorClasses(tier: AttendanceTier): {
  badge: string;
  bg: string;
  text: string;
  border: string;
  progress: string;
} {
  switch (tier) {
    case 'Excellent':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        progress: 'bg-emerald-500',
      };
    case 'Good':
      return {
        badge: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        progress: 'bg-blue-500',
      };
    case 'Warning':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        progress: 'bg-amber-500',
      };
    case 'Critical':
    default:
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        progress: 'bg-rose-500',
      };
  }
}

export interface TargetCalculationResult {
  targetPercentage: number;
  currentPercentage: number;
  classesNeeded: number;
  isAlreadyAchieved: boolean;
  isImpossible: boolean;
  explanation: string;
}

/**
 * Calculates the number of consecutive future classes needed to reach target percentage R.
 * Formula per Section 42:
 * (P + x) / (T + x) >= R
 * x >= (R * T - P) / (1 - R)
 */
export function calculateRequiredClasses(
  present: number,
  total: number,
  targetPercentage: number
): TargetCalculationResult {
  const currentPct = calculatePercentage(present, total);

  if (targetPercentage <= 0) {
    return {
      targetPercentage,
      currentPercentage: currentPct,
      classesNeeded: 0,
      isAlreadyAchieved: true,
      isImpossible: false,
      explanation: 'Target percentage is 0%, which is already achieved.',
    };
  }

  if (targetPercentage > 100) {
    return {
      targetPercentage,
      currentPercentage: currentPct,
      classesNeeded: 0,
      isAlreadyAchieved: false,
      isImpossible: true,
      explanation: 'Target percentage cannot exceed 100%.',
    };
  }

  if (currentPct >= targetPercentage) {
    return {
      targetPercentage,
      currentPercentage: currentPct,
      classesNeeded: 0,
      isAlreadyAchieved: true,
      isImpossible: false,
      explanation: `You are already at ${currentPct}%, which meets or exceeds your target of ${targetPercentage}%.`,
    };
  }

  const R = targetPercentage / 100;

  if (R >= 1) {
    return {
      targetPercentage,
      currentPercentage: currentPct,
      classesNeeded: 0,
      isAlreadyAchieved: false,
      isImpossible: true,
      explanation: 'Achieving 100% attendance is impossible once a single class has been missed.',
    };
  }

  // x >= (R * T - P) / (1 - R)
  const numerator = R * total - present;
  const denominator = 1 - R;
  const x = Math.ceil(numerator / denominator);

  if (x <= 0) {
    return {
      targetPercentage,
      currentPercentage: currentPct,
      classesNeeded: 0,
      isAlreadyAchieved: true,
      isImpossible: false,
      explanation: `You have already achieved your target of ${targetPercentage}%.`,
    };
  }

  return {
    targetPercentage,
    currentPercentage: currentPct,
    classesNeeded: x,
    isAlreadyAchieved: false,
    isImpossible: false,
    explanation: `You need to attend the next ${x} consecutive ${x === 1 ? 'class' : 'classes'} without missing to reach ${targetPercentage}%.`,
  };
}
