import { getAllTransactions } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from './DataTable';
import { columns } from './columns';

const RecentTransactions = () => {
    const { data } = useQuery({
        queryKey: ['transactions', 'recent'],
        queryFn: () => getAllTransactions(undefined, undefined, undefined, 6),
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
