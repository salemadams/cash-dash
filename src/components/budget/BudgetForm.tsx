import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { parse, format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { MonthPicker } from '../ui/monthpicker';
import { MultiSelect } from '../ui/multi-select';
import { useBudgetForm } from '@/hooks/useBudgetForm';
import { TransactionCategory } from '@/constants/transactions';
import { Button } from '../ui/button';
import { Budget } from '@/types/budget';
import { useFormDialog } from '@/hooks/useFormDialog';

const BudgetForm = ({
    formMode,
    initialData,
}: {
    formMode: string;
    initialData?: Budget;
}) => {
    const [open, setOpen] = useState(false);
    const { closeDialog } = useFormDialog();

    const { form, onSubmit, isLoading, isError, error } = useBudgetForm({
        mode: formMode,
        initialData: initialData,
        onSuccess: () => {
            closeDialog();
        },
    });

    const categoryOptions = Object.values(TransactionCategory).map(
        (category) => ({
            label: category,
            value: category,
        })
    );

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Budget Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Monthly Groceries"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Categories</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    options={categoryOptions.filter(
                                        (cat) =>
                                            cat.label !==
                                                TransactionCategory.Freelance &&
                                            cat.label !==
                                                TransactionCategory.Salary
                                    )}
                                    selected={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select categories..."
                                />
                            </FormControl>
                            <FormDescription>
                                Select the categories this budget applies to
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="500"
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        const val = e.target.valueAsNumber;
                                        field.onChange(isNaN(val) ? 0 : val);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="startMonth"
                    render={({ field }) => {
                        const selectedDate = field.value
                            ? parse(field.value, 'yyyy-MM', new Date())
                            : undefined;

                        return (
                            <FormItem>
                                <FormLabel>Start Month</FormLabel>
                                <FormControl>
                                    <Popover
                                        open={open}
                                        onOpenChange={setOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {field.value
                                                    ? format(
                                                          selectedDate!,
                                                          'MMMM yyyy'
                                                      )
                                                    : 'Pick a month'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <MonthPicker
                                                selectedMonth={selectedDate}
                                                onMonthSelect={(date) => {
                                                    field.onChange(
                                                        format(date, 'yyyy-MM')
                                                    );
                                                    setOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                <FormField
                    control={form.control}
                    name="alertThreshold"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Alert Threshold (%)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="80"
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        const val = e.target.valueAsNumber;
                                        field.onChange(isNaN(val) ? 0 : val);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Get alerted when spending reaches this
                                percentage
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="recurring"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Recurring Monthly</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rollover"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Rollover Unused Amount</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                {isError && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        <p className="font-semibold">
                            {formMode === 'create'
                                ? 'Failed to create budget'
                                : 'Failed to update budget'}
                        </p>
                        <p className="mt-1">
                            {error?.message || 'An unexpected error occurred'}
                        </p>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading
                        ? formMode === 'create'
                            ? 'Creating...'
                            : 'Updating...'
                        : formMode === 'create'
                        ? 'Create Budget'
                        : 'Update Budget'}
                </Button>
            </form>
        </Form>
    );
};
export default BudgetForm;
