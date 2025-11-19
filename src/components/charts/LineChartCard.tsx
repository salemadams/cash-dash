import { Card, CardContent, CardHeader } from '@/components/ui/card';
import LineChart from '@/components/charts/LineChart';
import ChartControls from '@/components/charts/ChartControls';
import { ChartData, ChartOptions } from 'chart.js';

type ChartCardProps = {
    title: string;
    subtitle: string;
    chartRef: React.RefObject<unknown>;
    data: ChartData<'line'>;
    options: ChartOptions<'line'>;
    visibleDatasets?: Record<string, boolean>;
    onResetZoom?: () => void;
    onToggleDataset?: (label: string) => void;
    showFilter?: boolean;
};

const LineChartCard = ({
    title,
    subtitle,
    chartRef,
    data,
    options,
    visibleDatasets = {},
    onResetZoom,
    onToggleDataset = () => {},
    showFilter = true,
}: ChartCardProps) => {
    return (
        <Card className="w-full h-full flex-2 card-hover">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xl font-bold">{title}</p>
                        <p className="text-gray-500">{subtitle}</p>
                    </div>
                    <ChartControls
                        onResetZoom={onResetZoom ? onResetZoom : () => {}}
                        visibleDatasets={visibleDatasets}
                        onToggleDataset={onToggleDataset}
                        showFilter={showFilter}
                    />
                </div>
            </CardHeader>
            <CardContent className="h-full">
                <div className="w-full h-full min-h-[350px]">
                    <LineChart
                        ref={chartRef}
                        datasets={data}
                        options={options}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default LineChartCard;
