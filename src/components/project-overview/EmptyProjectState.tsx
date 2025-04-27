
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyProjectStateProps {
  onCreateClick: () => void;
}

export const EmptyProjectState = ({ onCreateClick }: EmptyProjectStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">No Project Selected</h3>
          <p className="text-muted-foreground">
            Select a project from the list or create a new one to get started.
          </p>
          <Button 
            className="mt-4" 
            onClick={onCreateClick}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
