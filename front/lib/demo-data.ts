// ============================================
// Données de démonstration pour RoadUp
// Utilisées par la route /demo pour éviter les appels API
// ============================================

import type {
  Profile,
  Project,
  RoadmapItem,
  Comment,
  Activity,
  PlanLimits,
  CollaboratorRole,
  ProjectCollaborator,
} from "@/types";

// ============================================
// Utilisateur de démo
// ============================================

export const demoUser: Profile = {
  id: "demo-user-001",
  name: "Alex Demo",
  avatar_url: "",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: new Date().toISOString(),
};

// ============================================
// Projets
// ============================================

export const demoProjects: (Project & {
  role: CollaboratorRole | "owner";
  members: { id: string; name: string; avatar?: string }[];
})[] = [
  {
    id: "proj-001",
    name: "Acme SaaS Platform",
    slug: "acme-saas-platform",
    description: "Notre produit principal - Plateforme SaaS B2B",
    image_url: "",
    is_public: true,
    owner_id: "demo-user-001",
    items_count: 24,
    collaborators_count: 4,
    created_at: "2024-06-01T10:00:00Z",
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    role: "owner",
    members: [
      { id: "u1", name: "Alex Demo" },
      { id: "u2", name: "Sarah Jenkins" },
      { id: "u3", name: "Mike Chen" },
      { id: "u4", name: "Emily Watson" },
    ],
  },
  {
    id: "proj-002",
    name: "Mobile App Redesign",
    slug: "mobile-app-redesign",
    description: "Refonte complète de l'application mobile iOS/Android",
    image_url: "",
    is_public: true,
    owner_id: "demo-user-001",
    items_count: 18,
    collaborators_count: 2,
    created_at: "2024-08-15T10:00:00Z",
    updated_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    role: "owner",
    members: [
      { id: "u1", name: "Alex Demo" },
      { id: "u2", name: "Sarah Jenkins" },
    ],
  },
  {
    id: "proj-003",
    name: "API Documentation",
    slug: "api-documentation",
    description: "Documentation technique de l'API publique",
    image_url: "",
    is_public: false,
    owner_id: "u5",
    items_count: 8,
    collaborators_count: 3,
    created_at: "2024-09-01T10:00:00Z",
    updated_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    role: "editor",
    members: [
      { id: "u5", name: "David Park" },
      { id: "u1", name: "Alex Demo" },
      { id: "u3", name: "Mike Chen" },
    ],
  },
];

// ============================================
// Collaborateurs
// ============================================

export const demoCollaborators: ProjectCollaborator[] = [
  {
    id: "collab-001",
    project_id: "proj-001",
    user_id: "u2",
    role: "admin",
    created_at: "2024-06-05T10:00:00Z",
    profile: { id: "u2", name: "Sarah Jenkins", created_at: "", updated_at: "" },
  },
  {
    id: "collab-002",
    project_id: "proj-001",
    user_id: "u3",
    role: "editor",
    created_at: "2024-06-10T10:00:00Z",
    profile: { id: "u3", name: "Mike Chen", created_at: "", updated_at: "" },
  },
  {
    id: "collab-003",
    project_id: "proj-001",
    user_id: "u4",
    role: "viewer",
    created_at: "2024-07-01T10:00:00Z",
    profile: { id: "u4", name: "Emily Watson", created_at: "", updated_at: "" },
  },
];

// ============================================
// Items Roadmap
// ============================================

export const demoRoadmapItems: RoadmapItem[] = [
  // In Progress
  {
    id: "item-001",
    project_id: "proj-001",
    title: "Mode sombre",
    description:
      "Implémenter la détection de préférence système et un toggle manuel pour le mode sombre. Inclut la refonte des variables CSS et la persistance du choix utilisateur.",
    status: "in_progress",
    priority: "p0",
    category: "UX",
    target_date: "2025-01-15",
    labels: [
      { name: "HIGH PRIORITY", color: "#ef4444" },
      { name: "UX", color: "#f97316" },
    ],
    comments_count: 12,
    votes_count: 128,
    position: 1,
    created_at: "2024-10-01T10:00:00Z",
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "item-002",
    project_id: "proj-001",
    title: "API v2 Endpoints",
    description:
      "Restructurer les endpoints utilisateur pour de meilleures performances. Migration vers une architecture RESTful plus cohérente.",
    status: "in_progress",
    priority: "p1",
    category: "Backend",
    target_date: "2025-01-30",
    labels: [{ name: "DEV", color: "#3b82f6" }],
    comments_count: 5,
    votes_count: 45,
    position: 2,
    created_at: "2024-10-15T10:00:00Z",
    updated_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  // Planned
  {
    id: "item-003",
    project_id: "proj-001",
    title: "Intégration Slack",
    description:
      "Permettre aux utilisateurs de recevoir des notifications dans leurs channels Slack. Support des webhooks entrants et sortants.",
    status: "planned",
    priority: "p1",
    category: "Integration",
    target_date: "2025-02-15",
    labels: [{ name: "INTEGRATION", color: "#8b5cf6" }],
    comments_count: 8,
    votes_count: 89,
    position: 1,
    created_at: "2024-09-20T10:00:00Z",
    updated_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "item-004",
    project_id: "proj-001",
    title: "Rôles & Permissions granulaires",
    description:
      "Contrôle fin des accès par membre d'équipe. Définition de rôles personnalisés avec permissions spécifiques par ressource.",
    status: "planned",
    priority: "p0",
    category: "Security",
    target_date: "2025-02-28",
    labels: [{ name: "SECURITY", color: "#ef4444" }],
    comments_count: 15,
    votes_count: 210,
    position: 2,
    created_at: "2024-09-15T10:00:00Z",
    updated_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: "item-005",
    project_id: "proj-001",
    title: "Export PDF des rapports",
    description:
      "Générer des rapports PDF professionnels de la roadmap pour les présentations client et réunions du board.",
    status: "planned",
    priority: "p2",
    category: "Reporting",
    target_date: "2025-03-15",
    labels: [{ name: "FEATURE", color: "#10b981" }],
    comments_count: 3,
    votes_count: 56,
    position: 3,
    created_at: "2024-11-01T10:00:00Z",
    updated_at: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  // Completed
  {
    id: "item-006",
    project_id: "proj-001",
    title: "Application iOS native",
    description:
      "Application mobile native pour iOS avec support offline et notifications push.",
    status: "completed",
    priority: "p1",
    category: "Mobile",
    target_date: "2024-12-01",
    labels: [{ name: "MOBILE", color: "#10b981" }],
    comments_count: 20,
    votes_count: 342,
    position: 1,
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z",
  },
  {
    id: "item-007",
    project_id: "proj-001",
    title: "Dashboard Analytics",
    description:
      "Graphiques et métriques visuels pour suivre l'usage des features et la performance produit.",
    status: "completed",
    priority: "p2",
    category: "Analytics",
    target_date: "2024-11-15",
    labels: [{ name: "ANALYTICS", color: "#06b6d4" }],
    comments_count: 7,
    votes_count: 56,
    position: 2,
    created_at: "2024-07-15T10:00:00Z",
    updated_at: "2024-11-15T10:00:00Z",
  },
];

// ============================================
// Feedbacks
// ============================================

export type DemoFeedback = {
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

export const demoFeedbacks: DemoFeedback[] = [
  {
    id: "fb-001",
    title: "Mode sombre",
    description:
      "Ce serait super d'avoir un mode sombre pour les sessions nocturnes. Le fond blanc est un peu trop lumineux en conditions de faible éclairage. Beaucoup d'entre nous travaillent tard le soir.",
    status: "planned",
    category: "UX Improvements",
    votes: 124,
    author: { id: "ext-1", name: "Sarah Jenkins", email: "sarah@example.com" },
    created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    roadmap_item_id: "item-001",
  },
  {
    id: "fb-002",
    title: "Intégration Slack",
    description:
      "On utilise Slack pour tout dans notre équipe. Ce serait très utile d'avoir des notifications sur les nouveaux items de roadmap directement dans notre channel dédié.",
    status: "under_review",
    category: "Integrations",
    votes: 89,
    author: { id: "ext-2", name: "Mike Chen", email: "mike@example.com" },
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
  },
  {
    id: "fb-003",
    title: "Export en PDF",
    description:
      "Les clients demandent parfois une copie physique de la roadmap pour les réunions du board. Un simple export PDF de la vue actuelle serait suffisant.",
    status: "open",
    category: "Reporting",
    votes: 45,
    author: { id: "ext-3", name: "Emily Watson", email: "emily@example.com" },
    created_at: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
  },
  {
    id: "fb-004",
    title: "API Webhooks",
    description:
      "Besoin de webhooks pour déclencher des actions dans notre système quand un item de roadmap change de status. Essentiel pour notre workflow d'intégration continue.",
    status: "open",
    category: "Developer Tools",
    votes: 67,
    author: { id: "ext-4", name: "David Park", email: "david@example.com" },
    created_at: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
  },
  {
    id: "fb-005",
    title: "Templates de roadmap",
    description:
      "Pouvoir partir de templates prédéfinis (SaaS, E-commerce, Mobile App) pour démarrer plus vite un nouveau projet.",
    status: "open",
    category: "UX Improvements",
    votes: 34,
    author: { id: "ext-5", name: "Lisa Thompson" },
    created_at: new Date(Date.now() - 14 * 24 * 3600000).toISOString(),
  },
];

// ============================================
// Changelogs
// ============================================

export type DemoChangelog = {
  id: string;
  version: string;
  title: string;
  description: string;
  type: "major" | "improvement" | "bugfix";
  highlights: string[];
  tags: string[];
  published_at: string;
  is_draft: boolean;
  items?: string[]; // IDs des items roadmap inclus
};

export const demoChangelogs: DemoChangelog[] = [
  {
    id: "cl-001",
    version: "v3.0.0",
    title: "Le Nouveau Dashboard",
    description:
      "Nous avons complètement revu le dashboard pour vous donner de meilleurs insights en un coup d'œil. La nouvelle mise en page est entièrement personnalisable et supporte nativement le mode sombre.",
    type: "major",
    highlights: [
      "Données temps réel : Les métriques se mettent à jour instantanément via websockets.",
      "Widgets personnalisés : Glissez-déposez parmi 20+ types de widgets.",
      "Options d'export : Téléchargez les rapports en PDF, CSV ou PNG.",
    ],
    tags: ["dashboard", "analytics", "ui"],
    published_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    is_draft: false,
    items: ["item-007"],
  },
  {
    id: "cl-002",
    version: "v2.9.1",
    title: "Boost de Performance API",
    description:
      "Nous avons optimisé nos endpoints API principaux, résultant en une réduction de 40% de la latence pour les requêtes de données. Cette mise à jour cible spécifiquement les endpoints `/v1/users` et `/v1/projects`.",
    type: "improvement",
    highlights: [],
    tags: ["api", "performance", "backend"],
    published_at: new Date(Date.now() - 14 * 24 * 3600000).toISOString(),
    is_draft: false,
  },
  {
    id: "cl-003",
    version: "v2.9.0",
    title: "Corrections de bugs",
    description: "Plusieurs corrections de bugs signalés par la communauté.",
    type: "bugfix",
    highlights: [
      "Correction du timeout de login sur Safari.",
      "Résolution du bug de rendu des graphiques sur mobile.",
      "Correction d'une typo dans les notifications email.",
      "Correction du problème de z-index des modales.",
    ],
    tags: ["bugfix", "stability"],
    published_at: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
    is_draft: false,
  },
  {
    id: "cl-004",
    version: "v2.8.0",
    title: "Application iOS",
    description:
      "Lancement de notre application native iOS ! Gérez vos roadmaps en déplacement avec une expérience optimisée pour mobile.",
    type: "major",
    highlights: [
      "Interface native iOS avec support Dark Mode",
      "Notifications push en temps réel",
      "Mode hors-ligne avec synchronisation automatique",
    ],
    tags: ["ios", "mobile", "app"],
    published_at: new Date(Date.now() - 45 * 24 * 3600000).toISOString(),
    is_draft: false,
    items: ["item-006"],
  },
];

// ============================================
// Commentaires
// ============================================

export const demoComments: Comment[] = [
  {
    id: "comment-001",
    item_id: "item-001",
    user_id: "u2",
    content:
      "Super initiative ! J'ai hâte de pouvoir utiliser le mode sombre. Est-ce que ça inclura aussi les emails ?",
    created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    profile: {
      id: "u2",
      name: "Sarah Jenkins",
      avatar_url: "",
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "comment-002",
    item_id: "item-001",
    user_id: "u3",
    content:
      "Pour info, j'ai commencé à travailler sur les variables CSS. On utilise oklch pour une meilleure cohérence des couleurs.",
    created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    profile: {
      id: "u3",
      name: "Mike Chen",
      avatar_url: "",
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "comment-003",
    item_id: "item-001",
    user_id: "demo-user-001",
    content:
      "@Sarah Oui, les templates d'emails auront aussi une version dark. @Mike Super, merci pour l'update !",
    created_at: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    profile: {
      id: "demo-user-001",
      name: "Alex Demo",
      avatar_url: "",
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "comment-004",
    item_id: "item-003",
    user_id: "u4",
    content:
      "Est-ce qu'on pourra choisir quels événements déclenchent une notification Slack ?",
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    profile: {
      id: "u4",
      name: "Emily Watson",
      avatar_url: "",
      created_at: "",
      updated_at: "",
    },
  },
];

// ============================================
// Activités récentes
// ============================================

export const demoActivities: Activity[] = [
  {
    id: "act-001",
    type: "vote",
    user_name: "Sarah J.",
    item_title: "Mode sombre",
    item_id: "item-001",
    created_at: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: "act-002",
    type: "comment",
    user_name: "Mike T.",
    item_title: "API v2 Endpoints",
    item_id: "item-002",
    content: "La migration vers REST est presque terminée !",
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "act-003",
    type: "changelog",
    user_name: "Alex (Vous)",
    item_title: "v3.0.0 - Le Nouveau Dashboard",
    item_id: "cl-001",
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: "act-004",
    type: "item_created",
    user_name: "Emily W.",
    item_title: "Export PDF des rapports",
    item_id: "item-005",
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "act-005",
    type: "vote",
    user_name: "David P.",
    item_title: "Rôles & Permissions",
    item_id: "item-004",
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
];

// ============================================
// Statistiques Dashboard
// ============================================

export const demoStats = {
  total_feedback: 1240,
  feedback_change: 12,
  active_items: 8,
  items_in_progress: 2,
  changelog_subscribers: 450,
  subscribers_change: 5,
};

// ============================================
// Limites du plan
// ============================================

export const demoPlanLimits: PlanLimits = {
  tier: "pro",
  projects_count: 3,
  projects_limit: 10,
  can_create_project: true,
};

// ============================================
// Trending / Top demandes
// ============================================

export const demoTrendingItems = [
  { id: "item-001", title: "Mode sombre", category: "UI Customization", votes: 128 },
  { id: "item-004", title: "Rôles & Permissions", category: "Security", votes: 210 },
  { id: "item-003", title: "Intégration Slack", category: "Integrations", votes: 89 },
  { id: "item-005", title: "Export PDF", category: "Reporting", votes: 56 },
];

// ============================================
// Catégories disponibles
// ============================================

export const demoCategories = [
  "UX Improvements",
  "Integrations",
  "Reporting",
  "Developer Tools",
  "Security",
  "Mobile",
  "Analytics",
  "Backend",
];

export const demoPriorities = [
  { value: "p0", label: "P0 - Critique", color: "#ef4444" },
  { value: "p1", label: "P1 - Haute", color: "#f97316" },
  { value: "p2", label: "P2 - Moyenne", color: "#eab308" },
  { value: "p3", label: "P3 - Basse", color: "#22c55e" },
];

export const demoStatuses = [
  { value: "planned", label: "Planifié", color: "#6b7280" },
  { value: "in_progress", label: "En cours", color: "#3b82f6" },
  { value: "completed", label: "Terminé", color: "#22c55e" },
];

