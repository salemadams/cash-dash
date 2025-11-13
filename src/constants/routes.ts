import {
    CreditCard,
    DollarSign,
    Home,
    Settings,
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
        title: 'Cards',
        url: '/cards',
        icon: CreditCard,
        description: 'Manage your credit and debit cards',
    },
    {
        title: 'Settings',
        url: '/settings',
        icon: Settings,
        description: 'Customize your preferences and account settings',
    },
];
