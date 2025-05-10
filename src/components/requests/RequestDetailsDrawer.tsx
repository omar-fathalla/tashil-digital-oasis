
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/application-status/StatusBadge";
import type { EmployeeRegistration } from "@/hooks/useEmployeeRegistrations";
import type { EmployeeRequest } from "@/hooks/requests/types";

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

  // Safe access helper functions to handle type differences
  const getSubmissionDate = () => {
    if (isRegistration && 'submission_date' in data) {
      return data.submission_date;
    } else if (!isRegistration && 'request_date' in data) {
      return data.request_date;
    }
    return undefined;
  };

  const getName = () => {
    if (isRegistration && 'full_name' in data) {
      return data.full_name;
    } else if (!isRegistration && 'employee_name' in data) {
      return data.employee_name;
    }
    return "N/A";
  };

  const getEmployeeId = () => {
    if ('employee_id' in data) {
      return data.employee_id || "N/A";
    }
    return "N/A";
  };

  // Get company name if available
  const getCompanyName = () => {
    if ('company_name' in data) {
      return data.company_name || "N/A";
    }
    return "N/A";
  };
  
  // Get additional company info for company requests
  const getCompanyInfo = () => {
    if (type === 'company' && 'company_number' in data) {
      return {
        companyNumber: data.company_number || "N/A",
        taxCardNumber: data.tax_card_number || "N/A",
        commercialRegisterNumber: data.commercial_register_number || "N/A"
      };
    }
    return null;
  };
  
  const companyInfo = getCompanyInfo();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-3xl mx-auto">
        <div className="p-6">
          <DrawerHeader className="flex items-center justify-between p-0 mb-4">
            <DrawerTitle className="text-xl font-semibold">
              {isRegistration ? "Registration Details" : type === "company" ? "Company Request Details" : "Request Details"}
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
              <StatusBadge status={data.status || 'pending'} />
            </div>
            <div className="text-sm text-muted-foreground">
              Submitted: {formatDate(getSubmissionDate())}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {type === 'company' ? 'Contact Person' : 'Full Name'}
                  </p>
                  <p className="font-medium">{getName()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-medium font-mono">{getEmployeeId()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{getCompanyName()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Request Type</p>
                  <p className="font-medium">{(data.request_type as string) || "Registration"}</p>
                </div>
                {'position' in data && data.position && (
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{data.position}</p>
                  </div>
                )}
                {'area' in data && data.area && (
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
                {'email' in data && data.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium break-all">{data.email}</p>
                  </div>
                )}
                {'phone' in data && data.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{data.phone}</p>
                  </div>
                )}
                {'address' in data && data.address && (
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{data.address}</p>
                  </div>
                )}
                {'national_id' in data && data.national_id && (
                  <div>
                    <p className="text-sm text-muted-foreground">National ID</p>
                    <p className="font-medium font-mono">{data.national_id}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Company Details for company requests */}
          {type === 'company' && companyInfo && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Company Number</p>
                  <p className="font-medium font-mono">{companyInfo.companyNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Card Number</p>
                  <p className="font-medium font-mono">{companyInfo.taxCardNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commercial Register Number</p>
                  <p className="font-medium font-mono">{companyInfo.commercialRegisterNumber}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Additional Information for non-registration requests */}
          {!isRegistration && 'notes' in data && data.notes && (
            <div className="mt-6 p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-2">Notes</h3>
              <p className="text-muted-foreground">{String(data.notes)}</p>
            </div>
          )}
          
          {/* Photo if available */}
          {'photo_url' in data && data.photo_url && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Photo</h3>
              <div className="w-32 h-32 rounded-md overflow-hidden border">
                <img 
                  src={data.photo_url} 
                  alt={`Photo of ${getName()}`}
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
