import { Transaction } from '@/types/transaction';
import { DataTable } from './DataTable';
import { columns } from './columns';

const RecentTransactions = ({
    data,
    enablePagination = false,
    noDataLabel = 'No recent transactions.',
}: {
    data: Transaction[];
    enablePagination?: boolean;
    noDataLabel?: string;
}) => {
    return (
        <DataTable
            enablePagination={enablePagination}
            columns={columns}
            data={data}
            noDataLabel={noDataLabel}
        />
    );
};

export default RecentTransactions;
