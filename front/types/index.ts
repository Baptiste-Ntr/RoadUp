// ============================================
// Types pour RoadUp - Plateforme de Roadmap & Feedback
// ============================================

// Auth & Profile
export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
};

export type Profile = {
  id: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

// Projects
export type Project = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_public: boolean;
  owner_id: string;
  items_count: number;
  collaborators_count: number;
  created_at: string;
  updated_at: string;
};

export type CollaboratorRole = "viewer" | "editor" | "admin";

export type ProjectCollaborator = {
  id: string;
  project_id: string;
  user_id: string;
  role: CollaboratorRole;
  created_at: string;
  profile?: Profile;
};

// Roadmap Items
export type ItemStatus = "planned" | "in_progress" | "completed";
export type ItemPriority = "p0" | "p1" | "p2" | "p3";

export type Label = {
  name: string;
  color: string;
};

export type RoadmapItem = {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: ItemStatus;
  priority: ItemPriority;
  category?: string;
  target_date?: string;
  labels: Label[];
  comments_count: number;
  votes_count: number;
  position: number;
  created_at: string;
  updated_at: string;
};

// Comments
export type Comment = {
  id: string;
  item_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
};

// Votes
export type Vote = {
  id: string;
  item_id: string;
  user_id: string;
  created_at: string;
};

// Subscriptions
export type SubscriptionTier = "free" | "starter" | "pro" | "business";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

export type Subscription = {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_end?: string;
  created_at: string;
};

export type PlanLimits = {
  tier: SubscriptionTier;
  projects_count: number;
  projects_limit: number;
  can_create_project: boolean;
};

// Activity
export type ActivityType = "vote" | "comment" | "changelog" | "item_created" | "item_updated";

export type Activity = {
  id: string;
  type: ActivityType;
  user_name: string;
  item_title?: string;
  item_id?: string;
  content?: string;
  created_at: string;
};

// Dashboard Stats
export type DashboardStats = {
  total_feedback: number;
  feedback_change: number;
  active_items: number;
  items_in_progress: number;
  changelog_subscribers: number;
  subscribers_change: number;
};

// API Response wrapper
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

