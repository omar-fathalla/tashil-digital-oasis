
import { useState } from "react";
import { type Project } from "@/hooks/useProjects";
import { ProjectCard } from "./ProjectCard";
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

  if (isLoading) {
    return <div className="py-8 text-center">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="py-8 text-center border rounded-md">
        <p className="text-muted-foreground">No projects found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first project to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isSelected={selectedProjectId === project.id}
            onSelect={onSelectProject}
            onArchive={onArchiveProject}
            onDelete={setProjectToDelete}
          />
        ))}
      </div>

      <AlertDialog 
        open={!!projectToDelete} 
        onOpenChange={() => setProjectToDelete(null)}
      >
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
