import { Card } from '@/components/ui/card';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import type { Budget } from '@/types/budget';
import type { Transaction } from '@/types/transaction';
import RecentTransactions from '../dashboard/RecentTransactions/RecentTransactions';
import BudgetDetails from './BudgetDetails';

type BudgetItemProps = {
    budget: Budget;
    spent: number;
    percentageUsed: number;
    getBarColor: (percentage: number) => string;
    transactions: Transaction[];
};

const BudgetItem = ({
    budget,
    spent,
    percentageUsed,
    getBarColor,
    transactions,
}: BudgetItemProps) => {
    return (
        <Card>
            <AccordionItem
                className="pr-5 pl-5 py-0 border-0"
                value={budget.id.toString()}
            >
                <AccordionTrigger className="grid grid-cols-[1fr_0.3fr_auto_1fr_auto] gap-6 items-center w-full hover:no-underline py-2">
                    <h3 className="text-lg font-semibold">{budget.name}</h3>
                    <span className="text-gray-500">
                        Budget: ${budget.amount}
                    </span>
                    <span className="text-gray-500">
                        Spent: ${spent.toFixed(2)}
                    </span>
                    <Progress
                        className="h-3 w-4/5 justify-self-end"
                        indicatorClassName={getBarColor(percentageUsed)}
                        value={percentageUsed}
                    />
                </AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col">
                        <BudgetDetails
                            budget={budget}
                            spent={spent}
                            remaining={budget.amount - spent}
                        />
                        <RecentTransactions
                            data={transactions}
                            enablePagination={false}
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Card>
    );
};

export default BudgetItem;
