import { createContext, ReactNode, useContext, useState } from 'react';
import { Interval } from '@/constants/interval';

type GlobalDateProviderProps = {
    children: ReactNode;
};

type GlobalDateState = {
    startDate: Date;
    endDate: Date;
    prevStartDate: Date;
    prevEndDate: Date;
    interval: Interval;
    startDateError: string | null;
    endDateError: string | null;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
    setDateRange: (startDate: Date, endDate: Date) => void;
    setInterval: (interval: Interval) => void;
};

const date = new Date();

const initialState: GlobalDateState = {
    startDate: new Date(
        date.getFullYear(),
        date.getMonth() - 6,
        date.getDate()
    ),
    endDate: new Date(),
    prevStartDate: new Date(
        date.getFullYear(),
        date.getMonth() - 12,
        date.getDate()
    ),
    prevEndDate: new Date(
        date.getFullYear(),
        date.getMonth() - 6,
        date.getDate()
    ),
    interval: Interval.Month,
    startDateError: null,
    endDateError: null,
    setStartDate: () => null,
    setEndDate: () => null,
    setDateRange: () => null,
    setInterval: () => null,
};

const GlobalDateContext = createContext<GlobalDateState>(initialState);

export function GlobalDateProvider({ children }: GlobalDateProviderProps) {
    const [startDate, setStartDate] = useState(() => {
        const stored = Number(localStorage.getItem('startDate'));
        return stored ? new Date(stored) : initialState.startDate;
    });
    const [endDate, setEndDate] = useState(() => {
        const stored = Number(localStorage.getItem('endDate'));
        return stored ? new Date(stored) : initialState.endDate;
    });
    const [prevStartDate, setPrevStartDate] = useState(() => {
        const stored = Number(localStorage.getItem('prevStartDate'));
        return stored ? new Date(stored) : initialState.prevStartDate;
    });
    const [prevEndDate, setPrevEndDate] = useState(() => {
        const stored = Number(localStorage.getItem('prevEndDate'));
        return stored ? new Date(stored) : initialState.prevEndDate;
    });
    const [interval, setIntervalState] = useState<Interval>(() => {
        const stored = Number(localStorage.getItem('interval'));
        return stored && Object.values(Interval).includes(stored)
            ? stored
            : initialState.interval;
    });
    const [startDateError, setStartDateError] = useState<string | null>(null);
    const [endDateError, setEndDateError] = useState<string | null>(null);

    const value = {
        startDate,
        endDate,
        prevStartDate,
        prevEndDate,
        interval,
        startDateError,
        endDateError,
        setStartDate: (newStartDate: Date) => {
            if (newStartDate > endDate) {
                setStartDateError('Start date cannot be after end date');
                return;
            }
            setStartDateError(null);

            // Calculate previous interval (same duration, shifted back)
            const duration = endDate.getTime() - newStartDate.getTime();
            const newPrevEndDate = newStartDate;
            const newPrevStartDate = new Date(newStartDate.getTime() - duration);

            localStorage.setItem('startDate', newStartDate.getTime().toString());
            localStorage.setItem('prevStartDate', newPrevStartDate.getTime().toString());
            localStorage.setItem('prevEndDate', newPrevEndDate.getTime().toString());

            setStartDate(newStartDate);
            setPrevStartDate(newPrevStartDate);
            setPrevEndDate(newPrevEndDate);
        },
        setEndDate: (newEndDate: Date) => {
            if (newEndDate < startDate) {
                setEndDateError('End date cannot be before start date');
                return;
            }
            setEndDateError(null);

            // Calculate previous interval (same duration, shifted back)
            const duration = newEndDate.getTime() - startDate.getTime();
            const newPrevEndDate = startDate;
            const newPrevStartDate = new Date(startDate.getTime() - duration);

            localStorage.setItem('endDate', newEndDate.getTime().toString());
            localStorage.setItem('prevStartDate', newPrevStartDate.getTime().toString());
            localStorage.setItem('prevEndDate', newPrevEndDate.getTime().toString());

            setEndDate(newEndDate);
            setPrevStartDate(newPrevStartDate);
            setPrevEndDate(newPrevEndDate);
        },
        setDateRange: (newStartDate: Date, newEndDate: Date) => {
            if (newStartDate > newEndDate) {
                setStartDateError('Start date cannot be after end date');
                return;
            }
            setStartDateError(null);
            setEndDateError(null);

            // Calculate previous interval (same duration, shifted back)
            const duration = newEndDate.getTime() - newStartDate.getTime();
            const newPrevEndDate = newStartDate;
            const newPrevStartDate = new Date(newStartDate.getTime() - duration);

            localStorage.setItem('startDate', newStartDate.getTime().toString());
            localStorage.setItem('endDate', newEndDate.getTime().toString());
            localStorage.setItem('prevStartDate', newPrevStartDate.getTime().toString());
            localStorage.setItem('prevEndDate', newPrevEndDate.getTime().toString());

            setStartDate(newStartDate);
            setEndDate(newEndDate);
            setPrevStartDate(newPrevStartDate);
            setPrevEndDate(newPrevEndDate);
        },
        setInterval: (interval: Interval) => {
            localStorage.setItem('interval', interval.toString());
            setIntervalState(interval);
        },
    };

    return (
        <GlobalDateContext.Provider value={value}>
            {children}
        </GlobalDateContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalDate = () => {
    const context = useContext(GlobalDateContext);

    if (context === undefined)
        throw new Error('globalDate must be used withing a GlobalDateProvider');

    return context;
};
