
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Printer, Download, Search, Check, Filter } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import PrintableIDCard from "@/components/print/PrintableIDCard";
import { formatDate } from "@/utils/print/formatters";

const PrintBatch = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "printed" | "not_printed">("all");
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  
  const { data: employees, isLoading } = useQuery({
    queryKey: ["printable-employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee_registrations")
        .select("*")
        .eq("status", "approved")
        .order("full_name");
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredEmployees = employees?.filter(emp => {
    const matchesSearch = emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase());
                         
    const matchesFilter = filter === "all" || 
                         (filter === "printed" && emp.printed) ||
                         (filter === "not_printed" && !emp.printed);
    
    return matchesSearch && matchesFilter;
  });
  
  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredEmployees) {
      setSelectedItems(filteredEmployees.map(emp => emp.id));
    } else {
      setSelectedItems([]);
    }
  };
  
  const handleItemToggle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };
  
  const handleBatchPrint = async () => {
    if (selectedItems.length === 0) {
      toast.warning("Please select at least one ID card to print");
      return;
    }
    
    try {
      toast.info(`Preparing ${selectedItems.length} ID card(s) for printing...`);
      
      // In a real app, we would handle batch printing here
      // For now, we'll just mark them as printed in the database
      
      const { error } = await supabase
        .from('employee_registrations')
        .update({ 
          printed: true,
          printed_at: new Date().toISOString() 
        })
        .in('id', selectedItems);
        
      if (error) throw error;
      
      toast.success(`Successfully marked ${selectedItems.length} ID card(s) as printed`);
      
      // Reset selection after successful printing
      setSelectedItems([]);
    } catch (error) {
      console.error('Batch print error:', error);
      toast.error('Failed to process batch print job');
    }
  };
  
  const currentEmployee = currentPreview ? 
    employees?.find(emp => emp.id === currentPreview) : null;

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Digital ID Card Batch Printing
                </div>
                <Badge className="ml-2">
                  {selectedItems.length} Selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by name or ID..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select 
                    className="border rounded p-2 text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                  >
                    <option value="all">All</option>
                    <option value="printed">Printed</option>
                    <option value="not_printed">Not Printed</option>
                  </select>
                </div>
              </div>
              
              <div className="border rounded-md">
                <div className="grid grid-cols-[auto_2fr_1fr_1fr_auto] gap-2 p-3 bg-muted">
                  <div className="flex items-center h-5">
                    <Checkbox 
                      id="select-all"
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                      checked={selectedItems.length > 0 && 
                              filteredEmployees && 
                              selectedItems.length === filteredEmployees.length}
                    />
                  </div>
                  <Label htmlFor="select-all" className="font-medium">Name</Label>
                  <Label className="font-medium">Employee ID</Label>
                  <Label className="font-medium">Status</Label>
                  <Label className="font-medium sr-only">Actions</Label>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center">Loading employees...</div>
                  ) : filteredEmployees && filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <div 
                        key={employee.id} 
                        className="grid grid-cols-[auto_2fr_1fr_1fr_auto] gap-2 p-3 border-t hover:bg-muted/40"
                      >
                        <div className="flex items-center h-5">
                          <Checkbox 
                            id={`select-${employee.id}`}
                            checked={selectedItems.includes(employee.id)}
                            onCheckedChange={(checked) => handleItemToggle(employee.id, !!checked)}
                          />
                        </div>
                        <Label 
                          htmlFor={`select-${employee.id}`}
                          className="cursor-pointer overflow-hidden overflow-ellipsis"
                        >
                          {employee.full_name}
                        </Label>
                        <div className="font-mono text-sm">{employee.employee_id}</div>
                        <div>
                          {employee.printed ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" /> Printed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              Not Printed
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setCurrentPreview(employee.id)}
                        >
                          Preview
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No employees found matching your criteria
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedItems([])}
                  disabled={selectedItems.length === 0}
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={handleBatchPrint}
                  disabled={selectedItems.length === 0}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print {selectedItems.length} Card(s)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>ID Card Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {currentEmployee ? (
                <div className="space-y-6">
                  <PrintableIDCard employee={currentEmployee} />
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Employee Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Full Name:</span>
                      <span>{currentEmployee.full_name}</span>
                      
                      <span className="text-muted-foreground">Employee ID:</span>
                      <span>{currentEmployee.employee_id}</span>
                      
                      <span className="text-muted-foreground">Position:</span>
                      <span>{currentEmployee.position || 'N/A'}</span>
                      
                      <span className="text-muted-foreground">Area:</span>
                      <span>{currentEmployee.area || 'N/A'}</span>
                      
                      {currentEmployee.printed && (
                        <>
                          <span className="text-muted-foreground">Printed Date:</span>
                          <span>{formatDate(currentEmployee.printed_at)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => toast.info("Downloading ID Card...")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button className="flex-1">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-60 grid place-items-center text-muted-foreground">
                  Select an employee to preview their ID card
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrintBatch;
