
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Project } from "@/hooks/useProjects";
import { EditProjectDialog } from "./EditProjectDialog";
import { format } from "date-fns";

interface ProjectDetailsProps {
  project: Project;
  onUpdateProject: (id: string, data: Partial<Project>) => Promise<void>;
}

export const ProjectDetails = ({ project, onUpdateProject }: ProjectDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (updatedData: Partial<Project>) => {
    await onUpdateProject(project.id, updatedData);
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'active':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>;
      case 'archived':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Archived</span>;
      case 'in_progress':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl">{project.name}</CardTitle>
            <CardDescription>
              Created on {format(new Date(project.created_at), "MMMM d, yyyy")}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Project
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
              <div className="mt-1">{getStatusBadge(project.status)}</div>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium text-sm text-muted-foreground">Last Updated</h3>
              <p className="font-semibold">
                {format(new Date(project.updated_at), "PPp")}
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium text-sm text-muted-foreground">ID</h3>
              <p className="font-semibold">{project.id.substring(0, 8)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <div className="bg-muted/30 p-4 rounded-md">
                {project.description || "No description provided"}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Project Details</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>{format(new Date(project.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(project.updated_at), "MMM d, yyyy")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">Export Data</Button>
          <Button>Manage Project</Button>
        </CardFooter>
      </Card>

      <EditProjectDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        project={project}
        onUpdateProject={handleUpdate}
      />
    </>
  );
};
