// Budget health thresholds
export const BUDGET_THRESHOLD_CRITICAL = 90; // percentage
export const BUDGET_THRESHOLD_WARNING = 80; // percentage

// Transaction type color mappings
export const TRANSACTION_COLORS = {
  income: {
    background: 'bg-green-100',
    text: 'text-green-600',
    badge: 'bg-green-100 text-green-800',
    icon: 'text-green-600',
  },
  expense: {
    background: 'bg-red-100',
    text: 'text-red-600',
    badge: 'bg-red-100 text-red-800',
    icon: 'text-red-600',
  },
  savings: {
    background: 'bg-blue-100',
    text: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-800',
    icon: 'text-blue-600',
  },
} as const;

// Budget status colors
export const BUDGET_COLORS = {
  critical: 'bg-red-600',
  warning: 'bg-yellow-600',
  safe: '',
} as const;
