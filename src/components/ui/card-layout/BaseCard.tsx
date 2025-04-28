
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface BaseCardProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  children: React.ReactNode;
  className?: string;
}

export function BaseCard({
  title,
  description,
  isLoading,
  error,
  children,
  className,
}: BaseCardProps) {
  if (error) {
    return (
      <Card className="border-none bg-destructive/10 shadow-lg transition-all duration-200 ease-in-out will-change-transform">
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
      className={`
        border-none shadow-lg 
        transition-all duration-200 ease-in-out 
        will-change-transform
        hover:shadow-xl hover:scale-[1.02]
        hover:bg-accent/5
        active:scale-[0.98]
        ${className}
      `}
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
