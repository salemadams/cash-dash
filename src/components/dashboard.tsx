import { Card, CardHeader } from './ui/card';

const Dashboard = () => {
    return (
        <div className="flex flex-col h-full m-5 gap-6">
            <div className="flex flex-row gap-6 justify-between h-1/5">
                <Card className="w-full h-full">
                    <CardHeader>
                        <p className="font-bold text-2xl">Income</p>
                    </CardHeader>
                </Card>
                <Card className="w-full h-full">
                    <CardHeader>
                        <p className="font-bold text-2xl">Expenses</p>
                    </CardHeader>
                </Card>
                <Card className="w-full h-full">
                    <CardHeader>
                        <p className="font-bold text-2xl">Savings</p>
                    </CardHeader>
                </Card>
            </div>
            <Card className="w-full h-2/5"></Card>
            <Card className="w-full h-2/5"></Card>
        </div>
    );
};

export default Dashboard;
