import { Sidebar } from "@/components/Common/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <main>
                <Sidebar />
                {children}
            </main>
        </SidebarProvider>
    )
}