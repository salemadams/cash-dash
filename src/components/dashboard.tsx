import { Card, CardHeader } from './ui/card';

const Dashboard = () => {
    return (
        <div className="flex flex-col h-full p-5 gap-6">
            <div className="flex flex-row gap-6 justify-between flex-[1]">
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
            <Card className="w-full flex-[2]"></Card>
            <Card className="w-full flex-[2]"></Card>
        </div>
    );
};

export default Dashboard;
