import { Accordion } from '@/components/ui/accordion';
import { useQuery } from '@tanstack/react-query';
import { getAllBudgets } from '@/api/budgets';
import { getAllTransactions } from '@/api/transactions';
import { useMemo } from 'react';
import BudgetSummaryCard from '@/components/budget/BudgetSummaryCard';
import BudgetItem from '@/components/budget/BudgetItem';
import {
    calculateSpent,
    calculateBudgetHealth,
    getBarColor,
} from '@/services/budgets';

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
            <div className="p-2">
                <h2 className="text-xl font-bold mb-4">
                    Detailed Category Budgets
                </h2>
                <Accordion
                    type="multiple"
                    className="w-full space-y-2"
                >
                    {activeBudgets.map((budget) => {
                        const spent = calculateSpent(
                            budget,
                            transactions || [],
                            currentMonth
                        );
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
