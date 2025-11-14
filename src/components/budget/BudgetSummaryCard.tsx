import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import StatMetric from '@/components/common/StatMetric';

type BudgetSummaryCardProps = {
    totalBudgeted: number;
    totalSpent: number;
    totalRemaining: number;
    percentageUsed: number;
    getBarColor: (percentage: number) => string;
};

const BudgetSummaryCard = ({
    totalBudgeted,
    totalSpent,
    totalRemaining,
    percentageUsed,
    getBarColor,
}: BudgetSummaryCardProps) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex flex-row justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Overall Budget Health
                    </h2>
                    <h2 className="text-xl font-semibold">Utilized</h2>
                </div>
            </CardHeader>
            <CardContent>
                <Progress
                    className="h-5"
                    indicatorClassName={getBarColor(percentageUsed)}
                    value={percentageUsed}
                />
            </CardContent>
            <CardFooter>
                <div className="flex flex-row justify-between items-center w-full">
                    <StatMetric
                        label="Remaining"
                        value={`$${totalRemaining.toFixed(2)}`}
                        valueSize="lg"
                    />
                    <div className="flex flex-row gap-6">
                        <StatMetric label="Monthly Income" value="$0.00" />
                        <StatMetric
                            label="Budgeted"
                            value={`$${totalBudgeted.toFixed(2)}`}
                        />
                        <StatMetric
                            label="Spent"
                            value={`$${totalSpent.toFixed(2)}`}
                        />
                        <StatMetric label="Month-over-Month" value="0%" />
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default BudgetSummaryCard;
