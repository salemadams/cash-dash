import { Budget } from '@/types/budget';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBudget, updateBudget } from '@/api/budgets';

const budgetSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    categories: z.array(z.string()).min(1, 'At least one category is required'),
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    startMonth: z.string().min(1, 'Start month is required'),
    recurring: z.boolean(),
    rollover: z.boolean(),
    alertThreshold: z
        .number()
        .min(0)
        .max(100, 'Threshold must be between 0 and 100'),
    isActive: z.boolean(),
});

type BudgetSchema = z.infer<typeof budgetSchema>;

type UseBudgetFormProps = {
    mode: string;
    initialData?: Budget;
    onSuccess?: () => void;
};

/**
 * Hook for managing budget form state, validation, and create/update mutations
 */
export function useBudgetForm({
    mode,
    initialData,
    onSuccess,
}: UseBudgetFormProps) {
    const queryClient = useQueryClient();

    const form = useForm<BudgetSchema>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            name: initialData?.name || '',
            categories: initialData?.categories || [],
            amount: initialData?.amount || 0,
            startMonth: initialData?.startMonth || '',
            recurring: initialData?.recurring || false,
            rollover: initialData?.rollover || false,
            alertThreshold: initialData?.alertThreshold || 80,
            isActive: initialData?.isActive ?? true,
        },
    });

    const createMutation = useMutation({
        mutationFn: createBudget,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['budgets', 'budgetTransactions'],
            });
            if (onSuccess) onSuccess();
            form.reset();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: BudgetSchema) => {
            if (!initialData?.id) {
                throw new Error('Budget ID is required for update');
            }
            return updateBudget(initialData.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            if (onSuccess) onSuccess();
        },
    });

    const onSubmit = async (data: BudgetSchema) => {
        if (mode === 'create') {
            createMutation.mutate(data);
        } else {
            updateMutation.mutate(data);
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading: createMutation.isPending || updateMutation.isPending,
        isError: createMutation.isError || updateMutation.isError,
        error: createMutation.error || updateMutation.error,
    };
}
