import { Budget, CreateUpdateBudget } from '@/types/budget';
import { Transaction } from '@/types/transaction';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllBudgets = async (month?: string) => {
    const params = new URLSearchParams();

    if (month) params.append('month', month);

    const url = `${API_URL}/budgets${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error('Failed to retrieve budgets');

    return (await res.json()) as Budget[];
};

export const getBudgetTransactions = async (month: string) => {
    const params = new URLSearchParams({ month });
    const url = `${API_URL}/budgets/transactions?${params}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error('Failed to retrieve budget transactions');

    return (await res.json()) as Record<string, Transaction[]>;
};

export const createBudget = async (budgetData: CreateUpdateBudget) => {
    const url = `${API_URL}/budgets`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...budgetData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }),
    });

    if (!res.ok) throw new Error('Failed to create budget');

    return (await res.json()) as Budget;
};

export const updateBudget = async (id: number, budgetData: CreateUpdateBudget) => {
    const url = `${API_URL}/budgets/${id}`;
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...budgetData,
            updatedAt: new Date().toISOString(),
        }),
    });

    if (!res.ok) throw new Error('Failed to update budget');

    return (await res.json()) as Budget;
};
