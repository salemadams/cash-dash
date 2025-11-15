import { useQuery } from '@tanstack/react-query';
import { getAllBudgets } from '@/api/budgets';
import { getAllTransactions } from '@/api/transactions';
import { useMemo } from 'react';
import BudgetSummaryCard from '@/components/budget/BudgetSummaryCard';
import BudgetList from '@/components/budget/BudgetList';
import { calculateBudgetHealth, getBarColor } from '@/services/budgets';

const BudgetPage = () => {
    // Get current month in YYYY-MM format
    const currentMonth = new Date().toISOString().slice(0, 7);

    const { data: budgets } = useQuery({
        queryKey: ['budgets', currentMonth],
        queryFn: () => getAllBudgets(currentMonth),
    });

    const { data: transactions } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => getAllTransactions(),
    });

    // Filter and calculate budget totals
    const activeBudgets = useMemo(
        () => budgets?.filter((b) => b.isActive) || [],
        [budgets]
    );

    // Split budgets into recurring and one-time
    const recurringBudgets = useMemo(
        () => activeBudgets.filter((b) => b.recurring),
        [activeBudgets]
    );
    console.log(activeBudgets);
    const oneTimeBudgets = useMemo(
        () => activeBudgets.filter((b) => !b.recurring),
        [activeBudgets]
    );

    const budgetHealth = useMemo(
        () =>
            calculateBudgetHealth(
                activeBudgets,
                transactions || [],
                currentMonth
            ),
        [activeBudgets, transactions, currentMonth]
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
                transactions={transactions || []}
                currentMonth={currentMonth}
                emptyMessage="No recurring budgets yet"
            />

            <BudgetList
                title="One-Time Budgets"
                description="These budgets apply to a specific month only"
                budgets={oneTimeBudgets}
                transactions={transactions || []}
                currentMonth={currentMonth}
                emptyMessage="No one-time budgets yet"
            />
        </div>
    );
};

export default BudgetPage;
