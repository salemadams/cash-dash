import { getAllTransactions } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { Transaction } from '@/types/transaction';

const RecentTransactions = () => {
    const { data } = useQuery({
        queryKey: ['transactions'],
        queryFn: getAllTransactions,
        select: (data: Transaction[]) => {
            return data.slice(0, 6);
        },
    });

    return (
        <>
            {data ? (
                <DataTable
                    columns={columns}
                    data={data}
                />
            ) : (
                <div>Loading</div>
            )}
        </>
    );
};

export default RecentTransactions;
