import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp } from "lucide-react";
import Link from "next/link";

type TrendingItem = {
  id: string;
  title: string;
  category: string;
  votes: number;
};

type TrendingRequestsProps = {
  items: TrendingItem[];
};

export function TrendingRequests({ items }: TrendingRequestsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Top Demandes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length > 0 ? (
          <>
            {items.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center min-w-[40px] py-1 px-2 rounded border bg-card">
                  <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-semibold">{item.votes}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
              </div>
            ))}
            <Link
              href="/app/feedback"
              className="block text-center text-sm text-primary hover:underline font-medium pt-2"
            >
              Voir toutes les demandes
            </Link>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucune demande pour le moment
          </p>
        )}
      </CardContent>
    </Card>
  );
}

