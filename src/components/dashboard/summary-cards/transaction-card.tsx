import { USDollar } from '@/lib/format';
import { Card, CardContent } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';
import { ReactNode } from 'react';

const TransactionCard = ({
    total,
    type,
    children,
}: {
    total: number | undefined;
    type: string;
    children: ReactNode;
}) => {
    return (
        <Card className="flex-1 min-w-[250px] h-full shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex items-center h-full p-6 relative">
                {children}
                <div className="flex flex-col pl-20 gap-2 w-full">
                    <div className="text-3xl font-bold">
                        {total ? (
                            USDollar.format(total)
                        ) : (
                            <Skeleton className="h-9 w-32" />
                        )}
                    </div>
                    <p className="text-sm text-left text-gray-500">
                        Total {type}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionCard;
