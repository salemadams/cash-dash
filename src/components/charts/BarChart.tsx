import { defaults } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { forwardRef } from 'react';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

type BarChartProps = {
    data: ChartData<'bar'>;
    options?: ChartOptions<'bar'>;
};

const BarChart = forwardRef<any, BarChartProps>(
    ({ data, options = {} }, ref) => {
        return (
            <Bar
                ref={ref}
                data={data}
                options={options}
            />
        );
    }
);

BarChart.displayName = 'BarChart';

export default BarChart;
