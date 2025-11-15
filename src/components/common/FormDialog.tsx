import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';
import { FormDialogContext } from '@/hooks/useFormDialog';

interface FormDialogProps {
    trigger: ReactNode;
    title: string;
    description?: string;
    children: ReactNode;
}

const FormDialog = ({
    trigger,
    title,
    description,
    children,
}: FormDialogProps) => {
    const [open, setOpen] = useState(false);

    const closeDialog = () => setOpen(false);

    return (
        <FormDialogContext.Provider value={{ closeDialog }}>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        </FormDialogContext.Provider>
    );
};

export default FormDialog;
