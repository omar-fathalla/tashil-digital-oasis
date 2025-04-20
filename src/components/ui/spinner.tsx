
import { cn } from "@/lib/utils";

export const Spinner = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={cn("animate-spin rounded-full border-4 border-t-primary h-8 w-8", className)} 
      {...props}
    />
  );
};
