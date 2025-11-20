import { createContext, useContext } from 'react';

export interface FormDialogContextType {
    closeDialog: () => void;
}

export const FormDialogContext = createContext<FormDialogContextType | null>(null);

/**
 * Hook for accessing form dialog context to control dialog state
 */
export const useFormDialog = () => {
    const context = useContext(FormDialogContext);
    if (!context) {
        throw new Error('useFormDialog must be used within FormDialog');
    }
    return context;
};
