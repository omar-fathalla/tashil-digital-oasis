
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash } from "lucide-react";

interface PositionType {
  id: string;
  name: string;
}

export const FormFieldSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPosition, setNewPosition] = useState("");

  // Fetch position types from system_settings
  const { data: positions = [], isLoading } = useQuery({
    queryKey: ['system-settings', 'position-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('category', 'form_fields')
        .eq('key', 'position_types')
        .single();

      if (error) throw error;
      
      // Parse value and ensure it's an array of PositionType
      try {
        const positionsData = data?.value;
        if (!positionsData) return [] as PositionType[];
        
        // If it's already an array, validate and return it
        if (Array.isArray(positionsData)) {
          // Cast to PositionType[] after validating structure
          const validPositions: PositionType[] = [];
          for (const item of positionsData) {
            if (typeof item === 'object' && item !== null && 
                'id' in item && 'name' in item) {
              validPositions.push({
                id: String(item.id),
                name: String(item.name)
              });
            }
          }
          return validPositions;
        }
        
        // Try to parse JSON string if needed
        if (typeof positionsData === 'string') {
          try {
            const parsed = JSON.parse(positionsData);
            if (Array.isArray(parsed)) {
              // Same validation as above
              const validPositions: PositionType[] = [];
              for (const item of parsed) {
                if (typeof item === 'object' && item !== null && 
                    'id' in item && 'name' in item) {
                  validPositions.push({
                    id: String(item.id),
                    name: String(item.name)
                  });
                }
              }
              return validPositions;
            }
          } catch {
            console.error('Failed to parse position data string');
            return [] as PositionType[];
          }
        }
        
        // Default fallback
        return [] as PositionType[];
      } catch (e) {
        console.error('Error parsing position types:', e);
        return [] as PositionType[];
      }
    }
  });

  // Update position types mutation
  const updatePositionTypes = useMutation({
    mutationFn: async (newPositions: PositionType[]) => {
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

  const handleAddPosition = () => {
    if (!newPosition.trim()) {
      toast({
        title: "Error",
        description: "Position name is required",
        variant: "destructive",
      });
      return;
    }

    // Create a new array with the existing positions and the new one
    const currentPositions = Array.isArray(positions) ? positions : [];
    const newPositions = [
      ...currentPositions,
      {
        id: Date.now().toString(),
        name: newPosition.trim(),
      },
    ];

    updatePositionTypes.mutate(newPositions);
    setNewPosition("");
  };

  const handleRemovePosition = (id: string) => {
    const currentPositions = Array.isArray(positions) ? positions : [];
    const newPositions = currentPositions.filter((pos) => pos.id !== id);
    updatePositionTypes.mutate(newPositions);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Ensure we're working with an array for rendering
  const safePositions = Array.isArray(positions) ? positions : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Position Types</h2>
        <p className="text-muted-foreground">
          Manage available position types for employee registration.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {safePositions.map((position) => (
              <div key={position.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <Input
                    value={position.name}
                    onChange={(e) => {
                      const currentPositions = Array.isArray(positions) ? positions : [];
                      const newPositions = currentPositions.map((pos) =>
                        pos.id === position.id ? { ...pos, name: e.target.value } : pos
                      );
                      updatePositionTypes.mutate(newPositions);
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePosition(position.id)}
                  className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter new position type..."
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPosition();
                  }
                }}
              />
            </div>
            <Button onClick={handleAddPosition}>
              <Plus className="h-4 w-4 mr-2" />
              Add Position
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
