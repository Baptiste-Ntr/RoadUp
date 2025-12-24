"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
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
// Types pour le contexte démo
// ============================================

type ProjectWithRole = Project & {
  role: CollaboratorRole | "owner";
  members: { id: string; name: string; avatar?: string }[];
};

type DemoContextType = {
  // Mode
  isDemoMode: true;

  // User
  user: Profile;

  // Projects
  projects: ProjectWithRole[];
  createProject: (data: { name: string; description?: string; is_public?: boolean }) => ProjectWithRole;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Roadmap Items
  roadmapItems: RoadmapItem[];
  getItemsByProject: (projectId: string) => RoadmapItem[];
  getItemsByStatus: (projectId: string, status: ItemStatus) => RoadmapItem[];
  createItem: (data: Partial<RoadmapItem> & { project_id: string; title: string }) => RoadmapItem;
  updateItem: (id: string, data: Partial<RoadmapItem>) => void;
  deleteItem: (id: string) => void;
  reorderItems: (projectId: string, status: ItemStatus, itemIds: string[]) => void;

  // Feedbacks
  feedbacks: DemoFeedback[];
  createFeedback: (data: Partial<DemoFeedback> & { title: string }) => DemoFeedback;
  updateFeedback: (id: string, data: Partial<DemoFeedback>) => void;
  deleteFeedback: (id: string) => void;
  voteFeedback: (id: string) => void;
  promoteToRoadmap: (feedbackId: string, projectId: string) => RoadmapItem;

  // Changelogs
  changelogs: DemoChangelog[];
  createChangelog: (data: Partial<DemoChangelog> & { version: string; title: string }) => DemoChangelog;
  updateChangelog: (id: string, data: Partial<DemoChangelog>) => void;
  deleteChangelog: (id: string) => void;

  // Comments
  comments: Comment[];
  getCommentsByItem: (itemId: string) => Comment[];
  createComment: (itemId: string, content: string) => Comment;
  deleteComment: (id: string) => void;

  // Collaborators
  collaborators: ProjectCollaborator[];
  getCollaboratorsByProject: (projectId: string) => ProjectCollaborator[];
  addCollaborator: (projectId: string, email: string, role: CollaboratorRole) => void;
  removeCollaborator: (id: string) => void;
  updateCollaboratorRole: (id: string, role: CollaboratorRole) => void;

  // Stats & Activities
  stats: typeof demoStats;
  activities: Activity[];
  planLimits: PlanLimits;
  trendingItems: typeof demoTrendingItems;
};

// ============================================
// Context
// ============================================

const DemoContext = createContext<DemoContextType | null>(null);

// ============================================
// Provider
// ============================================

export function DemoProvider({ children }: { children: ReactNode }) {
  // State
  const [projects, setProjects] = useState<ProjectWithRole[]>(demoProjects);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(demoRoadmapItems);
  const [feedbacks, setFeedbacks] = useState<DemoFeedback[]>(demoFeedbacks);
  const [changelogs, setChangelogs] = useState<DemoChangelog[]>(demoChangelogs);
  const [comments, setComments] = useState<Comment[]>(demoComments);
  const [collaborators, setCollaborators] = useState<ProjectCollaborator[]>(demoCollaborators);
  const [activities, setActivities] = useState<Activity[]>(demoActivities);

  // Helper to generate IDs
  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add activity
  const addActivity = useCallback((activity: Omit<Activity, "id" | "created_at">) => {
    const newActivity: Activity = {
      ...activity,
      id: generateId("act"),
      created_at: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 20));
  }, []);

  // ============================================
  // Projects
  // ============================================

  const createProject = useCallback(
    (data: { name: string; description?: string; is_public?: boolean }): ProjectWithRole => {
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
      setProjects((prev) => [newProject, ...prev]);
      addActivity({ type: "item_created", user_name: demoUser.name, item_title: data.name });
      return newProject;
    },
    [addActivity]
  );

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setRoadmapItems((prev) => prev.filter((i) => i.project_id !== id));
  }, []);

  // ============================================
  // Roadmap Items
  // ============================================

  const getItemsByProject = useCallback(
    (projectId: string) => roadmapItems.filter((i) => i.project_id === projectId),
    [roadmapItems]
  );

  const getItemsByStatus = useCallback(
    (projectId: string, status: ItemStatus) =>
      roadmapItems.filter((i) => i.project_id === projectId && i.status === status),
    [roadmapItems]
  );

  const createItem = useCallback(
    (data: Partial<RoadmapItem> & { project_id: string; title: string }): RoadmapItem => {
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
        position: roadmapItems.filter((i) => i.project_id === data.project_id && i.status === (data.status || "planned")).length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setRoadmapItems((prev) => [...prev, newItem]);
      setProjects((prev) =>
        prev.map((p) => (p.id === data.project_id ? { ...p, items_count: p.items_count + 1 } : p))
      );
      addActivity({ type: "item_created", user_name: demoUser.name, item_title: data.title, item_id: newItem.id });
      return newItem;
    },
    [roadmapItems, addActivity]
  );

  const updateItem = useCallback((id: string, data: Partial<RoadmapItem>) => {
    setRoadmapItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...data, updated_at: new Date().toISOString() } : i))
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    const item = roadmapItems.find((i) => i.id === id);
    if (item) {
      setRoadmapItems((prev) => prev.filter((i) => i.id !== id));
      setProjects((prev) =>
        prev.map((p) => (p.id === item.project_id ? { ...p, items_count: Math.max(0, p.items_count - 1) } : p))
      );
      setComments((prev) => prev.filter((c) => c.item_id !== id));
    }
  }, [roadmapItems]);

  const reorderItems = useCallback((projectId: string, status: ItemStatus, itemIds: string[]) => {
    setRoadmapItems((prev) =>
      prev.map((item) => {
        const newPosition = itemIds.indexOf(item.id);
        if (newPosition !== -1 && item.project_id === projectId) {
          return { ...item, status, position: newPosition + 1 };
        }
        return item;
      })
    );
  }, []);

  // ============================================
  // Feedbacks
  // ============================================

  const createFeedback = useCallback(
    (data: Partial<DemoFeedback> & { title: string }): DemoFeedback => {
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
      setFeedbacks((prev) => [newFeedback, ...prev]);
      return newFeedback;
    },
    []
  );

  const updateFeedback = useCallback((id: string, data: Partial<DemoFeedback>) => {
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
  }, []);

  const deleteFeedback = useCallback((id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const voteFeedback = useCallback((id: string) => {
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, votes: f.votes + 1 } : f)));
    addActivity({ type: "vote", user_name: demoUser.name, item_id: id });
  }, [addActivity]);

  const promoteToRoadmap = useCallback(
    (feedbackId: string, projectId: string): RoadmapItem => {
      const feedback = feedbacks.find((f) => f.id === feedbackId);
      if (!feedback) throw new Error("Feedback not found");

      const newItem = createItem({
        project_id: projectId,
        title: feedback.title,
        description: feedback.description,
        status: "planned",
        priority: "p2",
        category: feedback.category,
      });

      updateFeedback(feedbackId, { status: "planned", roadmap_item_id: newItem.id });
      return newItem;
    },
    [feedbacks, createItem, updateFeedback]
  );

  // ============================================
  // Changelogs
  // ============================================

  const createChangelog = useCallback(
    (data: Partial<DemoChangelog> & { version: string; title: string }): DemoChangelog => {
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
      setChangelogs((prev) => [newChangelog, ...prev]);
      if (!newChangelog.is_draft) {
        addActivity({ type: "changelog", user_name: demoUser.name, item_title: `${data.version} - ${data.title}`, item_id: newChangelog.id });
      }
      return newChangelog;
    },
    [addActivity]
  );

  const updateChangelog = useCallback((id: string, data: Partial<DemoChangelog>) => {
    setChangelogs((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const deleteChangelog = useCallback((id: string) => {
    setChangelogs((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ============================================
  // Comments
  // ============================================

  const getCommentsByItem = useCallback((itemId: string) => comments.filter((c) => c.item_id === itemId), [comments]);

  const createComment = useCallback(
    (itemId: string, content: string): Comment => {
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
      setComments((prev) => [...prev, newComment]);
      setRoadmapItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, comments_count: i.comments_count + 1 } : i))
      );
      const item = roadmapItems.find((i) => i.id === itemId);
      if (item) {
        addActivity({ type: "comment", user_name: demoUser.name, item_title: item.title, item_id: itemId, content });
      }
      return newComment;
    },
    [roadmapItems, addActivity]
  );

  const deleteComment = useCallback((id: string) => {
    const comment = comments.find((c) => c.id === id);
    if (comment) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      setRoadmapItems((prev) =>
        prev.map((i) => (i.id === comment.item_id ? { ...i, comments_count: Math.max(0, i.comments_count - 1) } : i))
      );
    }
  }, [comments]);

  // ============================================
  // Collaborators
  // ============================================

  const getCollaboratorsByProject = useCallback(
    (projectId: string) => collaborators.filter((c) => c.project_id === projectId),
    [collaborators]
  );

  const addCollaborator = useCallback((projectId: string, email: string, role: CollaboratorRole) => {
    const newCollab: ProjectCollaborator = {
      id: generateId("collab"),
      project_id: projectId,
      user_id: generateId("user"),
      role,
      created_at: new Date().toISOString(),
      profile: { id: generateId("user"), name: email.split("@")[0], created_at: "", updated_at: "" },
    };
    setCollaborators((prev) => [...prev, newCollab]);
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, collaborators_count: p.collaborators_count + 1 } : p))
    );
  }, []);

  const removeCollaborator = useCallback((id: string) => {
    const collab = collaborators.find((c) => c.id === id);
    if (collab) {
      setCollaborators((prev) => prev.filter((c) => c.id !== id));
      setProjects((prev) =>
        prev.map((p) =>
          p.id === collab.project_id ? { ...p, collaborators_count: Math.max(0, p.collaborators_count - 1) } : p
        )
      );
    }
  }, [collaborators]);

  const updateCollaboratorRole = useCallback((id: string, role: CollaboratorRole) => {
    setCollaborators((prev) => prev.map((c) => (c.id === id ? { ...c, role } : c)));
  }, []);

  // ============================================
  // Context Value
  // ============================================

  const value: DemoContextType = {
    isDemoMode: true,
    user: demoUser,
    projects,
    createProject,
    updateProject,
    deleteProject,
    roadmapItems,
    getItemsByProject,
    getItemsByStatus,
    createItem,
    updateItem,
    deleteItem,
    reorderItems,
    feedbacks,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    voteFeedback,
    promoteToRoadmap,
    changelogs,
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
    stats: demoStats,
    activities,
    planLimits: demoPlanLimits,
    trendingItems: demoTrendingItems,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

// ============================================
// Hook
// ============================================

export function useDemoContext() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemoContext must be used within a DemoProvider");
  }
  return context;
}

export { DemoContext };

