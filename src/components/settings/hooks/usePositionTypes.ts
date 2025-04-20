
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePositionTypes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: positions = [], isLoading } = useQuery({
    queryKey: ['position-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("position_types")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const addPosition = async (position: { name: string }) => {
    const { error } = await supabase
      .from("position_types")
      .insert({ name: position.name });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add position type",
        variant: "destructive",
      });
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ['position-types'] });
  };

  const updatePosition = async (
    id: string,
    field: string,
    value: string | boolean
  ) => {
    const { error } = await supabase
      .from("position_types")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update position",
        variant: "destructive",
      });
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ['position-types'] });
  };

  const deletePosition = async (id: string) => {
    const { error } = await supabase
      .from("position_types")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete position",
        variant: "destructive",
      });
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ['position-types'] });
  };

  return {
    positions,
    isLoading,
    addPosition,
    updatePosition,
    deletePosition,
  };
};
