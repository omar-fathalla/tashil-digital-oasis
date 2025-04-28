
import { useState, useEffect } from "react";

export function useLoadingState<T>(
  data: T | undefined | null,
  delay: number = 400
): boolean {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data === undefined || data === null) {
      setIsLoading(true);
      return;
    }

    // Add minimum delay to prevent flash of loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [data, delay]);

  return isLoading;
}
