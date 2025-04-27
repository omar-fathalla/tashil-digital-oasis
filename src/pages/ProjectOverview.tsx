
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { ProjectSearch } from "@/components/project-overview/ProjectSearch";
import { ProjectsList } from "@/components/project-overview/ProjectsList";
import { CreateProjectDialog } from "@/components/project-overview/CreateProjectDialog";
import { ProjectHeader } from "@/components/project-overview/ProjectHeader";
import { ProjectTabs } from "@/components/project-overview/ProjectTabs";
import { EmptyProjectState } from "@/components/project-overview/EmptyProjectState";
import { useProjects } from "@/hooks/useProjects";

const ProjectOverview = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast: hookToast } = useToast();
  const { user } = useAuth();
  
  const { 
    projects, 
    isLoading, 
    createProject, 
    updateProject,
    archiveProject,
    deleteProject,
    error,
  } = useProjects();
  
  useEffect(() => {
    if (error) {
      hookToast({
        title: "Error loading projects",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, hookToast]);
  
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
    else if (selectedProjectId && !projects.find(p => p.id === selectedProjectId)) {
      setSelectedProjectId(projects.length > 0 ? projects[0].id : null);
    }
  }, [projects, selectedProjectId]);

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);
      setIsCreateDialogOpen(false);
      toast.success("Project created successfully");
    } catch (error) {
      toast.error("Failed to create project: " + error.message);
    }
  };

  const handleUpdateProject = async (projectId, projectData) => {
    try {
      await updateProject(projectId, projectData);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project: " + error.message);
    }
  };

  const handleArchiveProject = async (projectId) => {
    try {
      await archiveProject(projectId);
      toast.success("Project archived successfully");
    } catch (error) {
      toast.error("Failed to archive project: " + error.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
      }
    } catch (error) {
      toast.error("Failed to delete project: " + error.message);
    }
  };

  const selectedProject = selectedProjectId 
    ? projects.find(project => project.id === selectedProjectId) 
    : null;

  return (
    <div className="container py-10">
      <ProjectHeader onCreateClick={() => setIsCreateDialogOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectSearch />
              <ProjectsList 
                projects={projects} 
                isLoading={isLoading}
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
                onArchiveProject={handleArchiveProject}
                onDeleteProject={handleDeleteProject}
              />
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedProject ? (
            <ProjectTabs
              project={selectedProject}
              onUpdateProject={handleUpdateProject}
            />
          ) : (
            <EmptyProjectState onCreateClick={() => setIsCreateDialogOpen(true)} />
          )}
        </div>
      </div>

      <CreateProjectDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default ProjectOverview;
