
import { cn } from "@/lib/utils";
import { shimmer } from "@/utils/animations";

interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 1, className, ...props }: SkeletonTextProps) {
  return (
    <div className="space-y-2" {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-muted/20 dark:bg-muted/10 rounded-md",
            shimmer,
            className,
            // Vary the widths for a more natural look
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}
