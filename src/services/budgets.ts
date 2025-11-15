import { Budget } from '@/types/budget';
import { Transaction } from '@/types/transaction';
import { BUDGET_THRESHOLD_CRITICAL, BUDGET_THRESHOLD_WARNING, BUDGET_COLORS } from '@/constants/styles';

/**
 * Calculates the total amount spent for a specific budget
 */
export const calculateSpent = (
  budget: Budget,
  transactions: Transaction[],
  currentMonth: string
): number => {
  if (!transactions) return 0;

  return transactions
    .filter(
      (t: Transaction) =>
        budget.categories.includes(t.category || '') &&
        t.type === 'expense' &&
        t.date.toString().startsWith(currentMonth)
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

/**
 * Calculates budget health metrics including totals and percentage used
 */
export const calculateBudgetHealth = (
  activeBudgets: Budget[],
  budgetTransactions: Record<string, Transaction[]>
): {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  percentageUsed: number;
} => {
  const totalBudgeted = activeBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = activeBudgets.reduce((sum, b) => {
    const transactions = budgetTransactions[b.id] || [];
    const spent = transactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
    return sum + spent;
  }, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const percentageUsed = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  return {
    totalBudgeted,
    totalSpent,
    totalRemaining,
    percentageUsed,
  };
};

/**
 * Determines the progress bar color based on percentage used
 */
export const getBarColor = (percentage: number): string => {
  if (percentage >= BUDGET_THRESHOLD_CRITICAL) return BUDGET_COLORS.critical;
  if (percentage >= BUDGET_THRESHOLD_WARNING) return BUDGET_COLORS.warning;
  return BUDGET_COLORS.safe;
};