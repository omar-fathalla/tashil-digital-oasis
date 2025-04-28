
import { cn } from "@/lib/utils";
import { type AnimationType, getAnimation } from "@/utils/animations";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: AnimationType;
}

function Skeleton({
  className,
  animation = 'shimmer',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted/20 dark:bg-muted/10",
        getAnimation(animation),
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
