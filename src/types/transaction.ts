export type Transaction = {
    amount: number;
    category?: string;
    date: string;
    description: string;
    id: string;
    merchant: string;
    paymentMethod: string;
    type: string;
};
