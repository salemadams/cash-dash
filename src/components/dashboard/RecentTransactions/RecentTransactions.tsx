import { Transaction } from '@/types/transaction';
import { DataTable } from './DataTable';
import { columns } from './columns';

const RecentTransactions = ({
    data,
    enablePagination = false,
}: {
    data: Transaction[];
    enablePagination?: boolean;
}) => {
    return (
        <DataTable
            enablePagination={enablePagination}
            columns={columns}
            data={data}
        />
    );
};

export default RecentTransactions;
