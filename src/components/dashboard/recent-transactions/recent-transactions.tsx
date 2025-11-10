import { getAllTransactions } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from './data-table';
import { columns } from './columns';

const RecentTransactions = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['transactions'],
        queryFn: getAllTransactions,
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
