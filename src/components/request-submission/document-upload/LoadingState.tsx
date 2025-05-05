
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoadingStateProps {
  isLoading: boolean;
  error: string | null;
}

export const DocumentLoadingState = ({ isLoading, error }: LoadingStateProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return null;
};
