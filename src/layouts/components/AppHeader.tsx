import { useState } from 'react';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { GlobalDateSelector } from '@/components/features/global-date-selector';
import { IntervalSelector } from '@/components/features/interval-selector';
import { useLocation } from 'react-router-dom';
import { Routes } from '@/constants/routes';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useGlobalDate } from '@/contexts/GlobalDate';
import { FaPlus } from 'react-icons/fa';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useBudgetForm } from '@/hooks/useBudgetForm';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MonthPicker } from '@/components/ui/monthpicker';
import { MultiSelect } from '@/components/ui/multi-select';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { TransactionCategory } from '@/constants/transactions';

const AppHeader = () => {
    const location = useLocation();
    const globalDate = useGlobalDate();
    const { form, onSubmit } = useBudgetForm({
        mode: 'create',
        onSuccess: () => console.log('Budget created successfully!'),
    });

    const categoryOptions = Object.values(TransactionCategory).map(
        (category) => ({
            label: category,
            value: category,
        })
    );

    const activeRoute = Routes.find((r) => r.url === location.pathname);

    const setDateRange = (months: number) => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months + 1);
        globalDate.setStartDate(startDate);
        globalDate.setEndDate(endDate);
    };

    return (
        <div className="w-full flex flex-row justify-between items-center px-6 py-4 border-b bg-card shrink-0">
            <div className="flex flex-row items-center gap-4">
                <SidebarTrigger />
                <div className="flex flex-col justify-start">
                    <h1 className="text-2xl font-bold">{activeRoute?.title}</h1>
                    <p className="text-sm text-muted-foreground">
                        {activeRoute?.description}
                    </p>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
                {activeRoute?.url === '/budget' && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <FaPlus />
                                Add Budget
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Budget</DialogTitle>
                                <DialogDescription>
                                    Create a budget to track spending across
                                    categories and set monthly limits.
                                </DialogDescription>
                            </DialogHeader>
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
                                                <FormLabel>
                                                    Budget Name
                                                </FormLabel>
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
                                                        options={categoryOptions}
                                                        selected={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Select categories..."
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Select the categories this
                                                    budget applies to
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
                                                        value={
                                                            field.value || ''
                                                        }
                                                        onChange={(e) => {
                                                            const val =
                                                                e.target
                                                                    .valueAsNumber;
                                                            field.onChange(
                                                                isNaN(val)
                                                                    ? 0
                                                                    : val
                                                            );
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
                                            const [open, setOpen] =
                                                useState(false);
                                            const selectedDate = field.value
                                                ? parse(
                                                      field.value,
                                                      'yyyy-MM',
                                                      new Date()
                                                  )
                                                : undefined;

                                            return (
                                                <FormItem>
                                                    <FormLabel>
                                                        Start Month
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Popover
                                                            open={open}
                                                            onOpenChange={
                                                                setOpen
                                                            }
                                                        >
                                                            <PopoverTrigger
                                                                asChild
                                                            >
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
                                                                    selectedMonth={
                                                                        selectedDate
                                                                    }
                                                                    onMonthSelect={(
                                                                        date
                                                                    ) => {
                                                                        field.onChange(
                                                                            format(
                                                                                date,
                                                                                'yyyy-MM'
                                                                            )
                                                                        );
                                                                        setOpen(
                                                                            false
                                                                        );
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
                                                <FormLabel>
                                                    Alert Threshold (%)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="80"
                                                        {...field}
                                                        value={
                                                            field.value || ''
                                                        }
                                                        onChange={(e) => {
                                                            const val =
                                                                e.target
                                                                    .valueAsNumber;
                                                            field.onChange(
                                                                isNaN(val)
                                                                    ? 0
                                                                    : val
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Get alerted when spending
                                                    reaches this percentage
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
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Recurring Monthly
                                                    </FormLabel>
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
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Rollover Unused Amount
                                                    </FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting
                                            ? 'Creating...'
                                            : 'Create Budget'}
                                    </Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                )}
                {(activeRoute?.url === '/transactions' ||
                    activeRoute?.url === '/') && (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setDateRange(3)}
                        >
                            3 Months
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setDateRange(6)}
                        >
                            6 Months
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setDateRange(12)}
                        >
                            1 Year
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <Calendar className="h-4 w-4" />
                                    Custom Range
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="space-y-3 pt-2"
                                align="end"
                            >
                                <GlobalDateSelector
                                    label="Start Date"
                                    dateType="start"
                                />
                                <GlobalDateSelector
                                    label="End Date"
                                    dateType="end"
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <IntervalSelector />
                    </>
                )}
                <ModeToggle />
            </div>
        </div>
    );
};

export default AppHeader;
