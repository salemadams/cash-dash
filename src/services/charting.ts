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
    const labels = getUniqueLabels(startDate, endDate, interval);

    // Get unique transaction types
    const types = getUniqueTypes(sortedData, (t) => t.type);

    // Create a dataset for each transaction type
    const datasets = createDataSets(labels, types, sortedData, interval);

    return {
        labels,
        datasets,
    };
};

function getUniqueTypes<T>(
    sortedData: Transaction[],
    mapFn: (t: Transaction) => T
): T[] {
    return Array.from(new Set(sortedData.map(mapFn)));
}

function createDataSets<T>(
    labels: string[],
    types: T[],
    sortedData: Transaction[],
    interval: Interval
) {
    return types.map((type) => {
        // For each date label, find the corresponding transaction or use 0
        const dataPoints = labels.map((date: string) => {
            const dateToMs = new Date(date).getTime();
            const transactions = sortedData.filter((t: Transaction) => {
                return (
                    Number(t.date) >= dateToMs - interval &&
                    Number(t.date) < dateToMs &&
                    (t.type as unknown) === type
                );
            });
            if (transactions.length > 0) {
                const total = transactions.reduce(
                    (acc, transaction: Transaction) => {
                        return acc + Math.abs(transaction.amount);
                    },
                    0
                );
                return total;
            }
            return 0;
        });

        return {
            label: capitalize(String(type)),
            data: dataPoints,
            fill: false,
            borderColor: getBorderColorByType(String(type)),
        };
    });
}

function getUniqueLabels(startDate: Date, endDate: Date, interval: Interval) {
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
    return labels;
}

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
