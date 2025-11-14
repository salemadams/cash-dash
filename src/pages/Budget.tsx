import { Accordion } from '@/components/ui/accordion';
import { useQuery } from '@tanstack/react-query';
import { getAllBudgets } from '@/api/budgets';
import { getAllTransactions } from '@/api/transactions';
import type { Budget } from '@/types/budget';
import type { Transaction } from '@/types/transaction';
import { useMemo } from 'react';
import BudgetSummaryCard from '@/components/budget/BudgetSummaryCard';
import BudgetItem from '@/components/budget/BudgetItem';

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

    // Calculate spent amount for a budget
    const calculateSpent = (budget: Budget): number => {
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

    // Filter and calculate budget totals
    const activeBudgets = useMemo(
        () => budgets?.filter((b) => b.isActive) || [],
        [budgets]
    );

    const totalBudgeted = useMemo(
        () => activeBudgets.reduce((sum, b) => sum + b.amount, 0),
        [activeBudgets]
    );

    const totalSpent = useMemo(
        () => activeBudgets.reduce((sum, b) => sum + calculateSpent(b), 0),
        [activeBudgets, transactions, currentMonth]
    );

    const totalRemaining = totalBudgeted - totalSpent;
    const percentageUsed =
        totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    const getBarColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-red-600';
        if (percentage >= 80) return 'bg-yellow-600';
        return '';
    };

    return (
        <div className="flex flex-col h-full gap-7 p-4">
            <BudgetSummaryCard
                totalBudgeted={totalBudgeted}
                totalSpent={totalSpent}
                totalRemaining={totalRemaining}
                percentageUsed={percentageUsed}
                getBarColor={getBarColor}
            />
            <div className="p-2">
                <h2 className="text-xl font-bold mb-4">
                    Detailed Category Budgets
                </h2>
                <Accordion type="multiple" className="w-full space-y-2">
                    {activeBudgets.map((budget) => {
                        const spent = calculateSpent(budget);
                        const percentageUsed = (spent / budget.amount) * 100;

                        return (
                            <BudgetItem
                                key={budget.id}
                                budget={budget}
                                spent={spent}
                                percentageUsed={percentageUsed}
                                getBarColor={getBarColor}
                            />
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
};

export default BudgetPage;
