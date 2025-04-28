
import { cn } from "@/lib/utils";
import { shimmer } from "@/utils/animations";

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: boolean;
  rows?: number;
}

export function SkeletonCard({ header = true, rows = 3, className, ...props }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 space-y-4",
        shimmer,
        className
      )}
      {...props}
    >
      {header && (
        <div className="space-y-2">
          <div className="h-5 w-1/3 bg-muted/20 dark:bg-muted/10 rounded-md" />
          <div className="h-4 w-1/2 bg-muted/20 dark:bg-muted/10 rounded-md" />
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 bg-muted/20 dark:bg-muted/10 rounded-md w-full" />
        ))}
      </div>
    </div>
  );
}
