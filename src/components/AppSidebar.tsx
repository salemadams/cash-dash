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
import { Routes } from '@/constants/routes';
import { Link, useLocation } from 'react-router-dom';

export function AppSidebar() {
    const location = useLocation();

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
                            {Routes.map((item) => (
                                <SidebarMenuItem
                                    className="pr-2 pl-2"
                                    key={item.title}
                                >
                                    <SidebarMenuButton
                                        isActive={
                                            location.pathname === item.url
                                        }
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
                        <p className="text-sm text-gray-500">
                            salemadams@gmail.com
                        </p>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
