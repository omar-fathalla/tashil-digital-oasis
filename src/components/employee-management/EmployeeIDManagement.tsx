
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Employee, DigitalID } from "@/hooks/useEmployee";
import { format } from "date-fns";
import { CircleCheck, Printer, Download, RefreshCw } from "lucide-react";

interface EmployeeIDManagementProps {
  employee?: Employee | null;
  digitalId?: DigitalID | null;
  isLoading: boolean;
}

const EmployeeIDManagement = ({ employee, digitalId, isLoading }: EmployeeIDManagementProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <div className="flex justify-end space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Digital ID Management</CardTitle>
          <CardDescription>Employee data not available.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Check if employee is eligible for an ID card
  const isEligible = employee.status === 'approved' || 
                     employee.status === 'active' || 
                     employee.status === 'id_generated' || 
                     employee.status === 'id_printed' || 
                     employee.status === 'id_collected';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Digital ID Management</CardTitle>
        <CardDescription>Manage employee's digital identification cards and credentials</CardDescription>
      </CardHeader>
      <CardContent>
        {isEligible ? (
          <div className="space-y-6">
            <div className="border rounded-lg p-6 relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full -mt-8 -mr-8"></div>
              
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold opacity-70">Employee ID Card</h3>
                  <p className="text-2xl font-bold">{employee.employee_id}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-sm opacity-70">Issue Date</div>
                  <div>{digitalId?.issue_date ? format(new Date(digitalId.issue_date), "MMM d, yyyy") : "Pending"}</div>
                  
                  <div className="text-sm opacity-70 mt-2">Expiry Date</div>
                  <div>{digitalId?.expiry_date ? format(new Date(digitalId.expiry_date), "MMM d, yyyy") : "Pending"}</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="text-sm opacity-70">Employee Name</div>
                <div className="text-xl font-semibold">{employee.full_name}</div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm opacity-70">Position</div>
                <div>{employee.position || "Not specified"}</div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm opacity-70">Status</div>
                <Badge className={`
                  ${digitalId?.status === 'active' ? 'bg-green-500' : 
                  digitalId?.status === 'pending' ? 'bg-yellow-500' : 
                  digitalId?.status === 'expired' ? 'bg-red-500' : 'bg-blue-500'}
                `}>
                  {digitalId?.status || "Processing"}
                </Badge>
              </div>
              
              <div className="absolute bottom-0 right-0 mb-4 mr-4">
                <CircleCheck className="h-8 w-8 text-indigo-400/50" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <div>
                {employee.printed ? (
                  <Button variant="outline" size="sm" disabled>
                    <CircleCheck className="h-4 w-4 mr-2 text-green-500" />
                    ID Card Printed
                  </Button>
                ) : (
                  <Button size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print ID Card
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renew ID
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Digital ID
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>
                {employee.printed_at 
                  ? `ID card last printed on ${format(new Date(employee.printed_at), "MMMM d, yyyy")}.` 
                  : "ID card has not been printed yet."}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto h-12 w-12 text-muted-foreground opacity-50 rounded-full border-2 border-dashed flex items-center justify-center">
              <Printer className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Not Eligible for ID</h3>
            <p className="text-sm text-muted-foreground">
              This employee is not yet approved or their status doesn't allow ID issuance.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Current status: <Badge variant="outline">{employee.status || "Unknown"}</Badge>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeIDManagement;
