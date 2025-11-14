import { Button } from '@/components/ui/button';

type TransactionTypeFilterProps = {
    label: string;
    isActive: boolean;
    onClick: () => void;
    color: 'purple' | 'green' | 'red' | 'blue';
};

const colorMap = {
    purple: {
        active: 'bg-purple-600 hover:bg-purple-700',
        inactive:
            'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
    },
    green: {
        active: 'bg-green-600 hover:bg-green-700',
        inactive:
            'border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
    },
    red: {
        active: 'bg-red-600 hover:bg-red-700',
        inactive:
            'border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
    },
    blue: {
        active: 'bg-blue-600 hover:bg-blue-700',
        inactive:
            'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
    },
};

const TransactionTypeFilter = ({
    label,
    isActive,
    onClick,
    color,
}: TransactionTypeFilterProps) => {
    const colorClasses = isActive
        ? colorMap[color].active
        : colorMap[color].inactive;

    return (
        <Button
            onClick={onClick}
            variant={isActive ? 'default' : 'outline'}
            className={`rounded-full w-20 ${colorClasses}`}
        >
            {label}
        </Button>
    );
};

export default TransactionTypeFilter;
