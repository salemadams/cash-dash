export type Budget = {
    id: number;
    name: string;
    categories: string[];
    amount: number;
    startMonth: string;
    recurring: boolean;
    rollover: boolean;
    alertThreshold: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
