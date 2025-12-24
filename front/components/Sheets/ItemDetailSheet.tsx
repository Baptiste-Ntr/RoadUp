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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  MessageSquare,
  Pencil,
  Trash2,
  Send,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import type { RoadmapItem, Comment, ItemStatus, ItemPriority } from "@/types";

type ItemDetailSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: RoadmapItem | null;
  comments: Comment[];
  onUpdateItem: (id: string, data: Partial<RoadmapItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onAddComment: (content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onToggleVote: (itemId: string) => Promise<void>;
};

const priorities = [
  { value: "p0", label: "P0 - Critique", color: "#ef4444" },
  { value: "p1", label: "P1 - Haute", color: "#f97316" },
  { value: "p2", label: "P2 - Moyenne", color: "#eab308" },
  { value: "p3", label: "P3 - Basse", color: "#22c55e" },
];

const statuses = [
  { value: "planned", label: "Planifié", color: "#6b7280" },
  { value: "in_progress", label: "En cours", color: "#3b82f6" },
  { value: "completed", label: "Terminé", color: "#22c55e" },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return formatDate(dateString);
}

export function ItemDetailSheet({
  open,
  onOpenChange,
  item,
  comments,
  onUpdateItem,
  onDeleteItem,
  onAddComment,
  onDeleteComment,
  onToggleVote,
}: ItemDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<RoadmapItem>>({});
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);

  if (!item) return null;

  const handleEdit = () => {
    setEditData({
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      target_date: item.target_date,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdateItem(item.id, editData);
      toast.success("Item mis à jour !");
      setIsEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet item ?")) return;

    setIsLoading(true);
    try {
      await onDeleteItem(item.id);
      toast.success("Item supprimé !");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    setIsSendingComment(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment("");
      toast.success("Commentaire ajouté !");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'ajout");
    } finally {
      setIsSendingComment(false);
    }
  };

  const handleVote = async () => {
    try {
      await onToggleVote(item.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du vote");
    }
  };

  const currentStatus = statuses.find((s) => s.value === (isEditing ? editData.status : item.status));
  const currentPriority = priorities.find((p) => p.value === (isEditing ? editData.priority : item.priority));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {item.labels.map((label) => (
                <Badge
                  key={label.name}
                  variant="outline"
                  className="text-xs"
                  style={{ borderColor: label.color, color: label.color }}
                >
                  {label.name}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button variant="ghost" size="icon" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <Input
              value={editData.title || ""}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="text-lg font-semibold"
            />
          ) : (
            <SheetTitle className="text-xl">{item.title}</SheetTitle>
          )}

          <SheetDescription className="sr-only">
            Détails de l&apos;item de roadmap
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Meta info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">Status</label>
              {isEditing ? (
                <Select
                  value={editData.status}
                  onValueChange={(value) => setEditData({ ...editData, status: value as ItemStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: currentStatus?.color }}
                  />
                  <span className="text-sm">{currentStatus?.label}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">Priorité</label>
              {isEditing ? (
                <Select
                  value={editData.priority}
                  onValueChange={(value) => setEditData({ ...editData, priority: value as ItemPriority })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: currentPriority?.color }}
                  />
                  <span className="text-sm">{currentPriority?.label}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">Date cible</label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editData.target_date || ""}
                  onChange={(e) => setEditData({ ...editData, target_date: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {item.target_date ? formatDate(item.target_date) : "Non définie"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase">Votes</label>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleVote}>
                <ChevronUp className="h-4 w-4" />
                {item.votes_count}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase">Description</label>
            {isEditing ? (
              <Textarea
                value={editData.description || ""}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={4}
              />
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {item.description || "Aucune description"}
              </p>
            )}
          </div>

          <Separator />

          {/* Comments */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Commentaires ({comments.length})
              </span>
            </div>

            {/* Comment input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
                disabled={isSendingComment}
              />
              <Button
                size="icon"
                onClick={handleSendComment}
                disabled={!newComment.trim() || isSendingComment}
              >
                {isSendingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Comments list */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 group">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.profile?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {comment.profile?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.profile?.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun commentaire pour le moment
                </p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

