import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconClassName?: string;
};

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {change !== undefined && (
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-sm font-medium",
                    isPositive && "text-emerald-600",
                    isNegative && "text-red-500",
                    !isPositive && !isNegative && "text-muted-foreground"
                  )}
                >
                  {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
                  {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
                  {isPositive && "+"}
                  {change}%
                </span>
              )}
            </div>
            {changeLabel && (
              <p className="text-xs text-muted-foreground">{changeLabel}</p>
            )}
          </div>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              iconClassName || "bg-primary/10 text-primary"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

