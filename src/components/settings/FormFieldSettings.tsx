import { Card, CardContent } from "@/components/ui/card";
import { usePositionTypes } from "./hooks/usePositionTypes";
import { PositionItem } from "./components/PositionItem";
import { NewPositionForm } from "./components/NewPositionForm";

export const FormFieldSettings = () => {
  const {
    positions,
    isLoading,
    addPosition,
    updatePosition,
    deletePosition,
  } = usePositionTypes();

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            {positions.length > 0 ? (
              positions.map((position) => (
                <PositionItem
                  key={position.id}
                  position={position}
                  onUpdate={(field, value) => updatePosition(position.id!, field, value)}
                  onRemove={() => deletePosition(position.id!)}
                />
              ))
            ) : (
              <div className="text-muted-foreground">No position types found. Add one below.</div>
            )}
          </div>

          <NewPositionForm onAdd={addPosition} />
        </CardContent>
      </Card>
    </div>
  );
};
