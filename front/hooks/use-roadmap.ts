"use client";

import useSWR, { mutate } from "swr";
import type { RoadmapItem, Comment, ItemStatus, ItemPriority, Label } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Erreur lors du chargement");
  }
  const data = await res.json();
  return data.data;
};

// ============================================
// Items d'un projet
// ============================================

export function useRoadmapItems(projectSlug: string | null) {
  const { data, error, isLoading } = useSWR(
    projectSlug ? `/api/projects/${projectSlug}` : null,
    fetcher
  );

  const items: RoadmapItem[] = data?.items || [];

  const getItemsByStatus = (status: ItemStatus) =>
    items.filter((item) => item.status === status).sort((a, b) => a.position - b.position);

  const createItem = async (itemData: {
    project_id: string;
    title: string;
    description?: string;
    status?: ItemStatus;
    priority?: ItemPriority;
    category?: string;
    target_date?: string;
    labels?: Label[];
  }) => {
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur lors de la création");
    }

    // Revalidate
    if (projectSlug) {
      mutate(`/api/projects/${projectSlug}`);
    }
    return result.data as RoadmapItem;
  };

  const updateItem = async (itemId: string, updates: Partial<RoadmapItem>) => {
    const res = await fetch(`/api/items/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur lors de la mise à jour");
    }

    // Revalidate
    if (projectSlug) {
      mutate(`/api/projects/${projectSlug}`);
    }
    return result.data as RoadmapItem;
  };

  const deleteItem = async (itemId: string) => {
    const res = await fetch(`/api/items/${itemId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || "Erreur lors de la suppression");
    }

    // Revalidate
    if (projectSlug) {
      mutate(`/api/projects/${projectSlug}`);
    }
  };

  const reorderItems = async (projectId: string, status: ItemStatus, itemIds: string[]) => {
    const res = await fetch("/api/items/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId, status, item_ids: itemIds }),
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || "Erreur lors du réordonnement");
    }

    // Revalidate
    if (projectSlug) {
      mutate(`/api/projects/${projectSlug}`);
    }
  };

  const toggleVote = async (itemId: string) => {
    const res = await fetch(`/api/votes/${itemId}`, {
      method: "POST",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur lors du vote");
    }

    // Revalidate
    if (projectSlug) {
      mutate(`/api/projects/${projectSlug}`);
    }
    return result.voted as boolean;
  };

  return {
    items,
    getItemsByStatus,
    isLoading,
    error: error?.message,
    createItem,
    updateItem,
    deleteItem,
    reorderItems,
    toggleVote,
  };
}

// ============================================
// Item unique avec commentaires
// ============================================

type ItemWithComments = RoadmapItem & {
  comments: Comment[];
};

export function useRoadmapItem(itemId: string | null) {
  const { data, error, isLoading } = useSWR<ItemWithComments>(
    itemId ? `/api/items/${itemId}` : null,
    fetcher
  );

  const addComment = async (content: string) => {
    if (!itemId) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: itemId, content }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur lors de l'ajout du commentaire");
    }

    // Revalidate
    mutate(`/api/items/${itemId}`);
    return result.data as Comment;
  };

  const deleteComment = async (commentId: string) => {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || "Erreur lors de la suppression");
    }

    // Revalidate
    if (itemId) {
      mutate(`/api/items/${itemId}`);
    }
  };

  return {
    item: data || null,
    comments: data?.comments || [],
    isLoading,
    error: error?.message,
    addComment,
    deleteComment,
  };
}

