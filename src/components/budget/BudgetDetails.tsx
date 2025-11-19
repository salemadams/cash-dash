import { Budget } from '@/types/budget';
import {
    FaDollarSign,
    FaCalendarAlt,
    FaRedo,
    FaBell,
    FaCheckCircle,
    FaTimesCircle,
    FaTags,
} from 'react-icons/fa';
import BudgetMetricCard from './BudgetMetricCard';

type BudgetDetailsProps = {
    budget: Budget;
    spent: number;
    remaining: number;
};

const BudgetDetails = ({ budget, spent, remaining }: BudgetDetailsProps) => {
    const isLowBudget = (remaining / budget.amount) * 100 < 20;

    return (
        <div className="bg-muted/30 p-6 space-y-4">
            {/* Financial Overview */}
            <div className="grid grid-cols-4 gap-4">
                <BudgetMetricCard
                    icon={<FaDollarSign />}
                    label="Budgeted"
                    value={`$${budget.amount.toFixed(2)}`}
                    iconColor="text-blue-600 dark:text-blue-400"
                    iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                />
                <BudgetMetricCard
                    icon={<FaDollarSign />}
                    label="Spent"
                    value={`$${spent.toFixed(2)}`}
                    iconColor="text-orange-600 dark:text-orange-400"
                    iconBgColor="bg-orange-100 dark:bg-orange-900/30"
                />
                <BudgetMetricCard
                    icon={<FaDollarSign />}
                    label="Remaining"
                    value={`$${remaining.toFixed(2)}`}
                    iconColor={
                        isLowBudget
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                    }
                    iconBgColor={
                        isLowBudget
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : 'bg-green-100 dark:bg-green-900/30'
                    }
                    valueColor={
                        isLowBudget
                            ? 'text-red-600 dark:text-red-400'
                            : undefined
                    }
                />
                <BudgetMetricCard
                    icon={<FaBell />}
                    label="Alert Threshold"
                    value={`${budget.alertThreshold}%`}
                    iconColor="text-purple-600 dark:text-purple-400"
                    iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                />
            </div>

            {/* Budget Properties */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-muted-foreground" />
                        <span className="text-sm">
                            <span className="text-muted-foreground">
                                Start:
                            </span>
                            <span className="font-medium">
                                {budget.startMonth}
                            </span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaRedo className="text-muted-foreground" />
                        <span
                            className={`px-2 py-1 rounded-md text-sm font-medium ${
                                budget.recurring
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {budget.recurring ? 'Recurring' : 'One-time'}
                        </span>
                    </div>
                    {budget.rollover && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm font-medium">
                            Rollover Enabled
                        </span>
                    )}
                    <div className="flex items-center gap-2">
                        {budget.isActive ? (
                            <FaCheckCircle className="text-green-600 dark:text-green-400" />
                        ) : (
                            <FaTimesCircle className="text-gray-400" />
                        )}
                        <span
                            className={`text-sm font-medium ${
                                budget.isActive
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-400'
                            }`}
                        >
                            {budget.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    {/* Categories */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FaTags />
                            <span className="text-sm font-medium">
                                Categories:
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {budget.categories.map((category) => (
                                <span
                                    key={category}
                                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetDetails;
