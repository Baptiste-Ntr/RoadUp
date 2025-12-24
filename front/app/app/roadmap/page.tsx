"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Share2,
  Filter,
  ChevronUp,
  MoreHorizontal,
  LayoutGrid,
  List,
  CalendarDays,
} from "lucide-react";
import type { RoadmapItem, ItemStatus } from "@/types";

// Mock data
const mockItems: RoadmapItem[] = [
  {
    id: "1",
    project_id: "p1",
    title: "Mode sombre",
    description: "Implémenter la détection de préférence système et le toggle",
    status: "in_progress",
    priority: "p0",
    category: "UX",
    labels: [
      { name: "HIGH PRIORITY", color: "#ef4444" },
      { name: "UX", color: "#f97316" },
    ],
    comments_count: 12,
    votes_count: 128,
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    project_id: "p1",
    title: "API v2 Endpoints",
    description: "Restructurer les endpoints pour de meilleures performances",
    status: "in_progress",
    priority: "p1",
    category: "DEV",
    labels: [{ name: "DEV", color: "#3b82f6" }],
    comments_count: 5,
    votes_count: 45,
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    project_id: "p1",
    title: "Intégration Slack",
    description: "Recevoir les notifications dans les channels Slack",
    status: "planned",
    priority: "p1",
    category: "INTEGRATION",
    labels: [{ name: "INTEGRATION", color: "#8b5cf6" }],
    comments_count: 8,
    votes_count: 89,
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    project_id: "p1",
    title: "Rôles & Permissions",
    description: "Contrôle granulaire des accès par membre",
    status: "planned",
    priority: "p0",
    category: "SECURITY",
    labels: [{ name: "SECURITY", color: "#ef4444" }],
    comments_count: 15,
    votes_count: 210,
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    project_id: "p1",
    title: "Application iOS",
    description: "Application native pour la gestion mobile",
    status: "completed",
    priority: "p2",
    category: "MOBILE",
    labels: [{ name: "MOBILE", color: "#10b981" }],
    comments_count: 20,
    votes_count: 342,
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    project_id: "p1",
    title: "Dashboard Analytics",
    description: "Graphiques visuels pour l'usage des features",
    status: "completed",
    priority: "p2",
    category: "ANALYTICS",
    labels: [{ name: "ANALYTICS", color: "#06b6d4" }],
    comments_count: 7,
    votes_count: 56,
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const columns: { id: ItemStatus; title: string; color: string }[] = [
  { id: "in_progress", title: "Now", color: "bg-emerald-500" },
  { id: "planned", title: "Next", color: "bg-blue-500" },
  { id: "completed", title: "Later", color: "bg-gray-400" },
];

const labelColors: Record<string, string> = {
  "HIGH PRIORITY": "bg-red-100 text-red-700 border-red-200",
  UX: "bg-orange-100 text-orange-700 border-orange-200",
  DEV: "bg-blue-100 text-blue-700 border-blue-200",
  INTEGRATION: "bg-purple-100 text-purple-700 border-purple-200",
  SECURITY: "bg-red-100 text-red-700 border-red-200",
  MOBILE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ANALYTICS: "bg-cyan-100 text-cyan-700 border-cyan-200",
};

function KanbanCard({ item }: { item: RoadmapItem }) {
  return (
    <div className="group p-4 rounded-lg border bg-card hover:shadow-md transition-all cursor-pointer">
      {/* Labels */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.labels.map((label) => (
          <Badge
            key={label.name}
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${labelColors[label.name] || "bg-gray-100 text-gray-700"}`}
          >
            {label.name}
          </Badge>
        ))}
      </div>

      {/* Title & Description */}
      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {item.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1 text-muted-foreground">
          <ChevronUp className="h-4 w-4" />
          <span className="text-sm font-medium">{item.votes_count}</span>
        </div>
        <div className="flex -space-x-2">
          <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarImage src="" />
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({
  column,
  items,
}: {
  column: { id: ItemStatus; title: string; color: string };
  items: RoadmapItem[];
}) {
  return (
    <div className="flex-1 min-w-[300px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${column.color}`} />
          <h3 className="font-semibold">{column.title}</h3>
          <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted text-xs font-medium">
            {items.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {items.map((item) => (
          <KanbanCard key={item.id} item={item} />
        ))}

        {/* Add Item Button */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground border-2 border-dashed"
        >
          <Plus className="h-4 w-4" />
          Ajouter un item
        </Button>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("board");

  const getItemsByStatus = (status: ItemStatus) =>
    mockItems.filter((item) => item.status === status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Product Roadmap
          </h1>
          <p className="text-muted-foreground">
            Visualisez et gérez la progression des features.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Partager la vue publique
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="board" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Board
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Timeline
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px]"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvel item
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      {view === "board" && (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              items={getItemsByStatus(column.id)}
            />
          ))}
        </div>
      )}

      {/* List View Placeholder */}
      {view === "list" && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <List className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Vue Liste</h3>
          <p className="text-sm text-muted-foreground">
            La vue liste sera disponible prochainement.
          </p>
        </div>
      )}

      {/* Timeline View Placeholder */}
      {view === "timeline" && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Vue Timeline</h3>
          <p className="text-sm text-muted-foreground">
            La vue timeline sera disponible prochainement.
          </p>
        </div>
      )}
    </div>
  );
}

