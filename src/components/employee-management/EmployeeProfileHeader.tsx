
import { User, Calendar, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Employee } from "@/hooks/useEmployee";
import { format } from "date-fns";

interface EmployeeProfileHeaderProps {
  employee?: Employee;
  isLoading: boolean;
}

const EmployeeProfileHeader = ({ employee, isLoading }: EmployeeProfileHeaderProps) => {
  // Get status badge color based on status
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500">Suspended</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-center text-muted-foreground">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="bg-muted/20 h-24 w-24 rounded-full flex items-center justify-center">
          {employee.photo_url ? (
            <img 
              src={employee.photo_url} 
              alt={employee.full_name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">{employee.full_name}</h2>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-1">
            {getStatusBadge(employee.status)}
            {employee.position && (
              <Badge variant="outline">{employee.position}</Badge>
            )}
            {employee.area && (
              <Badge variant="outline">{employee.area}</Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">ID: {employee.employee_id}</span>
            </div>
            {employee.submission_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Joined: {format(new Date(employee.submission_date), "MMM dd, yyyy")}
                </span>
              </div>
            )}
            {employee.company_id && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Company ID: {employee.company_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileHeader;
