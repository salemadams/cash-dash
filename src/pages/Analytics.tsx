import { getAllTransactions } from '@/api/transactions';
import { useChartZoom } from '@/components/charts/hooks/useChartZoom';
import LineChartCard from '@/components/charts/LineChartCard';
import { Interval } from '@/constants/interval';
import { useGlobalDate } from '@/contexts/GlobalDate';
import { USDollar } from '@/lib/format';
import { formatLineChartData } from '@/services/charting';
import { Transaction } from '@/types/transaction';
import { useQuery } from '@tanstack/react-query';
import { ChartOptions } from 'chart.js';
import { useState } from 'react';

const AnalyticsPage = () => {
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
                globalDate.interval,
                'category'
            ),
    });

    const { chartRef, handleResetZoom, handleZoomComplete } =
        useChartZoom(data);

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
        <>
            {data ? (
                <LineChartCard
                    title="Expense Spending Trends"
                    subtitle={`Last ${data?.labels?.length ?? 0} ${
                        Interval[globalDate.interval]
                    }${
                        data?.labels?.length && data.labels.length > 1
                            ? 's'
                            : ''
                    } Overview`}
                    chartRef={chartRef}
                    data={data}
                    options={options}
                    visibleDatasets={visibleDatasets}
                    onResetZoom={handleResetZoom}
                    onToggleDataset={toggleDataset}
                />
            ) : (
                <span>Loading...</span>
            )}
        </>
    );
};

export default AnalyticsPage;
