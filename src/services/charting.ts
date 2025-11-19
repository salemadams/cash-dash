import { Transaction } from '@/types/transaction';
import type { ChartData } from 'chart.js';
import { capitalize } from '@/lib/format';
import { Interval } from '@/constants/interval';
import { TransactionType } from '@/constants/transactions';

export const formatLineChartData = (
    data: Transaction[],
    startDate: Date,
    endDate: Date,
    interval: Interval,
    typeAggregator: keyof Transaction
): ChartData<'line'> => {
    // Server already filtered and sorted data by date ascending
    const sortedData = data.map((t) => ({
        ...t,
        date: new Date(t.date).getTime(),
    }));

    const mapFn = (t: Transaction) => {
        const value = t[typeAggregator];
        // Ignore Income and Savings when aggregating by category
        if (
            typeAggregator === 'category' &&
            (t.type === TransactionType.Income ||
                t.type === TransactionType.Savings)
        ) {
            return;
        }

        return value;
    };

    // Get unique dates for labels
    const labels = getUniqueLabels(startDate, endDate, interval);

    // Get unique transaction types
    const types = getUniqueTypes(sortedData, mapFn);
    console.log(types);
    // Create a dataset for each transaction type
    const datasets = createDataSets(labels, types, sortedData, interval, mapFn);

    return {
        labels,
        datasets,
    };
};

function getUniqueTypes<T>(
    sortedData: Transaction[],
    mapFn: (t: Transaction) => T | undefined
): T[] {
    return Array.from(new Set(sortedData.map(mapFn))).filter(
        (type): type is T => type !== undefined
    );
}

function createDataSets<T>(
    labels: string[],
    types: T[],
    sortedData: Transaction[],
    interval: Interval,
    mapFn: (t: Transaction) => T
) {
    return types.map((type) => {
        const dataPoints = labels.map((date: string) => {
            const dateToMs = new Date(date).getTime();

            const transactions = sortedData.filter((t: Transaction) => {
                return (
                    Number(t.date) >= dateToMs - interval &&
                    Number(t.date) < dateToMs &&
                    mapFn(t) === type // <-- generic comparison
                );
            });

            if (transactions.length > 0) {
                return transactions.reduce(
                    (acc, transaction) => acc + Math.abs(transaction.amount),
                    0
                );
            }
            return 0;
        });

        return {
            label: capitalize(String(type)),
            data: dataPoints,
            fill: false,
            borderColor: getColorForCategory(String(type)),
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
const SPECIAL_COLORS: Record<string, string> = {
    income: '#00a63e',
    expense: '#e7000b',
    savings: '#155dfc',
};

function getColorForCategory(type: string): string {
    const key = type.toLowerCase();

    if (SPECIAL_COLORS[key]) {
        return SPECIAL_COLORS[key];
    }

    return generateColorFromString(key);
}

function generateColorFromString(str: string): string {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    const saturation = 60;
    const lightness = 55;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
