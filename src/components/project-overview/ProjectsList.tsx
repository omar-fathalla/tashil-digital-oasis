
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Archive, 
  CircleCheck, 
  Clock, 
  CircleX,
  MoreHorizontal, 
  Edit,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type Project } from "@/hooks/useProjects";
import { format } from "date-fns";

interface ProjectsListProps {
  projects: Project[];
  isLoading: boolean;
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onArchiveProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectsList = ({
  projects,
  isLoading,
  selectedProjectId,
  onSelectProject,
  onArchiveProject,
  onDeleteProject,
}: ProjectsListProps) => {
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      case 'archived':
        return <CircleX className="h-4 w-4 text-gray-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Archived</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      default:
        return null;
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(id);
  };

  const handleArchiveClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onArchiveProject(id);
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="py-8 text-center border rounded-md">
        <p className="text-muted-foreground">No projects found</p>
        <p className="text-sm text-muted-foreground mt-1">Create your first project to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={cn(
              "p-3 border rounded-md cursor-pointer transition-colors",
              selectedProjectId === project.id
                ? "border-primary bg-primary/5"
                : "hover:bg-muted"
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="mr-2">{getStatusIcon(project.status)}</div>
                <div>
                  <h4 className="font-medium text-sm">{project.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    Updated {format(new Date(project.updated_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project.id);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={(e) => handleArchiveClick(project.id, e)}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600"
                    onClick={(e) => handleDeleteClick(project.id, e)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {project.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
            
            <div className="mt-2">
              {getStatusBadge(project.status)}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (projectToDelete) {
                  onDeleteProject(projectToDelete);
                  setProjectToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
