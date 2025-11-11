import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '../ui/card';
import RecentTransactions from './recent-transactions/recent-transactions';
import TransactionCards from './summary-cards/transaction-card-list';
import { getAllTransactions } from '@/api/transactions';
import { formatLineChartData } from '@/services/charting';
import LineChart from '../charts/LineChart';
import { ChartOptions } from 'chart.js';
import { USDollar } from '@/lib/format';

const Dashboard = () => {
    const { data } = useQuery({
        queryKey: ['transactions'],
        queryFn: getAllTransactions,
        select: formatLineChartData,
    });

    return (
        <div className="flex flex-col h-full p-5 gap-6">
            <TransactionCards />
            <Card className="w-full flex-2 card-hover">
                <CardHeader>
                    <p className="text-xl font-bold">Monthly Spending Trends</p>
                    <p className="text-gray-500">Last 3 months overview</p>
                </CardHeader>
                <CardContent className="h-full">
                    {data ? (
                        <div className="w-full h-full min-h-[350px]">
                            <LineChart
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
