
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/hooks/useEmployee";

interface EmployeeProfileHeaderProps {
  employee?: Employee | null;
  isLoading: boolean;
}

const EmployeeProfileHeader = ({ employee, isLoading }: EmployeeProfileHeaderProps) => {
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-500";
    
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "suspended":
        return "bg-red-500";
      case "on leave":
        return "bg-blue-500";
      case "probation":
        return "bg-orange-500";
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-2 text-center md:text-left">
              <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-4 w-72 mx-auto md:mx-0" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24">
              <AvatarFallback>??</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h1 className="text-2xl font-bold">Employee Not Found</h1>
              <p className="text-muted-foreground">
                The requested employee profile could not be found.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="h-24 w-24 border-2 border-muted">
            {employee.photo_url ? (
              <AvatarImage src={employee.photo_url} alt={employee.full_name} />
            ) : null}
            <AvatarFallback className="text-lg">
              {getInitials(employee.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-bold">{employee.full_name}</h1>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge className={getStatusColor(employee.status)}>
                {employee.status || "Unknown Status"}
              </Badge>
              <Badge variant="outline">{employee.employee_id}</Badge>
              {employee.position && (
                <Badge variant="secondary">{employee.position}</Badge>
              )}
            </div>
            
            <p className="text-muted-foreground">
              {employee.position}
              {employee.area ? ` — ${employee.area}` : ""}
              {employee.company_name ? ` at ${employee.company_name}` : ""}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:gap-6 text-sm text-muted-foreground pt-2">
              {employee.email && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span>Email:</span>
                  <a href={`mailto:${employee.email}`} className="text-primary">
                    {employee.email}
                  </a>
                </div>
              )}
              
              {employee.phone && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span>Phone:</span>
                  <a href={`tel:${employee.phone}`} className="text-primary">
                    {employee.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileHeader;
