import { getAllTransactions } from '@/api/transactions';
import RecentTransactions from '@/components/dashboard/RecentTransactions/RecentTransactions';
import TransactionCard from '@/components/dashboard/SummaryCards/TransactionCard';
import { TransactionType } from '@/constants/transactions';
import { useGlobalDate } from '@/contexts/GlobalDate';
import { useQuery } from '@tanstack/react-query';

const Transactions = () => {
    const globalDate = useGlobalDate();

    const { data } = useQuery({
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
    });

    const income = data?.reduce((acc, t) => {
        return t.type === TransactionType.Income ? acc + t.amount : acc;
    }, 0);

    const expenses = data?.reduce((acc, t) => {
        return t.type === TransactionType.Expense ? acc + t.amount : acc;
    }, 0);

    const net =
        income !== undefined && expenses !== undefined
            ? income - Math.abs(expenses)
            : undefined;

    return (
        <div className="flex flex-col min-h-full p-5 gap-6">
            <div className="flex flex-wrap gap-6 justify-between">
                <TransactionCard
                    total={data?.length}
                    type="Total Transactions"
                    formatter={(value) => value.toLocaleString()}
                    labelPosition="top"
                />
                <TransactionCard
                    total={income}
                    type="Total Income"
                    labelPosition="top"
                />
                <TransactionCard
                    total={expenses}
                    type="Total Expenses"
                    labelPosition="top"
                />
                <TransactionCard
                    total={net}
                    type="Net"
                    labelPosition="top"
                />
            </div>
            <RecentTransactions enablePagination={true} />
        </div>
    );
};
export default Transactions;
