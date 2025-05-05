
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegistrationRequestsTable } from "@/components/registration-requests/RegistrationRequestsTable";
import EmployeeListTable from "@/components/employee-management/EmployeeListTable";

const RegistrationRequests = () => {
  const [activeTab, setActiveTab] = useState("requests");
  
  // Mock requests data for demonstration
  const mockRequests = [
    {
      id: "1",
      full_name: "John Smith",
      national_id: "AB123456",
      submission_date: new Date().toISOString(),
      status: "pending",
      documents: {}
    },
    {
      id: "2",
      full_name: "Jane Doe",
      national_id: "CD789012",
      submission_date: new Date().toISOString(),
      status: "approved",
      documents: {}
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Registration Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Registration Requests</TabsTrigger>
          <TabsTrigger value="employees">Employee List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Registration Requests</CardTitle>
              <CardDescription>
                View and manage pending and processed registration requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegistrationRequestsTable requests={mockRequests} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee List</CardTitle>
              <CardDescription>
                View all employees across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeListTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegistrationRequests;
