"use client";

import React, { createContext, useContext, ReactNode, useMemo, useState, Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/hooks/use-auth";
import {
  demoUser,
  demoProjects,
  type DemoFeedback,
  type DemoChangelog,
} from "@/lib/demo-data";
import type {
  Profile,
  Project,
  CollaboratorRole,
} from "@/types";

// ============================================
// Types pour le contexte
// ============================================

type ProjectWithRole = Project & {
  role: CollaboratorRole | "owner";
  members: { id: string; name: string; avatar?: string }[];
};

type AppContextType = {
  // Mode
  isDemoMode: boolean;

  // User
  user: Profile | null;
  isLoadingUser: boolean;

  // Projects
  projects: ProjectWithRole[];
  isLoadingProjects: boolean;
  createProject: (data: { name: string; description?: string; is_public?: boolean }) => Promise<ProjectWithRole>;
  refreshProjects: () => Promise<void>;
  activeProject: Project["id"] | null;
  setActiveProject: Dispatch<SetStateAction<Project["id"] | null>>;
};

// ============================================
// Context
// ============================================

const AppContext = createContext<AppContextType | null>(null);

// ============================================
// Provider
// ============================================

export function AppProvider({ children, isDemo = false }: { children: ReactNode; isDemo?: boolean }) {
  const pathname = usePathname();
  const isDemoMode = isDemo || pathname?.startsWith("/demo") || false;

  // ============================================
  // Hooks pour le mode normal (uniquement si pas en mode demo)
  // ============================================
  const { projects: apiProjects, isLoading: isLoadingApiProjects, createProject: createApiProject, refreshProjects: refreshApiProjects } = useProjects();
  const { user: authUser, isLoading: isLoadingAuth } = useAuth();

  // ============================================
  // User
  // ============================================
  const user: Profile | null = useMemo(() => {
    if (isDemoMode) {
      return demoUser;
    }
    if (authUser) {
      return {
        id: authUser.id,
        name: authUser.name || authUser.email?.split("@")[0] || "Utilisateur",
        avatar_url: authUser.avatar_url,
        created_at: authUser.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    return null;
  }, [isDemoMode, authUser]);

  // ============================================
  // Projects
  // ============================================

  const [activeProject, setActiveProject] = useState<Project["id"] | null>(null)

  const projects: ProjectWithRole[] = useMemo(() => {
    if (isDemoMode) {
      return demoProjects;
    }
    // Convertir les projets API en format avec role
    return apiProjects.map((p) => ({
      ...p,
      role: "owner" as const, // TODO: récupérer le vrai rôle depuis l'API
      members: [], // TODO: récupérer les membres depuis l'API
    }));
  }, [isDemoMode, apiProjects]);

  // ============================================
  // Wrapper pour createProject
  // ============================================
  const createProject = async (data: { name: string; description?: string; is_public?: boolean }): Promise<ProjectWithRole> => {
    if (isDemoMode) {
      // En mode demo, créer un projet localement
      const newProject: ProjectWithRole = {
        id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: data.description || "",
        image_url: "",
        is_public: data.is_public ?? true,
        owner_id: demoUser.id,
        items_count: 0,
        collaborators_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: "owner",
        members: [{ id: demoUser.id, name: demoUser.name }],
      };
      // Note: En mode demo, on ne persiste pas vraiment, juste pour l'UI
      return newProject;
    }
    const project = await createApiProject(data);
    return {
      ...project,
      role: "owner" as const,
      members: [],
    };
  };

  // ============================================
  // Wrapper pour refreshProjects
  // ============================================
  const refreshProjects = async () => {
    if (!isDemoMode) {
      await refreshApiProjects();
    }
  };

  // ============================================
  // Value
  // ============================================
  const value: AppContextType = {
    isDemoMode,
    user,
    isLoadingUser: isLoadingAuth,
    projects,
    isLoadingProjects: isLoadingApiProjects,
    createProject,
    refreshProjects,
    activeProject,
    setActiveProject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ============================================
// Hook
// ============================================

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export { AppContext };
