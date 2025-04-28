
import { cn } from "@/lib/utils";
import { shimmer } from "@/utils/animations";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted/20 dark:bg-muted/10",
        shimmer,
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
