
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PositionType } from "../types/position";

export function usePositionTypes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: positions = [], isLoading } = useQuery({
    queryKey: ['position-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('position_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching position types:', error);
        return [];
      }

      return data.map(pos => ({
        id: pos.id,
        name: pos.name
      }));
    }
  });

  const updatePositionTypes = useMutation({
    mutationFn: async (newPositions: PositionType[]) => {
      // First, get all existing positions
      const { data: existingPositions } = await supabase
        .from('position_types')
        .select('id, name');

      // Delete removed positions
      const existingIds = existingPositions?.map(p => p.id) || [];
      const newIds = newPositions.map(p => p.id);
      const toDelete = existingIds.filter(id => !newIds.includes(id));

      if (toDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('position_types')
          .delete()
          .in('id', toDelete);

        if (deleteError) throw deleteError;
      }

      // Update or insert positions
      for (const position of newPositions) {
        if (position.id && existingIds.includes(position.id)) {
          // Update existing position
          const { error: updateError } = await supabase
            .from('position_types')
            .update({ name: position.name })
            .eq('id', position.id);

          if (updateError) throw updateError;
        } else {
          // Insert new position
          const { error: insertError } = await supabase
            .from('position_types')
            .insert({ name: position.name });

          if (insertError) throw insertError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['position-types'] });
      toast({
        title: "Success",
        description: "Position types updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating position types:', error);
      toast({
        title: "Error",
        description: "Failed to update position types",
        variant: "destructive",
      });
    }
  });

  return {
    positions,
    isLoading,
    updatePositionTypes,
  };
}
