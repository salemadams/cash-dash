import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { getAllBudgets } from '@/api/budgets';
import { getAllTransactions } from '@/api/transactions';
import type { Budget } from '@/types/budget';
import type { Transaction } from '@/types/transaction';
import { useMemo } from 'react';

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
            <Card className="w-full">
                <CardHeader>
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            Overall Budget Health
                        </h2>
                        <h2 className="text-xl font-semibold">Utilized</h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress
                        className="h-5"
                        indicatorClassName={getBarColor(percentageUsed)}
                        value={percentageUsed}
                    />
                </CardContent>
                <CardFooter>
                    <div className="flex flex-row justify-between items-center w-full text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-500">Remaining</span>
                            <span className="font-semibold text-lg">
                                ${totalRemaining.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex flex-row gap-6">
                            <div className="flex flex-col items-start">
                                <span className="text-gray-500">
                                    Monthly Income
                                </span>
                                <span className="font-semibold">$0.00</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-gray-500">Budgeted</span>
                                <span className="font-semibold">
                                    ${totalBudgeted.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-gray-500">Spent</span>
                                <span className="font-semibold">
                                    ${totalSpent.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-gray-500">
                                    Month-over-Month
                                </span>
                                <span className="font-semibold">0%</span>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
            <div className="p-2">
                <h2 className="text-xl font-bold mb-4">
                    Detailed Category Budgets
                </h2>
                <Accordion
                    type="multiple"
                    className="w-full space-y-2"
                >
                    {activeBudgets.map((budget) => {
                        const spent = calculateSpent(budget);
                        const percentageUsed = (spent / budget.amount) * 100;

                        return (
                            <Card key={budget.id}>
                                <AccordionItem
                                    className="pr-5 pl-5 py-0 border-0"
                                    value={budget.id.toString()}
                                >
                                    <AccordionTrigger className="grid grid-cols-[1fr_0.3fr_auto_1fr_auto] gap-6 items-center w-full hover:no-underline py-2">
                                        <h3 className="text-lg font-semibold">
                                            {budget.name}
                                        </h3>
                                        <span className="text-gray-500">
                                            Budget: ${budget.amount}
                                        </span>
                                        <span className="text-gray-500">
                                            Spent: ${spent.toFixed(2)}
                                        </span>
                                        <Progress
                                            className="h-3 w-4/5 justify-self-end"
                                            indicatorClassName={getBarColor(
                                                percentageUsed
                                            )}
                                            value={percentageUsed}
                                        />
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-4">
                                            <div className="flex flex-row gap-4 flex-wrap">
                                                {budget.categories.map(
                                                    (category) => (
                                                        <span
                                                            key={category}
                                                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                                        >
                                                            {category}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                            <div className="mt-4 space-y-2">
                                                <p className="text-sm text-gray-600">
                                                    Remaining: $
                                                    {(
                                                        budget.amount - spent
                                                    ).toFixed(2)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {budget.recurring
                                                        ? 'Recurring monthly'
                                                        : 'One-time budget'}
                                                </p>
                                                {budget.rollover && (
                                                    <p className="text-sm text-gray-600">
                                                        Rollover enabled
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Card>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
};

export default BudgetPage;
