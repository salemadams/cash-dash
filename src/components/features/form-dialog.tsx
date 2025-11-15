import { FaPlus } from 'react-icons/fa';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import BudgetForm from '../budget/BudgetForm';

type FormDialogProps = {};

const FormDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <FaPlus />
                    Add Budget
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>
                        Create a budget to track spending across categories and
                        set monthly limits.
                    </DialogDescription>
                </DialogHeader>
                <BudgetForm />
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;
