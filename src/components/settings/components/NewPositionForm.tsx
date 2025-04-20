
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PositionType } from "../types/position";

interface NewPositionFormProps {
  onAdd: (positions: PositionType[]) => void;
  positions: PositionType[];
}

export const NewPositionForm = ({ onAdd, positions }: NewPositionFormProps) => {
  const [newPosition, setNewPosition] = useState("");
  const { toast } = useToast();

  const handleAddPosition = () => {
    if (!newPosition.trim()) {
      toast({
        title: "Error",
        description: "Position name is required",
        variant: "destructive",
      });
      return;
    }

    const newPositions = [
      ...positions,
      {
        id: Date.now().toString(),
        name: newPosition.trim(),
      },
    ];

    onAdd(newPositions);
    setNewPosition("");
  };

  return (
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
  );
};
