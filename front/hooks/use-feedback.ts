"use client";

import useSWR, { mutate } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Erreur lors du chargement");
  }
  const data = await res.json();
  return data.data;
};

// Note: Pour le MVP, les feedbacks sont stockés comme des RoadmapItems avec un flag spécial
// ou dans une table séparée. Pour l'instant, on simule avec les items de type "feedback"

export type Feedback = {
  id: string;
  title: string;
  description: string;
  status: "open" | "under_review" | "planned" | "completed" | "closed";
  category: string;
  votes: number;
  author: { id: string; name: string; email?: string; avatar?: string };
  created_at: string;
  roadmap_item_id?: string;
};

// Pour le MVP, on utilise les roadmap items comme feedback
// En production, il faudrait une table feedback séparée

export function useFeedback() {
  // Pour le MVP, on retourne un état vide
  // En production: const { data, error, isLoading } = useSWR<Feedback[]>("/api/feedback", fetcher);
  
  const createFeedback = async (feedbackData: {
    title: string;
    description?: string;
    category?: string;
    author_email?: string;
  }) => {
    // Pour le MVP, créer comme un item roadmap avec status spécial
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...feedbackData,
        status: "planned",
        priority: "p2",
        labels: [{ name: "FEEDBACK", color: "#8b5cf6" }],
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur lors de la création");
    }

    return result.data;
  };

  const voteFeedback = async (feedbackId: string) => {
    const res = await fetch(`/api/votes/${feedbackId}`, {
      method: "POST",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur lors du vote");
    }

    return result.voted as boolean;
  };

  const promoteToRoadmap = async (feedbackId: string, projectId: string) => {
    // Mettre à jour le feedback pour le lier à un item roadmap
    const res = await fetch(`/api/items/${feedbackId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: projectId,
        status: "planned",
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur lors de la promotion");
    }

    mutate(`/api/projects/${projectId}`);
    return result.data;
  };

  return {
    feedbacks: [] as Feedback[],
    isLoading: false,
    error: undefined as string | undefined,
    createFeedback,
    voteFeedback,
    promoteToRoadmap,
  };
}

// ============================================
// Plan limits
// ============================================

export function usePlanLimits() {
  const { data, error, isLoading } = useSWR("/api/plan", fetcher);

  return {
    limits: data || { tier: "free", projects_count: 0, projects_limit: 1, can_create_project: true },
    isLoading,
    error: error?.message,
  };
}

