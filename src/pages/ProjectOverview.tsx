
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const ProjectOverview = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        
        // Using the mock client that returns empty data
        const response = await supabase
          .from('projects')
          .select()
          .eq('name', 'tashil')
          .order('created_at');
        
        // The mock always returns empty data, but in a real implementation
        // this would get actual projects
        setProjects(response.data as Project[] || []);
        
      } catch (error: any) {
        toast({
          title: "Error fetching projects",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user, toast]);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tashil Project Overview</h1>
        <p className="text-muted-foreground">
          View and manage your Tashil project details
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Summary</CardTitle>
          <CardDescription>
            Key information about the Tashil project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">Loading project data...</div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                <p className="font-semibold">{projects[0].status}</p>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium text-sm text-muted-foreground">Created</h3>
                <p className="font-semibold">
                  {new Date(projects[0].created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium text-sm text-muted-foreground">ID</h3>
                <p className="font-semibold">{projects[0].id.substring(0, 8)}</p>
              </div>
            </div>
          ) : (
            <div className="text-center p-4">
              <p>No project data found for "Tashil"</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Comprehensive information about the Tashil project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">Loading project details...</div>
          ) : projects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.description || "No description available"}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-4 border rounded-md">
              <p className="mb-4">No project found with the name "Tashil"</p>
              <Button onClick={async () => {
                try {
                  // Mock creating a project
                  await supabase
                    .from('projects')
                    .insert([
                      { 
                        name: "tashil", 
                        description: "A streamlined project to facilitate processes", 
                        status: "Active" 
                      }
                    ]);
                  
                  toast({
                    title: "Success",
                    description: "Tashil project has been created",
                  });
                  
                  // Set mock project data as if it was returned
                  setProjects([{
                    id: "proj_" + Math.random().toString(36).substring(2, 9),
                    name: "tashil",
                    description: "A streamlined project to facilitate processes",
                    status: "Active",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }]);
                } catch (error: any) {
                  toast({
                    title: "Error creating project",
                    description: error.message,
                    variant: "destructive",
                  });
                }
              }}>
                Create Tashil Project
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="mr-2">Export Data</Button>
          <Button>Manage Project</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectOverview;
