import { ModeToggle } from '@/theme/ModeToggle';

const AppHeader = () => {
    return (
        <div className="w-full flex flex-row justify-between items-center pt-1 pr-4 pl-4 pb-4 border-b-2">
            <div className="flex flex-col justify-start">
                <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                <p className="text-lg">
                    Welcome back, Salem! Here's your financial summary.
                </p>
            </div>
            <ModeToggle />
        </div>
    );
};

export default AppHeader;
