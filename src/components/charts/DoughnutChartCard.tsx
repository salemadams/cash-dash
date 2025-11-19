import ChartCard from '@/components/charts/ChartCard';
import DoughnutChart from '@/components/charts/DoughnutChart';
import { ChartData, ChartOptions } from 'chart.js';
import { USDollar } from '@/lib/format';

type DoughnutChartCardProps = {
    title: string;
    subtitle?: string;
    data: ChartData<'doughnut'>;
    options?: ChartOptions<'doughnut'>;
};

const DoughnutChartCard = ({
    title,
    subtitle,
    data,
    options,
}: DoughnutChartCardProps) => {
    const defaultOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 12,
                    padding: 16,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce(
                            (acc: number, val) => acc + (typeof val === 'number' ? val : 0),
                            0
                        );
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${USDollar.format(value)} (${percentage}%)`;
                    },
                },
            },
        },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return (
        <ChartCard title={title} subtitle={subtitle}>
            <div className="w-full h-full min-h-[250px]">
                <DoughnutChart data={data} options={mergedOptions} />
            </div>
        </ChartCard>
    );
};

export default DoughnutChartCard;
