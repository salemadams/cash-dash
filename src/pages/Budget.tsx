import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';

const BudgetPage = () => {
    const categories = [
        { id: 'food', name: 'Food', budget: 500, spent: 350 },
        { id: 'transport', name: 'Transport', budget: 300, spent: 200 },
        { id: 'entertainment', name: 'Entertainment', budget: 200, spent: 150 },
    ];

    return (
        <div className="flex flex-col h-full gap-7 p-4">
            <Card className="w-full h-1/6">
                <CardHeader>
                    <div className="flex flex-row justify-between">
                        <h2 className="text-xl font-semibold">
                            Overall Budget Health
                        </h2>
                        <h2 className="text-xl font-semibold">Utilized</h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress className="h-5"></Progress>
                </CardContent>
            </Card>
            <div className="p-2">
                <h2 className="text-xl font-bold mb-4">
                    Detailed Category Budgets
                </h2>
                <Accordion
                    type="multiple"
                    className="w-full space-y-2"
                >
                    {categories.map((category) => (
                        <Card>
                            <AccordionItem
                                className="pr-5 pl-5 py-0 border-0"
                                key={category.id}
                                value={category.id}
                            >
                                <AccordionTrigger className="grid grid-cols-[1fr_0.3fr_auto_1fr_auto] gap-6 items-center w-full hover:no-underline py-2">
                                    <h3 className="text-lg font-semibold">
                                        {category.name}
                                    </h3>
                                    <span className="text-gray-500">
                                        Budget: ${category.budget}
                                    </span>
                                    <span className="text-gray-500">
                                        Spent: ${category.spent}
                                    </span>
                                    <Progress
                                        className="h-3 w-4/5 justify-self-end"
                                        value={
                                            (category.spent / category.budget) *
                                            100
                                        }
                                    />
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="p-4">
                                        {/* Add your detailed budget breakdown here */}
                                        <p>Details for {category.name}</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Card>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

export default BudgetPage;
