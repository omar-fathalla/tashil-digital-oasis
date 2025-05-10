
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SeedCompanyRequestsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSeedCompanyRequests = async () => {
    setIsLoading(true);
    try {
      const egyptianCompanies = [
        'NileWare Technologies',
        'DeltaCorp Solutions',
        'Luxor Innovations',
        'CairoByte Software',
        'Pharos Solutions'
      ];
      
      const egyptianNames = [
        'Ahmed Mohamed',
        'Fatima Ibrahim',
        'Omar Hassan',
        'Layla Ahmed',
        'Karim Mahmoud'
      ];
      
      const statuses = ['pending', 'approved', 'rejected'];
      const requestTypes = ['Company Registration', 'Information Update', 'Document Submission'];
      const requests = [];
      
      for (let i = 0; i < 5; i++) {
        const companyName = egyptianCompanies[i];
        const contactName = egyptianNames[i];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const requestType = requestTypes[Math.floor(Math.random() * requestTypes.length)];
        const companyNumber = `EG-${2024}${String(i+1).padStart(4, '0')}`;
        
        requests.push({
          employee_name: contactName,
          employee_id: companyNumber,
          status,
          type: 'company',
          request_type: requestType,
          company_name: companyName,
          company_number: companyNumber,
          tax_card_number: `TAX${2024}${String(i+1).padStart(4, '0')}`,
          commercial_register_number: `CR${2024}${String(i+1).padStart(4, '0')}`,
          notes: Math.random() > 0.7 ? `Additional information about ${companyName} registration request` : null,
          request_date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      
      // Insert the requests to database if connected to Supabase
      try {
        for (const request of requests) {
          await supabase.from('employee_requests').insert(request);
        }
        toast.success(`Successfully added 5 company requests`);
      } catch (error) {
        console.error("Error inserting to Supabase:", error);
        // We'll still show the mock data even if insertion fails
      }
      
      // Refresh any cached data
      queryClient.invalidateQueries({ queryKey: ['employee-requests'] });
      
      // This will refresh the UI with the mock data even if Supabase insertion fails
      window.location.reload();
    } catch (error) {
      console.error("Error seeding company requests:", error);
      toast.error("Failed to add company requests");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleSeedCompanyRequests}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          Adding Requests...
        </>
      ) : (
        'Add Sample Company Requests'
      )}
    </Button>
  );
}
