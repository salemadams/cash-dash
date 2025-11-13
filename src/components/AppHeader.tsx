import { ModeToggle } from '@/contexts/ModeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { GlobalDateSelector } from './ui/global-date-selector';
import { IntervalSelector } from './ui/interval-selector';
import { useLocation } from 'react-router-dom';
import { Routes } from '@/constants/routes';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Calendar } from 'lucide-react';
import { useGlobalDate } from '@/contexts/GlobalDate';

const AppHeader = () => {
    const location = useLocation();
    const globalDate = useGlobalDate();

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
                <ModeToggle />
            </div>
        </div>
    );
};

export default AppHeader;
