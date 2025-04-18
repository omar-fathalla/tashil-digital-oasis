
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useReportData } from "@/hooks/useReportData";
import { TotalEmployeesCard } from "@/components/reports/TotalEmployeesCard";
import { DocumentStatusCard } from "@/components/reports/DocumentStatusCard";
import { EmployeesByRegionChart } from "@/components/reports/EmployeesByRegionChart";
import { RegistrationsByDateChart } from "@/components/reports/RegistrationsByDateChart";
import { ReviewersActivityTable } from "@/components/reports/ReviewersActivityTable";
import { IncompleteSubmissionsTable } from "@/components/reports/IncompleteSubmissionsTable";
import { DocumentUploadsTable } from "@/components/reports/DocumentUploadsTable";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { ExportOptions } from "@/components/reports/ExportOptions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileBarChart2, FileText, Users, Calendar, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Report = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data, isLoading, error } = useReportData();

  const handleFilterChange = (filters: any) => {
    // TODO: Implement filtering logic
    console.log("Filters changed:", filters);
    toast({
      title: "Filters Applied",
      description: "The report data has been filtered according to your selection.",
    });
  };

  const handleExport = (format: "csv" | "excel") => {
    // TODO: Implement export logic
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your report is being prepared for download.",
    });
  };

  const handlePrint = () => {
    window.print();
  };
  
  // Redirect if not authenticated
  if (!user) {
    navigate("/auth");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-red-100 text-red-800 p-3 rounded-full inline-flex">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="mt-2 text-xl font-semibold">Error Loading Report</h2>
              <p className="mt-1 text-gray-500">
                There was an error loading the report data. Please try again later.
              </p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="bg-primary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Reports & Analytics
            </h1>
            <p className="text-lg text-gray-600">
              Comprehensive overview of employee registrations and document status
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <ReportFilters onFilterChange={handleFilterChange} />
          <ExportOptions onExport={handleExport} onPrint={handlePrint} />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <FileBarChart2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="employees" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Employees</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Documents</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Activity</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TotalEmployeesCard 
                  totalEmployees={data?.totalEmployees || 0}
                  approvedEmployees={data?.approvedEmployees || 0}
                  pendingEmployees={data?.pendingEmployees || 0}
                  rejectedEmployees={data?.rejectedEmployees || 0}
                />
                <DocumentStatusCard />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EmployeesByRegionChart data={data?.employeesByRegion || []} />
                <RegistrationsByDateChart data={data?.registrationsByDate || {}} />
              </div>
            </TabsContent>
            
            <TabsContent value="employees" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TotalEmployeesCard 
                  totalEmployees={data?.totalEmployees || 0}
                  approvedEmployees={data?.approvedEmployees || 0}
                  pendingEmployees={data?.pendingEmployees || 0}
                  rejectedEmployees={data?.rejectedEmployees || 0}
                />
                <EmployeesByRegionChart data={data?.employeesByRegion || []} />
              </div>
              <IncompleteSubmissionsTable data={data?.incompleteSubmissions || []} />
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentStatusCard />
                <DocumentUploadsTable data={data?.documentUploads || []} />
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <ReviewersActivityTable data={data?.reviewerActivity || []} />
                <RegistrationsByDateChart data={data?.registrationsByDate || {}} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Report;
