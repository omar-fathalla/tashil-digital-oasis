
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/application-status/StatusBadge";
import { 
  Calendar, 
  FileText, 
  Info, 
  User, 
  Building, 
  Mail,
  Phone,
  MapPin,
  Briefcase
} from "lucide-react";
import { format } from "date-fns";
import { EmployeeRequest, EmployeeRegistration, RequestDetailsData } from "@/hooks/requests/types";
import { Dispatch, SetStateAction } from "react";

export interface RequestDetailsDrawerProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  data: RequestDetailsData | null;
  type: "registration" | "company" | "employee";
}

export function RequestDetailsDrawer({ 
  open, 
  onOpenChange, 
  data, 
  type 
}: RequestDetailsDrawerProps) {
  if (!data) return null;
  
  // Determine if the data is an EmployeeRegistration or EmployeeRequest
  const isRegistration = type === "registration";
  
  // Get the correct fields based on data type
  const displayName = isRegistration
    ? (data as EmployeeRegistration).full_name
    : (data as EmployeeRequest).employee_name;
    
  const employeeId = isRegistration
    ? (data as EmployeeRegistration).employee_id
    : (data as EmployeeRequest).employee_id;
    
  const status = isRegistration
    ? (data as EmployeeRegistration).status || "pending"
    : (data as EmployeeRequest).status;
    
  const requestType = isRegistration
    ? (data as EmployeeRegistration).request_type || "Registration"
    : (data as EmployeeRequest).request_type;
    
  const date = isRegistration
    ? (data as EmployeeRegistration).submission_date
    : (data as EmployeeRequest).request_date;
    
  const companyName = isRegistration
    ? (data as EmployeeRegistration).company_name
    : (data as EmployeeRequest).company_name;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">{displayName}</h2>
              <div className="flex items-center text-sm text-muted-foreground space-x-2">
                <span>ID: {employeeId}</span>
                <StatusBadge status={status} />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-medium">Request Type:</span>
              <span>{requestType}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">Date:</span>
              <span>{date ? format(new Date(date), "PPP") : "N/A"}</span>
            </div>

            {companyName && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-primary" />
                <span className="font-medium">Company:</span>
                <span>{companyName}</span>
              </div>
            )}

            {!isRegistration && (data as EmployeeRequest).notes && (
              <div className="flex items-start gap-2 text-sm">
                <Info className="h-4 w-4 text-primary mt-0.5" />
                <span className="font-medium">Notes:</span>
                <span>{(data as EmployeeRequest).notes}</span>
              </div>
            )}
            
            {!isRegistration && (data as EmployeeRequest).type === "company" && (
              <div className="mt-3 border-t pt-3 space-y-3">
                <h3 className="font-medium">Company Information</h3>
                
                {(data as EmployeeRequest).company_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-primary" />
                    <span className="font-medium">Company Number:</span>
                    <span>{(data as EmployeeRequest).company_number}</span>
                  </div>
                )}
                
                {(data as EmployeeRequest).tax_card_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">Tax Card Number:</span>
                    <span>{(data as EmployeeRequest).tax_card_number}</span>
                  </div>
                )}
                
                {(data as EmployeeRequest).commercial_register_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">Commercial Register:</span>
                    <span>{(data as EmployeeRequest).commercial_register_number}</span>
                  </div>
                )}
              </div>
            )}
            
            {isRegistration && (
              <div className="mt-3 border-t pt-3 space-y-3">
                <h3 className="font-medium">Personal Information</h3>
                
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">Full Name:</span>
                  <span>{(data as EmployeeRegistration).full_name}</span>
                </div>
                
                {(data as EmployeeRegistration).position && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="font-medium">Position:</span>
                    <span>{(data as EmployeeRegistration).position}</span>
                  </div>
                )}
                
                {(data as EmployeeRegistration).area && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="font-medium">Department/Area:</span>
                    <span>{(data as EmployeeRegistration).area}</span>
                  </div>
                )}
                
                {(data as EmployeeRegistration).email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="font-medium">Email:</span>
                    <span>{(data as EmployeeRegistration).email}</span>
                  </div>
                )}
                
                {(data as EmployeeRegistration).phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="font-medium">Phone:</span>
                    <span>{(data as EmployeeRegistration).phone}</span>
                  </div>
                )}
                
                {(data as EmployeeRegistration).address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">Address:</span>
                    <span>{(data as EmployeeRegistration).address}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
