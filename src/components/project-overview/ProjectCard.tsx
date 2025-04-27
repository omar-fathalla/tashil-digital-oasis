
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { type Project } from "@/hooks/useProjects";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectActions } from "./ProjectActions";

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({
  project,
  isSelected,
  onSelect,
  onArchive,
  onDelete,
}: ProjectCardProps) => {
  return (
    <div
      onClick={() => onSelect(project.id)}
      className={cn(
        "p-3 border rounded-md cursor-pointer transition-colors",
        isSelected ? "border-primary bg-primary/5" : "hover:bg-muted"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <ProjectStatusBadge status={project.status} />
          <div>
            <h4 className="font-medium text-sm">{project.name}</h4>
            <p className="text-xs text-muted-foreground">
              Updated {format(new Date(project.updated_at), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        
        <ProjectActions
          projectId={project.id}
          onEdit={onSelect}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      </div>
      
      {project.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {project.description}
        </p>
      )}
    </div>
  );
};
