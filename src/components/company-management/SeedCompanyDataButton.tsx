
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { seedSampleCompanies } from "@/utils/api/companyApi";

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
      
      // Call the API function to seed companies
      const success = await seedSampleCompanies();
      
      if (success) {
        // Refresh the companies data
        queryClient.invalidateQueries({ queryKey: ['companies'] });
      }
    } catch (error) {
      console.error("Error seeding company data:", error);
      toast.error("Failed to add sample companies");
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
