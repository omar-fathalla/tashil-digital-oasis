
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployee } from "@/hooks/useEmployee";
import { ChevronLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeInformation from "@/components/employee-management/EmployeeInformation";
import EmployeeProfileHeader from "@/components/employee-management/EmployeeProfileHeader";
import EmployeeActivity from "@/components/employee-management/EmployeeActivity";
import EmployeeDocuments from "@/components/employee-management/EmployeeDocuments";
import EmployeeIDManagement from "@/components/employee-management/EmployeeIDManagement";
import { useNavigate } from "react-router-dom";

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("information");
  const { employee, documents, digitalId, isLoading, uploadDocument } = useEmployee(id);

  const handleBack = () => {
    navigate("/employee-management");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={handleBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Employee Management
        </Button>
        
        <EmployeeProfileHeader employee={employee} isLoading={isLoading} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="id">ID Management</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="access" disabled>Access & Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="information" className="space-y-4">
          <EmployeeInformation employee={employee} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <EmployeeDocuments 
            employeeId={id} 
            documents={documents}
            onUpload={(file, type) => uploadDocument.mutate({ file, documentType: type })}
            isUploading={uploadDocument.isPending}
          />
        </TabsContent>
        
        <TabsContent value="id" className="space-y-4">
          <EmployeeIDManagement
            employee={employee}
            digitalId={digitalId}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <EmployeeActivity employeeId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;
