import { createContext, ReactNode, useContext, useState } from 'react';
import { Interval } from '@/constants/interval';

type GlobalDateProviderProps = {
    children: ReactNode;
};

type GlobalDateState = {
    startDate: Date;
    endDate: Date;
    interval: Interval;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
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
    interval: Interval.Month,
    setStartDate: () => null,
    setEndDate: () => null,
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
    const [interval, setIntervalState] = useState<Interval>(() => {
        const stored = Number(localStorage.getItem('interval'));
        return stored && Object.values(Interval).includes(stored)
            ? stored
            : initialState.interval;
    });

    const value = {
        startDate,
        endDate,
        interval,
        setStartDate: (date: Date) => {
            localStorage.setItem('startDate', date.getTime().toString());
            setStartDate(date);
        },
        setEndDate: (date: Date) => {
            localStorage.setItem('endDate', date.getTime().toString());
            setEndDate(date);
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
