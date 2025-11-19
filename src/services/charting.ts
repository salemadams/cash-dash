import { Transaction } from '@/types/transaction';
import type { ChartData } from 'chart.js';
import { capitalize } from '@/lib/format';
import { Interval } from '@/constants/interval';
import { TransactionType } from '@/constants/transactions';
import { SummaryMetric } from '@/components/charts/SummaryCard';

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

export const formatDoughnutChartData = (
    data: Transaction[]
): ChartData<'doughnut'> => {
    // Filter for expenses only
    const expenses = data.filter((t) => t.type === TransactionType.Expense);

    // Group by category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((t) => {
        const category = t.category;
        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] += Math.abs(t.amount);
    });

    const labels = Object.keys(categoryTotals).map(capitalize);
    const values = Object.values(categoryTotals);
    const colors = Object.keys(categoryTotals).map((cat) =>
        getColorForCategory(cat)
    );

    return {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                borderWidth: 2,
            },
        ],
    };
};

export const formatBarChartData = (
    data: Transaction[],
    limit: number = 6
): ChartData<'bar'> => {
    // Filter for expenses only
    const expenses = data.filter((t) => t.type === TransactionType.Expense);

    // Group by category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((t) => {
        const category = t.category;
        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] += Math.abs(t.amount);
    });

    // Sort by amount descending and limit
    const sorted = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit);

    const labels = sorted.map(([category]) => capitalize(category));
    const values = sorted.map(([, amount]) => amount);
    const colors = sorted.map(([category]) => getColorForCategory(category));

    return {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                borderRadius: 4,
            },
        ],
    };
};

export const calculateSummaryMetrics = (
    data: Transaction[]
): SummaryMetric[] => {
    const totalIncome = data
        .filter((t) => t.type === TransactionType.Income)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpense = data
        .filter((t) => t.type === TransactionType.Expense)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalSavings = data
        .filter((t) => t.type === TransactionType.Savings)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netChange = totalIncome - totalExpense - totalSavings;
    const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
    const expenseRate = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

    return [
        {
            label: 'Total Income',
            value: totalIncome,
            format: 'currency',
            trend: totalIncome > 0 ? 'up' : 'neutral',
        },
        {
            label: 'Total Expenses',
            value: totalExpense,
            format: 'currency',
            trend: expenseRate <= 70 ? 'up' : expenseRate <= 90 ? 'neutral' : 'down',
        },
        {
            label: 'Net Change',
            value: netChange,
            format: 'currency',
            trend: netChange > 0 ? 'up' : netChange < 0 ? 'down' : 'neutral',
        },
        {
            label: 'Total Savings',
            value: totalSavings,
            format: 'currency',
            trend: totalSavings > 0 ? 'up' : 'neutral',
        },
        {
            label: 'Savings Rate',
            value: savingsRate,
            format: 'percentage',
            trend: savingsRate >= 20 ? 'up' : savingsRate >= 10 ? 'neutral' : 'down',
        },
        {
            label: 'Expense Ratio',
            value: expenseRate,
            format: 'percentage',
            trend: expenseRate <= 70 ? 'up' : expenseRate <= 90 ? 'neutral' : 'down',
        },
    ];
};
