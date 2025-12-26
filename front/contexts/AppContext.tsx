"use client";

import React, { createContext, useContext, ReactNode, useMemo, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useProjects, useProject } from "@/hooks/use-projects";
import { useRoadmapItems, useRoadmapItem } from "@/hooks/use-roadmap";
import { useFeedback, usePlanLimits } from "@/hooks/use-feedback";
import { useAuth } from "@/hooks/use-auth";
import {
  demoUser,
  demoProjects,
  demoRoadmapItems,
  demoFeedbacks,
  demoChangelogs,
  demoActivities,
  demoStats,
  demoPlanLimits,
  demoComments,
  demoCollaborators,
  demoTrendingItems,
  type DemoFeedback,
  type DemoChangelog,
} from "@/lib/demo-data";
import type {
  Profile,
  Project,
  RoadmapItem,
  Comment,
  Activity,
  PlanLimits,
  CollaboratorRole,
  ProjectCollaborator,
  ItemStatus,
  ItemPriority,
} from "@/types";

// ============================================
// Types pour le contexte unifié
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
  createProject: (data: { name: string; description?: string; is_public?: boolean }) => Promise<ProjectWithRole> | ProjectWithRole;
  updateProject: (id: string, data: Partial<Project>) => Promise<void> | void;
  deleteProject: (id: string) => Promise<void> | void;

  // Roadmap Items
  roadmapItems: RoadmapItem[];
  isLoadingItems: boolean;
  getItemsByProject: (projectId: string) => RoadmapItem[];
  getItemsByStatus: (projectId: string, status: ItemStatus) => RoadmapItem[];
  createItem: (data: Partial<RoadmapItem> & { project_id: string; title: string }) => Promise<RoadmapItem> | RoadmapItem;
  updateItem: (id: string, data: Partial<RoadmapItem>) => Promise<RoadmapItem> | RoadmapItem;
  deleteItem: (id: string) => Promise<void> | void;
  reorderItems: (projectId: string, status: ItemStatus, itemIds: string[]) => Promise<void> | void;
  toggleVote?: (itemId: string) => Promise<boolean> | void;

  // Feedbacks
  feedbacks: DemoFeedback[];
  isLoadingFeedbacks: boolean;
  createFeedback: (data: Partial<DemoFeedback> & { title: string }) => Promise<DemoFeedback> | DemoFeedback;
  updateFeedback: (id: string, data: Partial<DemoFeedback>) => Promise<void> | void;
  deleteFeedback: (id: string) => Promise<void> | void;
  voteFeedback: (id: string) => Promise<void> | void;
  promoteToRoadmap: (feedbackId: string, projectId: string) => Promise<RoadmapItem> | RoadmapItem;

  // Changelogs
  changelogs: DemoChangelog[];
  isLoadingChangelogs: boolean;
  createChangelog: (data: Partial<DemoChangelog> & { version: string; title: string }) => Promise<DemoChangelog> | DemoChangelog;
  updateChangelog: (id: string, data: Partial<DemoChangelog>) => Promise<void> | void;
  deleteChangelog: (id: string) => Promise<void> | void;

  // Comments
  comments: Comment[];
  getCommentsByItem: (itemId: string) => Comment[];
  createComment: (itemId: string, content: string) => Promise<Comment> | Comment;
  deleteComment: (id: string) => Promise<void> | void;

  // Collaborators
  collaborators: ProjectCollaborator[];
  getCollaboratorsByProject: (projectId: string) => ProjectCollaborator[];
  addCollaborator: (projectId: string, email: string, role: CollaboratorRole) => Promise<void> | void;
  removeCollaborator: (id: string) => Promise<void> | void;
  updateCollaboratorRole: (id: string, role: CollaboratorRole) => Promise<void> | void;

  // Stats & Activities
  stats: {
    total_feedback: number;
    feedback_change: number;
    active_items: number;
    items_in_progress: number;
    changelog_subscribers: number;
    subscribers_change: number;
  };
  activities: Activity[];
  planLimits: PlanLimits;
  trendingItems: Array<{ id: string; title: string; category: string; votes: number }>;
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
  // State pour le mode demo
  // ============================================
  const [demoProjectsState, setDemoProjects] = useState(demoProjects);
  const [demoRoadmapItemsState, setDemoRoadmapItems] = useState(demoRoadmapItems);
  const [demoFeedbacksState, setDemoFeedbacks] = useState(demoFeedbacks);
  const [demoChangelogsState, setDemoChangelogs] = useState(demoChangelogs);
  const [demoCommentsState, setDemoComments] = useState(demoComments);
  const [demoCollaboratorsState, setDemoCollaborators] = useState(demoCollaborators);
  const [demoActivitiesState, setDemoActivities] = useState(demoActivities);

  // Helper pour générer des IDs
  const generateId = useCallback((prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, []);

  // Helper pour ajouter une activité
  const addDemoActivity = useCallback((activity: Omit<Activity, "id" | "created_at">) => {
    const newActivity: Activity = {
      ...activity,
      id: generateId("act"),
      created_at: new Date().toISOString(),
    };
    setDemoActivities((prev) => [newActivity, ...prev].slice(0, 20));
  }, [generateId]);

  // ============================================
  // Hooks pour le mode normal (uniquement si pas en mode demo)
  // ============================================
  const { projects: apiProjects, isLoading: isLoadingApiProjects, createProject: createApiProject } = useProjects();
  const { user: authUser, isLoading: isLoadingAuth } = useAuth();
  const { feedbacks: apiFeedbacks = [], isLoading: isLoadingApiFeedbacks } = useFeedback();
  const { limits: apiPlanLimits } = usePlanLimits();

  // Détection du premier projet pour les items
  const firstProject = apiProjects[0];
  const { items: apiItems, isLoading: isLoadingApiItems, createItem: createApiItem, updateItem: updateApiItem, deleteItem: deleteApiItem, reorderItems: reorderApiItems, toggleVote } = useRoadmapItems(
    isDemoMode ? null : firstProject?.slug || null
  );

  // User
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

  // Projects
  const projects: ProjectWithRole[] = useMemo(() => {
    if (isDemoMode) {
      return demoProjectsState;
    }
    // Convertir les projets API en format avec role
    return apiProjects.map((p) => ({
      ...p,
      role: "owner" as const, // TODO: récupérer le vrai rôle depuis l'API
      members: [], // TODO: récupérer les membres depuis l'API
    }));
  }, [isDemoMode, demoProjectsState, apiProjects]);

  // Roadmap Items
  const roadmapItems: RoadmapItem[] = useMemo(() => {
    if (isDemoMode) {
      return demoRoadmapItemsState;
    }
    return apiItems;
  }, [isDemoMode, demoRoadmapItemsState, apiItems]);

  // Feedbacks
  const feedbacks: DemoFeedback[] = useMemo(() => {
    if (isDemoMode) {
      return demoFeedbacksState;
    }
    // Convertir les feedbacks API en format DemoFeedback si nécessaire
    return apiFeedbacks as DemoFeedback[];
  }, [isDemoMode, demoFeedbacksState, apiFeedbacks]);

  // Changelogs
  const changelogs: DemoChangelog[] = useMemo(() => {
    if (isDemoMode) {
      return demoChangelogsState;
    }
    return []; // TODO: implémenter l'API changelog
  }, [isDemoMode, demoChangelogsState]);

  // Comments
  const comments: Comment[] = useMemo(() => {
    if (isDemoMode) {
      return demoCommentsState;
    }
    return []; // TODO: récupérer depuis l'API
  }, [isDemoMode, demoCommentsState]);

  // Collaborators
  const collaborators: ProjectCollaborator[] = useMemo(() => {
    if (isDemoMode) {
      return demoCollaboratorsState;
    }
    return []; // TODO: récupérer depuis l'API
  }, [isDemoMode, demoCollaboratorsState]);

  // Stats
  const stats = useMemo(() => {
    if (isDemoMode) {
      return demoStats;
    }
    return {
      total_feedback: feedbacks.length,
      feedback_change: 0,
      active_items: roadmapItems.filter((i) => i.status !== "completed").length,
      items_in_progress: roadmapItems.filter((i) => i.status === "in_progress").length,
      changelog_subscribers: 0,
      subscribers_change: 0,
    };
  }, [isDemoMode, feedbacks, roadmapItems]);

  // Activities
  const activities: Activity[] = useMemo(() => {
    if (isDemoMode) {
      return demoActivitiesState;
    }
    return []; // TODO: récupérer depuis l'API
  }, [isDemoMode, demoActivitiesState]);

  // Plan Limits
  const planLimits: PlanLimits = useMemo(() => {
    if (isDemoMode) {
      return demoPlanLimits;
    }
    return apiPlanLimits;
  }, [isDemoMode, apiPlanLimits]);

  // Trending Items
  const trendingItems = useMemo(() => {
    if (isDemoMode) {
      return demoTrendingItems;
    }
    return roadmapItems
      .sort((a, b) => b.votes_count - a.votes_count)
      .slice(0, 4)
      .map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category || "Feature",
        votes: item.votes_count,
      }));
  }, [isDemoMode, roadmapItems]);

  // Helper functions
  const getItemsByProject = (projectId: string) => {
    return roadmapItems.filter((i) => i.project_id === projectId);
  };

  const getItemsByStatus = (projectId: string, status: ItemStatus) => {
    return roadmapItems.filter((i) => i.project_id === projectId && i.status === status);
  };

  const getCommentsByItem = (itemId: string) => {
    return comments.filter((c) => c.item_id === itemId);
  };

  const getCollaboratorsByProject = (projectId: string) => {
    return collaborators.filter((c) => c.project_id === projectId);
  };

  // ============================================
  // Wrapper functions pour unifier les signatures
  // ============================================

  const createProject = useCallback(async (data: { name: string; description?: string; is_public?: boolean }) => {
    if (isDemoMode) {
      const newProject: ProjectWithRole = {
        id: generateId("proj"),
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
      setDemoProjects((prev) => [newProject, ...prev]);
      addDemoActivity({ type: "item_created", user_name: demoUser.name, item_title: data.name });
      return newProject;
    }
    const project = await createApiProject(data);
    return {
      ...project,
      role: "owner" as const,
      members: [],
    };
  }, [isDemoMode, generateId, addDemoActivity, createApiProject]);

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    if (isDemoMode) {
      setDemoProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p))
      );
      return;
    }
    // TODO: implémenter updateProject dans useProjects
    throw new Error("Not implemented");
  }, [isDemoMode]);

  const deleteProject = useCallback(async (id: string) => {
    if (isDemoMode) {
      setDemoProjects((prev) => prev.filter((p) => p.id !== id));
      setDemoRoadmapItems((prev) => prev.filter((i) => i.project_id !== id));
      return;
    }
    // TODO: implémenter deleteProject dans useProjects
    throw new Error("Not implemented");
  }, [isDemoMode]);

  const createItem = useCallback(async (data: Partial<RoadmapItem> & { project_id: string; title: string }) => {
    if (isDemoMode) {
      const newItem: RoadmapItem = {
        id: generateId("item"),
        project_id: data.project_id,
        title: data.title,
        description: data.description || "",
        status: (data.status as ItemStatus) || "planned",
        priority: (data.priority as ItemPriority) || "p2",
        category: data.category || "",
        target_date: data.target_date,
        labels: data.labels || [],
        comments_count: 0,
        votes_count: 0,
        position: demoRoadmapItemsState.filter((i) => i.project_id === data.project_id && i.status === (data.status || "planned")).length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setDemoRoadmapItems((prev) => [...prev, newItem]);
      setDemoProjects((prev) =>
        prev.map((p) => (p.id === data.project_id ? { ...p, items_count: p.items_count + 1 } : p))
      );
      addDemoActivity({ type: "item_created", user_name: demoUser.name, item_title: data.title, item_id: newItem.id });
      return newItem;
    }
    return await createApiItem(data);
  }, [isDemoMode, generateId, demoRoadmapItemsState, addDemoActivity, createApiItem]);

  const updateItem = useCallback(async (id: string, data: Partial<RoadmapItem>) => {
    if (isDemoMode) {
      setDemoRoadmapItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...data, updated_at: new Date().toISOString() } : i))
      );
      return {} as RoadmapItem;
    }
    return await updateApiItem(id, data);
  }, [isDemoMode, updateApiItem]);

  const deleteItem = useCallback(async (id: string) => {
    if (isDemoMode) {
      const item = demoRoadmapItemsState.find((i) => i.id === id);
      if (item) {
        setDemoRoadmapItems((prev) => prev.filter((i) => i.id !== id));
        setDemoProjects((prev) =>
          prev.map((p) => (p.id === item.project_id ? { ...p, items_count: Math.max(0, p.items_count - 1) } : p))
        );
        setDemoComments((prev) => prev.filter((c) => c.item_id !== id));
      }
      return;
    }
    await deleteApiItem(id);
  }, [isDemoMode, demoRoadmapItemsState, deleteApiItem]);

  const reorderItems = useCallback(async (projectId: string, status: ItemStatus, itemIds: string[]) => {
    if (isDemoMode) {
      setDemoRoadmapItems((prev) =>
        prev.map((item) => {
          const newPosition = itemIds.indexOf(item.id);
          if (newPosition !== -1 && item.project_id === projectId) {
            return { ...item, status, position: newPosition + 1 };
          }
          return item;
        })
      );
      return;
    }
    await reorderApiItems(projectId, status, itemIds);
  }, [isDemoMode, reorderApiItems]);

  const createFeedback = useCallback(async (data: Partial<DemoFeedback> & { title: string }) => {
    if (isDemoMode) {
      const newFeedback: DemoFeedback = {
        id: generateId("fb"),
        title: data.title,
        description: data.description || "",
        status: data.status || "open",
        category: data.category || "UX Improvements",
        votes: 0,
        author: data.author || { id: demoUser.id, name: demoUser.name },
        created_at: new Date().toISOString(),
      };
      setDemoFeedbacks((prev) => [newFeedback, ...prev]);
      return newFeedback;
    }
    // TODO: utiliser l'API feedback
    throw new Error("Not implemented");
  }, [isDemoMode, generateId]);

  const updateFeedback = useCallback(async (id: string, data: Partial<DemoFeedback>) => {
    if (isDemoMode) {
      setDemoFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
      return;
    }
    // TODO: utiliser l'API feedback
    throw new Error("Not implemented");
  }, [isDemoMode]);

  const deleteFeedback = useCallback(async (id: string) => {
    if (isDemoMode) {
      setDemoFeedbacks((prev) => prev.filter((f) => f.id !== id));
      return;
    }
    // TODO: utiliser l'API feedback
    throw new Error("Not implemented");
  }, [isDemoMode]);

  const voteFeedback = useCallback(async (id: string) => {
    if (isDemoMode) {
      setDemoFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, votes: f.votes + 1 } : f)));
      addDemoActivity({ type: "vote", user_name: demoUser.name, item_id: id });
      return;
    }
    // TODO: utiliser l'API feedback
    throw new Error("Not implemented");
  }, [isDemoMode, addDemoActivity]);

  const promoteToRoadmap = useCallback(async (feedbackId: string, projectId: string) => {
    if (isDemoMode) {
      const feedback = demoFeedbacksState.find((f) => f.id === feedbackId);
      if (!feedback) throw new Error("Feedback not found");

      const newItem = await createItem({
        project_id: projectId,
        title: feedback.title,
        description: feedback.description,
        status: "planned",
        priority: "p2",
        category: feedback.category,
      });

      setDemoFeedbacks((prev) => prev.map((f) => (f.id === feedbackId ? { ...f, status: "planned" as const, roadmap_item_id: newItem.id } : f)));
      return newItem;
    }
    // TODO: utiliser l'API feedback
    throw new Error("Not implemented");
  }, [isDemoMode, demoFeedbacksState, createItem]);

  const createChangelog = useCallback(async (data: Partial<DemoChangelog> & { version: string; title: string }) => {
    if (isDemoMode) {
      const newChangelog: DemoChangelog = {
        id: generateId("cl"),
        version: data.version,
        title: data.title,
        description: data.description || "",
        type: data.type || "improvement",
        highlights: data.highlights || [],
        tags: data.tags || [],
        published_at: new Date().toISOString(),
        is_draft: data.is_draft ?? false,
        items: data.items || [],
      };
      setDemoChangelogs((prev) => [newChangelog, ...prev]);
      if (!newChangelog.is_draft) {
        addDemoActivity({ type: "changelog", user_name: demoUser.name, item_title: `${data.version} - ${data.title}`, item_id: newChangelog.id });
      }
      return newChangelog;
    }
    // TODO: utiliser l'API changelog
    throw new Error("Not implemented");
  }, [isDemoMode, generateId, addDemoActivity]);

  const updateChangelog = useCallback(async (id: string, data: Partial<DemoChangelog>) => {
    if (isDemoMode) {
      setDemoChangelogs((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
      return;
    }
    // TODO: utiliser l'API changelog
    throw new Error("Not implemented");
  }, [isDemoMode]);

  const deleteChangelog = useCallback(async (id: string) => {
    if (isDemoMode) {
      setDemoChangelogs((prev) => prev.filter((c) => c.id !== id));
      return;
    }
    // TODO: utiliser l'API changelog
    throw new Error("Not implemented");
  }, [isDemoMode]);

  const createComment = useCallback(async (itemId: string, content: string) => {
    if (isDemoMode) {
      const newComment: Comment = {
        id: generateId("comment"),
        item_id: itemId,
        user_id: demoUser.id,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile: {
          id: demoUser.id,
          name: demoUser.name,
          avatar_url: demoUser.avatar_url,
          created_at: "",
          updated_at: "",
        },
      };
      setDemoComments((prev) => [...prev, newComment]);
      setDemoRoadmapItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, comments_count: i.comments_count + 1 } : i))
      );
      const item = demoRoadmapItemsState.find((i) => i.id === itemId);
      if (item) {
        addDemoActivity({ type: "comment", user_name: demoUser.name, item_title: item.title, item_id: itemId, content });
      }
      return newComment;
    }
    // TODO: utiliser l'API comments
    throw new Error("Not implemented");
  }, [isDemoMode, generateId, demoRoadmapItemsState, addDemoActivity]);

  const deleteComment = useCallback(async (id: string) => {
    if (isDemoMode) {
      const comment = demoCommentsState.find((c) => c.id === id);
      if (comment) {
        setDemoComments((prev) => prev.filter((c) => c.id !== id));
        setDemoRoadmapItems((prev) =>
          prev.map((i) => (i.id === comment.item_id ? { ...i, comments_count: Math.max(0, i.comments_count - 1) } : i))
        );
      }
      return;
    }
    // TODO: utiliser l'API comments
    throw new Error("Not implemented");
  }, [isDemoMode, demoCommentsState]);

  const addCollaborator = useCallback(async (projectId: string, email: string, role: CollaboratorRole) => {
    if (isDemoMode) {
      const newCollab: ProjectCollaborator = {
        id: generateId("collab"),
        project_id: projectId,
        user_id: generateId("user"),
        role,
        created_at: new Date().toISOString(),
        profile: { id: generateId("user"), name: email.split("@")[0], created_at: "", updated_at: "" },
      };
      setDemoCollaborators((prev) => [...prev, newCollab]);
      setDemoProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, collaborators_count: p.collaborators_count + 1 } : p))
      );
      return;
    }
    // TODO: utiliser l'API collaborators
    throw new Error("Not implemented");
  }, [isDemoMode, generateId]);

  const removeCollaborator = useCallback(async (id: string) => {
    if (isDemoMode) {
      const collab = demoCollaboratorsState.find((c) => c.id === id);
      if (collab) {
        setDemoCollaborators((prev) => prev.filter((c) => c.id !== id));
        setDemoProjects((prev) =>
          prev.map((p) =>
            p.id === collab.project_id ? { ...p, collaborators_count: Math.max(0, p.collaborators_count - 1) } : p
          )
        );
      }
      return;
    }
    // TODO: utiliser l'API collaborators
    throw new Error("Not implemented");
  }, [isDemoMode, demoCollaboratorsState]);

  const updateCollaboratorRole = useCallback(async (id: string, role: CollaboratorRole) => {
    if (isDemoMode) {
      setDemoCollaborators((prev) => prev.map((c) => (c.id === id ? { ...c, role } : c)));
      return;
    }
    // TODO: utiliser l'API collaborators
    throw new Error("Not implemented");
  }, [isDemoMode]);

  const value: AppContextType = {
    isDemoMode,
    user,
    isLoadingUser: isLoadingAuth,
    projects,
    isLoadingProjects: isLoadingApiProjects,
    createProject,
    updateProject,
    deleteProject,
    roadmapItems,
    isLoadingItems: isLoadingApiItems,
    getItemsByProject,
    getItemsByStatus,
    createItem,
    updateItem,
    deleteItem,
    reorderItems,
    toggleVote,
    feedbacks,
    isLoadingFeedbacks: isLoadingApiFeedbacks,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    voteFeedback,
    promoteToRoadmap,
    changelogs,
    isLoadingChangelogs: false,
    createChangelog,
    updateChangelog,
    deleteChangelog,
    comments,
    getCommentsByItem,
    createComment,
    deleteComment,
    collaborators,
    getCollaboratorsByProject,
    addCollaborator,
    removeCollaborator,
    updateCollaboratorRole,
    stats,
    activities,
    planLimits,
    trendingItems,
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

