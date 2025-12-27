"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { Sidebar } from "@/components/Common/Sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { ProjectSelector } from "@/components/Header/ProjectSelector";

// Composant interne qui utilise le contexte
function AppHeader() {
  const { projects } = useAppContext();
  
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* <SidebarTrigger className="-ml-2" /> */}
      <ProjectSelector projects={projects} />
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();

        if (data.user) {
          setIsAuthenticated(true);
        } else {
          router.push("/auth");
        }
      } catch {
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="h-8 w-8 mx-auto" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppProvider isDemo={false}>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset>
          <AppHeader />
          <main className="w-[calc(100vw-256px)] h-[calc(100vh-56px)] p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  );
}
