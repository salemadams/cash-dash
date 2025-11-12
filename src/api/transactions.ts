import type { Transaction } from '@/types/transaction';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllTransactions = async (startDate?: Date, endDate?: Date) => {
    const res = await fetch(`${API_URL}/transactions`);
    if (!res.ok) throw new Error('Failed to retrieve transactions');

    let data = await res.json() as Transaction[];

    // Filter by date range on the client side
    if (startDate || endDate) {
        data = data.filter(transaction => {
            const transactionDate = new Date(transaction.date);

            if (startDate && transactionDate < startDate) {
                return false;
            }

            if (endDate && transactionDate > endDate) {
                return false;
            }

            return true;
        });
    }

    return data;
};
