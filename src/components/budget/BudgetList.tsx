import { Accordion } from '@/components/ui/accordion';
import { Budget } from '@/types/budget';
import { Transaction } from '@/types/transaction';
import BudgetItem from './BudgetItem';
import { calculateSpent, getBarColor } from '@/services/budgets';

interface BudgetListProps {
    title: string;
    description: string;
    budgets: Budget[];
    transactions: Transaction[];
    currentMonth: string;
    emptyMessage?: string;
}

const BudgetList = ({
    title,
    description,
    budgets,
    transactions,
    currentMonth,
    emptyMessage = 'No budgets yet',
}: BudgetListProps) => {
    return (
        <div className="p-2">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            {budgets.length > 0 ? (
                <Accordion type="multiple" className="w-full space-y-2">
                    {budgets.map((budget) => {
                        const spent = calculateSpent(
                            budget,
                            transactions,
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
            ) : (
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            )}
        </div>
    );
};

export default BudgetList;
