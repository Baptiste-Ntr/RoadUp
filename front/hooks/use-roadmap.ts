"use client";

import { useState, useEffect, useCallback } from "react";
import { items as apiItems, projects as apiProjects, comments as apiComments, votes as apiVotes } from "@/lib/api";
import type { RoadmapItem, Comment, ItemStatus, ItemPriority, Label } from "@/types";

// ============================================
// Items d'un projet
// ============================================

export function useRoadmapItems(projectSlug: string | null) {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les items du projet
  const loadItems = useCallback(async () => {
    if (!projectSlug) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await apiProjects.getBySlug(projectSlug);
      if (result.error) {
        setError(result.error);
        setItems([]);
      } else {
        setItems(result.data!.items || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectSlug]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Filtrer les items par statut
  const getItemsByStatus = useCallback(
    (status: ItemStatus) => {
      return items.filter((item) => item.status === status).sort((a, b) => a.position - b.position);
    },
    [items]
  );

  // Créer un item
  const createItem = useCallback(
    async (itemData: {
      project_id: string;
      title: string;
      description?: string;
      status?: ItemStatus;
      priority?: ItemPriority;
      category?: string;
      target_date?: string;
      labels?: Label[];
    }) => {
      try {
        const result = await apiItems.create(itemData);
        if (result.error) {
          throw new Error(result.error);
        }
        // Recharger les items après création
        await loadItems();
        return result.data!;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors de la création");
      }
    },
    [loadItems]
  );

  // Mettre à jour un item
  const updateItem = useCallback(
    async (itemId: string, updates: Partial<RoadmapItem>) => {
      try {
        const result = await apiItems.update(itemId, updates);
        if (result.error) {
          throw new Error(result.error);
        }
        // Recharger les items après mise à jour
        await loadItems();
        return result.data!;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      }
    },
    [loadItems]
  );

  // Supprimer un item
  const deleteItem = useCallback(
    async (itemId: string) => {
      try {
        const result = await apiItems.delete(itemId);
        if (result.error) {
          throw new Error(result.error);
        }
        // Recharger les items après suppression
        await loadItems();
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors de la suppression");
      }
    },
    [loadItems]
  );

  // Réordonner les items
  const reorderItems = useCallback(
    async (projectId: string, status: ItemStatus, itemIds: string[]) => {
      try {
        const result = await apiItems.reorder(projectId, status, itemIds);
        if (result.error) {
          throw new Error(result.error);
        }
        // Recharger les items après réordonnement
        await loadItems();
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors du réordonnement");
      }
    },
    [loadItems]
  );

  // Toggle vote
  const toggleVote = useCallback(
    async (itemId: string) => {
      try {
        const result = await apiVotes.toggle(itemId);
        if (result.error) {
          throw new Error(result.error);
        }
        // Recharger les items après vote
        await loadItems();
        return result.data!.voted;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors du vote");
      }
    },
    [loadItems]
  );

  return {
    items,
    getItemsByStatus,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    reorderItems,
    toggleVote,
    refreshItems: loadItems,
  };
}

// ============================================
// Item unique avec commentaires
// ============================================

type ItemWithComments = RoadmapItem & {
  comments: Comment[];
};

export function useRoadmapItem(itemId: string | null) {
  const [item, setItem] = useState<RoadmapItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger l'item et ses commentaires
  const loadItem = useCallback(async () => {
    if (!itemId) {
      setItem(null);
      setComments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Charger l'item
      const itemResult = await apiItems.get(itemId);
      if (itemResult.error) {
        setError(itemResult.error);
        setItem(null);
      } else {
        setItem(itemResult.data!);
      }

      // Charger les commentaires
      const commentsResult = await apiComments.getByItem(itemId);
      if (!commentsResult.error) {
        setComments(commentsResult.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      setItem(null);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  // Ajouter un commentaire
  const addComment = useCallback(
    async (content: string) => {
      if (!itemId) return;

      try {
        const result = await apiComments.create(itemId, content);
        if (result.error) {
          throw new Error(result.error);
        }
        // Recharger l'item et les commentaires
        await loadItem();
        return result.data!;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors de l'ajout du commentaire");
      }
    },
    [itemId, loadItem]
  );

  // Supprimer un commentaire
  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        const result = await apiComments.delete(commentId);
        if (result.error) {
          throw new Error(result.error);
        }
        // Recharger les commentaires
        await loadItem();
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors de la suppression");
      }
    },
    [loadItem]
  );

  return {
    item,
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    refreshItem: loadItem,
  };
}

