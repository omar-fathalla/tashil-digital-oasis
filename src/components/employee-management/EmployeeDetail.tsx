
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyEmployee } from "@/types/employee";

interface EmployeeDetailProps {
  employee: CompanyEmployee | null;
  open: boolean;
  onClose: () => void;
}

export function EmployeeDetail({ employee, open, onClose }: EmployeeDetailProps) {
  if (!employee) return null;

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            Complete information for {employee.full_name}
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3">
                    <span className="font-medium">Full Name:</span>
                    <span className="col-span-2">{employee.full_name}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-medium">National ID:</span>
                    <span className="col-span-2">{employee.national_id}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-medium">Employee ID:</span>
                    <span className="col-span-2">{employee.employee_id}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-medium">Insurance Number:</span>
                    <span className="col-span-2">{employee.insurance_number}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-medium">Gender:</span>
                    <span className="col-span-2">{employee.gender === 'male' ? 'Male' : 'Female'}</span>
                  </div>
                  {employee.position && (
                    <div className="grid grid-cols-3">
                      <span className="font-medium">Position:</span>
                      <span className="col-span-2">{employee.position}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Contact & Location</h3>
                <div className="space-y-2">
                  {employee.address && (
                    <div className="grid grid-cols-3">
                      <span className="font-medium">Address:</span>
                      <span className="col-span-2">{employee.address}</span>
                    </div>
                  )}
                  {employee.area && (
                    <div className="grid grid-cols-3">
                      <span className="font-medium">Area:</span>
                      <span className="col-span-2">{employee.area}</span>
                    </div>
                  )}
                  {employee.email && (
                    <div className="grid grid-cols-3">
                      <span className="font-medium">Email:</span>
                      <span className="col-span-2">{employee.email}</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-4">Registration Details</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3">
                    <span className="font-medium">Status:</span>
                    <span className="col-span-2">{employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-medium">Submitted On:</span>
                    <span className="col-span-2">{formatDate(employee.submission_date)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {employee.documents && Object.keys(employee.documents).length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Uploaded Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(employee.documents).map(([key, url]) => (
                    <a 
                      key={key} 
                      href={url as string} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-4 border rounded-md hover:bg-gray-50"
                    >
                      <div className="w-full h-32 mb-2 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        {(url as string).toLowerCase().endsWith('.pdf') ? (
                          <div className="text-center p-2">
                            <span className="text-sm">PDF Document</span>
                          </div>
                        ) : (
                          <img 
                            src={url as string} 
                            alt={`${key} document`} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
