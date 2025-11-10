import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { USDollar } from '@/lib/format';
import { getAllTransactions } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';

const TransactionCards = () => {
    const { data: totals } = useQuery({
        queryKey: ['totals'],
        queryFn: getAllTransactions,
        select: (data) => {
            return data.reduce((acc, transaction) => {
                const type = transaction.type;
                acc[type] = (acc[type] || 0) + transaction.amount;
                return acc;
            }, {} as Record<string, number>);
        },
    });
    return (
        <div className="flex flex-row gap-6 justify-between flex-1">
            <Card className="w-full h-full shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-center h-full p-6 relative">
                    <div className="absolute left-6 flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 w-full">
                        <div className="text-3xl font-bold text-green-600">
                            {totals?.income ? (
                                USDollar.format(totals.income)
                            ) : (
                                <Skeleton className="h-9 w-32" />
                            )}
                        </div>
                        <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">
                            Income
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full h-full shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-center h-full p-6 relative">
                    <div className="absolute left-6 flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                        <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 w-full">
                        <div className="text-3xl font-bold text-red-600">
                            {totals?.expense ? (
                                USDollar.format(totals.expense)
                            ) : (
                                <Skeleton className="h-9 w-32" />
                            )}
                        </div>
                        <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">
                            Expenses
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full h-full shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-center h-full p-6 relative">
                    <div className="absolute left-6 flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
                        <PiggyBank className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 w-full">
                        <div className="text-3xl font-bold text-blue-600">
                            {totals?.savings ? (
                                USDollar.format(totals.savings)
                            ) : (
                                <Skeleton className="h-9 w-32" />
                            )}
                        </div>
                        <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">
                            Savings
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionCards;
