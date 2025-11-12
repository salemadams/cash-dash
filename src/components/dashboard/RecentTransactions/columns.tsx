import { Button } from '@/components/ui/button';
import { capitalize } from '@/lib/format';
import type { Transaction } from '@/types/transaction';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { MdAttachMoney } from 'react-icons/md';
import { FaRegCreditCard } from 'react-icons/fa';
import { AiOutlineBank } from 'react-icons/ai';

// Helper functions for transaction type styling
const getBackgroundColor = (type: string) => {
    if (type === 'income') return 'bg-green-100';
    if (type === 'expense') return 'bg-red-100';
    return 'bg-blue-100';
};

const getTextColor = (type: string) => {
    if (type === 'income') return 'text-green-600';
    if (type === 'expense') return 'text-red-600';
    return 'text-blue-600';
};

const getBadgeStyles = (type: string) => {
    if (type === 'income') return 'bg-green-100 text-green-800';
    if (type === 'expense') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
};

const getTypeIcon = (type: string) => {
    if (type === 'income') return <MdAttachMoney size={20} />;
    if (type === 'expense') return <FaRegCreditCard size={20} />;
    return <AiOutlineBank size={20} />;
};

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            const type = row.getValue<string>('type');
            const desc = row.getValue<string>('description');
            return (
                <div className="flex flex-row items-center gap-2">
                    <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getBackgroundColor(
                            type
                        )}`}
                    >
                        {getTypeIcon(type)}
                    </div>
                    <div>{desc}</div>
                </div>
            );
        },
    },
    {
        accessorKey: 'merchant',
        header: 'Merchant',
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
            const category = row.getValue<string>('category');
            if (!category) return <div>-</div>;
            return (
                <div className="px-3 py-1 rounded-full max-w-fit font-semibold bg-gray-200 text-gray-600">
                    {capitalize(category)}
                </div>
            );
        },
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue<string>('type');
            if (!type) return <div>-</div>;
            return (
                <span
                    className={`px-3 py-1 rounded-full font-medium ${getBadgeStyles(
                        type
                    )}`}
                >
                    {capitalize(type)}
                </span>
            );
        },
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            const type = row.getValue<string>('type');
            return (
                <div className={`pl-2 ${getTextColor(type)}`}>
                    {type !== 'expense' && '+'}
                    {amount.toFixed(2)}
                </div>
            );
        },
    },
];
