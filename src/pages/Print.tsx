
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import PrintableIDCard from "@/components/print/PrintableIDCard";
import EmployeePrintTable from "@/components/print/EmployeePrintTable";

const Print = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // If no user is logged in, redirect to auth
  if (!user) {
    navigate("/auth");
    return null;
  }

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employee-registrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employee_registrations')
        .select('*')
        .order('submission_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Employee ID Card Printing System</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <EmployeePrintTable 
            employees={employees || []}
            onSelect={setSelectedEmployee}
            selectedEmployee={selectedEmployee}
          />
        </Card>

        {selectedEmployee && (
          <Card className="p-6">
            <PrintableIDCard employee={selectedEmployee} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Print;
