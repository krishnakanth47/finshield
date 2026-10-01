import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '', showIcon = true }) => {
  const configs = {
    LOW: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'LOW RISK',
    },
    MEDIUM: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      label: 'MEDIUM RISK',
    },
    HIGH: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500 animate-pulse',
      label: 'HIGH RISK',
    },
    CRITICAL: {
      bg: 'bg-red-100 text-red-800 border-red-300 font-bold',
      dot: 'bg-red-600 animate-ping',
      label: 'CRITICAL',
    },
  };

  const current = configs[level] || configs.LOW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg} ${className}`}
    >
      {showIcon && <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>}
      {current.label}
    </span>
  );
};
