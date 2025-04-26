
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Download, FileText, Printer } from "lucide-react";
import { Employee } from "@/hooks/useEmployee";
import { format } from "date-fns";
import { toast } from "sonner";

interface EmployeeIDManagementProps {
  employee?: Employee;
  digitalId: any | null;
  isLoading: boolean;
}

const EmployeeIDManagement = ({ employee, digitalId, isLoading }: EmployeeIDManagementProps) => {
  const handlePrint = () => {
    toast.info("Preparing ID for printing...");
    
    // In a real implementation, this would prepare the ID for printing
    setTimeout(() => {
      toast.success("ID sent to printer");
    }, 1500);
  };
  
  const handleDownload = () => {
    toast.info("Preparing digital ID for download...");
    
    // In a real implementation, this would download the digital ID
    setTimeout(() => {
      toast.success("Digital ID ready for download");
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <div className="flex justify-center space-x-3">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(3).fill(null).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no digital ID exists yet
  if (!digitalId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ID Management</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
          <p className="mt-4 text-lg font-medium">No Digital ID Available</p>
          <p className="text-muted-foreground">
            This employee doesn't have a digital ID issued yet.
          </p>
          {employee?.status === 'approved' && (
            <Button className="mt-6">Issue Digital ID</Button>
          )}
          {employee?.status !== 'approved' && (
            <p className="text-sm text-muted-foreground mt-6">
              The employee must be approved before issuing a digital ID.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Digital ID Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="border rounded-lg w-full max-w-md p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex flex-col items-center">
                <div className="bg-muted/20 h-24 w-24 rounded-full flex items-center justify-center mb-4">
                  {employee?.photo_url ? (
                    <img 
                      src={employee.photo_url} 
                      alt={employee.full_name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                
                <h3 className="text-lg font-bold">{employee?.full_name}</h3>
                <p className="text-muted-foreground">{employee?.position || 'Employee'}</p>
                
                <div className="w-full mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ID Number:</span>
                    <span className="text-sm font-medium">{digitalId.id_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Employee ID:</span>
                    <span className="text-sm font-medium">{employee?.employee_id}</span>
                  </div>
                  {employee?.area && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Department:</span>
                      <span className="text-sm font-medium">{employee.area}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valid Until:</span>
                    <span className="text-sm font-medium">
                      {format(new Date(digitalId.expiry_date), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 w-full">
                  <Badge 
                    className={`w-full justify-center ${
                      digitalId.status === 'active' 
                        ? 'bg-green-500' 
                        : 'bg-yellow-500'
                    }`}
                  >
                    {digitalId.status === 'active' ? 'ACTIVE' : 'PENDING'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button onClick={handlePrint} variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Print ID
              </Button>
              <Button onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                Download Digital ID
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>ID Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">ID Number</dt>
              <dd className="text-lg">{digitalId.id_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Issue Date</dt>
              <dd className="text-lg">{format(new Date(digitalId.issue_date), "MMMM d, yyyy")}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Expiry Date</dt>
              <dd className="flex items-center gap-2">
                <span className="text-lg">{format(new Date(digitalId.expiry_date), "MMMM d, yyyy")}</span>
                {new Date(digitalId.expiry_date) < new Date() && (
                  <Badge variant="destructive">Expired</Badge>
                )}
                {new Date(digitalId.expiry_date) > new Date() && (
                  <Badge variant="outline" className="gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    Valid
                  </Badge>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd>
                <Badge 
                  className={digitalId.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}
                >
                  {digitalId.status.toUpperCase()}
                </Badge>
              </dd>
            </div>
            {employee?.printed && employee.printed_at && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Printed</dt>
                <dd className="text-lg">{format(new Date(employee.printed_at), "MMMM d, yyyy")}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeIDManagement;
