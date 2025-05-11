
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export function SeedCompanyDataButton() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const handleSeedCompanyData = async () => {
    setIsLoading(true);
    try {
      // Check for active session
      if (!user?.id) {
        toast.error("You must be logged in to add sample companies");
        return;
      }
      
      // Get the current session for auth token
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      
      if (!accessToken) {
        toast.error("Authentication error. Please log in again.");
        return;
      }
      
      // Call the Edge Function to seed companies
      const { data, error } = await supabase.functions.invoke('insert-sample-companies', {
        method: 'POST',
      });
      
      if (error) {
        console.error("Error calling seed companies function:", error);
        toast.error(`Failed to add sample companies: ${error.message || "Unknown error"}`);
        return;
      }
      
      if (data.success) {
        // Refresh the companies data
        queryClient.invalidateQueries({ queryKey: ['companies'] });
        toast.success(data.message || "Sample companies added successfully");
      } else {
        toast.info(data.message || "No new companies were added");
      }
      
    } catch (error) {
      console.error("Error seeding company data:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleSeedCompanyData}
      disabled={isLoading || !user?.id}
    >
      {isLoading ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          Adding Companies...
        </>
      ) : (
        'Add Sample Companies'
      )}
    </Button>
  );
}
