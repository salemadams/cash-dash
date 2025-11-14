import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import RecentTransactions from '@/components/dashboard/RecentTransactions/RecentTransactions';
import TransactionCards from '@/components/dashboard/SummaryCards/TransactionCardList';
import { getAllTransactions } from '@/api/transactions';
import { Transaction } from '@/types/transaction';
import { formatLineChartData } from '@/services/charting';
import { ChartDataset, ChartOptions } from 'chart.js';
import { USDollar } from '@/lib/format';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Interval } from '@/constants/interval';
import { useGlobalDate } from '@/contexts/GlobalDate';
import { Link } from 'react-router-dom';
import ChartCard from '@/components/charts/ChartCard';
import { useChartZoom } from '@/components/charts/hooks/useChartZoom';

const DashboardPage = () => {
    const globalDate = useGlobalDate();

    const [visibleDatasets, setVisibleDatasets] = useState<
        Record<string, boolean>
    >({
        Income: true,
        Expense: true,
        Savings: true,
    });

    const { data } = useQuery({
        queryKey: [
            'transactions',
            globalDate.startDate,
            globalDate.endDate,
            globalDate.interval,
        ],
        queryFn: () =>
            getAllTransactions(
                globalDate.startDate,
                globalDate.endDate,
                globalDate.interval
            ),
        select: (data: Transaction[]) =>
            formatLineChartData(
                data,
                globalDate.startDate,
                globalDate.endDate,
                globalDate.interval
            ),
    });

    const { data: recentTransactionsData } = useQuery({
        queryKey: ['transactions', 'recent'],
        queryFn: () => getAllTransactions(undefined, undefined, undefined, 6),
    });

    const { chartRef, handleResetZoom, handleZoomComplete } =
        useChartZoom(data);

    const toggleDataset = (label: string) => {
        if (!chartRef.current) return;

        const chart = chartRef.current;
        const datasetIndex = chart.data.datasets.findIndex(
            (dataset: ChartDataset) => dataset.label === label
        );

        if (datasetIndex !== -1) {
            const isVisible = chart.isDatasetVisible(datasetIndex);
            chart.setDatasetVisibility(datasetIndex, !isVisible);
            chart.update();

            setVisibleDatasets((prev) => ({
                ...prev,
                [label]: !isVisible,
            }));
        }
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: {
                    callback: (tickValue) =>
                        `$${Number(tickValue).toLocaleString('en-US', {
                            maximumFractionDigits: 0,
                        })}`,
                },
            },
        },
        plugins: {
            zoom: {
                zoom: {
                    drag: {
                        enabled: true,
                    },
                    onZoomComplete: handleZoomComplete,
                    mode: 'x',
                },
            },
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        `${context.dataset.label || ''}: ${USDollar.format(
                            Number(context.parsed.y)
                        )}`,
                },
            },
        },
    };

    return (
        <div className="flex flex-col min-h-full p-5 gap-6">
            <TransactionCards />
            <ChartCard
                title="Monthly Spending Trends"
                subtitle={`Last ${data?.labels?.length ?? 0} ${
                    Interval[globalDate.interval]
                }${
                    data?.labels?.length && data.labels.length > 1 ? 's' : ''
                } Overview`}
                chartRef={chartRef}
                data={data}
                options={options}
                visibleDatasets={visibleDatasets}
                onResetZoom={handleResetZoom}
                onToggleDataset={toggleDataset}
            />
            <Card className="w-full flex-2 card-hover">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xl font-bold">
                                Recent Transactions
                            </p>
                            <p className="text-gray-500">
                                Your latest financial activities
                            </p>
                        </div>
                        <Link
                            to="/transactions"
                            className="flex items-center gap-1 pt-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            View All Transactions
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentTransactionsData ? (
                        <RecentTransactions data={recentTransactionsData} />
                    ) : (
                        <div>Loading...</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardPage;
