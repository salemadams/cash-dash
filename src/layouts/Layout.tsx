import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/layouts/components/AppSidebar';
import { Outlet } from 'react-router-dom';
import AppHeader from '@/layouts/components/AppHeader';
import { GlobalDateProvider } from '@/contexts/GlobalDate';

export default function Layout() {
    return (
        <SidebarProvider className="h-full">
            <AppSidebar />
            <GlobalDateProvider>
                <main className="w-full h-full flex flex-col overflow-hidden">
                    <AppHeader />
                    <div className="flex-1 overflow-auto">
                        <Outlet />
                    </div>
                </main>
            </GlobalDateProvider>
        </SidebarProvider>
    );
}
