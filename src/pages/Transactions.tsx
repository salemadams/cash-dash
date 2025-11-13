import { getAllTransactions } from '@/api/transactions';
import RecentTransactions from '@/components/dashboard/RecentTransactions/RecentTransactions';
import TransactionCard from '@/components/dashboard/SummaryCards/TransactionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TransactionType } from '@/constants/transactions';
import { useGlobalDate } from '@/contexts/GlobalDate';
import { Transaction } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';

const Transactions = () => {
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
        setFilteredData(
            data?.filter((t) => {
                const matchesSearch =
                    t.category
                        ?.toLowerCase()
                        .includes(searchInput.toLocaleLowerCase()) ||
                    t.description
                        .toLowerCase()
                        .includes(searchInput.toLocaleLowerCase()) ||
                    t.merchant
                        .toLowerCase()
                        .includes(searchInput.toLocaleLowerCase());
                if (typeFilter === TransactionType.All) return matchesSearch;
                const matchesType = t.type === typeFilter;
                return matchesSearch && matchesType;
            })
        );
    }, [searchInput, data, typeFilter]);

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
                <Button
                    onClick={() => setTypeFilter(TransactionType.All)}
                    variant={
                        typeFilter === TransactionType.All
                            ? 'default'
                            : 'outline'
                    }
                    className={`rounded-full w-13 ${
                        typeFilter === TransactionType.All
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
                    }`}
                >
                    All
                </Button>
                <Button
                    onClick={() => setTypeFilter(TransactionType.Income)}
                    variant={
                        typeFilter === TransactionType.Income
                            ? 'default'
                            : 'outline'
                    }
                    className={`rounded-full w-20 ${
                        typeFilter === TransactionType.Income
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                    }`}
                >
                    Income
                </Button>
                <Button
                    onClick={() => setTypeFilter(TransactionType.Expense)}
                    variant={
                        typeFilter === TransactionType.Expense
                            ? 'default'
                            : 'outline'
                    }
                    className={`rounded-full w-20 ${
                        typeFilter === TransactionType.Expense
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                    }`}
                >
                    Expenses
                </Button>
                <Button
                    onClick={() => setTypeFilter(TransactionType.Savings)}
                    variant={
                        typeFilter === TransactionType.Savings
                            ? 'default'
                            : 'outline'
                    }
                    className={`rounded-full w-20 ${
                        typeFilter === TransactionType.Savings
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                >
                    Savings
                </Button>
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
                <div>Loading...</div>
            )}
        </div>
    );
};
export default Transactions;
