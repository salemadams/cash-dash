import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '../ui/card';
import RecentTransactions from './recent-transactions/recent-transactions';
import TransactionCards from './summary-cards/transaction-card-list';
import { getAllTransactions } from '@/api/transactions';
import { formatLineChartData } from '@/services/charting';
import LineChart from '../charts/LineChart';
import { ChartOptions } from 'chart.js';
import { USDollar } from '@/lib/format';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';

const Dashboard = () => {
    const chartRef = useRef<any>(null);
    const [visibleDatasets, setVisibleDatasets] = useState<Record<string, boolean>>({
        Income: true,
        Expense: true,
        Savings: true,
    });

    const { data } = useQuery({
        queryKey: ['transactions'],
        queryFn: getAllTransactions,
        select: formatLineChartData,
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

    return (
        <div className="flex flex-col min-h-full p-5 gap-6">
            <TransactionCards />
            <Card className="w-full flex-2 card-hover">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xl font-bold">Monthly Spending Trends</p>
                            <p className="text-gray-500">Last 3 months overview</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={visibleDatasets.Income ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => toggleDataset('Income')}
                            >
                                Income
                            </Button>
                            <Button
                                variant={visibleDatasets.Expense ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => toggleDataset('Expense')}
                            >
                                Expense
                            </Button>
                            <Button
                                variant={visibleDatasets.Savings ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => toggleDataset('Savings')}
                            >
                                Savings
                            </Button>
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
                    <p className="text-gray-500">Your latest financial activities</p>
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
