
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PositionType } from "../types/position";

export function usePositionTypes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rawData = [], isLoading } = useQuery({
    queryKey: ['system-settings', 'position-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('category', 'form_fields')
        .eq('key', 'position_types')
        .single();

      if (error) {
        console.error('Error fetching position types:', error);
        return [] as PositionType[];
      }
      
      if (!data?.value) {
        return [] as PositionType[];
      }

      if (Array.isArray(data.value)) {
        return (data.value as any[]).map(item => ({
          id: typeof item.id === 'string' ? item.id : String(item.id),
          name: typeof item.name === 'string' ? item.name : String(item.name)
        })) as PositionType[];
      }
      
      if (typeof data.value === 'string') {
        try {
          const parsed = JSON.parse(data.value);
          if (Array.isArray(parsed)) {
            return parsed.map(item => ({
              id: typeof item.id === 'string' ? item.id : String(item.id),
              name: typeof item.name === 'string' ? item.name : String(item.name)
            })) as PositionType[];
          }
        } catch (e) {
          console.error('Failed to parse position data string:', e);
        }
      }
      
      return [] as PositionType[];
    }
  });

  const positions = Array.isArray(rawData) ? rawData : [];

  const updatePositionTypes = useMutation({
    mutationFn: async (newPositions: PositionType[]) => {
      if (!Array.isArray(newPositions)) {
        throw new Error("Invalid positions data format");
      }
      
      const { data, error } = await supabase.rpc('update_setting', {
        p_category: 'form_fields',
        p_key: 'position_types',
        p_value: JSON.stringify(newPositions)
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings', 'position-types'] });
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
