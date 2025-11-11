import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Outlet } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';

export default function Layout() {
    return (
        <SidebarProvider className="h-full">
            <AppSidebar />
            <main className="w-full h-full flex flex-col overflow-hidden">
                <AppHeader />
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    );
}
