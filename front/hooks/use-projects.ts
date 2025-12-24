"use client";

import useSWR, { mutate } from "swr";
import type { Project, RoadmapItem } from "@/types";

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
// Liste des projets
// ============================================

export function useProjects() {
  const { data, error, isLoading } = useSWR<Project[]>("/api/projects", fetcher);

  const createProject = async (projectData: {
    name: string;
    description?: string;
    is_public?: boolean;
  }) => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur lors de la création");
    }

    // Revalidate the projects list
    mutate("/api/projects");
    return result.data as Project;
  };

  return {
    projects: data || [],
    isLoading,
    error: error?.message,
    createProject,
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
  const { data, error, isLoading } = useSWR<ProjectWithItems>(
    slug ? `/api/projects/${slug}` : null,
    fetcher
  );

  const updateProject = async (updates: Partial<Project>) => {
    if (!slug) return;

    const res = await fetch(`/api/projects/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur lors de la mise à jour");
    }

    // Revalidate
    mutate(`/api/projects/${slug}`);
    mutate("/api/projects");
    return result.data as Project;
  };

  const deleteProject = async () => {
    if (!slug) return;

    const res = await fetch(`/api/projects/${slug}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || "Erreur lors de la suppression");
    }

    // Revalidate
    mutate("/api/projects");
  };

  return {
    project: data?.project || null,
    items: data?.items || [],
    isLoading,
    error: error?.message,
    updateProject,
    deleteProject,
  };
}

