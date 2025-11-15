import { createContext, useContext } from 'react';

export interface FormDialogContextType {
    closeDialog: () => void;
}

export const FormDialogContext = createContext<FormDialogContextType | null>(null);

export const useFormDialog = () => {
    const context = useContext(FormDialogContext);
    if (!context) {
        throw new Error('useFormDialog must be used within FormDialog');
    }
    return context;
};
