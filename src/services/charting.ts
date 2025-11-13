import { TransactionType } from '@/constants/transactions';
import { Transaction } from '@/types/transaction';
import type { ChartData } from 'chart.js';
import { capitalize } from '@/lib/format';
import { Interval } from '@/constants/interval';

export const formatLineChartData = (
    data: Transaction[],
    startDate: Date,
    endDate: Date,
    interval: Interval
): ChartData<'line'> => {
    // Server already filtered and sorted data by date ascending
    const sortedData = data.map((t) => ({
        ...t,
        date: new Date(t.date).getTime(),
    }));

    // Get unique dates for labels
    const labels: string[] = [];
    let current = new Date(startDate);

    while (current.getTime() <= endDate.getTime()) {
        labels.push(current.toLocaleDateString());

        // Increment based on interval type
        if (interval === Interval.Month) {
            // Use proper month arithmetic
            current = new Date(
                current.getFullYear(),
                current.getMonth() + 1,
                current.getDate()
            );
        } else {
            // For Day/Week, add milliseconds
            current = new Date(current.getTime() + interval);
        }

        // If the next increment would exactly equal endDate, we're done
        // If it would exceed endDate, add endDate as final label for leftover time
        if (current.getTime() > endDate.getTime()) {
            const lastLabel = labels[labels.length - 1];
            const endDateLabel = endDate.toLocaleDateString();
            // Only add endDate if it's different from the last label
            if (lastLabel !== endDateLabel) {
                labels.push(endDateLabel);
            }
            break;
        }
    }

    // Get unique transaction types
    const types = Array.from(new Set(sortedData.map((t) => t.type)));

    // Create a dataset for each transaction type
    const datasets = types.map((type) => {
        // For each date label, find the corresponding transaction or use 0
        const dataPoints = labels.map((date) => {
            const dateToMs = new Date(date).getTime();
            const transactions = sortedData.filter((t) => {
                return (
                    t.date >= dateToMs - interval &&
                    t.date < dateToMs &&
                    t.type === type
                );
            });
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
