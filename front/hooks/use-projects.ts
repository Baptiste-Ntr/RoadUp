"use client";

import { useState, useEffect, useCallback } from "react";
import { projects as apiProjects } from "@/lib/api";
import type { Project, RoadmapItem } from "@/types";

// ============================================
// Liste des projets
// ============================================

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les projets au montage
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiProjects.getAll();
      if (result.error) {
        setError(result.error);
        setProjects([]);
      } else {
        setProjects(result.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Créer un projet
  const createProject = useCallback(
    async (projectData: { name: string; description?: string; is_public?: boolean }) => {
      try {
        const result = await apiProjects.create(projectData);
        if (result.error) {
          throw new Error(result.error);
        }
        // Recharger la liste après création
        await loadProjects();
        return result.data!;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors de la création");
      }
    },
    [loadProjects]
  );

  return {
    projects,
    isLoading,
    error,
    createProject,
    refreshProjects: loadProjects,
  };
}

// ============================================
// Projet unique avec items
// ============================================

type ProjectWithItems = {
  project: Project;
  items: RoadmapItem[];
};

export function useProject(slug: string | null) {
  const [project, setProject] = useState<Project | null>(null);
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le projet et ses items
  const loadProject = useCallback(async () => {
    if (!slug) {
      setProject(null);
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await apiProjects.getBySlug(slug);
      if (result.error) {
        setError(result.error);
        setProject(null);
        setItems([]);
      } else {
        setProject(result.data!.project);
        setItems(result.data!.items || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      setProject(null);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Mettre à jour le projet
  const updateProject = useCallback(
    async (updates: Partial<Project>) => {
      if (!slug) return;

      try {
        const result = await apiProjects.update(slug, updates);
        if (result.error) {
          throw new Error(result.error);
        }
        // Recharger le projet après mise à jour
        await loadProject();
        return result.data!;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      }
    },
    [slug, loadProject]
  );

  // Supprimer le projet
  const deleteProject = useCallback(async () => {
    if (!slug) return;

    try {
      const result = await apiProjects.delete(slug);
      if (result.error) {
        throw new Error(result.error);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  }, [slug]);

  return {
    project,
    items,
    isLoading,
    error,
    updateProject,
    deleteProject,
    refreshProject: loadProject,
  };
}

