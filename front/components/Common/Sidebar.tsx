"use client";

import { useState } from "react";
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
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { CreateProjectDialog } from "@/components/Dialogs/CreateProjectDialog";
import { toast } from "sonner";

type SidebarProps = {
  basePath?: "/app" | "/demo";
};

export const Sidebar = ({ basePath = "/app" }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const isDemoMode = basePath === "/demo";

  const mainNavItems = [
    {
      title: "Dashboard",
      url: basePath,
      icon: LayoutDashboard,
    },
    {
      title: "Projets",
      url: `${basePath}/projects`,
      icon: FolderKanban,
    },
  ];

  const projectNavItems = [
    {
      title: "Roadmap",
      url: `${basePath}/roadmap`,
      icon: Map,
    },
    {
      title: "Feedback",
      url: `${basePath}/feedback`,
      icon: MessageSquareText,
    },
    {
      title: "Changelog",
      url: `${basePath}/changelog`,
      icon: FileText,
    },
  ];

  const bottomNavItems = [
    {
      title: "Paramètres",
      url: `${basePath}/settings`,
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    if (isDemoMode) {
      router.push("/");
      return;
    }

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth");
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const handleCreateProject = async (data: {
    name: string;
    description?: string;
    is_public?: boolean;
  }) => {
    if (isDemoMode) {
      toast.success("Projet créé (mode démo) !");
      return { id: "demo", ...data };
    }

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur lors de la création");
    }

    return result.data;
  };

  return (
    <>
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
                        isActive &&
                          "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
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
                const isActive =
                  pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "transition-colors",
                        isActive &&
                          "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
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
                        isActive &&
                          "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
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
              <span className="font-medium">
                {isDemoMode ? "Plan Pro (Démo)" : "Plan Free"}
              </span>
              <span className="text-primary">
                {isDemoMode ? "3/10 projets" : "1/1 projet"}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: isDemoMode ? "30%" : "100%" }}
              />
            </div>
          </div>

          {/* Create button */}
          <Button
            className="w-full gap-2"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Créer
          </Button>

          {/* User profile */}
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {isDemoMode ? "AD" : "JD"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {isDemoMode ? "Alex Demo" : "John Doe"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isDemoMode ? "Mode Démo" : "Admin"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={handleLogout}
              title={isDemoMode ? "Quitter la démo" : "Déconnexion"}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </SidebarShadcn>

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateProject={handleCreateProject}
      />
    </>
  );
};
