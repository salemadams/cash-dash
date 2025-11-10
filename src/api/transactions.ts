import type { Transaction } from '@/types/transaction';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllTransactions = async () => {
    const res = await fetch(`${API_URL}/transactions`);
    if (!res.ok) throw new Error('Failed to retrieve transactions');

    const data = await res.json();
    return data as Transaction[];
};
