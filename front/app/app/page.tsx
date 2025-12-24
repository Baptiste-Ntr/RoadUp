import { MessageSquareText, Map, Bell, FileText, Plus } from "lucide-react";
import { StatCard } from "@/components/Dashboard/StatCard";
import { RoadmapSnapshot } from "@/components/Dashboard/RoadmapSnapshot";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { TrendingRequests } from "@/components/Dashboard/TrendingRequests";
import { Button } from "@/components/ui/button";
import type { RoadmapItem, Activity } from "@/types";

// Données de démonstration (à remplacer par des appels API)
const mockInProgressItems: RoadmapItem[] = [
  {
    id: "1",
    project_id: "p1",
    title: "Authentification SSO",
    description: "Support SAML et OAuth",
    status: "in_progress",
    priority: "p0",
    category: "Core",
    labels: [{ name: "Core", color: "#ef4444" }],
    comments_count: 5,
    votes_count: 45,
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    project_id: "p1",
    title: "Mode sombre",
    description: "Thème dark pour l'application",
    status: "in_progress",
    priority: "p1",
    category: "UI/UX",
    labels: [{ name: "UI/UX", color: "#f97316" }],
    comments_count: 12,
    votes_count: 128,
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockPlannedItems: RoadmapItem[] = [
  {
    id: "3",
    project_id: "p1",
    title: "API Publique V2",
    description: "Nouvelle version de l'API",
    status: "planned",
    priority: "p1",
    category: "API",
    labels: [{ name: "API", color: "#3b82f6" }],
    comments_count: 8,
    votes_count: 67,
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    project_id: "p1",
    title: "Intégration Slack",
    description: "Notifications dans Slack",
    status: "planned",
    priority: "p2",
    category: "Integration",
    labels: [{ name: "Integration", color: "#8b5cf6" }],
    comments_count: 3,
    votes_count: 89,
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockActivities: Activity[] = [
  {
    id: "a1",
    type: "vote",
    user_name: "Sarah J.",
    item_title: "Mode sombre",
    item_id: "2",
    created_at: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: "a2",
    type: "comment",
    user_name: "Mike T.",
    item_title: "Authentification SSO",
    item_id: "1",
    content: "Est-ce que Okta sera supporté initialement ?",
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "a3",
    type: "changelog",
    user_name: "Alex (Vous)",
    item_title: "v2.4.0 Release Notes",
    item_id: "c1",
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];

const mockTrendingItems = [
  { id: "t1", title: "Mode sombre", category: "UI Customization", votes: 45 },
  { id: "t2", title: "API Publique V2", category: "Developer Tools", votes: 32 },
  { id: "t3", title: "Export CSV", category: "Reporting", votes: 28 },
  { id: "t4", title: "Intégration Slack", category: "Integrations", votes: 24 },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, Alex
          </h1>
          <p className="text-muted-foreground">
            Voici un aperçu de la performance de votre produit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Publier Changelog
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Feedback"
          value="1,240"
          change={12}
          icon={MessageSquareText}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Items Roadmap actifs"
          value="8"
          changeLabel="En cours"
          icon={Map}
          iconClassName="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Abonnés Changelog"
          value="450"
          change={5}
          icon={Bell}
          iconClassName="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <RoadmapSnapshot
            inProgressItems={mockInProgressItems}
            plannedItems={mockPlannedItems}
          />
          <RecentActivity activities={mockActivities} />
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
              {/* Simple bar chart placeholder */}
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

          <TrendingRequests items={mockTrendingItems} />

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
    </div>
  );
}
