export type Transaction = {
    amount: number;
    category?: string;
    date: string | number;
    description: string;
    id: string;
    merchant: string;
    paymentMethod: string;
    type: string;
};
