import { Interval } from '@/constants/interval';
import type { Transaction } from '@/types/transaction';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllTransactions = async (
    startDate?: Date,
    endDate?: Date,
    interval?: Interval,
    limit?: number
) => {
    const params = new URLSearchParams();

    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    if (interval) params.append('interval', interval.toString());
    if (limit) params.append('_limit', limit.toString());

    const url = `${API_URL}/transactions${
        params.toString() ? `?${params}` : ''
    }`;
    const res = await fetch(url);

    if (!res.ok) throw new Error('Failed to retrieve transactions');

    return (await res.json()) as Transaction[];
};
