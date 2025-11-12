import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGlobalDate } from '@/contexts/GlobalDate';
import { Interval } from '@/constants/interval';
import { IoIosTimer } from 'react-icons/io';
const intervalOptions = [
    { value: Interval.Day, label: 'Day' },
    { value: Interval.Week, label: 'Week' },
    { value: Interval.Month, label: 'Month' },
];

export function IntervalSelector() {
    const { interval, setInterval } = useGlobalDate();

    const currentLabel =
        intervalOptions.find((opt) => opt.value === interval)?.label || 'Month';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-1"
                >
                    <span>{currentLabel}</span>
                    <IoIosTimer className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="space-y-1"
                align="end"
            >
                {intervalOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => setInterval(option.value)}
                        className={
                            interval === option.value
                                ? 'bg-accent text-accent-foreground'
                                : ''
                        }
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
