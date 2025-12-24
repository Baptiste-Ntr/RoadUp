import { Map } from "lucide-react";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/app" className="flex items-center gap-2.5 group">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:shadow-md transition-shadow">
        <Map className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight">RoadUp</span>
        <span className="text-[10px] text-muted-foreground -mt-1">
          Roadmap & Feedback
        </span>
      </div>
    </Link>
  );
};
