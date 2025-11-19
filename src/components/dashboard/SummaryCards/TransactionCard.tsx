import { USDollar } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TransactionCard = ({
    total,
    previousTotal,
    label: type,
    children,
    formatter = (value: number) => USDollar.format(value),
    labelPosition = 'bottom',
}: {
    total: number | undefined;
    previousTotal?: number;
    label: string;
    children?: ReactNode;
    formatter?: (value: number) => string;
    labelPosition?: 'top' | 'bottom';
}) => {
    const calculatePercentChange = () => {
        if (total === undefined || previousTotal === undefined) return null;
        if (previousTotal === 0) return total > 0 ? 100 : 0;
        return ((total - previousTotal) / previousTotal) * 100;
    };
    const percentChange = calculatePercentChange();

    return (
        <Card className="flex-1 min-w-[250px] h-full shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex items-center h-full p-6 relative">
                {previousTotal !== undefined &&
                    (percentChange !== null ? (
                        <div
                            className={`absolute top-0.5 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                type !== 'Expenses'
                                    ? percentChange >= 0
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    : percentChange >= 0
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-green-100 text-green-700'
                            }`}
                        >
                            {percentChange >= 0 ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {Math.abs(percentChange).toFixed(1)}%
                        </div>
                    ) : (
                        <Skeleton className="absolute top-0.5 right-3 h-6 w-14 rounded-full" />
                    ))}
                {children}
                <div
                    className={`flex flex-col gap-2 w-full ${
                        children ? 'pl-20' : ''
                    }`}
                >
                    {labelPosition === 'top' && (
                        <p className="text-sm text-left text-gray-500">
                            {type}
                        </p>
                    )}
                    <div className="text-3xl font-bold">
                        {total !== undefined ? (
                            formatter(total)
                        ) : (
                            <Skeleton className="h-9 w-32" />
                        )}
                    </div>
                    {labelPosition === 'bottom' && (
                        <p className="text-sm text-left text-gray-500">
                            {type}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionCard;
