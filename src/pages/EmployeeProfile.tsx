
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, FileDown, FileText, UserCircle, History, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEmployee } from "@/hooks/useEmployee";
import EmployeeProfileHeader from "@/components/employee-management/EmployeeProfileHeader";
import EmployeeInformation from "@/components/employee-management/EmployeeInformation";
import EmployeeDocuments from "@/components/employee-management/EmployeeDocuments";
import EmployeeActivity from "@/components/employee-management/EmployeeActivity";
import EmployeeIDManagement from "@/components/employee-management/EmployeeIDManagement";
import { toast } from "sonner";

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [activeTab, setActiveTab] = useState("information");
  
  const { employee, documents, digitalId, isLoading, error } = useEmployee(employeeId);
  
  const generateReport = () => {
    toast.info("Generating employee report...");
    
    // In a real implementation, this would call an API to generate the report
    setTimeout(() => {
      toast.success("Employee report ready for download");
    }, 1500);
  };
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/employee-management">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Employee Management
            </Button>
          </Link>
        </div>
        
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              There was an error loading the employee information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please try again later or contact the system administrator.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Link to="/employee-management">
          <Button variant="ghost" size="sm" className="gap-1 mb-4 md:mb-0">
            <ChevronLeft className="h-4 w-4" />
            Back to Employee Management
          </Button>
        </Link>
        
        <Button onClick={generateReport} className="gap-2">
          <FileDown className="h-4 w-4" />
          Generate Report
        </Button>
      </div>
      
      <EmployeeProfileHeader employee={employee} isLoading={isLoading} />
      
      <div className="mt-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="information" className="gap-2">
              <UserCircle className="h-4 w-4" />
              <span className="hidden md:inline">Information</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="id-management" className="gap-2">
              <FileCheck className="h-4 w-4" />
              <span className="hidden md:inline">ID Management</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden md:inline">Activity</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="information">
              <EmployeeInformation employee={employee} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="documents">
              <EmployeeDocuments 
                documents={documents} 
                isLoading={isLoading}
                employeeId={employeeId}
              />
            </TabsContent>
            
            <TabsContent value="id-management">
              <EmployeeIDManagement 
                employee={employee}
                digitalId={digitalId} 
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="activity">
              <EmployeeActivity 
                employeeId={employeeId}
                isLoading={isLoading} 
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeProfile;
