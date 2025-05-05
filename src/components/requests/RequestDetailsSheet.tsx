
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileTextIcon, UserIcon } from "lucide-react";
import { CardSection } from "@/components/ui/card-layout/CardSection";
import { BaseCard } from "@/components/ui/card-layout/BaseCard";
import type { EmployeeRequest } from "@/hooks/useEmployeeRequests";

interface RequestDetailsSheetProps {
  request: EmployeeRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDetailsSheet({ request, open, onOpenChange }: RequestDetailsSheetProps) {
  if (!request) return null;
  
  // Get registration data if available
  const registration = request.employee_registrations || null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-xl flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-primary" />
            Request Details
          </SheetTitle>
          <SheetDescription>
            Viewing details for request submitted on{" "}
            {format(new Date(request.request_date || new Date()), "PPP")}
          </SheetDescription>
          <div className="flex items-center gap-2 pt-1">
            <Badge
              variant="outline"
              className={
                request.status === "approved"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : request.status === "rejected"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
              }
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
            <Badge variant="outline" className="bg-primary/10">
              {request.request_type}
            </Badge>
            <Badge variant="outline" className="bg-secondary/10 capitalize">
              {request.type} Request
            </Badge>
          </div>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <CardSection 
            title="Request Information"
            description="Basic information about this request"
          >
            <BaseCard className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Request ID</p>
                  <p className="font-mono text-sm">{request.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submission Date</p>
                  <p className="font-mono text-sm">
                    {format(new Date(request.request_date || new Date()), "PPP")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Request Type</p>
                  <p>{request.request_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="capitalize">{request.status}</p>
                </div>
              </div>
            </BaseCard>
          </CardSection>
          
          <Separator />
          
          {request.type === 'employee' ? (
            <CardSection 
              title="Employee Information"
              description="Details about the employee associated with this request"
            >
              <BaseCard className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Employee Name</p>
                    <p>{registration?.full_name || request.employee_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                    <p className="font-mono text-sm">{registration?.employee_id || request.employee_id}</p>
                  </div>
                  {registration && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">National ID</p>
                        <p className="font-mono text-sm">{registration.national_id || "Not available"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <p>{registration.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Position</p>
                        <p>{registration.position || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Hire Date</p>
                        <p>{registration.hire_date ? format(new Date(registration.hire_date), "PPP") : "Not specified"}</p>
                      </div>
                    </>
                  )}
                </div>
                
                {registration?.photo_url && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Photo</p>
                    <img 
                      src={registration.photo_url} 
                      alt="Employee Photo" 
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </BaseCard>
            </CardSection>
          ) : (
            <CardSection 
              title="Company Information"
              description="Details about the company associated with this request"
            >
              <BaseCard className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                    <p>{request.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company Number</p>
                    <p className="font-mono text-sm">{request.company_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tax Card Number</p>
                    <p className="font-mono text-sm">{request.tax_card_number || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Commercial Register</p>
                    <p className="font-mono text-sm">{request.commercial_register_number || "Not available"}</p>
                  </div>
                </div>
              </BaseCard>
            </CardSection>
          )}
          
          {request.notes && (
            <>
              <Separator />
              <CardSection 
                title="Notes"
                description="Additional information about this request"
              >
                <BaseCard>
                  <p className="text-sm whitespace-pre-line">{request.notes}</p>
                </BaseCard>
              </CardSection>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
