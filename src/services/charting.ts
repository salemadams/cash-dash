import { TransactionType } from '@/enums/transactions';
import { Transaction } from '@/types/transaction';
import type { ChartData } from 'chart.js';

export const formatLineChartData = (data: Transaction[]): ChartData<'line'> => {
    // Sort transactions by date in ascending order
    const sortedData = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Get unique dates for labels
    const labels = Array.from(
        new Set(sortedData.map((t: Transaction) => t.date))
    );

    // Get unique transaction types
    const types = Array.from(
        new Set(sortedData.map((t: Transaction) => t.type))
    );

    // Create a dataset for each transaction type
    const datasets = types.map((type) => {
        // For each date label, find the corresponding transaction or use 0
        const dataPoints = labels.map((date) => {
            const transaction = sortedData.find(
                (t) => t.date === date && t.type === type
            );
            if (transaction) {
                return transaction.amount < 0
                    ? transaction.amount * -1
                    : transaction.amount;
            }
            return 0;
        });

        return {
            label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
            data: dataPoints,
            fill: false,
            borderColor: getBorderColorByType(type),
        };
    });

    return {
        labels: labels,
        datasets: datasets,
    };
};

function getBorderColorByType(type: string) {
    switch (type) {
        case TransactionType.Income:
            return '#00a63e';
        case TransactionType.Expense:
            return '#e7000b';
        case TransactionType.Savings:
            return '#155dfc';
        default:
            return '#155dfc';
    }
}
