
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface IDCardStatus {
  id: string;
  employee_id: string;
  full_name: string;
  status: "approved" | "id_generated" | "id_printed" | "id_collected";
  generated_at?: string;
  printed_at?: string;
  collected_at?: string;
  collector_name?: string;
  photo_url?: string;
}

export const useDigitalIDCards = () => {
  const queryClient = useQueryClient();

  const { data: idCards = [], isLoading } = useQuery({
    queryKey: ["digital-id-cards"],
    queryFn: async () => {
      // Get all employees with status approved or higher (id_generated, id_printed, id_collected)
      const { data, error } = await supabase
        .from("employee_registrations")
        .select("*")
        .in("status", ["approved", "id_generated", "id_printed", "id_collected"])
        .order("full_name");
      
      if (error) throw error;
      return data || [];
    }
  });

  const updateCardStatus = useMutation({
    mutationFn: async ({ 
      id, 
      status,
      collectorName = null 
    }: { 
      id: string; 
      status: "id_generated" | "id_printed" | "id_collected"; 
      collectorName?: string | null;
    }) => {
      const updateData: Record<string, any> = { status };
      
      // Add timestamp based on the status
      if (status === "id_generated") {
        updateData.generated_at = new Date().toISOString();
      } else if (status === "id_printed") {
        updateData.printed = true;
        updateData.printed_at = new Date().toISOString();
      } else if (status === "id_collected") {
        updateData.collected_at = new Date().toISOString();
        if (collectorName) {
          updateData.collector_name = collectorName;
        }
      }
      
      const { error } = await supabase
        .from("employee_registrations")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-id-cards"] });
      toast.success("ID card status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update ID card status");
      console.error("Error updating ID card status:", error);
    }
  });
  
  const updateCardPhoto = useMutation({
    mutationFn: async ({ id, photoUrl }: { id: string; photoUrl: string }) => {
      const { error } = await supabase
        .from("employee_registrations")
        .update({ photo_url: photoUrl })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-id-cards"] });
      toast.success("ID card photo updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update ID card photo");
      console.error("Error updating ID card photo:", error);
    }
  });
  
  return {
    idCards,
    isLoading,
    updateCardStatus,
    updateCardPhoto
  };
};
