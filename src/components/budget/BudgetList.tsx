import { Accordion } from '@/components/ui/accordion';
import { Budget } from '@/types/budget';
import { Transaction } from '@/types/transaction';
import BudgetItem from './BudgetItem';
import { getBarColor } from '@/services/budgets';

interface BudgetListProps {
    title: string;
    description: string;
    budgets: Budget[];
    budgetTransactions: Record<string, Transaction[]>;
    emptyMessage?: string;
}

const BudgetList = ({
    title,
    description,
    budgets,
    budgetTransactions,
    emptyMessage = 'No budgets yet',
}: BudgetListProps) => {
    return (
        <div className="p-2">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            {budgets.length > 0 ? (
                <Accordion type="multiple" className="w-full space-y-2">
                    {budgets.map((budget) => {
                        const transactions = budgetTransactions[budget.id] || [];
                        const spent = transactions.reduce(
                            (sum, t) => sum + Math.abs(t.amount),
                            0
                        );
                        const percentageUsed = (spent / budget.amount) * 100;

                        return (
                            <BudgetItem
                                key={budget.id}
                                budget={budget}
                                spent={spent}
                                percentageUsed={percentageUsed}
                                getBarColor={getBarColor}
                                transactions={transactions}
                            />
                        );
                    })}
                </Accordion>
            ) : (
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            )}
        </div>
    );
};

export default BudgetList;
