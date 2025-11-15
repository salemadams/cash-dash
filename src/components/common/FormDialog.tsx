import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';

interface FormDialogProps {
    trigger: ReactNode;
    title: string;
    description?: string;
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const FormDialog = ({
    trigger,
    title,
    description,
    children,
    open,
    onOpenChange,
}: FormDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
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
    );
};

export default FormDialog;
