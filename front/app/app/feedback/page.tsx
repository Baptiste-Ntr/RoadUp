"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
  Download,
  ChevronUp,
  Clock,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import { CreateFeedbackDialog } from "@/components/Dialogs/CreateFeedbackDialog";
import { FeedbackDetailSheet } from "@/components/Sheets/FeedbackDetailSheet";
import { useProjects } from "@/hooks/use-projects";
import { toast } from "sonner";
import { demoFeedbacks, type DemoFeedback } from "@/lib/demo-data";

type FeedbackStatus = "open" | "under_review" | "planned" | "completed" | "closed";

const statusConfig: Record<FeedbackStatus, { label: string; className: string }> = {
  open: { label: "OPEN", className: "bg-gray-100 text-gray-700 border-gray-200" },
  under_review: {
    label: "UNDER REVIEW",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  planned: {
    label: "PLANNED",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  completed: {
    label: "COMPLETED",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  closed: {
    label: "CLOSED",
    className: "bg-gray-100 text-gray-500 border-gray-200",
  },
};

const categories = [
  "All",
  "UX Improvements",
  "Integrations",
  "Reporting",
  "Bugs",
  "Developer Tools",
];

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffDays < 1) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffWeeks < 4) return `Il y a ${diffWeeks} sem.`;
  return date.toLocaleDateString("fr-FR");
}

type FeedbackCardProps = {
  feedback: DemoFeedback;
  onVote: () => void;
  onPromote: () => void;
  onOpenDetail: () => void;
};

function FeedbackCard({ feedback, onVote, onPromote, onOpenDetail }: FeedbackCardProps) {
  const status = statusConfig[feedback.status];

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onOpenDetail}>
      <CardContent className="p-0">
        <div className="flex">
          {/* Vote Section */}
          <div className="flex flex-col items-center justify-center px-4 py-6 border-r bg-muted/30 min-w-[80px]">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 mb-1"
              onClick={(e) => {
                e.stopPropagation();
                onVote();
              }}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <span className="text-lg font-bold">{feedback.votes}</span>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{feedback.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {feedback.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={feedback.author.avatar} />
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {feedback.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{feedback.author.name}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTimeAgo(feedback.created_at)}
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="outline" className="text-xs">
                    {feedback.category}
                  </Badge>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col items-end gap-3">
                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>
                {(feedback.status === "under_review" || feedback.status === "open") && (
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPromote();
                    }}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    Promouvoir
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FeedbackPage() {
  const { projects } = useProjects();
  const [feedbacks, setFeedbacks] = useState<DemoFeedback[]>(demoFeedbacks);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("top_voted");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<DemoFeedback | null>(null);

  // Stats
  const pendingReview = feedbacks.filter(
    (f) => f.status === "open" || f.status === "under_review"
  ).length;
  const planned = feedbacks.filter((f) => f.status === "planned").length;
  const totalVotes = feedbacks.reduce((sum, f) => sum + f.votes, 0);

  const filteredFeedback = feedbacks.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVote = (feedbackId: string) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === feedbackId ? { ...f, votes: f.votes + 1 } : f))
    );
    toast.success("Vote enregistré !");
  };

  const handleCreateFeedback = async (data: {
    title: string;
    description?: string;
    category?: string;
  }) => {
    const newFeedback: DemoFeedback = {
      id: `fb-${Date.now()}`,
      title: data.title,
      description: data.description || "",
      status: "open",
      category: data.category || "UX Improvements",
      votes: 0,
      author: { id: "current", name: "Vous" },
      created_at: new Date().toISOString(),
    };
    setFeedbacks((prev) => [newFeedback, ...prev]);
  };

  const handleUpdateFeedback = (id: string, data: Partial<DemoFeedback>) => {
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback({ ...selectedFeedback, ...data });
    }
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  };

  const handlePromoteToRoadmap = async (feedbackId: string, projectId: string) => {
    handleUpdateFeedback(feedbackId, { status: "planned", roadmap_item_id: "promoted" });
    toast.success("Feedback promu vers la roadmap !");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feedback Inbox</h1>
          <p className="text-muted-foreground">
            Gérez et priorisez les demandes utilisateurs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button className="gap-2" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Ajouter manuellement
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  En attente de review
                </p>
                <p className="text-3xl font-bold mt-1">{pendingReview}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Planifiés
                </p>
                <p className="text-3xl font-bold mt-1">{planned}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Total votes
                </p>
                <p className="text-3xl font-bold mt-1">{totalVotes.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ChevronUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les feedbacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top_voted">Top voted</SelectItem>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="oldest">Plus anciens</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              onVote={() => handleVote(feedback.id)}
              onPromote={() => setSelectedFeedback(feedback)}
              onOpenDetail={() => setSelectedFeedback(feedback)}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aucun feedback trouvé</h3>
              <p className="text-sm text-muted-foreground">
                Essayez de modifier vos filtres ou d&apos;ajouter un feedback manuellement.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <CreateFeedbackDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateFeedback={handleCreateFeedback}
      />

      <FeedbackDetailSheet
        open={!!selectedFeedback}
        onOpenChange={(open) => !open && setSelectedFeedback(null)}
        feedback={selectedFeedback}
        projects={projects}
        onUpdateFeedback={handleUpdateFeedback}
        onDeleteFeedback={handleDeleteFeedback}
        onVote={handleVote}
        onPromoteToRoadmap={handlePromoteToRoadmap}
      />
    </div>
  );
}
