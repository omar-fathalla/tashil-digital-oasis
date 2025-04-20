
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Region {
  id?: string;
  name: string;
}

export const useRegions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchRegions = async () => {
    const { data, error } = await supabase
      .from("regions")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch regions",
        variant: "destructive",
      });
      throw error;
    }

    return data || [];
  };

  const { data: regions = [], isLoading } = useQuery({
    queryKey: ['regions'],
    queryFn: fetchRegions,
  });

  useEffect(() => {
    const channel = supabase
      .channel('regions_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'regions' 
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['regions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const addRegion = async (region: { name: string }) => {
    const { error } = await supabase
      .from("regions")
      .insert({ name: region.name });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add region",
        variant: "destructive",
      });
      throw error;
    }

    // Real-time will handle UI update via subscription
    toast({
      title: "Success",
      description: "Region added successfully",
    });
  };

  const updateRegion = async (
    id: string, 
    field: keyof Region, 
    value: string
  ) => {
    const { error } = await supabase
      .from("regions")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update region",
        variant: "destructive",
      });
      throw error;
    }

    // Real-time will handle UI update via subscription
    toast({
      title: "Success", 
      description: "Region updated successfully"
    });
  };

  const deleteRegion = async (id: string) => {
    const { error } = await supabase
      .from("regions")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete region",
        variant: "destructive",
      });
      throw error;
    }

    // Real-time will handle UI update via subscription
    toast({
      title: "Success",
      description: "Region deleted successfully",
    });
  };

  return {
    regions,
    isLoading,
    addRegion,
    updateRegion,
    deleteRegion,
  };
};
