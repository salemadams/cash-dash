import { Card, CardHeader } from '../ui/card';
import TransactionCards from './transaction-cards';

const Dashboard = () => {
    return (
        <div className="flex flex-col h-full p-5 gap-6">
            <TransactionCards />
            <Card className="w-full flex-2">
                <CardHeader>
                    <p className="text-xl font-semibold text-foreground/70 uppercase tracking-wider">
                        Monthly Spending
                    </p>
                </CardHeader>
            </Card>
            <Card className="w-full flex-2">
                <CardHeader>
                    <p className="text-xl font-semibold text-foreground/70 uppercase tracking-wider">
                        Recent Transactions
                    </p>
                </CardHeader>
            </Card>
        </div>
    );
};

export default Dashboard;
