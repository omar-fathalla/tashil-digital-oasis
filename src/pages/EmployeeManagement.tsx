
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeeDataTable from "@/components/employee-management/EmployeeDataTable";
import EmployeeFilters from "@/components/employee-management/EmployeeFilters";
import EmployeeExport from "@/components/employee-management/EmployeeExport";
import { ensureDemoData } from "@/utils/seedDemoData";
import SeedDataButton from "@/components/employee-management/SeedDataButton";

const EmployeeManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoadingDemoData, setIsLoadingDemoData] = useState(false);

  // Only ensure we have basic demo data when the component loads
  // This doesn't execute seedEmployeeData()
  useEffect(() => {
    const loadDemoData = async () => {
      setIsLoadingDemoData(true);
      try {
        await ensureDemoData();
      } catch (error) {
        console.error("Failed to load demo data:", error);
      } finally {
        setIsLoadingDemoData(false);
      }
    };
    
    loadDemoData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground">View, manage, and export employee records</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <SeedDataButton />
          <EmployeeExport />
        </div>
      </div>
      
      <Card className="border-none shadow-lg mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Employee Filters</CardTitle>
          <CardDescription>Filter the employee list by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>Complete list of employees with detailed information</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeDataTable
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            departmentFilter={departmentFilter}
            roleFilter={roleFilter}
            isLoadingDemoData={isLoadingDemoData}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
