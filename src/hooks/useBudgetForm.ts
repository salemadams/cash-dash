import { Budget } from '@/types/budget';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

export function useBudgetForm({
    mode,
    initialData,
    onSuccess,
}: UseBudgetFormProps) {
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

    const onSubmit = async (data: BudgetSchema) => {
        console.log('Submitting');
        if (mode === 'create') {
            console.log('Created: ', data);
            // TODO: Add API call to create budget
        } else {
            console.log('Edited: ', data);
            // TODO: Add API call to update budget
        }
        if (onSuccess) onSuccess();
        form.reset();
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
    };
}
