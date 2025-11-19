import { Skeleton } from '@/components/ui/skeleton';

export const ChartCardSkeleton = () => {
    return <Skeleton className="w-full h-full min-h-[300px] rounded-lg" />;
};

export const SummaryCardSkeleton = () => {
    return <Skeleton className="w-full h-full min-h-[200px] rounded-lg" />;
};

export const DoughnutChartSkeleton = () => {
    return <Skeleton className="w-full h-full min-h-[250px] rounded-lg" />;
};

export const BarChartSkeleton = () => {
    return <Skeleton className="w-full h-full min-h-[250px] rounded-lg" />;
};

export const TransactionsTableSkeleton = () => {
    return <Skeleton className="w-full h-64 rounded-lg" />;
};
