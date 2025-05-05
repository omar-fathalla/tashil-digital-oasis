
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/application-status/StatusBadge";
import type { EmployeeRegistration } from "@/hooks/useEmployeeRegistrations";
import type { EmployeeRequest } from "@/hooks/useEmployeeRequests";

type RequestDataType = "registration" | "employee" | "company";

interface RequestDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: EmployeeRegistration | EmployeeRequest | null;
  type: RequestDataType;
}

export function RequestDetailsDrawer({ 
  open, 
  onOpenChange, 
  data, 
  type 
}: RequestDetailsDrawerProps) {
  if (!data) return null;

  // Determine if we're dealing with an EmployeeRegistration or EmployeeRequest
  const isRegistration = type === "registration";
  
  // Format date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-3xl mx-auto">
        <div className="p-6">
          <DrawerHeader className="flex items-center justify-between p-0 mb-4">
            <DrawerTitle className="text-xl font-semibold">
              {isRegistration ? "Registration Details" : "Request Details"}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </DrawerHeader>
          
          {/* Request Status Banner */}
          <div className="mb-6 p-3 bg-muted/30 rounded-md flex justify-between items-center">
            <div>
              <span className="text-sm font-medium mr-2">Status:</span>
              <StatusBadge status={data.status} />
            </div>
            <div className="text-sm text-muted-foreground">
              Submitted: {formatDate(isRegistration ? data.submission_date : (data as EmployeeRequest).request_date)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{isRegistration ? data.full_name : (data as EmployeeRequest).employee_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-medium font-mono">{data.employee_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Request Type</p>
                  <p className="font-medium">{data.request_type || "Registration"}</p>
                </div>
                {isRegistration && data.position && (
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{data.position}</p>
                  </div>
                )}
                {isRegistration && data.area && (
                  <div>
                    <p className="text-sm text-muted-foreground">Area/Department</p>
                    <p className="font-medium">{data.area}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 gap-3">
                {isRegistration && data.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium break-all">{data.email}</p>
                  </div>
                )}
                {isRegistration && data.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{data.phone}</p>
                  </div>
                )}
                {isRegistration && data.address && (
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{data.address}</p>
                  </div>
                )}
                {isRegistration && data.national_id && (
                  <div>
                    <p className="text-sm text-muted-foreground">National ID</p>
                    <p className="font-medium font-mono">{data.national_id}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional Information for non-registration requests */}
          {!isRegistration && (data as EmployeeRequest).notes && (
            <div className="mt-6 p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-2">Notes</h3>
              <p className="text-muted-foreground">{(data as EmployeeRequest).notes}</p>
            </div>
          )}
          
          {/* Photo if available */}
          {isRegistration && data.photo_url && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Photo</h3>
              <div className="w-32 h-32 rounded-md overflow-hidden border">
                <img 
                  src={data.photo_url} 
                  alt={`Photo of ${data.full_name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
