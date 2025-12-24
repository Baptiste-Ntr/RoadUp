// ============================================
// API Client pour RoadUp
// ============================================

import type {
  ApiResponse,
  Project,
  RoadmapItem,
  Comment,
  Profile,
  PlanLimits,
  ProjectCollaborator,
} from "@/types";

const API_BASE = "/api";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Une erreur est survenue" };
    }

    return { data: data.data };
  } catch {
    return { error: "Erreur de connexion au serveur" };
  }
}

// ============================================
// Auth
// ============================================

export const auth = {
  login: (email: string, password: string) =>
    fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (email: string, password: string) =>
    fetchApi("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => fetchApi("/auth/logout", { method: "POST" }),

  getUser: () => fetchApi("/auth/user"),
};

// ============================================
// Projects
// ============================================

export const projects = {
  getAll: () => fetchApi<Project[]>("/projects"),

  getBySlug: (slug: string) =>
    fetchApi<{ project: Project; items: RoadmapItem[] }>(`/projects/${slug}`),

  create: (data: { name: string; description?: string; is_public?: boolean }) =>
    fetchApi<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    slug: string,
    data: Partial<Pick<Project, "name" | "description" | "is_public" | "image_url">>
  ) =>
    fetchApi<Project>(`/projects/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (slug: string) =>
    fetchApi(`/projects/${slug}`, { method: "DELETE" }),
};

// ============================================
// Roadmap Items
// ============================================

export const items = {
  create: (data: Partial<RoadmapItem>) =>
    fetchApi<RoadmapItem>("/items", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  get: (id: string) => fetchApi<RoadmapItem>(`/items/${id}`),

  update: (id: string, data: Partial<RoadmapItem>) =>
    fetchApi<RoadmapItem>(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) => fetchApi(`/items/${id}`, { method: "DELETE" }),

  reorder: (project_id: string, status: string, item_ids: string[]) =>
    fetchApi("/items/reorder", {
      method: "POST",
      body: JSON.stringify({ project_id, status, item_ids }),
    }),
};

// ============================================
// Comments
// ============================================

export const comments = {
  getByItem: (item_id: string) =>
    fetchApi<Comment[]>(`/comments?item_id=${item_id}`),

  create: (item_id: string, content: string) =>
    fetchApi<Comment>("/comments", {
      method: "POST",
      body: JSON.stringify({ item_id, content }),
    }),

  update: (id: string, content: string) =>
    fetchApi<Comment>(`/comments/${id}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    }),

  delete: (id: string) => fetchApi(`/comments/${id}`, { method: "DELETE" }),
};

// ============================================
// Votes
// ============================================

export const votes = {
  toggle: (itemId: string) =>
    fetchApi<{ voted: boolean }>(`/votes/${itemId}`, { method: "POST" }),
};

// ============================================
// Profile
// ============================================

export const profile = {
  get: () => fetchApi<Profile>("/profile"),

  update: (data: Partial<Pick<Profile, "name" | "avatar_url">>) =>
    fetchApi<Profile>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ============================================
// Plan
// ============================================

export const plan = {
  getLimits: () => fetchApi<PlanLimits>("/plan"),
};

// ============================================
// Collaborators
// ============================================

export const collaborators = {
  getByProject: (project_id: string) =>
    fetchApi<ProjectCollaborator[]>(`/collaborators?project_id=${project_id}`),

  add: (project_id: string, user_id: string, role?: string) =>
    fetchApi<ProjectCollaborator>("/collaborators", {
      method: "POST",
      body: JSON.stringify({ project_id, user_id, role }),
    }),

  updateRole: (id: string, role: string) =>
    fetchApi<ProjectCollaborator>(`/collaborators/${id}`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    }),

  remove: (id: string) =>
    fetchApi(`/collaborators/${id}`, { method: "DELETE" }),
};

