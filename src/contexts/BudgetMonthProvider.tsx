import { createContext, useContext, useState, ReactNode } from 'react';

interface BudgetMonthContextType {
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
}

const BudgetMonthContext = createContext<BudgetMonthContextType | null>(null);

export const BudgetMonthProvider = ({ children }: { children: ReactNode }) => {
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );

    return (
        <BudgetMonthContext.Provider
            value={{ selectedMonth, setSelectedMonth }}
        >
            {children}
        </BudgetMonthContext.Provider>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useBudgetMonth = () => {
    const context = useContext(BudgetMonthContext);
    if (!context) {
        throw new Error(
            'useBudgetMonth must be used within BudgetMonthProvider'
        );
    }
    return context;
};
