import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { USDollar } from '@/lib/format';

export type SummaryMetric = {
    label: string;
    value: number;
    format: 'currency' | 'percentage';
    trend?: 'up' | 'down' | 'neutral';
};

type SummaryCardProps = {
    title: string;
    subtitle?: string;
    metrics: SummaryMetric[];
};

const SummaryCard = ({ title, subtitle, metrics }: SummaryCardProps) => {
    const formatValue = (value: number, format: 'currency' | 'percentage') => {
        if (format === 'currency') {
            return USDollar.format(value);
        }
        return `${value.toFixed(1)}%`;
    };

    const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="h-4 w-4 text-green-500" />;
            case 'down':
                return <TrendingDown className="h-4 w-4 text-red-500" />;
            default:
                return <Minus className="h-4 w-4 text-gray-400" />;
        }
    };

    const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
        switch (trend) {
            case 'up':
                return 'text-green-600';
            case 'down':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <Card className="w-full h-full card-hover">
            <CardHeader className="pb-2">
                <div>
                    <p className="text-lg font-bold">{title}</p>
                    {subtitle && (
                        <p className="text-gray-500 text-sm">{subtitle}</p>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {metrics.map((metric, index) => (
                    <div key={index} className="flex flex-col">
                        <span className="text-sm text-gray-500">
                            {metric.label}
                        </span>
                        <div className="flex items-center gap-2">
                            <span
                                className={`text-xl font-semibold ${getTrendColor(
                                    metric.trend
                                )}`}
                            >
                                {formatValue(metric.value, metric.format)}
                            </span>
                            {metric.trend && getTrendIcon(metric.trend)}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default SummaryCard;
