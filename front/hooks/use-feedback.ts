"use client";

import { useState, useEffect, useCallback } from "react";
import { items as apiItems, votes as apiVotes, plan as apiPlan } from "@/lib/api";
import type { PlanLimits } from "@/types";

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
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pour le MVP, on retourne un état vide
  // En production, il faudrait charger depuis une API dédiée

  // Créer un feedback
  const createFeedback = useCallback(
    async (feedbackData: {
      title: string;
      description?: string;
      category?: string;
      author_email?: string;
    }) => {
      try {
        // Pour le MVP, créer comme un item roadmap avec status spécial
        const result = await apiItems.create({
          project_id: "", // Sera rempli par l'API si nécessaire
          title: feedbackData.title,
          description: feedbackData.description,
          status: "planned",
          priority: "p2",
          category: feedbackData.category,
          labels: [{ name: "FEEDBACK", color: "#8b5cf6" }],
        });

        if (result.error) {
          throw new Error(result.error);
        }

        return result.data;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors de la création");
      }
    },
    []
  );

  // Voter pour un feedback
  const voteFeedback = useCallback(async (feedbackId: string) => {
    try {
      const result = await apiVotes.toggle(feedbackId);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data!.voted;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Erreur lors du vote");
    }
  }, []);

  // Promouvoir un feedback vers la roadmap
  const promoteToRoadmap = useCallback(
    async (feedbackId: string, projectId: string) => {
      try {
        // Mettre à jour le feedback pour le lier à un item roadmap
        const result = await apiItems.update(feedbackId, {
          project_id: projectId,
          status: "planned",
        });

        if (result.error) {
          throw new Error(result.error);
        }

        return result.data!;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors de la promotion");
      }
    },
    []
  );

  return {
    feedbacks,
    isLoading,
    error,
    createFeedback,
    voteFeedback,
    promoteToRoadmap,
  };
}

// ============================================
// Plan limits
// ============================================

export function usePlanLimits() {
  const [limits, setLimits] = useState<PlanLimits>({
    tier: "free",
    projects_count: 0,
    projects_limit: 1,
    can_create_project: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les limites du plan
  const loadLimits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiPlan.getLimits();
      if (result.error) {
        setError(result.error);
      } else {
        setLimits(result.data || limits);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLimits();
  }, [loadLimits]);

  return {
    limits,
    isLoading,
    error,
    refreshLimits: loadLimits,
  };
}

