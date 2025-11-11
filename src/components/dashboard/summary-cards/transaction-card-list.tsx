import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { getAllTransactions } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';
import TransactionCard from './transaction-card';

const TransactionCards = () => {
    const { data: totals } = useQuery({
        queryKey: ['totals'],
        queryFn: getAllTransactions,
        select: (data) => {
            return data.reduce((acc, transaction) => {
                const type = transaction.type;
                acc[type] =
                    (acc[type] || 0) +
                    (transaction.amount < 0
                        ? transaction.amount * -1
                        : transaction.amount);
                return acc;
            }, {} as Record<string, number>);
        },
    });
    return (
        <div className="flex flex-wrap gap-6 justify-between">
            <TransactionCard
                total={totals?.income}
                type="Income"
            >
                <div className="absolute left-6 flex items-center justify-center w-16 h-16 rounded-lg bg-green-100">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
            </TransactionCard>

            <TransactionCard
                total={totals?.expense}
                type="Expenses"
            >
                <div className="absolute left-6 flex items-center justify-center w-16 h-16 rounded-lg bg-red-100">
                    <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
            </TransactionCard>
            <TransactionCard
                total={totals?.savings}
                type="Savings"
            >
                <div className="absolute left-6 flex items-center justify-center w-16 h-16 rounded-lg bg-blue-100">
                    <PiggyBank className="w-8 h-8 text-blue-600" />
                </div>
            </TransactionCard>
        </div>
    );
};

export default TransactionCards;
