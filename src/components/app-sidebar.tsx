import {
    Home,
    Settings,
    DollarSign,
    TrendingUp,
    CreditCard,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';

const items = [
    {
        title: 'Dashboard',
        url: '/',
        icon: Home,
    },
    {
        title: 'Transactions',
        url: '/transactions',
        icon: DollarSign,
    },
    {
        title: 'Analytics',
        url: '/analytics',
        icon: TrendingUp,
    },
    {
        title: 'Cards',
        url: '/cards',
        icon: CreditCard,
    },
    {
        title: 'Settings',
        url: '/settings',
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold">CD</span>
                </div>
                <span className="text-xl font-bold">Cash Dash</span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem
                                    className="pr-2 pl-2"
                                    key={item.title}
                                >
                                    <SidebarMenuButton
                                        className="pl-8 text-md"
                                        size="lg"
                                        asChild
                                    >
                                        <Link
                                            to={item.url}
                                            className="space-x-2"
                                        >
                                            <item.icon />
                                            <span className="text-md">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex flex-row gap-3 items-center">
                    <img
                        src="src\assets\monkey_pfp.png"
                        alt="monkey"
                        className="h-12 w-12"
                    ></img>
                    <div className="flex flex-col">
                        <h2 className="font-semibold">Salem Adams</h2>
                        <p className="text-sm text-gray-400">
                            salemadams@gmail.com
                        </p>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
