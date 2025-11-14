import { Budget } from '@/types/budget';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllBudgets = async () => {
    const res = await fetch(`${API_URL}/budgets`);

    if (!res.ok) throw new Error('Failed to retrieve budgets');

    return (await res.json()) as Budget[];
};
