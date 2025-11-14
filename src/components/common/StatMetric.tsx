type StatMetricProps = {
    label: string;
    value: string | number;
    valueSize?: 'sm' | 'md' | 'lg';
    align?: 'start' | 'end';
};

const sizeClasses = {
    sm: 'font-semibold',
    md: 'font-semibold text-lg',
    lg: 'font-semibold text-xl',
};

const StatMetric = ({
    label,
    value,
    valueSize = 'md',
    align = 'start',
}: StatMetricProps) => {
    return (
        <div className={`flex flex-col items-${align}`}>
            <span className="text-gray-500 text-sm">{label}</span>
            <span className={sizeClasses[valueSize]}>{value}</span>
        </div>
    );
};

export default StatMetric;
