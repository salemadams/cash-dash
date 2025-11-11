import { ModeToggle } from '@/theme/ModeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

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
            <ModeToggle />
        </div>
    );
};

export default AppHeader;
