
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/application-status/StatusBadge";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { EmployeeRequest } from "@/hooks/requests/types";

interface RequestDetailsSheetProps {
  request: EmployeeRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDetailsSheet({ request, open, onOpenChange }: RequestDetailsSheetProps) {
  if (!request) {
    return null;
  }

  // Check if linked registration data exists
  const registration = request.employee_registrations;
  const hasBrokenLink = request.registration_id && !registration;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Request Details</SheetTitle>
          <SheetDescription>
            View details for {request.employee_name}'s request
          </SheetDescription>
        </SheetHeader>

        {hasBrokenLink && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This request references registration ID {request.registration_id} but the linked data is missing or inaccessible.
            </AlertDescription>
          </Alert>
        )}

        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Request Information</h4>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">Request ID:</span>
              <span className="text-sm col-span-2 font-mono">{request.id}</span>
              
              <span className="text-sm font-medium">Request Type:</span>
              <span className="text-sm col-span-2">{request.request_type}</span>
              
              <span className="text-sm font-medium">Employee Name:</span>
              <span className="text-sm col-span-2">{request.employee_name}</span>
              
              <span className="text-sm font-medium">Employee ID:</span>
              <span className="text-sm col-span-2 font-mono">{request.employee_id}</span>
              
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm col-span-2">
                {format(new Date(request.request_date || new Date()), "PPP")}
              </span>
              
              <span className="text-sm font-medium">Status:</span>
              <div className="col-span-2">
                <StatusBadge status={request.status} />
              </div>
              
              {request.notes && (
                <>
                  <span className="text-sm font-medium">Notes:</span>
                  <div className="text-sm col-span-2 bg-muted p-2 rounded">{request.notes}</div>
                </>
              )}
            </div>
          </div>

          {registration && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Registration Data</h4>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium">Full Name:</span>
                <span className="text-sm col-span-2">{registration.full_name}</span>
                
                {registration.national_id && (
                  <>
                    <span className="text-sm font-medium">National ID:</span>
                    <span className="text-sm col-span-2 font-mono">{registration.national_id}</span>
                  </>
                )}
                
                {registration.position && (
                  <>
                    <span className="text-sm font-medium">Position:</span>
                    <span className="text-sm col-span-2">{registration.position}</span>
                  </>
                )}
                
                {registration.area && (
                  <>
                    <span className="text-sm font-medium">Area:</span>
                    <span className="text-sm col-span-2">{registration.area}</span>
                  </>
                )}
                
                {registration.submission_date && (
                  <>
                    <span className="text-sm font-medium">Submission:</span>
                    <span className="text-sm col-span-2">
                      {format(new Date(registration.submission_date), "PPP")}
                    </span>
                  </>
                )}
              </div>

              {registration.photo_url && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Photo</h4>
                  <div className="h-48 w-48 border rounded overflow-hidden">
                    <img 
                      src={registration.photo_url} 
                      alt="Employee" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Handle broken image
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <SheetFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
