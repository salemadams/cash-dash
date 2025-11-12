import { USDollar } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactNode } from 'react';

const TransactionCard = ({
    total,
    label: type,
    children,
    formatter = (value: number) => USDollar.format(value),
    labelPosition = 'bottom',
}: {
    total: number | undefined;
    label: string;
    children?: ReactNode;
    formatter?: (value: number) => string;
    labelPosition?: 'top' | 'bottom';
}) => {
    return (
        <Card className="flex-1 min-w-[250px] h-full shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex items-center h-full p-6 relative">
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
