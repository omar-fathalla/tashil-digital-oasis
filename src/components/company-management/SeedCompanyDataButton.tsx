
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function SeedCompanyDataButton() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSeedCompanyData = async () => {
    setIsLoading(true);
    try {
      // Egyptian company data with realistic information
      const egyptianCompanies = [
        {
          company_name: 'NileWare Technologies',
          address: '15 Tahrir Square, Cairo',
          register_number: 'REG-1001',
          tax_card_number: 'TAX-5823',
          company_number: 'EGY-7124',
          created_at: new Date('2025-01-15').toISOString(),
          updated_at: new Date('2025-01-15').toISOString(),
          is_dummy: false,
          is_archived: false
        },
        {
          company_name: 'CairoByte Software',
          address: '27 El-Giza Street, Giza',
          register_number: 'REG-1002',
          tax_card_number: 'TAX-6134',
          company_number: 'EGY-8235',
          created_at: new Date('2025-02-03').toISOString(),
          updated_at: new Date('2025-02-03').toISOString(),
          is_dummy: false,
          is_archived: false
        },
        {
          company_name: 'Luxor Innovations',
          address: '8 Valley of Kings Road, Luxor',
          register_number: 'REG-1003',
          tax_card_number: 'TAX-9472',
          company_number: 'EGY-3469',
          created_at: new Date('2025-02-22').toISOString(),
          updated_at: new Date('2025-02-22').toISOString(),
          is_dummy: false,
          is_archived: false
        },
        {
          company_name: 'DeltaCorp Solutions',
          address: '41 Corniche Road, Alexandria',
          register_number: 'REG-1004',
          tax_card_number: 'TAX-2857',
          company_number: 'EGY-5762',
          created_at: new Date('2025-03-10').toISOString(),
          updated_at: new Date('2025-03-10').toISOString(),
          is_dummy: false,
          is_archived: false
        },
        {
          company_name: 'Pharos Solutions',
          address: '12 El-Nasr Street, Aswan',
          register_number: 'REG-1005',
          tax_card_number: 'TAX-1498',
          company_number: 'EGY-9213',
          created_at: new Date('2025-04-05').toISOString(),
          updated_at: new Date('2025-04-05').toISOString(),
          is_dummy: false,
          is_archived: false
        }
      ];
      
      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      if (!userId) {
        toast.error("You must be logged in to add sample companies");
        return;
      }
      
      // Add user_id to each company object
      const companiesWithUserId = egyptianCompanies.map(company => ({
        ...company,
        user_id: userId
      }));
      
      // Insert the companies into the database
      for (const company of companiesWithUserId) {
        const { error } = await supabase.from('companies').insert(company);
        if (error) {
          console.error("Error inserting company:", error);
          if (error.message.includes('duplicate key value')) {
            toast.error(`Company with register number ${company.register_number} already exists`);
          } else {
            throw error;
          }
        }
      }
      
      // Refresh any cached data
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      
      toast.success("Successfully added sample Egyptian companies");
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
