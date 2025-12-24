"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useDemoContext } from "@/contexts/DemoContext";
import { toast } from "sonner";
import {
  User,
  CreditCard,
  Receipt,
  Bell,
  Shield,
  Trash2,
  Download,
  Check,
} from "lucide-react";

type SettingsTab = "profile" | "subscription" | "billing" | "notifications" | "security";

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profil", icon: User },
  { id: "subscription", label: "Abonnement", icon: CreditCard },
  { id: "billing", label: "Facturation", icon: Receipt },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Sécurité", icon: Shield },
];

const mockInvoices = [
  { id: "INV-2024-001", date: "24 Déc 2024", amount: "29,00 €", status: "Payé" },
  { id: "INV-2024-002", date: "24 Nov 2024", amount: "29,00 €", status: "Payé" },
  { id: "INV-2024-003", date: "24 Oct 2024", amount: "29,00 €", status: "Payé" },
];

export default function DemoSettingsPage() {
  const { user, planLimits } = useDemoContext();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [formData, setFormData] = useState({
    firstName: user.name.split(" ")[0] || "Alex",
    lastName: user.name.split(" ")[1] || "Demo",
    email: "alex.demo@company.com",
    bio: "Product Manager passionné par la création de super expériences utilisateur.",
  });

  const [notifications, setNotifications] = useState({
    productUpdates: true,
    securityAlerts: true,
    newsletter: false,
  });

  const handleSave = () => {
    toast.success("Modifications enregistrées !");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres du compte</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles, facturation et préférences.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <nav className="w-48 flex-shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="text-lg bg-primary/10 text-primary">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{formData.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          Changer l&apos;avatar
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <p className="text-xs text-muted-foreground">
                      Brève description de votre profil.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Annuler</Button>
                    <Button onClick={handleSave}>Sauvegarder</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Plan d&apos;abonnement</CardTitle>
                    <CardDescription>Gérez votre abonnement actuel</CardDescription>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    ACTIF
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start justify-between p-4 rounded-lg border bg-muted/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-primary capitalize">
                          {planLimits.tier} Plan
                        </h3>
                        {planLimits.tier === "pro" && (
                          <Badge variant="outline">Recommandé</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Parfait pour les équipes en croissance.
                      </p>
                      <div className="mt-4 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Projets utilisés</span>
                          <span className="font-medium">
                            {planLimits.projects_count} / {planLimits.projects_limit}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${(planLimits.projects_count / planLimits.projects_limit) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">
                        {planLimits.tier === "free" ? "0€" : "29€"}
                        <span className="text-sm font-normal text-muted-foreground">
                          /mois
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h4 className="font-medium">Méthode de paiement</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Visa se terminant par 4242</span>
                        <span className="text-xs text-muted-foreground">
                          Expire 12/2025
                        </span>
                      </div>
                    </div>
                    <Button variant="link" className="text-primary">
                      Modifier
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1">Upgrade Plan</Button>
                    <Button variant="outline" className="flex-1">
                      Annuler l&apos;abonnement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historique de facturation</CardTitle>
                  <CardDescription>
                    Consultez et téléchargez vos factures passées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                            Facture
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                            Montant
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                            Statut
                          </th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {mockInvoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-muted/30">
                            <td className="py-3 px-4 font-medium">{invoice.id}</td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {invoice.date}
                            </td>
                            <td className="py-3 px-4">{invoice.amount}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className="bg-emerald-100 text-emerald-700 border-emerald-200"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                {invoice.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notifications</CardTitle>
                  <CardDescription>
                    Choisissez comment vous souhaitez être notifié
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Mises à jour produit</p>
                      <p className="text-sm text-muted-foreground">
                        Recevez des emails sur les nouvelles features.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.productUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, productUpdates: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Alertes de sécurité</p>
                      <p className="text-sm text-muted-foreground">
                        Soyez notifié des connexions suspectes.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.securityAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, securityAlerts: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Newsletter marketing</p>
                      <p className="text-sm text-muted-foreground">
                        Recevez des conseils et tutoriels.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newsletter}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newsletter: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Changer le mot de passe</Label>
                    <div className="flex gap-3">
                      <Input type="password" placeholder="Mot de passe actuel" />
                      <Input type="password" placeholder="Nouveau mot de passe" />
                      <Button onClick={() => toast.success("Mot de passe mis à jour !")}>
                        Mettre à jour
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Zone de danger</CardTitle>
                  <CardDescription>
                    Actions irréversibles sur votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div>
                      <p className="font-medium text-destructive">Supprimer le compte</p>
                      <p className="text-sm text-muted-foreground">
                        Cette action est irréversible.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => toast.error("Action bloquée en mode démo")}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

