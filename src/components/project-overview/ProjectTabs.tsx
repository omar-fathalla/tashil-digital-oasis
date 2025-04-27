
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProjectDetails } from "./ProjectDetails";
import { ProjectBackupControl } from "./ProjectBackupControl";
import { type Project } from "@/hooks/useProjects";

interface ProjectTabsProps {
  project: Project;
  onUpdateProject: (projectId: string, data: Partial<Project>) => Promise<void>;
}

export const ProjectTabs = ({ project, onUpdateProject }: ProjectTabsProps) => {
  return (
    <Tabs defaultValue="details">
      <TabsList className="mb-4">
        <TabsTrigger value="details">Project Details</TabsTrigger>
        <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <ProjectDetails 
          project={project}
          onUpdateProject={onUpdateProject}
        />
      </TabsContent>
      
      <TabsContent value="backup">
        <ProjectBackupControl projectId={project.id} />
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
                <ProjectCollaboration projectId={project.id} />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

// This is a placeholder until the real collaboration component is implemented
const ProjectCollaboration = ({ projectId }: { projectId: string }) => {
  return <div>Collaboration features will be loaded here for project {projectId}</div>;
};
