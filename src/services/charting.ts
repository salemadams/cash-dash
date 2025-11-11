import { TransactionType } from '@/constants/transactions';
import { Transaction } from '@/types/transaction';
import type { ChartData } from 'chart.js';
import { capitalize } from '@/lib/format';
import { Interval } from '@/constants/interval';

export const formatLineChartData = (
    data: Transaction[],
    startDate: Date = new Date('2010-01-01'),
    endDate: Date = new Date(),
    interval: Interval = Interval.Day
): ChartData<'line'> => {
    // Sort transactions by date in ascending order and filter by start/end
    const sortedData = [...data]
        .filter((t) => {
            const transactionDate = new Date(t.date).getTime();
            return (
                transactionDate >= startDate.getTime() - interval &&
                transactionDate <= endDate.getTime()
            );
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((t) => ({
            ...t,
            date: new Date(t.date).getTime(),
        }));

    // Get unique dates for labels
    let labels: string[] = [];
    let current = startDate?.getTime();
    while (current <= endDate.getTime()) {
        labels.push(new Date(current).toLocaleDateString());
        current = current + interval;
    }

    // Get unique transaction types
    const types = Array.from(new Set(sortedData.map((t) => t.type)));

    // Create a dataset for each transaction type
    const datasets = types.map((type) => {
        // For each date label, find the corresponding transaction or use 0
        const dataPoints = labels.map((date) => {
            const dateToMs = new Date(date).getTime();
            const transactions = sortedData.filter(
                (t) =>
                    t.date >= dateToMs - interval &&
                    t.date <= dateToMs &&
                    t.type === type
            );

            if (transactions.length > 0) {
                const total = transactions.reduce((acc, transaction) => {
                    return acc + Math.abs(transaction.amount);
                }, 0);
                return total;
            }
            return 0;
        });

        return {
            label: capitalize(type),
            data: dataPoints,
            fill: false,
            borderColor: getBorderColorByType(type),
        };
    });

    // Slice labels post aggregation
    labels = labels.slice(1, labels.length);

    return {
        labels,
        datasets,
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
