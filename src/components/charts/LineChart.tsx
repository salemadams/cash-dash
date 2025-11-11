import { defaults } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { forwardRef } from 'react';
import { Button } from '../ui/button';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

type LineChartProps = {
    datasets: ChartData<'line'>;
    options?: ChartOptions<'line'>;
};

const LineChart = forwardRef<any, LineChartProps>(
    ({ datasets, options = {} }, ref) => {
        return (
            <Line
                ref={ref}
                data={datasets}
                options={options}
            />
        );
    }
);

LineChart.displayName = 'LineChart';

export default LineChart;
