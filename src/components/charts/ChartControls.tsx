import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';

type ChartControlsProps = {
    onResetZoom: () => void;
    visibleDatasets: Record<string, boolean>;
    onToggleDataset: (label: string) => void;
};

const ChartControls = ({
    onResetZoom,
    visibleDatasets,
    onToggleDataset,
}: ChartControlsProps) => {
    return (
        <div className="flex gap-2">
            <Button variant="default" size="sm" onClick={onResetZoom}>
                Reset
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter Data
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                    <DropdownMenuCheckboxItem
                        checked={visibleDatasets.Income}
                        onCheckedChange={() => onToggleDataset('Income')}
                        onSelect={(e) => e.preventDefault()}
                    >
                        Income
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={visibleDatasets.Expense}
                        onCheckedChange={() => onToggleDataset('Expense')}
                        onSelect={(e) => e.preventDefault()}
                    >
                        Expense
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={visibleDatasets.Savings}
                        onCheckedChange={() => onToggleDataset('Savings')}
                        onSelect={(e) => e.preventDefault()}
                    >
                        Savings
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ChartControls;
