
import { cn } from "@/lib/utils";
import { getAnimation } from "@/utils/animations";
import { type SkeletonTableProps } from "./types";

export function SkeletonTable({ 
  rows = 5, 
  columns = 4, 
  className,
  animation = 'shimmer',
  ...props 
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full space-y-4", className)} {...props}>
      {/* Header */}
      <div className="flex gap-4 pb-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`header-${i}`}
            className={cn(
              "h-6 bg-muted/20 dark:bg-muted/10 rounded-md flex-1",
              getAnimation(animation)
            )}
          />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className={cn(
                "h-4 bg-muted/20 dark:bg-muted/10 rounded-md flex-1",
                getAnimation(animation)
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
