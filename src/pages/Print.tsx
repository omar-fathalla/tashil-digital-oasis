
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import PrintableIDCard from "@/components/print/PrintableIDCard";
import EmployeePrintTable from "@/components/print/EmployeePrintTable";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Printer, X } from "lucide-react";
import { downloadIdCard } from "@/utils/idCardUtils";
import { toast } from "sonner";

const Print = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "printed" | "not_printed">("all");

  // If no user is logged in, redirect to auth
  if (!user) {
    navigate("/auth");
    return null;
  }

  const { data: employees, isLoading, refetch } = useQuery({
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

  const handleBulkPrint = async () => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    try {
      // Update print status for all selected employees
      const { error } = await supabase
        .from('employee_registrations')
        .update({ 
          printed: true, 
          printed_at: new Date().toISOString() 
        })
        .in('id', selectedEmployees.map(emp => emp.id));

      if (error) throw error;
      
      // Generate combined PDF for all selected employees
      await Promise.all(selectedEmployees.map(employee => downloadIdCard(employee)));
      
      toast.success(`Successfully processed ${selectedEmployees.length} ID cards`);
      setSelectedEmployees([]);
      refetch();
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to process ID cards');
    }
  };

  const filteredEmployees = employees?.filter(employee => {
    const matchesSearch = 
      employee.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employee_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      filterStatus === "all" || 
      (filterStatus === "printed" && employee.printed) ||
      (filterStatus === "not_printed" && !employee.printed);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Employee ID Card Printing System</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >All</Button>
                <Button
                  variant={filterStatus === "printed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("printed")}
                >Printed</Button>
                <Button
                  variant={filterStatus === "not_printed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("not_printed")}
                >Not Printed</Button>
              </div>
            </div>

            {selectedEmployees.length > 0 && (
              <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedEmployees.length} selected
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEmployees([])}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <Button onClick={handleBulkPrint}>
                  <Printer className="h-4 w-4 mr-1" />
                  Print Selected
                </Button>
              </div>
            )}
            
            <EmployeePrintTable 
              employees={filteredEmployees || []}
              selectedEmployees={selectedEmployees}
              onSelectEmployee={(employee, selected) => {
                if (selected) {
                  setSelectedEmployees(prev => [...prev, employee]);
                } else {
                  setSelectedEmployees(prev => 
                    prev.filter(emp => emp.id !== employee.id)
                  );
                }
              }}
              onRefresh={refetch}
            />
          </div>
        </Card>

        {selectedEmployees.length === 1 && (
          <Card className="p-6">
            <PrintableIDCard employee={selectedEmployees[0]} onPrintComplete={refetch} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Print;
