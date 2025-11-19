import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ReactNode } from 'react';

type ChartCardProps = {
    title: string;
    subtitle?: string;
    children: ReactNode;
    headerAction?: ReactNode;
    className?: string;
    contentClassName?: string;
};

const ChartCard = ({
    title,
    subtitle,
    children,
    headerAction,
    className = '',
    contentClassName = '',
}: ChartCardProps) => {
    return (
        <Card className={`w-full h-full card-hover ${className}`}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xl font-bold">{title}</p>
                        {subtitle && <p className="text-gray-500">{subtitle}</p>}
                    </div>
                    {headerAction}
                </div>
            </CardHeader>
            <CardContent className={`h-full ${contentClassName}`}>
                {children}
            </CardContent>
        </Card>
    );
};

export default ChartCard;
