import { ModeToggle } from '@/contexts/ModeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { GlobalDateSelector } from './GlobalDateSelector';
import { IntervalSelector } from './IntervalSelector';

const AppHeader = () => {
    return (
        <div className="w-full flex flex-row justify-between items-center px-6 py-4 border-b bg-card shrink-0">
            <div className="flex flex-row items-center gap-4">
                <SidebarTrigger />
                <div className="flex flex-col justify-start">
                    <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                    <p className="text-sm text-muted-foreground">
                        Welcome back, Salem! Here's your financial summary.
                    </p>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
                <GlobalDateSelector
                    label="Start Date"
                    dateType="start"
                />
                <GlobalDateSelector
                    label="End Date"
                    dateType="end"
                />
                <div className="pt-4.5">
                    <IntervalSelector />
                </div>
                <div className="pt-4.5">
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
};

export default AppHeader;
