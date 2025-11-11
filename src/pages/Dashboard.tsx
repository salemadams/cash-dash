import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import RecentTransactions from '@/components/dashboard/RecentTransactions/RecentTransactions';
import TransactionCards from '@/components/dashboard/SummaryCards/TransactionCardList';
import { getAllTransactions } from '@/api/transactions';
import { formatLineChartData } from '@/services/charting';
import LineChart from '@/components/charts/LineChart';
import { ChartOptions } from 'chart.js';
import { USDollar } from '@/lib/format';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { Interval } from '@/constants/interval';

const Dashboard = () => {
    const chartRef = useRef<any>(null);
    const [visibleDatasets, setVisibleDatasets] = useState<
        Record<string, boolean>
    >({
        Income: true,
        Expense: true,
        Savings: true,
    });

    const { data } = useQuery({
        queryKey: ['transactions'],
        queryFn: getAllTransactions,
        select: (data) => {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 6);
            return formatLineChartData(
                data,
                startDate,
                endDate,
                Interval.Month
            );
        },
    });

    const toggleDataset = (label: string) => {
        if (!chartRef.current) return;

        const chart = chartRef.current;
        const datasetIndex = chart.data.datasets.findIndex(
            (dataset: any) => dataset.label === label
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
        chartRef.current.resetZoom();
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
                                Last 3 months overview
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
                    <p className="text-xl font-bold">Recent Transactions</p>
                    <p className="text-gray-500">
                        Your latest financial activities
                    </p>
                </CardHeader>
                <CardContent>
                    <RecentTransactions />
                </CardContent>
            </Card>
        </div>
    );
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

export default Dashboard;
