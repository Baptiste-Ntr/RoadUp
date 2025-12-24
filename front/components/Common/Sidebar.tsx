"use client";

import {
  Sidebar as SidebarShadcn,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import {
  LayoutDashboard,
  MessageSquareText,
  Map,
  FileText,
  Settings,
  Plus,
  FolderKanban,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/app",
    icon: LayoutDashboard,
  },
  {
    title: "Projets",
    url: "/app/projects",
    icon: FolderKanban,
  },
];

const projectNavItems = [
  {
    title: "Roadmap",
    url: "/app/roadmap",
    icon: Map,
  },
  {
    title: "Feedback",
    url: "/app/feedback",
    icon: MessageSquareText,
  },
  {
    title: "Changelog",
    url: "/app/changelog",
    icon: FileText,
  },
];

const bottomNavItems = [
  {
    title: "Paramètres",
    url: "/app/settings",
    icon: Settings,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <SidebarShadcn className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Navigation principale */}
        <SidebarGroup>
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "transition-colors",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Navigation projet */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider px-2">
            Projet actif
          </SidebarGroupLabel>
          <SidebarMenu>
            {projectNavItems.map((item) => {
              const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "transition-colors",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Paramètres */}
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "transition-colors",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        {/* Plan usage */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium">Plan Free</span>
            <span className="text-primary">1/1 projet</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-full bg-primary rounded-full" />
          </div>
        </div>

        {/* Create button */}
        <Button className="w-full gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Créer
        </Button>

        {/* User profile */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">Admin</p>
          </div>
        </div>
      </SidebarFooter>
    </SidebarShadcn>
  );
};
