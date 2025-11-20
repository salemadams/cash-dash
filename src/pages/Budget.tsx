import { useQuery } from '@tanstack/react-query';
import { getAllBudgets, getBudgetTransactions } from '@/api/budgets';
import { useMemo } from 'react';
import BudgetSummaryCard from '@/components/budget/BudgetSummaryCard';
import BudgetList from '@/components/budget/BudgetList';
import { calculateBudgetHealth, getBarColor } from '@/services/budgets';
import { useBudgetMonth } from '@/contexts/BudgetMonthProvider';

const BudgetPage = () => {
    const { selectedMonth: currentMonth } = useBudgetMonth();

    const { data: budgets } = useQuery({
        queryKey: ['budgets', currentMonth],
        queryFn: () => getAllBudgets(currentMonth),
    });

    const { data: budgetTransactions } = useQuery({
        queryKey: ['budgetTransactions', currentMonth],
        queryFn: () => getBudgetTransactions(currentMonth),
    });

    const activeBudgets = useMemo(
        () => budgets?.filter((b) => b.isActive) || [],
        [budgets]
    );

    const recurringBudgets = useMemo(
        () => activeBudgets.filter((b) => b.recurring),
        [activeBudgets]
    );

    const oneTimeBudgets = useMemo(
        () => activeBudgets.filter((b) => !b.recurring),
        [activeBudgets]
    );

    const budgetHealth = useMemo(
        () => calculateBudgetHealth(activeBudgets, budgetTransactions || {}),
        [activeBudgets, budgetTransactions]
    );

    const { totalBudgeted, totalSpent, totalRemaining, percentageUsed } =
        budgetHealth;

    return (
        <div className="flex flex-col h-full gap-7 p-4">
            <BudgetSummaryCard
                totalBudgeted={totalBudgeted}
                totalSpent={totalSpent}
                totalRemaining={totalRemaining}
                percentageUsed={percentageUsed}
                getBarColor={getBarColor}
            />
            <BudgetList
                title="Recurring Monthly Budgets"
                description="These budgets reset every month"
                budgets={recurringBudgets}
                budgetTransactions={budgetTransactions || {}}
                emptyMessage="No recurring budgets yet"
            />

            <BudgetList
                title="One-Time Budgets"
                description="These budgets apply to a specific month only"
                budgets={oneTimeBudgets}
                budgetTransactions={budgetTransactions || {}}
                emptyMessage="No one-time budgets yet"
            />
        </div>
    );
};

export default BudgetPage;
