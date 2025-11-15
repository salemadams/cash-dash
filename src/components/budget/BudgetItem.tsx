import { Card } from '@/components/ui/card';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import type { Budget } from '@/types/budget';
import { Button } from '../ui/button';
import { FaEdit } from 'react-icons/fa';
import FormDialog from '../common/FormDialog';
import BudgetForm from './BudgetForm';

type BudgetItemProps = {
    budget: Budget;
    spent: number;
    percentageUsed: number;
    getBarColor: (percentage: number) => string;
};

const BudgetItem = ({
    budget,
    spent,
    percentageUsed,
    getBarColor,
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
                    <div className="flex flex-row justify-between p-4">
                        {budget.categories.map((category) => (
                            <span
                                key={category}
                                className="w-20 h-9 text-center pt-2 bg-gray-100 rounded-full text-sm"
                            >
                                {category}
                            </span>
                        ))}
                        <p className="text-sm text-gray-600">
                            Remaining: ${(budget.amount - spent).toFixed(2)}
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
                        <FormDialog
                            trigger={
                                <Button>
                                    <FaEdit />
                                    Edit Budget
                                </Button>
                            }
                            title={'Edit Budget'}
                            description="Update your budget settings, adjust spending limits, or modify tracked categories"
                        >
                            <BudgetForm formMode="edit" />
                        </FormDialog>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Card>
    );
};

export default BudgetItem;
