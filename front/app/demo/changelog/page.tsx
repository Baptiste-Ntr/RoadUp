"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Search,
  Eye,
  Rocket,
  Zap,
  Bug,
  Check,
  Trash2,
  Pencil,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { CreateChangelogDialog } from "@/components/Dialogs/CreateChangelogDialog";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";
import { toast } from "sonner";
import type { DemoChangelog } from "@/lib/demo-data";

type ChangelogType = "major" | "improvement" | "bugfix";

const typeConfig: Record<
  ChangelogType,
  { label: string; icon: React.ElementType; className: string }
> = {
  major: {
    label: "MAJOR RELEASE",
    icon: Rocket,
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  improvement: {
    label: "IMPROVEMENT",
    icon: Zap,
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  bugfix: {
    label: "BUG FIXES",
    icon: Bug,
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type ChangelogCardProps = {
  changelog: DemoChangelog;
  onEdit: () => void;
  onDelete: () => void;
};

function ChangelogCard({ changelog, onEdit, onDelete }: ChangelogCardProps) {
  const config = typeConfig[changelog.type];
  const Icon = config.icon;

  return (
    <div className="relative pl-8 pb-12 last:pb-0 group">
      {/* Timeline dot */}
      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary border-4 border-background" />
      {/* Timeline line */}
      <div className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-border" />

      <Card className="relative">
        {/* Actions */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono">
                {changelog.version}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(changelog.published_at)}
              </span>
              {changelog.is_draft && (
                <Badge variant="secondary" className="text-xs">
                  Brouillon
                </Badge>
              )}
            </div>
            <Badge variant="outline" className={config.className}>
              <Icon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold mb-3">{changelog.title}</h3>
          <p className="text-muted-foreground mb-4">{changelog.description}</p>

          {/* Highlights */}
          {changelog.highlights.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Points clés
              </h4>
              <ul className="space-y-2">
                {changelog.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {changelog.tags.length > 0 && (
            <div className="flex gap-2 mt-4">
              {changelog.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DemoChangelogPage() {
  const { changelogs, createChangelog, deleteChangelog } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [changelogToDelete, setChangelogToDelete] = useState<DemoChangelog | null>(null);

  const filters = [
    { id: "all", label: "Toutes les mises à jour", count: changelogs.length },
    {
      id: "major",
      label: "Nouvelles fonctionnalités",
      count: changelogs.filter((c) => c.type === "major").length,
    },
    {
      id: "improvement",
      label: "Améliorations",
      count: changelogs.filter((c) => c.type === "improvement").length,
    },
    {
      id: "bugfix",
      label: "Corrections",
      count: changelogs.filter((c) => c.type === "bugfix").length,
    },
  ];

  const filteredChangelogs = changelogs.filter((changelog) => {
    const matchesSearch =
      changelog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      changelog.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || changelog.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateChangelog = async (data: Parameters<typeof createChangelog>[0]) => {
    createChangelog(data);
  };

  const handleDeleteChangelog = async () => {
    if (!changelogToDelete) return;
    deleteChangelog(changelogToDelete.id);
    toast.success("Changelog supprimé !");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Changelog</h1>
          <p className="text-muted-foreground">
            Explorez les dernières mises à jour, améliorations et corrections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Voir la page publique
          </Button>
          <Button className="gap-2" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Nouvelle version
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Catégories
            </h4>
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeFilter === filter.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{filter.label}</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : ""
                  }`}
                >
                  {filter.count}
                </Badge>
              </button>
            ))}
          </div>
        </aside>

        {/* Timeline */}
        <div className="flex-1 max-w-2xl">
          {filteredChangelogs.length > 0 ? (
            <div className="relative">
              {filteredChangelogs.map((changelog) => (
                <ChangelogCard
                  key={changelog.id}
                  changelog={changelog}
                  onEdit={() => toast.info("Édition en cours de développement")}
                  onDelete={() => setChangelogToDelete(changelog)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Rocket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Aucun changelog trouvé</h3>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier vos filtres ou créez une nouvelle version.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateChangelogDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateChangelog={handleCreateChangelog}
      />

      <ConfirmDialog
        open={!!changelogToDelete}
        onOpenChange={(open) => !open && setChangelogToDelete(null)}
        title="Supprimer le changelog"
        description={`Êtes-vous sûr de vouloir supprimer "${changelogToDelete?.title}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={handleDeleteChangelog}
      />
    </div>
  );
}

