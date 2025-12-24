"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Plus } from "lucide-react";
import { toast } from "sonner";

type ChangelogType = "major" | "improvement" | "bugfix";

type CreateChangelogDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateChangelog: (data: {
    version: string;
    title: string;
    description?: string;
    type?: ChangelogType;
    highlights?: string[];
    tags?: string[];
    is_draft?: boolean;
  }) => Promise<unknown>;
};

const changelogTypes = [
  { value: "major", label: "Major Release", description: "Nouvelle fonctionnalité majeure" },
  { value: "improvement", label: "Improvement", description: "Amélioration existante" },
  { value: "bugfix", label: "Bug Fix", description: "Correction de bugs" },
];

export function CreateChangelogDialog({
  open,
  onOpenChange,
  onCreateChangelog,
}: CreateChangelogDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    version: "",
    title: "",
    description: "",
    type: "improvement" as ChangelogType,
    highlights: [] as string[],
    tags: [] as string[],
    is_draft: false,
  });
  const [newHighlight, setNewHighlight] = useState("");
  const [newTag, setNewTag] = useState("");

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.version.trim()) {
      toast.error("La version est requise");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    setIsLoading(true);
    try {
      await onCreateChangelog({
        version: formData.version.trim(),
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        highlights: formData.highlights.length > 0 ? formData.highlights : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        is_draft: formData.is_draft,
      });
      toast.success(
        formData.is_draft ? "Brouillon enregistré !" : "Changelog publié avec succès !"
      );
      onOpenChange(false);
      setFormData({
        version: "",
        title: "",
        description: "",
        type: "improvement",
        highlights: [],
        tags: [],
        is_draft: false,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nouvelle version</DialogTitle>
            <DialogDescription>
              Créez une nouvelle entrée de changelog pour informer vos utilisateurs.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="version">Version *</Label>
                <Input
                  id="version"
                  placeholder="Ex: v2.1.0"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as ChangelogType })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {changelogTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                placeholder="Ex: Nouveau Dashboard Analytics"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez les changements de cette version..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isLoading}
                rows={3}
              />
            </div>

            {/* Highlights */}
            <div className="space-y-2">
              <Label>Points clés</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un point clé..."
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHighlight();
                    }
                  }}
                  disabled={isLoading}
                />
                <Button type="button" variant="outline" size="icon" onClick={addHighlight}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.highlights.length > 0 && (
                <ul className="space-y-2 mt-2">
                  {formData.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 text-sm"
                    >
                      <span>{highlight}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeHighlight(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  disabled={isLoading}
                />
                <Button type="button" variant="outline" size="icon" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Draft toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="is_draft">Enregistrer comme brouillon</Label>
                <p className="text-sm text-muted-foreground">
                  Ne pas publier immédiatement
                </p>
              </div>
              <Switch
                id="is_draft"
                checked={formData.is_draft}
                onCheckedChange={(checked) => setFormData({ ...formData, is_draft: checked })}
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {formData.is_draft ? "Enregistrer" : "Publier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

