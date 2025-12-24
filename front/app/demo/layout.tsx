"use client";

import { DemoProvider } from "@/contexts/DemoContext";
import { Sidebar } from "@/components/Common/Sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <SidebarProvider>
        <Sidebar basePath="/demo" />
        <SidebarInset>
          {/* Demo Banner */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/20">
            <div className="flex items-center justify-between px-6 py-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Mode Démonstration</span>
                <Badge variant="secondary" className="text-xs">
                  Données fictives
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Les modifications ne seront pas sauvegardées
                </span>
                <Button size="sm" asChild>
                  <Link href="/auth">Créer un compte</Link>
                </Button>
              </div>
            </div>
          </div>

          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </DemoProvider>
  );
}

