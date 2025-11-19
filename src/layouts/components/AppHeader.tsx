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
import FormDialog from '@/components/common/FormDialog';
import BudgetForm from '@/components/budget/BudgetForm';
import { useBudgetMonth } from '@/contexts/BudgetMonthProvider';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { MonthPicker } from '@/components/ui/monthpicker';
import { useState } from 'react';
import { parse, format } from 'date-fns';
import { cn } from '@/lib/utils';

const AppHeader = () => {
    const location = useLocation();
    const { setDateRange, startDateError, endDateError } =
        useGlobalDate();
    const { selectedMonth, setSelectedMonth } = useBudgetMonth();
    const [monthPickerOpen, setMonthPickerOpen] = useState(false);
    const activeRoute = Routes.find((r) => r.url === location.pathname);

    const handleDateRangeClick = (months: number) => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months + 1);
        setDateRange(startDate, endDate);
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
                    <>
                        <Popover
                            open={monthPickerOpen}
                            onOpenChange={setMonthPickerOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'gap-2',
                                        !selectedMonth &&
                                            'text-muted-foreground'
                                    )}
                                >
                                    <Calendar className="h-4 w-4" />
                                    {selectedMonth
                                        ? format(
                                              parse(
                                                  selectedMonth,
                                                  'yyyy-MM',
                                                  new Date()
                                              ),
                                              'MMMM yyyy'
                                          )
                                        : 'Pick a month'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="end"
                            >
                                <MonthPicker
                                    selectedMonth={parse(
                                        selectedMonth,
                                        'yyyy-MM',
                                        new Date()
                                    )}
                                    onMonthSelect={(date) => {
                                        setSelectedMonth(
                                            format(date, 'yyyy-MM')
                                        );
                                        setMonthPickerOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        <FormDialog
                            trigger={
                                <Button className="gap-2">
                                    <FaPlus />
                                    Add Budget
                                </Button>
                            }
                            title="Create New Budget"
                            description="Create a budget to track spending across categories and set monthly limits"
                        >
                            <BudgetForm formMode="create" />
                        </FormDialog>
                    </>
                )}
                {(activeRoute?.url === '/transactions' ||
                    activeRoute?.url === '/' ||
                    activeRoute?.url === '/analytics') && (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => handleDateRangeClick(3)}
                        >
                            3 Months
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleDateRangeClick(6)}
                        >
                            6 Months
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleDateRangeClick(12)}
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
                                <div>
                                    <GlobalDateSelector
                                        label="Start Date"
                                        dateType="start"
                                    />
                                    {startDateError && (
                                        <p className="text-destructive text-sm px-2 pt-1">
                                            {startDateError}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <GlobalDateSelector
                                        label="End Date"
                                        dateType="end"
                                    />
                                    {endDateError && (
                                        <p className="text-destructive text-sm px-2 pt-1">
                                            {endDateError}
                                        </p>
                                    )}
                                </div>
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
