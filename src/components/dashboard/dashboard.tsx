import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '../ui/card';
import RecentTransactions from './recent-transactions/recent-transactions';
import TransactionCards from './transaction-cards';
import { getAllTransactions } from '@/api/transactions';
import { formatLineChartData } from '@/services/charting';
import LineChart from '../charts/LineChart';
import { ChartOptions } from 'chart.js';

const Dashboard = () => {
    const { data } = useQuery({
        queryKey: ['transactions'],
        queryFn: getAllTransactions,
        select: (data) => {
            return formatLineChartData(data);
        },
    });

    return (
        <div className="flex flex-col h-full p-5 gap-6">
            <TransactionCards />
            <Card className="w-full flex-2">
                <CardHeader>
                    <p className="text-xl font-semibold text-foreground/70 uppercase tracking-wider">
                        Monthly Spending
                    </p>
                </CardHeader>
                <CardContent>
                    {data ? (
                        <LineChart
                            datasets={data}
                            options={options}
                        />
                    ) : (
                        <div>Loading...</div>
                    )}
                </CardContent>
            </Card>
            <Card className="w-full flex-2">
                <CardHeader>
                    <p className="text-xl font-semibold text-foreground/70 uppercase tracking-wider">
                        Recent Transactions
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
    scales: {
        y: {
            ticks: {
                callback(tickValue) {
                    return `$${tickValue.toLocaleString()}`;
                },
            },
        },
    },
    plugins: {
        tooltip: {
            callbacks: {
                label(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y;
                    return `${label}: $${value!.toLocaleString('en-US')}`;
                },
            },
        },
    },
};

export default Dashboard;
