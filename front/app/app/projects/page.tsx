"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  MoreHorizontal,
  Settings,
  Trash2,
  ExternalLink,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { useProjects } from "@/hooks/use-projects";
import { CreateProjectDialog } from "@/components/Dialogs/CreateProjectDialog";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";
import { toast } from "sonner";
import type { Project } from "@/types";

const statusColors: Record<string, string> = {
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  planning: "bg-gray-100 text-gray-700 border-gray-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  at_risk: "bg-red-100 text-red-700 border-red-200",
  archived: "bg-gray-100 text-gray-500 border-gray-200",
};

const statusLabels: Record<string, string> = {
  in_progress: "En cours",
  planning: "Planification",
  completed: "Terminé",
  at_risk: "À risque",
  archived: "Archivé",
};

function getProjectStatus(project: Project): string {
  if (project.items_count === 0) return "planning";
  if (project.items_count > 20) return "in_progress";
  if (project.items_count > 10) return "completed";
  return "at_risk";
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffHours < 1) return "À l'instant";
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  if (diffWeeks < 4) return `Il y a ${diffWeeks} sem.`;
  return date.toLocaleDateString("fr-FR");
}

export default function ProjectsPage() {
  const { projects, isLoading, createProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("anyone");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleDeleteProject = async () => {
    if (!deleteProject) return;
    try {
      const res = await fetch(`/api/projects/${deleteProject.slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      toast.success("Projet supprimé !");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projets</h1>
          <p className="text-muted-foreground">
            Gérez vos roadmaps et changelogs.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des projets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="planning">Planification</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Propriétaire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="anyone">Tous</SelectItem>
            <SelectItem value="me">Mes projets</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Projects Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Nom du projet
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Items
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Membres
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Dernière MàJ
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td className="py-4 px-4" colSpan={6}>
                    <Skeleton className="h-12 w-full" />
                  </td>
                </tr>
              ))
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">
                  Aucun projet trouvé. Créez-en un pour commencer !
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => {
                const status = getProjectStatus(project);
                return (
                  <tr
                    key={project.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <Link
                        href={`/app/roadmap?project=${project.slug}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold">
                          {project.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {project.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {project.description || "Aucune description"}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={statusColors[status]}>
                        {statusLabels[status]}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm">{project.items_count} items</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex -space-x-2">
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            ME
                          </AvatarFallback>
                        </Avatar>
                        {project.collaborators_count > 1 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                            +{project.collaborators_count - 1}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {formatTimeAgo(project.updated_at)}
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/app/roadmap?project=${project.slug}`}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ouvrir
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Paramètres
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteProject(project)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Affichage{" "}
            <span className="font-medium">1-{filteredProjects.length}</span> sur{" "}
            <span className="font-medium text-primary">
              {filteredProjects.length} projets
            </span>
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled>
              Suivant
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateProject={createProject}
      />

      <ConfirmDialog
        open={!!deleteProject}
        onOpenChange={(open) => !open && setDeleteProject(null)}
        title="Supprimer le projet"
        description={`Êtes-vous sûr de vouloir supprimer "${deleteProject?.name}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={handleDeleteProject}
      />
    </div>
  );
}
