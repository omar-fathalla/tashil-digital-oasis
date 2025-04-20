
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmployeesTable } from "@/components/employee-management/EmployeesTable";
import EmployeeForm from "@/components/employee-management/EmployeeForm";
import { EmployeeDetail } from "@/components/employee-management/EmployeeDetail";
import { DeleteConfirmationDialog } from "@/components/employee-management/DeleteConfirmationDialog";
import { useCompanyEmployees } from "@/hooks/useCompanyEmployees";
import { CompanyEmployee } from "@/types/employee";
import { useAuth } from "@/components/AuthProvider";

export default function EmployeeManagement() {
  const { user } = useAuth();
  // In a real app, this would come from the user's company data
  const companyId = user?.id || "temp-company-id";
  
  const {
    employees,
    isLoading,
    selectedEmployee,
    setSelectedEmployee,
    isAddingEmployee,
    setIsAddingEmployee,
    isEditingEmployee,
    setIsEditingEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee
  } = useCompanyEmployees(companyId);
  
  // State for view employee details dialog
  const [isViewingEmployee, setIsViewingEmployee] = useState(false);
  
  // State for delete confirmation dialog
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<CompanyEmployee | null>(null);
  
  // Handle view employee
  const handleView = (employee: CompanyEmployee) => {
    setSelectedEmployee(employee);
    setIsViewingEmployee(true);
  };
  
  // Handle edit employee
  const handleEdit = (employee: CompanyEmployee) => {
    setSelectedEmployee(employee);
    setIsEditingEmployee(true);
  };
  
  // Handle delete employee
  const handleDeleteConfirm = (employee: CompanyEmployee) => {
    setEmployeeToDelete(employee);
    setIsConfirmingDelete(true);
  };
  
  // Execute delete
  const executeDelete = async () => {
    if (employeeToDelete) {
      await deleteEmployee.mutateAsync(employeeToDelete.id);
      setIsConfirmingDelete(false);
      setEmployeeToDelete(null);
    }
  };
  
  // Show the appropriate content based on current state
  const renderContent = () => {
    if (isAddingEmployee) {
      return (
        <EmployeeForm
          onSubmit={(data) => addEmployee.mutate(data)}
          onCancel={() => setIsAddingEmployee(false)}
          isSubmitting={addEmployee.isPending}
        />
      );
    }
    
    if (isEditingEmployee && selectedEmployee) {
      return (
        <EmployeeForm
          employee={selectedEmployee}
          onSubmit={(data) => updateEmployee.mutate({ id: selectedEmployee.id, ...data })}
          onCancel={() => setIsEditingEmployee(false)}
          isSubmitting={updateEmployee.isPending}
        />
      );
    }
    
    // Default view: list of employees
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <Button onClick={() => setIsAddingEmployee(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
        
        <EmployeesTable
          employees={employees}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteConfirm}
          isLoading={isLoading}
        />
        
        {/* Employee details dialog */}
        <EmployeeDetail
          employee={selectedEmployee}
          open={isViewingEmployee}
          onClose={() => setIsViewingEmployee(false)}
        />
        
        {/* Delete confirmation dialog */}
        <DeleteConfirmationDialog
          open={isConfirmingDelete}
          onClose={() => setIsConfirmingDelete(false)}
          onConfirm={executeDelete}
          isDeleting={deleteEmployee.isPending}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      {renderContent()}
    </div>
  );
}
