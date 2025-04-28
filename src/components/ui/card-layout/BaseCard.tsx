
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseCardProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "secondary" | "subtle";
}

const cardVariants = {
  default: `
    hover:shadow-xl hover:scale-[1.02]
    hover:bg-accent/5
    active:scale-[0.98]
  `,
  primary: `
    hover:shadow-xl hover:scale-[1.03]
    hover:bg-primary/5
    active:scale-[0.97]
  `,
  secondary: `
    hover:shadow-lg hover:scale-[1.01]
    hover:bg-secondary/5
    active:scale-[0.99]
  `,
  subtle: `
    hover:shadow-md hover:scale-[1.005]
    hover:bg-accent/3
    active:scale-[0.995]
  `
};

export function BaseCard({
  title,
  description,
  isLoading,
  error,
  children,
  className,
  variant = "default"
}: BaseCardProps) {
  if (error) {
    return (
      <Card 
        className={cn(
          "border-none bg-destructive/10",
          "shadow-lg transition-all duration-200 ease-in-out will-change-transform",
          "hover:shadow-xl hover:scale-[1.01] hover:bg-destructive/15"
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Error
          </CardTitle>
          <CardDescription className="text-destructive/90">
            {error.message || "An error occurred while loading the content"}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "border-none shadow-lg",
        "transition-all duration-200 ease-in-out will-change-transform",
        cardVariants[variant],
        className
      )}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={isLoading ? "animate-pulse" : ""}>
        {children}
      </CardContent>
    </Card>
  );
}
