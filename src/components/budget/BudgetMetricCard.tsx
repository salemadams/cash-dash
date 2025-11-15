import { ReactNode } from 'react';

type BudgetMetricCardProps = {
    icon: ReactNode;
    label: string;
    value: string;
    iconColor: string;
    iconBgColor: string;
    valueColor?: string;
};

const BudgetMetricCard = ({
    icon,
    label,
    value,
    iconColor,
    iconBgColor,
    valueColor,
}: BudgetMetricCardProps) => {
    return (
        <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
            <div className={`p-2 rounded-full ${iconBgColor}`}>
                <div className={iconColor}>{icon}</div>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-lg font-semibold ${valueColor || ''}`}>
                    {value}
                </p>
            </div>
        </div>
    );
};

export default BudgetMetricCard;
