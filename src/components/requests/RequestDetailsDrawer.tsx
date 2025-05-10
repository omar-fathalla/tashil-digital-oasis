import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { ensureDemoData } from "@/utils/seedDemoData";

export function SeedCompanyDataButton() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSeedCompanyData = async () => {
    setIsLoading(true);
    try {
      await ensureDemoData();
      
      // Refresh any cached data
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      
      toast.success("Successfully added company data");
    } catch (error) {
      console.error("Error seeding company data:", error);
      toast.error("Failed to add company data");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleSeedCompanyData}
      disabled={isLoading}
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
