import {
    CreditCard,
    DollarSign,
    Home,
    TrendingUp,
} from 'lucide-react';

export const Routes = [
    {
        title: 'Dashboard',
        url: '/',
        icon: Home,
        description: "Welcome back Salem! Here's your financial summary!",
    },
    {
        title: 'Transactions',
        url: '/transactions',
        icon: DollarSign,
        description: 'View and search all of your financial transactions',
    },
    {
        title: 'Analytics',
        url: '/analytics',
        icon: TrendingUp,
        description: 'Analyze your spending patterns and financial trends',
    },
    {
        title: 'Budget',
        url: '/budget',
        icon: CreditCard,
        description: 'Manage and adjust your personal budgets',
    },
];
