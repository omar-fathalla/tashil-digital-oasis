
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ProjectHeaderProps {
  onCreateClick: () => void;
}

export const ProjectHeader = ({ onCreateClick }: ProjectHeaderProps) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">Project Overview</h1>
        <p className="text-muted-foreground">
          Manage and monitor all your Tashil projects
        </p>
      </div>
      <Button 
        onClick={onCreateClick}
        className="flex items-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
};
