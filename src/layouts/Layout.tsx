import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <SidebarProvider className="h-full">
            <AppSidebar />
            <main className="w-full h-full flex flex-col overflow-hidden">
                <SidebarTrigger />
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    );
}
