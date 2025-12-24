"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronUp,
  Calendar,
  ArrowUpRight,
  Trash2,
  Loader2,
  Mail,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import type { DemoFeedback } from "@/lib/demo-data";
import type { Project } from "@/types";

type FeedbackStatus = "open" | "under_review" | "planned" | "completed" | "closed";

type FeedbackDetailSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: DemoFeedback | null;
  projects: Project[];
  onUpdateFeedback: (id: string, data: Partial<DemoFeedback>) => void;
  onDeleteFeedback: (id: string) => void;
  onVote: (id: string) => void;
  onPromoteToRoadmap: (feedbackId: string, projectId: string) => Promise<void>;
};

const statusConfig: Record<FeedbackStatus, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-gray-100 text-gray-700 border-gray-200" },
  under_review: { label: "Under Review", className: "bg-amber-100 text-amber-700 border-amber-200" },
  planned: { label: "Planned", className: "bg-blue-100 text-blue-700 border-blue-200" },
  completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function FeedbackDetailSheet({
  open,
  onOpenChange,
  feedback,
  projects,
  onUpdateFeedback,
  onDeleteFeedback,
  onVote,
  onPromoteToRoadmap,
}: FeedbackDetailSheetProps) {
  const [isPromoting, setIsPromoting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [showPromoteOptions, setShowPromoteOptions] = useState(false);

  if (!feedback) return null;

  const status = statusConfig[feedback.status];

  const handleStatusChange = (newStatus: FeedbackStatus) => {
    onUpdateFeedback(feedback.id, { status: newStatus });
    toast.success("Status mis à jour !");
  };

  const handleDelete = () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce feedback ?")) return;
    onDeleteFeedback(feedback.id);
    onOpenChange(false);
    toast.success("Feedback supprimé !");
  };

  const handlePromote = async () => {
    if (!selectedProjectId) {
      toast.error("Veuillez sélectionner un projet");
      return;
    }

    setIsPromoting(true);
    try {
      await onPromoteToRoadmap(feedback.id, selectedProjectId);
      toast.success("Feedback promu vers la roadmap !");
      setShowPromoteOptions(false);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la promotion");
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[550px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <SheetTitle className="text-xl">{feedback.title}</SheetTitle>
          <SheetDescription className="sr-only">
            Détails du feedback
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={feedback.author.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {feedback.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{feedback.author.name}</p>
              {feedback.author.email && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {feedback.author.email}
                </p>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                Catégorie
              </label>
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {feedback.category}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                Date
              </label>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(feedback.created_at)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                Votes
              </label>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => onVote(feedback.id)}
              >
                <ChevronUp className="h-4 w-4" />
                {feedback.votes}
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                Status
              </label>
              <Select value={feedback.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">
              Description
            </label>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {feedback.description}
            </p>
          </div>

          <Separator />

          {/* Actions */}
          {(feedback.status === "open" || feedback.status === "under_review") && (
            <div className="space-y-4">
              <label className="text-xs font-medium text-muted-foreground uppercase">
                Actions
              </label>

              {!showPromoteOptions ? (
                <Button
                  className="w-full gap-2"
                  onClick={() => setShowPromoteOptions(true)}
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Promouvoir vers la roadmap
                </Button>
              ) : (
                <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
                  <p className="text-sm font-medium">Sélectionnez un projet</p>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un projet..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowPromoteOptions(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handlePromote}
                      disabled={!selectedProjectId || isPromoting}
                    >
                      {isPromoting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Promouvoir
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {feedback.roadmap_item_id && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">
                ✓ Ce feedback a été promu vers la roadmap
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

