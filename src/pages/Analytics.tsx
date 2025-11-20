import { getAllTransactions } from '@/api/transactions';
import { useChartZoom } from '@/components/charts/hooks/useChartZoom';
import LineChartCard from '@/components/charts/LineChartCard';
import DoughnutChartCard from '@/components/charts/DoughnutChartCard';
import BarChartCard from '@/components/charts/BarChartCard';
import SummaryCard from '@/components/charts/SummaryCard';
import {
    ChartCardSkeleton,
    SummaryCardSkeleton,
    DoughnutChartSkeleton,
    BarChartSkeleton,
} from '@/components/charts/skeletons';
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
import { useMemo } from 'react';

const AnalyticsPage = () => {
    const globalDate = useGlobalDate();

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
            {/* Top row: single column on mobile, 3/4 and 1/4 split on desktop */}
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
                <div className="w-full lg:w-3/4 h-full min-h-[300px]">
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
                            onResetZoom={handleResetZoom}
                            showFilter={false}
                        />
                    ) : (
                        <ChartCardSkeleton />
                    )}
                </div>
                <div className="w-full lg:w-1/4">
                    {summaryMetrics ? (
                        <SummaryCard
                            title="Financial Summary"
                            subtitle="Current Period"
                            metrics={summaryMetrics}
                        />
                    ) : (
                        <SummaryCardSkeleton />
                    )}
                </div>
            </div>

            {/* Bottom row: single column on mobile, 50/50 split on desktop */}
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
                <div className="w-full lg:w-1/2 min-h-[300px]">
                    {doughnutChartData ? (
                        <DoughnutChartCard
                            title="Expense Breakdown"
                            subtitle="By Category"
                            data={doughnutChartData}
                        />
                    ) : (
                        <DoughnutChartSkeleton />
                    )}
                </div>
                <div className="w-full lg:w-1/2 min-h-[300px]">
                    {barChartData ? (
                        <BarChartCard
                            title="Top Spending Categories"
                            subtitle="Ranked by Amount"
                            data={barChartData}
                            horizontal={true}
                        />
                    ) : (
                        <BarChartSkeleton />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
