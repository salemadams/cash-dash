import { defaults } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

type LineChartProps = {
    datasets: ChartData<'line'>;
    options?: ChartOptions<'line'>;
};

const LineChart = ({ datasets, options = {} }: LineChartProps) => {
    return (
        <Line
            data={datasets}
            options={options}
        />
    );
};

export default LineChart;
