import { defaults } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { forwardRef } from 'react';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

type DoughnutChartProps = {
    data: ChartData<'doughnut'>;
    options?: ChartOptions<'doughnut'>;
};

const DoughnutChart = forwardRef<any, DoughnutChartProps>(
    ({ data, options = {} }, ref) => {
        return (
            <Doughnut
                ref={ref}
                data={data}
                options={options}
            />
        );
    }
);

DoughnutChart.displayName = 'DoughnutChart';

export default DoughnutChart;
