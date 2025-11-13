import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import RecentTransactions from '@/components/dashboard/RecentTransactions/RecentTransactions';
import TransactionCards from '@/components/dashboard/SummaryCards/TransactionCardList';
import { getAllTransactions } from '@/api/transactions';
import { Transaction } from '@/types/transaction';
import { formatLineChartData } from '@/services/charting';
import LineChart from '@/components/charts/LineChart';
import { ChartDataset, ChartOptions } from 'chart.js';
import { USDollar } from '@/lib/format';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, ArrowRight } from 'lucide-react';
import { Interval } from '@/constants/interval';
import { useGlobalDate } from '@/contexts/GlobalDate';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const globalDate = useGlobalDate();
    const queryClient = useQueryClient();
    const chartRef = useRef<any>(null);
    const [visibleDatasets, setVisibleDatasets] = useState<
        Record<string, boolean>
    >({
        Income: true,
        Expense: true,
        Savings: true,
    });
    const [baseDateRange, setBaseDateRange] = useState({
        startDate: globalDate.startDate,
        endDate: globalDate.endDate,
    });
    const isZoomingRef = useRef(false);

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

    const handleResetZoom = () => {
        if (!chartRef.current) return;

        // Set flag to prevent onZoomComplete from firing
        isZoomingRef.current = true;

        // Reset chart zoom
        chartRef.current.resetZoom();

        // Restore original date range
        globalDate.setStartDate(baseDateRange.startDate);
        globalDate.setEndDate(baseDateRange.endDate);

        // Reset flag after a short delay
        setTimeout(() => {
            isZoomingRef.current = false;
        }, 100);
    };

    // Update base date range when data is fetched (not from zoom)
    useEffect(() => {
        // Only update if the chart is not zoomed
        if (!chartRef.current || !data) return;

        const chart = chartRef.current;
        const isZoomed = chart.getZoomLevel && chart.getZoomLevel() > 1;
        if (!isZoomed) {
            setBaseDateRange({
                startDate: globalDate.startDate,
                endDate: globalDate.endDate,
            });
        }
    }, [data]);

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
                    onZoomComplete: ({ chart }) => {
                        // Ignore if we're in the middle of a reset
                        if (isZoomingRef.current) {
                            return;
                        }

                        // Calculate the number of data points in the zoomed range
                        const minIndex = Math.floor(chart.scales.x.min);
                        const maxIndex = Math.ceil(chart.scales.x.max);
                        const selectedRange = maxIndex - minIndex;

                        // Reject zoom if 2 or fewer intervals selected
                        if (selectedRange < 2) {
                            isZoomingRef.current = true;
                            chart.resetZoom();
                            isZoomingRef.current = false;
                            return;
                        }

                        const newStartDate = new Date(
                            chart.scales.x.getLabelForValue(chart.scales.x.min)
                        );
                        const newEndDate = new Date(
                            chart.scales.x.getLabelForValue(chart.scales.x.max)
                        );

                        // Preserve current data before updating dates
                        const currentData = data;

                        // Update global dates (this will change queryKey)
                        globalDate.setStartDate(newStartDate);
                        globalDate.setEndDate(newEndDate);

                        // Immediately set the query data to prevent refetch
                        queryClient.setQueryData(
                            [
                                'transactions',
                                newStartDate,
                                newEndDate,
                                globalDate.interval,
                            ],
                            currentData
                        );
                    },
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
            <Card className="w-full flex-2 card-hover">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xl font-bold">
                                Monthly Spending Trends
                            </p>
                            <p className="text-gray-500">
                                Last {data?.labels?.length ?? 0}{' '}
                                {Interval[globalDate.interval]}
                                {data?.labels?.length &&
                                    data.labels.length > 1 &&
                                    's'}{' '}
                                Overview
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleResetZoom}
                            >
                                Reset
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filter Data
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center">
                                    <DropdownMenuCheckboxItem
                                        checked={visibleDatasets.Income}
                                        onCheckedChange={() =>
                                            toggleDataset('Income')
                                        }
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        Income
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={visibleDatasets.Expense}
                                        onCheckedChange={() =>
                                            toggleDataset('Expense')
                                        }
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        Expense
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={visibleDatasets.Savings}
                                        onCheckedChange={() =>
                                            toggleDataset('Savings')
                                        }
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        Savings
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-full">
                    {data ? (
                        <div className="w-full h-full min-h-[350px]">
                            <LineChart
                                ref={chartRef}
                                datasets={data}
                                options={options}
                            />
                        </div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </CardContent>
            </Card>
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
