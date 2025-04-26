
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Employee } from "@/hooks/useEmployee";

interface EmployeeInformationProps {
  employee?: Employee;
  isLoading: boolean;
}

const EmployeeInformation = ({ employee, isLoading }: EmployeeInformationProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(4).fill(null).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(4).fill(null).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Employee data not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
              <dd className="text-lg">{employee.full_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">First Name</dt>
              <dd className="text-lg">{employee.first_name}</dd>
            </div>
            {employee.mid_name && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Middle Name</dt>
                <dd className="text-lg">{employee.mid_name}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Last Name</dt>
              <dd className="text-lg">{employee.last_name}</dd>
            </div>
            {employee.sex && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
                <dd className="text-lg">{employee.sex}</dd>
              </div>
            )}
            {employee.national_id && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">National ID</dt>
                <dd className="text-lg">{employee.national_id}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Employment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Employee ID</dt>
              <dd className="text-lg">{employee.employee_id}</dd>
            </div>
            {employee.position && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Position</dt>
                <dd className="text-lg">{employee.position}</dd>
              </div>
            )}
            {employee.area && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Department/Area</dt>
                <dd className="text-lg">{employee.area}</dd>
              </div>
            )}
            {employee.insurance_number && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Insurance Number</dt>
                <dd className="text-lg">{employee.insurance_number}</dd>
              </div>
            )}
            {employee.request_type && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Request Type</dt>
                <dd className="text-lg">{employee.request_type}</dd>
              </div>
            )}
            {employee.company_name && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Company</dt>
                <dd className="text-lg">{employee.company_name}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeInformation;
