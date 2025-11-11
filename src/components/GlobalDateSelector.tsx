import { useGlobalDate } from '@/contexts/GlobalDate';
import { DateSelector } from './ui/date-selector';

type GlobalDateSelectorProps = {
    label: string;
    dateType: 'start' | 'end';
};

export function GlobalDateSelector({
    label,
    dateType,
}: GlobalDateSelectorProps) {
    const globalDate = useGlobalDate();

    const currentDate =
        dateType === 'start' ? globalDate.startDate : globalDate.endDate;
    const setDate =
        dateType === 'start' ? globalDate.setStartDate : globalDate.setEndDate;

    return (
        <DateSelector
            label={label}
            initialDate={currentDate}
            onDateChange={setDate}
        />
    );
}
