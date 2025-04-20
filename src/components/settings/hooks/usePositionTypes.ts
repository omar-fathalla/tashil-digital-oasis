
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePositionTypes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [positions, setPositions] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPositions = async () => {
    const { data, error } = await supabase
      .from("position_types")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch position types",
        variant: "destructive",
      });
      throw error;
    }

    setPositions(data || []);
    setIsLoading(false);
    return data;
  };

  const { data: queryData } = useQuery({
    queryKey: ['position-types'],
    queryFn: fetchPositions,
    initialData: positions,
  });

  useEffect(() => {
    const channel = supabase
      .channel('position_types_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'position_types' 
        },
        (payload) => {
          switch(payload.eventType) {
            case 'INSERT':
              setPositions(prev => [...prev, payload.new as { id: string; name: string }]);
              break;
            case 'UPDATE':
              setPositions(prev => 
                prev.map(pos => 
                  pos.id === payload.new.id 
                    ? { ...pos, ...payload.new } 
                    : pos
                )
              );
              break;
            case 'DELETE':
              setPositions(prev => 
                prev.filter(pos => pos.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addPosition = async (position: { name: string }) => {
    const { data, error } = await supabase
      .from("position_types")
      .insert({ name: position.name })
      .select();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add position type",
        variant: "destructive",
      });
      throw error;
    }

    // Real-time will handle UI update via subscription
    return data;
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

    // Real-time will handle UI update via subscription
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

    // Real-time will handle UI update via subscription
  };

  return {
    positions,
    isLoading,
    addPosition,
    updatePosition,
    deletePosition,
  };
};
