import { USDollar } from '@/lib/format';
import type { Transaction } from '@/types/transaction';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            const formatted = USDollar.format(amount);
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: 'date',
        header: 'Date',
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue<string>('type');
            if (!type) return <div>-</div>;
            const formatted =
                type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
            const category = row.getValue<string>('category');
            if (!category) return <div>-</div>;
            const formatted =
                category.charAt(0).toUpperCase() +
                category.slice(1).toLowerCase();
            return <div>{formatted}</div>;
        },
    },
];
