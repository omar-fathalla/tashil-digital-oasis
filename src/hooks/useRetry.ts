
type RetryConfig = {
  maxAttempts?: number;
  delayMs?: number;
};

export function useRetry() {
  const retry = async <T>(
    operation: () => Promise<T>,
    { maxAttempts = 3, delayMs = 2000 }: RetryConfig = {}
  ): Promise<T> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        // Check if error is permanent (like duplicate email)
        if (error.message?.includes('already registered')) {
          throw error; // Don't retry permanent errors
        }

        // On last attempt, throw the error
        if (attempt === maxAttempts) {
          throw new Error('Failed after multiple attempts: ' + error.message);
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    // This should never happen due to the throw above, but TypeScript needs it
    throw lastError;
  };

  return { retry };
}
