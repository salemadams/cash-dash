import { createContext, ReactNode, useContext, useState } from 'react';

type GlobalDateProviderProps = {
    children: ReactNode;
};

type GlobalDateState = {
    startDate: Date;
    endDate: Date;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
};

const date = new Date();

const initialState: GlobalDateState = {
    startDate: new Date(
        date.getFullYear(),
        date.getMonth() - 6,
        date.getDate()
    ),
    endDate: new Date(),
    setStartDate: () => null,
    setEndDate: () => null,
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

    const value = {
        startDate,
        endDate,
        setStartDate: (date: Date) => {
            localStorage.setItem('startDate', date.getTime().toString());
            setStartDate(date);
        },
        setEndDate: (date: Date) => {
            localStorage.setItem('endDate', date.getTime().toString());
            setEndDate(date);
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
