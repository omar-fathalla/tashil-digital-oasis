
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertTriangle, Calendar, Users, Building, User } from 'lucide-react';

// Mock function to simulate data fetching
const fetchProjectData = () => {
  return Promise.resolve({
    name: "Access Management System",
    status: "In Progress",
    progress: 68,
    startDate: "2023-12-01",
    endDate: "2024-06-30",
    registeredCompanies: 24,
    totalEmployees: 1452,
    pendingRequests: 37,
    approvedRequests: 845,
    rejectedRequests: 78,
    regions: [
      { name: "Cairo", employees: 542 },
      { name: "Alexandria", employees: 398 },
      { name: "Giza", employees: 275 },
      { name: "Aswan", employees: 154 },
      { name: "Other", employees: 83 }
    ],
    milestones: [
      { name: "Project Kickoff", date: "2023-12-01", completed: true },
      { name: "Initial Deployment", date: "2024-02-15", completed: true },
      { name: "50% Registration Goal", date: "2024-04-10", completed: true },
      { name: "Full Feature Rollout", date: "2024-05-15", completed: false },
      { name: "Project Completion", date: "2024-06-30", completed: false }
    ],
    team: [
      { name: "Ahmed Hassan", role: "Project Manager", email: "ahmed@example.com" },
      { name: "Sara Mahmoud", role: "System Administrator", email: "sara@example.com" },
      { name: "Mohammed Ali", role: "Developer", email: "mohammed@example.com" },
      { name: "Laila Ibrahim", role: "Support Specialist", email: "laila@example.com" }
    ]
  });
};

const ProjectOverview = () => {
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load project data
  if (isLoading) {
    fetchProjectData()
      .then(data => {
        setProjectData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to load project data:", error);
        setIsLoading(false);
      });
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!projectData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold">Failed to load project data</h2>
          <p className="mt-2 text-gray-600">Please try again later</p>
          <Button className="mt-4" onClick={() => setIsLoading(true)}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  const getStatusBadge = () => {
    switch (projectData.status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800 ml-2">Completed</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800 ml-2">In Progress</Badge>;
      case "On Hold":
        return <Badge className="bg-orange-100 text-orange-800 ml-2">On Hold</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 ml-2">{projectData.status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            {projectData.name}
            {getStatusBadge()}
          </h1>
          <p className="text-gray-600 mt-2">
            <Calendar className="inline-block mr-1 h-4 w-4" /> 
            {new Date(projectData.startDate).toLocaleDateString()} - {new Date(projectData.endDate).toLocaleDateString()}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="flex items-center">
            <div className="mr-2 font-medium">Progress:</div>
            <div className="w-40 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${projectData.progress}%` }}
              ></div>
            </div>
            <span className="ml-2 font-medium">{projectData.progress}%</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Building className="mr-2 h-5 w-5 text-blue-600" />
              Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projectData.registeredCompanies}</div>
            <p className="text-sm text-gray-500">Registered companies</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-green-600" />
              Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projectData.totalEmployees}</div>
            <p className="text-sm text-gray-500">Total registered employees</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-amber-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projectData.pendingRequests}</div>
            <p className="text-sm text-gray-500">Requests awaiting review</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Registration Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Approved</div>
                      <div className="text-sm font-medium text-green-600">{projectData.approvedRequests}</div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-green-500 rounded-full" style={{ 
                        width: `${(projectData.approvedRequests / (projectData.approvedRequests + projectData.pendingRequests + projectData.rejectedRequests) * 100).toFixed(0)}%` 
                      }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Pending</div>
                      <div className="text-sm font-medium text-amber-600">{projectData.pendingRequests}</div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-amber-500 rounded-full" style={{ 
                        width: `${(projectData.pendingRequests / (projectData.approvedRequests + projectData.pendingRequests + projectData.rejectedRequests) * 100).toFixed(0)}%` 
                      }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Rejected</div>
                      <div className="text-sm font-medium text-red-600">{projectData.rejectedRequests}</div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-red-500 rounded-full" style={{ 
                        width: `${(projectData.rejectedRequests / (projectData.approvedRequests + projectData.pendingRequests + projectData.rejectedRequests) * 100).toFixed(0)}%` 
                      }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectData.regions.map((region) => (
                    <div key={region.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">{region.name}</div>
                        <div className="text-sm font-medium">{region.employees}</div>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div className="h-full bg-blue-500 rounded-full" style={{ 
                          width: `${(region.employees / projectData.totalEmployees * 100).toFixed(0)}%` 
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectData.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {milestone.completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium">{milestone.name}</h4>
                      <p className="text-sm text-gray-500">{new Date(milestone.date).toLocaleDateString()}</p>
                      {milestone.completed ? (
                        <Badge className="mt-2 bg-green-100 text-green-800">Completed</Badge>
                      ) : (
                        <Badge className="mt-2 bg-blue-100 text-blue-800">Upcoming</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Project Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectData.team.map((member, index) => (
                  <div key={index} className="flex items-center p-4 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.role}</p>
                      <p className="text-sm text-blue-600">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectOverview;
