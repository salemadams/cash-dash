import ChartCard from '@/components/charts/ChartCard';
import BarChart from '@/components/charts/BarChart';
import { ChartData, ChartOptions } from 'chart.js';
import { USDollar } from '@/lib/format';

type BarChartCardProps = {
    title: string;
    subtitle?: string;
    data: ChartData<'bar'>;
    options?: ChartOptions<'bar'>;
    horizontal?: boolean;
};

const BarChartCard = ({
    title,
    subtitle,
    data,
    options,
    horizontal = false,
}: BarChartCardProps) => {
    const defaultOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: horizontal ? 'y' : 'x',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return USDollar.format(context.parsed.x || context.parsed.y);
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    callback: (value) =>
                        horizontal
                            ? `$${Number(value).toLocaleString('en-US', {
                                  maximumFractionDigits: 0,
                              })}`
                            : value,
                },
            },
            y: {
                ticks: {
                    callback: function (value) {
                        if (!horizontal) {
                            return `$${Number(value).toLocaleString('en-US', {
                                maximumFractionDigits: 0,
                            })}`;
                        }
                        // For horizontal bars, just return the label
                        return this.getLabelForValue(value as number);
                    },
                },
            },
        },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return (
        <ChartCard title={title} subtitle={subtitle}>
            <div className="w-full h-full min-h-[250px]">
                <BarChart data={data} options={mergedOptions} />
            </div>
        </ChartCard>
    );
};

export default BarChartCard;
