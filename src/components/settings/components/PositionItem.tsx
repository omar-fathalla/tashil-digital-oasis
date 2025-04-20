
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { PositionType } from "../types/position";

interface PositionItemProps {
  position: PositionType;
  onUpdate: (positions: PositionType[]) => void;
  onRemove: (id: string) => void;
  positions: PositionType[];
}

export const PositionItem = ({ position, onUpdate, onRemove, positions }: PositionItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Input
          value={position.name}
          onChange={(e) => {
            const newPositions = positions.map((pos) =>
              pos.id === position.id ? { ...pos, name: e.target.value } : pos
            );
            onUpdate(newPositions);
          }}
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(position.id)}
        className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
