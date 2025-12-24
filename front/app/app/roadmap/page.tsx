"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useProjects } from "@/hooks/use-projects";
import { useRoadmapItems, useRoadmapItem } from "@/hooks/use-roadmap";
import { CreateItemDialog } from "@/components/Dialogs/CreateItemDialog";
import { ItemDetailSheet } from "@/components/Sheets/ItemDetailSheet";
import { toast } from "sonner";
import type { RoadmapItem, ItemStatus } from "@/types";

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
  FEATURE: "bg-green-100 text-green-700 border-green-200",
  FEEDBACK: "bg-purple-100 text-purple-700 border-purple-200",
};

type KanbanCardProps = {
  item: RoadmapItem;
  onOpenDetail: (item: RoadmapItem) => void;
};

function KanbanCard({ item, onOpenDetail }: KanbanCardProps) {
  return (
    <div
      className="group p-4 rounded-lg border bg-card hover:shadow-md transition-all cursor-pointer"
      onClick={() => onOpenDetail(item)}
    >
      {/* Labels */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.labels.map((label) => (
          <Badge
            key={label.name}
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${
              labelColors[label.name] || "bg-gray-100 text-gray-700"
            }`}
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

type KanbanColumnProps = {
  column: { id: ItemStatus; title: string; color: string };
  items: RoadmapItem[];
  onOpenDetail: (item: RoadmapItem) => void;
  onAddItem: (status: ItemStatus) => void;
};

function KanbanColumn({ column, items, onOpenDetail, onAddItem }: KanbanColumnProps) {
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
          <KanbanCard key={item.id} item={item} onOpenDetail={onOpenDetail} />
        ))}

        {/* Add Item Button */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground border-2 border-dashed"
          onClick={() => onAddItem(column.id)}
        >
          <Plus className="h-4 w-4" />
          Ajouter un item
        </Button>
      </div>
    </div>
  );
}

function RoadmapContent() {
  const searchParams = useSearchParams();
  const projectSlug = searchParams.get("project");

  const { projects, isLoading: isLoadingProjects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string | null>(projectSlug);

  // Update selectedProject when projectSlug changes
  useEffect(() => {
    if (projectSlug) {
      setSelectedProject(projectSlug);
    } else if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].slug);
    }
  }, [projectSlug, projects, selectedProject]);

  const currentProject = projects.find((p) => p.slug === selectedProject);
  const {
    items,
    getItemsByStatus,
    isLoading: isLoadingItems,
    createItem,
    updateItem,
    deleteItem,
    toggleVote,
  } = useRoadmapItems(selectedProject);

  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("board");
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<ItemStatus>("planned");
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);

  // Get comments for selected item
  const { comments, addComment, deleteComment } = useRoadmapItem(selectedItem?.id || null);

  const handleAddItem = (status: ItemStatus) => {
    setDefaultStatus(status);
    setShowItemDialog(true);
  };

  const handleOpenDetail = (item: RoadmapItem) => {
    setSelectedItem(item);
  };

  const handleUpdateItem = async (id: string, data: Partial<RoadmapItem>) => {
    await updateItem(id, data);
    // Update local state
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({ ...selectedItem, ...data });
    }
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
    setSelectedItem(null);
  };

  const handleAddComment = async (content: string) => {
    if (selectedItem) {
      await addComment(content);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
  };

  const handleToggleVote = async (itemId: string) => {
    await toggleVote(itemId);
    toast.success("Vote enregistré !");
  };

  const isLoading = isLoadingProjects || isLoadingItems;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Roadmap</h1>
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
        <div className="flex items-center gap-4">
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

          {/* Project Selector */}
          {projects.length > 0 && (
            <Select value={selectedProject || ""} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sélectionner un projet" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.slug}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

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
          <Button
            className="gap-2"
            onClick={() => handleAddItem("planned")}
            disabled={!currentProject}
          >
            <Plus className="h-4 w-4" />
            Nouvel item
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      {view === "board" && (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[300px] space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))
          ) : (
            columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                items={getItemsByStatus(column.id)}
                onOpenDetail={handleOpenDetail}
                onAddItem={handleAddItem}
              />
            ))
          )}
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

      {/* Dialogs & Sheets */}
      {currentProject && (
        <CreateItemDialog
          open={showItemDialog}
          onOpenChange={setShowItemDialog}
          projectId={currentProject.id}
          defaultStatus={defaultStatus}
          onCreateItem={createItem}
        />
      )}

      <ItemDetailSheet
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        item={selectedItem}
        comments={comments}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onToggleVote={handleToggleVote}
      />
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={<div className="space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-64 w-full" /></div>}>
      <RoadmapContent />
    </Suspense>
  );
}
