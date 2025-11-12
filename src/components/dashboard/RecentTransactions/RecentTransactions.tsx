import { getAllTransactions } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from './DataTable';
import { columns } from './columns';

const RecentTransactions = ({
    limit,
    enablePagination = false,
}: {
    limit?: number;
    enablePagination?: boolean;
}) => {
    const { data } = useQuery({
        queryKey: ['transactions', 'recent'],
        queryFn: () =>
            getAllTransactions(undefined, undefined, undefined, limit),
    });

    return (
        <>
            {data ? (
                <DataTable
                    enablePagination={enablePagination}
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
