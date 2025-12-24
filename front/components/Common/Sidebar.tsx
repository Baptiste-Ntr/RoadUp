import { Sidebar as SidebarShadcn, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarFooter, SidebarMenuButton } from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { ChartNoAxesGantt, LayoutDashboard, MessageSquareDot, Replace } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const sidebarItems = [
    {
        title: "Dashboard",
        url: "/app",
        icon: LayoutDashboard
    },
    {
        title: "FeedBacks",
        url: "/feedbacks",
        icon: MessageSquareDot
    },
    {
        title: "RoadMap",
        url: "/roadmap",
        icon: ChartNoAxesGantt
    },
    {
        title: "ChangeLogs",
        url: "/changelogs",
        icon: Replace
    }
]

export const Sidebar = () => {
    return (
        <SidebarShadcn>
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {sidebarItems.map(item => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <Link href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <Button>
                    Create New
                </Button>
            </SidebarFooter>
        </SidebarShadcn>
    )
}