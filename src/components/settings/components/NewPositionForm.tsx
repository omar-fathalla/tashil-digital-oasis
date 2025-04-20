import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface NewPositionFormProps {
  onAdd: (position: { name: string }) => Promise<void>;
}

export const NewPositionForm = ({ onAdd }: NewPositionFormProps) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({ name });
      setName("");
    } catch (e) {
      console.error("Add position failed", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 flex gap-2">
      <Input
        placeholder="New position type"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleAdd} disabled={isSubmitting || !name.trim()}>
        <Plus className="w-4 h-4 mr-1" /> Add Position
      </Button>
    </div>
  );
};
