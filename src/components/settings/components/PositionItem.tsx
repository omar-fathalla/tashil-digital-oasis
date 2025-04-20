import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface PositionItemProps {
  position: { id: string; name: string };
  onUpdate: (field: string, value: string | boolean) => void;
  onRemove: () => void;
}

export const PositionItem = ({ position, onUpdate, onRemove }: PositionItemProps) => {
  return (
    <div className="flex items-center gap-4">
      <Input
        value={position.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        className="flex-1"
      />
      <Button
        variant="ghost"
        className="text-destructive hover:bg-destructive/10"
        onClick={onRemove}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};
