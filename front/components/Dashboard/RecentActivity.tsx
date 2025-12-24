import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageSquare, Rocket } from "lucide-react";
import type { Activity } from "@/types";

type RecentActivityProps = {
  activities: Activity[];
};

const activityIcons = {
  vote: { icon: ThumbsUp, bg: "bg-blue-100", color: "text-blue-600" },
  comment: { icon: MessageSquare, bg: "bg-amber-100", color: "text-amber-600" },
  changelog: { icon: Rocket, bg: "bg-emerald-100", color: "text-emerald-600" },
  item_created: { icon: Rocket, bg: "bg-purple-100", color: "text-purple-600" },
  item_updated: { icon: Rocket, bg: "bg-gray-100", color: "text-gray-600" },
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString("fr-FR");
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Activité récente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const { icon: Icon, bg, color } = activityIcons[activity.type] || activityIcons.item_updated;
            
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className={`h-9 w-9 ${bg}`}>
                  <AvatarFallback className={`${bg} ${color}`}>
                    <Icon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user_name}</span>
                    {activity.type === "vote" && " a voté pour "}
                    {activity.type === "comment" && " a commenté sur "}
                    {activity.type === "changelog" && " a publié "}
                    {activity.item_title && (
                      <span className="text-primary font-medium">
                        {activity.item_title}
                      </span>
                    )}
                  </p>
                  {activity.content && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      &quot;{activity.content}&quot;
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucune activité récente
          </p>
        )}
      </CardContent>
    </Card>
  );
}

