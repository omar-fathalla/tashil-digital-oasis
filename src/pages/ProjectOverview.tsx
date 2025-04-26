
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { ProjectSearch } from "@/components/project-overview/ProjectSearch";
import { ProjectsList } from "@/components/project-overview/ProjectsList";
import { ProjectDetails } from "@/components/project-overview/ProjectDetails";
import { ProjectBackupControl } from "@/components/project-overview/ProjectBackupControl";
import { CreateProjectDialog } from "@/components/project-overview/CreateProjectDialog";
import { useProjects } from "@/hooks/useProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";

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
    refetch
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
    // Select the first project if available and none is selected
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
    // Reset selected project if it no longer exists
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Project Overview</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your Tashil projects
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          New Project
        </Button>
      </div>

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
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Project Details</TabsTrigger>
                <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <ProjectDetails 
                  project={selectedProject} 
                  onUpdateProject={handleUpdateProject}
                />
              </TabsContent>
              
              <TabsContent value="backup">
                <ProjectBackupControl projectId={selectedProject.id} />
              </TabsContent>
              
              <TabsContent value="collaboration">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Collaboration</CardTitle>
                    <CardDescription>
                      Team communication and activity feed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-muted p-4 rounded-md">
                        <ProjectCollaboration projectId={selectedProject.id} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">No Project Selected</h3>
                  <p className="text-muted-foreground">
                    Select a project from the list or create a new one to get started.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Project
                  </Button>
                </div>
              </CardContent>
            </Card>
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

// This is a placeholder for the ProjectCollaboration component
// It will be implemented as a separate component
const ProjectCollaboration = ({ projectId }) => {
  return <div>Collaboration features will be loaded here for project {projectId}</div>;
};

export default ProjectOverview;
