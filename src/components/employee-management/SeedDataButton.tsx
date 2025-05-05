
import { Button } from "@/components/ui/button";
import { seedEmployeeData } from "@/utils/seedEmployeeData";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function SeedDataButton() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSeedData = async () => {
    console.log("User manually triggered seedEmployeeData() function");
    setIsLoading(true);
    try {
      await seedEmployeeData();
      // Invalidate the employees query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleSeedData}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          Adding Employees...
        </>
      ) : (
        'Add Sample Employees'
      )}
    </Button>
  );
}
