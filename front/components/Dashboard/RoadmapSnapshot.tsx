"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { RoadmapItem } from "@/types";

type RoadmapSnapshotProps = {
  inProgressItems: RoadmapItem[];
  plannedItems: RoadmapItem[];
};

const labelColors: Record<string, string> = {
  Core: "bg-red-100 text-red-700 border-red-200",
  "UI/UX": "bg-orange-100 text-orange-700 border-orange-200",
  API: "bg-blue-100 text-blue-700 border-blue-200",
  Integration: "bg-purple-100 text-purple-700 border-purple-200",
  Security: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

function ItemCard({ item }: { item: RoadmapItem }) {
  const labelColor =
    item.labels?.[0]?.name && labelColors[item.labels[0].name]
      ? labelColors[item.labels[0].name]
      : "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow cursor-pointer">
      {item.labels?.[0] && (
        <Badge variant="outline" className={`mb-2 text-[10px] ${labelColor}`}>
          {item.labels[0].name}
        </Badge>
      )}
      <p className="font-medium text-sm">{item.title}</p>
    </div>
  );
}

export function RoadmapSnapshot({
  inProgressItems,
  plannedItems,
}: RoadmapSnapshotProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Roadmap Snapshot</CardTitle>
        <Link
          href="/app/roadmap"
          className="text-sm text-primary hover:underline font-medium"
        >
          Voir le board
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* In Progress */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                En cours
              </span>
            </div>
            <div className="space-y-2">
              {inProgressItems.length > 0 ? (
                inProgressItems.slice(0, 2).map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Aucun item en cours
                </p>
              )}
            </div>
          </div>

          {/* Planned */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Planifié
              </span>
            </div>
            <div className="space-y-2">
              {plannedItems.length > 0 ? (
                plannedItems.slice(0, 2).map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Aucun item planifié
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

