import { getAllTransactions } from '@/api/transactions';
import { useChartZoom } from '@/components/charts/hooks/useChartZoom';
import LineChartCard from '@/components/charts/LineChartCard';
import DoughnutChartCard from '@/components/charts/DoughnutChartCard';
import BarChartCard from '@/components/charts/BarChartCard';
import SummaryCard from '@/components/charts/SummaryCard';
import { Interval } from '@/constants/interval';
import { useGlobalDate } from '@/contexts/GlobalDate';
import { USDollar } from '@/lib/format';
import {
    formatLineChartData,
    formatDoughnutChartData,
    formatBarChartData,
    calculateSummaryMetrics,
} from '@/services/charting';
import { Transaction } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';
import { ChartOptions } from 'chart.js';
import { useState, useMemo } from 'react';

const AnalyticsPage = () => {
    const globalDate = useGlobalDate();

    const [visibleDatasets, setVisibleDatasets] = useState<
        Record<string, boolean>
    >({
        Income: true,
        Expense: true,
        Savings: true,
    });

    // Query with select for line chart (compatible with zoom caching)
    const { data: lineChartData } = useQuery({
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
                globalDate.interval,
                'category'
            ),
    });

    // Separate query for raw data (for other charts)
    const { data: rawData } = useQuery({
        queryKey: [
            'transactions-raw',
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
    });

    // Format data for other chart types (memoized)
    const doughnutChartData = useMemo(
        () => (rawData ? formatDoughnutChartData(rawData) : undefined),
        [rawData]
    );

    const barChartData = useMemo(
        () => (rawData ? formatBarChartData(rawData, 6) : undefined),
        [rawData]
    );

    const summaryMetrics = useMemo(
        () => (rawData ? calculateSummaryMetrics(rawData) : undefined),
        [rawData]
    );

    const { chartRef, handleResetZoom, handleZoomComplete } =
        useChartZoom(lineChartData);

    const toggleDataset = (label: string) => {
        if (!chartRef.current) return;

        const chart = chartRef.current;
        const datasetIndex = chart.data.datasets.findIndex(
            (dataset: { label?: string }) => dataset.label === label
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
        <div className="flex flex-col gap-4 h-full p-5">
            {/* Top row: 3/4 and 1/4 split */}
            <div className="flex gap-4 flex-1">
                <div className="w-3/4 h-full">
                    {lineChartData ? (
                        <LineChartCard
                            title="Expense Spending Trends"
                            subtitle={`Last ${lineChartData?.labels?.length ?? 0} ${
                                Interval[globalDate.interval]
                            }${
                                lineChartData?.labels?.length &&
                                lineChartData.labels.length > 1
                                    ? 's'
                                    : ''
                            } Overview`}
                            chartRef={chartRef}
                            data={lineChartData}
                            options={options}
                            visibleDatasets={visibleDatasets}
                            onResetZoom={handleResetZoom}
                            onToggleDataset={toggleDataset}
                        />
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full flex items-center justify-center">
                            <span>Loading...</span>
                        </div>
                    )}
                </div>
                <div className="w-1/4">
                    {summaryMetrics ? (
                        <SummaryCard
                            title="Financial Summary"
                            subtitle="Current Period"
                            metrics={summaryMetrics}
                        />
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full flex items-center justify-center">
                            <span>Loading...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom row: 50/50 split */}
            <div className="flex gap-4 flex-1">
                <div className="w-1/2">
                    {doughnutChartData ? (
                        <DoughnutChartCard
                            title="Expense Breakdown"
                            subtitle="By Category"
                            data={doughnutChartData}
                        />
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full flex items-center justify-center">
                            <span>Loading...</span>
                        </div>
                    )}
                </div>
                <div className="w-1/2">
                    {barChartData ? (
                        <BarChartCard
                            title="Top Spending Categories"
                            subtitle="Ranked by Amount"
                            data={barChartData}
                            horizontal={true}
                        />
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full flex items-center justify-center">
                            <span>Loading...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
