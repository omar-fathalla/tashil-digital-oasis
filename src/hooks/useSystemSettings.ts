
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type SystemSetting = {
  id: string;
  category: string;
  key: string;
  value: any;
  updated_at: string;
};

export function useSystemSettings(category: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['system-settings', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', category);

      if (error) {
        console.error('Error fetching settings:', error);
        return [];
      }

      return data;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Record<string, any>) => {
      // Create an array of upsert operations for each setting
      const updates = Object.entries(newSettings).map(([key, value]) => ({
        category,
        key,
        value,
      }));

      // Log the updates for debugging
      console.log('Updating settings with:', updates);
      
      // Upsert each setting
      const { error } = await supabase
        .from('system_settings')
        .upsert(
          updates.map(update => ({
            category: update.category,
            key: update.key,
            value: update.value
          })),
          { onConflict: 'category,key' }
        );

      if (error) {
        console.error('Error updating settings:', error);
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate and refetch queries after successful mutation
      queryClient.invalidateQueries({ queryKey: ['system-settings', category] });
      
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
}
