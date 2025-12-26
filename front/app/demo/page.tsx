"use client";

import { useState } from "react";
import { MessageSquareText, Map, Bell, FileText, Plus } from "lucide-react";
import { StatCard } from "@/components/Dashboard/StatCard";
import { RoadmapSnapshot } from "@/components/Dashboard/RoadmapSnapshot";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { TrendingRequests } from "@/components/Dashboard/TrendingRequests";
import { Button } from "@/components/ui/button";
import { CreateItemDialog } from "@/components/Dialogs/CreateItemDialog";
import { CreateChangelogDialog } from "@/components/Dialogs/CreateChangelogDialog";
import { useAppContext } from "@/contexts/AppContext";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

export default function DemoDashboardPage() {
  const { user, projects, roadmapItems, activities, stats, trendingItems, createItem, createChangelog } =
    useAppContext();

  const [showItemDialog, setShowItemDialog] = useState(false);
  const [showChangelogDialog, setShowChangelogDialog] = useState(false);

  const firstProject = projects[0];
  const inProgressItems = roadmapItems.filter((i) => i.status === "in_progress");
  const plannedItems = roadmapItems.filter((i) => i.status === "planned");

  const handleCreateItem = async (data: Parameters<typeof createItem>[0]) => {
    createItem(data);
  };

  const handleCreateChangelog = async (data: Parameters<typeof createChangelog>[0]) => {
    createChangelog(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {user.name}
          </h1>
          <p className="text-muted-foreground">
            Voici un aperçu de la performance de votre produit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowChangelogDialog(true)}>
            <FileText className="h-4 w-4" />
            Publier Changelog
          </Button>
          <Button className="gap-2" onClick={() => setShowItemDialog(true)}>
            <Plus className="h-4 w-4" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Feedback"
          value={stats.total_feedback.toLocaleString()}
          change={stats.feedback_change}
          icon={MessageSquareText}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Items Roadmap actifs"
          value={stats.active_items.toString()}
          changeLabel={`${stats.items_in_progress} en cours`}
          icon={Map}
          iconClassName="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Abonnés Changelog"
          value={stats.changelog_subscribers.toString()}
          change={stats.subscribers_change}
          icon={Bell}
          iconClassName="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <RoadmapSnapshot
            inProgressItems={inProgressItems}
            plannedItems={plannedItems}
          />
          <RecentActivity activities={activities} />
        </div>

        {/* Right column - 1/3 */}
        <div className="space-y-6">
          {/* Feedback Volume Chart placeholder */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-1">Volume Feedback</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Derniers 30 jours
            </p>
            <div className="h-32 flex items-end justify-between gap-1">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/40"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>1 Déc</span>
              <span>15 Déc</span>
              <span>30 Déc</span>
            </div>
          </div>

          <TrendingRequests items={trendingItems} />

          {/* Pro Tip */}
          <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary mb-3">
              💡
            </div>
            <h3 className="font-semibold text-sm">Astuce Pro</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Partagez votre roadmap publique avec vos clients pour augmenter
              l&apos;engagement et collecter plus de feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {firstProject && (
        <CreateItemDialog
          open={showItemDialog}
          onOpenChange={setShowItemDialog}
          projectId={firstProject.id}
          onCreateItem={handleCreateItem}
        />
      )}

      <CreateChangelogDialog
        open={showChangelogDialog}
        onOpenChange={setShowChangelogDialog}
        onCreateChangelog={handleCreateChangelog}
      />
    </div>
  );
}

