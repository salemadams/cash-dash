import { Transaction } from '@/types/transaction';
import type { ChartData } from 'chart.js';
import { capitalize } from '@/lib/format';
import { Interval } from '@/constants/interval';
import { TransactionType } from '@/constants/transactions';
import { SummaryMetric } from '@/components/charts/SummaryCard';

/**
 * Formats transaction data into Chart.js line chart format with datasets grouped by type/category
 */
export const formatLineChartData = (
    data: Transaction[],
    startDate: Date,
    endDate: Date,
    interval: Interval,
    typeAggregator: keyof Transaction
): ChartData<'line'> => {
    const sortedData = data.map((t) => ({
        ...t,
        date: new Date(t.date).getTime(),
    }));

    const mapFn = (t: Transaction) => {
        const value = t[typeAggregator];
        // Ignore Income and Savings when aggregating by category since they don't have meaningful categories
        if (
            typeAggregator === 'category' &&
            (t.type === TransactionType.Income ||
                t.type === TransactionType.Savings)
        ) {
            return;
        }

        return value;
    };

    const labels = getUniqueLabels(startDate, endDate, interval);
    const types = getUniqueTypes(sortedData, mapFn);
    const datasets = createDataSets(labels, types, sortedData, interval, mapFn);

    return {
        labels,
        datasets,
    };
};

/**
 * Extracts unique values from transactions using a mapping function
 */
function getUniqueTypes<T>(
    sortedData: Transaction[],
    mapFn: (t: Transaction) => T | undefined
): T[] {
    return Array.from(new Set(sortedData.map(mapFn))).filter(
        (type): type is T => type !== undefined
    );
}

/**
 * Creates Chart.js datasets for each transaction type with aggregated amounts per interval
 */
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
                    mapFn(t) === type
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

/**
 * Generates date labels for chart x-axis based on interval between start and end dates
 */
function getUniqueLabels(startDate: Date, endDate: Date, interval: Interval) {
    const labels: string[] = [];
    let current = new Date(startDate);

    while (current.getTime() <= endDate.getTime()) {
        labels.push(current.toLocaleDateString());

        if (interval === Interval.Month) {
            current = new Date(
                current.getFullYear(),
                current.getMonth() + 1,
                current.getDate()
            );
        } else {
            current = new Date(current.getTime() + interval);
        }

        if (current.getTime() > endDate.getTime()) {
            const lastLabel = labels[labels.length - 1];
            const endDateLabel = endDate.toLocaleDateString();
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

/**
 * Returns a color for a category, using predefined colors for special types or generating one
 */
function getColorForCategory(type: string): string {
    const key = type.toLowerCase();

    if (SPECIAL_COLORS[key]) {
        return SPECIAL_COLORS[key];
    }

    return generateColorFromString(key);
}

/**
 * Generates a consistent HSL color from a string using hash
 */
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

/**
 * Formats expense transactions into Chart.js doughnut chart format grouped by category
 */
export const formatDoughnutChartData = (
    data: Transaction[]
): ChartData<'doughnut'> => {
    const expenses = data.filter((t) => t.type === TransactionType.Expense);

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

/**
 * Formats expense transactions into Chart.js bar chart format with top categories by amount
 */
export const formatBarChartData = (
    data: Transaction[],
    limit: number = 6
): ChartData<'bar'> => {
    const expenses = data.filter((t) => t.type === TransactionType.Expense);

    const categoryTotals: Record<string, number> = {};
    expenses.forEach((t) => {
        const category = t.category;
        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] += Math.abs(t.amount);
    });

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

/**
 * Calculates financial summary metrics including totals, rates, and trends from transactions
 */
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
