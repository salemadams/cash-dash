import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { getAllTransactions } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';
import TransactionCard from './TransactionCard';
import { useGlobalDate } from '@/contexts/GlobalDate';
import { aggregateByType } from '@/services/transactions';

const TransactionCards = () => {
    const globalDate = useGlobalDate();

    const { data: totals } = useQuery({
        queryKey: [
            'transactions',
            globalDate.startDate,
            globalDate.endDate,
            globalDate.interval,
        ],
        queryFn: () =>
            getAllTransactions(
                globalDate.startDate,
                globalDate.endDate,
                globalDate.interval
            ),
        select: (data) => aggregateByType(data),
    });
    const { data: previousTotals } = useQuery({
        queryKey: [
            'transactions',
            'previous',
            globalDate.prevStartDate,
            globalDate.prevEndDate,
            globalDate.interval,
        ],
        queryFn: () =>
            getAllTransactions(
                globalDate.prevStartDate,
                globalDate.prevEndDate,
                globalDate.interval
            ),
        select: (data) => aggregateByType(data),
    });

    console.log(globalDate.startDate, globalDate.endDate);
    console.log(globalDate.prevStartDate, globalDate.prevEndDate);

    return (
        <div className="flex flex-wrap gap-6 justify-between">
            <TransactionCard
                total={totals?.income}
                previousTotal={previousTotals?.income}
                label="Income"
            >
                <div className="absolute left-6 flex items-center justify-center w-16 h-16 rounded-lg bg-green-100">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
            </TransactionCard>

            <TransactionCard
                total={totals?.expense}
                previousTotal={previousTotals?.expense}
                label="Expenses"
            >
                <div className="absolute left-6 flex items-center justify-center w-16 h-16 rounded-lg bg-red-100">
                    <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
            </TransactionCard>
            <TransactionCard
                total={totals?.savings}
                previousTotal={previousTotals?.savings}
                label="Savings"
            >
                <div className="absolute left-6 flex items-center justify-center w-16 h-16 rounded-lg bg-blue-100">
                    <PiggyBank className="w-8 h-8 text-blue-600" />
                </div>
            </TransactionCard>
        </div>
    );
};

export default TransactionCards;
