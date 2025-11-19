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
import FormDialog from '../common/FormDialog';
import BudgetForm from './BudgetForm';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import DeleteDialog from '../features/delete-dialog';
import { deleteBudget } from '@/api/budgets';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: deleteBudget,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['budgetTransactions'] });
        },
    });
    return (
        <Card>
            <AccordionItem
                className="pr-5 pl-5 py-0 border-0"
                value={budget.id.toString()}
            >
                <AccordionTrigger className="grid grid-cols-[1fr_0.3fr_auto_1fr_auto_auto] gap-6 items-center w-full hover:no-underline py-2">
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
                    <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                >
                                    <EllipsisVertical className="h-4 w-4" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <FormDialog
                                    trigger={
                                        <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            Edit Budget
                                        </DropdownMenuItem>
                                    }
                                    title="Edit Budget"
                                    description="Update your budget settings, adjust spending limits, or modify tracked categories"
                                >
                                    <BudgetForm
                                        formMode="edit"
                                        initialData={budget}
                                    />
                                </FormDialog>
                                <DeleteDialog
                                    itemType="budget"
                                    onConfirm={() =>
                                        deleteMutation.mutate(budget.id)
                                    }
                                    trigger={
                                        <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    }
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
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
