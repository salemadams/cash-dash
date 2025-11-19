import { getAllTransactions } from '@/api/transactions';
import RecentTransactions from '@/components/dashboard/RecentTransactions/RecentTransactions';
import TransactionCard from '@/components/dashboard/SummaryCards/TransactionCard';
import { Input } from '@/components/ui/input';
import { TransactionType } from '@/constants/transactions';
import { useGlobalDate } from '@/contexts/GlobalDate';
import { Transaction } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import TransactionTypeFilter from '@/components/transactions/TransactionTypeFilter';
import { filterTransactions, calculateTransactionTotals } from '@/services/transactions';
import { TransactionsTableSkeleton } from '@/components/charts/skeletons';

const filterOptions = [
    { type: TransactionType.All, label: 'All', color: 'purple' as const },
    { type: TransactionType.Income, label: 'Income', color: 'green' as const },
    { type: TransactionType.Expense, label: 'Expenses', color: 'red' as const },
    { type: TransactionType.Savings, label: 'Savings', color: 'blue' as const },
];

const TransactionsPage = () => {
    const globalDate = useGlobalDate();
    const [searchInput, setSearchInput] = useState('');
    const [typeFilter, setTypeFilter] = useState(TransactionType.All);
    const [filteredData, setFilteredData] = useState<Transaction[] | undefined>(
        undefined
    );

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

    useEffect(() => {
        if (data) {
            setFilteredData(filterTransactions(data, searchInput, typeFilter));
        }
    }, [searchInput, data, typeFilter]);

    const totals = data ? calculateTransactionTotals(data) : undefined;
    const income = totals?.income;
    const expenses = totals?.expenses;
    const net = totals?.net;

    return (
        <div className="flex flex-col min-h-full p-5 gap-6">
            <div className="relative">
                <IoMdSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                />
                <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search categories, merchants, description..."
                    className="pl-10"
                />
            </div>
            <div className="flex flex-row gap-2">
                {filterOptions.map((option) => (
                    <TransactionTypeFilter
                        key={option.type}
                        label={option.label}
                        isActive={typeFilter === option.type}
                        onClick={() => setTypeFilter(option.type)}
                        color={option.color}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-6 justify-between">
                <TransactionCard
                    total={data?.length}
                    label="Total Transactions"
                    formatter={(value) => value.toLocaleString()}
                    labelPosition="top"
                />
                <TransactionCard
                    total={income}
                    label="Total Income"
                    labelPosition="top"
                />
                <TransactionCard
                    total={expenses}
                    label="Total Expenses"
                    labelPosition="top"
                />
                <TransactionCard
                    total={net}
                    label={`Net ${net && net > 0 ? 'Gain' : 'Loss'}`}
                    labelPosition="top"
                />
            </div>
            {filteredData ? (
                <RecentTransactions
                    data={filteredData}
                    enablePagination={true}
                />
            ) : (
                <TransactionsTableSkeleton />
            )}
        </div>
    );
};
export default TransactionsPage;
