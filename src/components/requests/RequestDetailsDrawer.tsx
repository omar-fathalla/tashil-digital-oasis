
import { useState } from "react";
import { format } from "date-fns";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/application-status/StatusBadge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { EmployeeRegistration } from "@/hooks/useEmployeeRegistrations";
import type { EmployeeRequest } from "@/hooks/useEmployeeRequests";

interface RequestDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: EmployeeRegistration | EmployeeRequest | null;
  type: "registration" | "request";
}

export function RequestDetailsDrawer({ open, onOpenChange, data, type }: RequestDetailsDrawerProps) {
  if (!data) return null;

  // Determine if this is a request with broken linked data
  const isBrokenLink = 
    type === "request" && 
    (data as EmployeeRequest).registration_id && 
    !(data as EmployeeRequest).employee_registrations;

  const request = data as EmployeeRequest;
  const registration = 
    type === "registration" 
      ? data as EmployeeRegistration 
      : (data as EmployeeRequest).employee_registrations || null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] overflow-y-auto">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>
              {type === "registration" ? "Registration Details" : "Request Details"}
            </DrawerTitle>
            <DrawerDescription>
              {type === "registration" 
                ? `Viewing registration for ${(data as EmployeeRegistration).full_name}`
                : `Viewing request from ${(data as EmployeeRequest).employee_name}`
              }
            </DrawerDescription>
          </DrawerHeader>

          {isBrokenLink && (
            <Alert variant="destructive" className="mx-4 mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This request references registration ID {request.registration_id} but the linked data is missing or inaccessible.
              </AlertDescription>
            </Alert>
          )}

          <div className="p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Basic Information</h4>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm col-span-2">{type === "registration" ? registration?.full_name : request.employee_name}</span>
                  
                  <span className="text-sm font-medium">Employee ID:</span>
                  <span className="text-sm col-span-2 font-mono">{type === "registration" ? registration?.employee_id : request.employee_id}</span>
                  
                  <span className="text-sm font-medium">Status:</span>
                  <div className="col-span-2">
                    <StatusBadge status={type === "registration" ? registration?.status || "unknown" : request.status} />
                  </div>
                  
                  <span className="text-sm font-medium">Type:</span>
                  <span className="text-sm col-span-2">{type === "registration" ? registration?.request_type || "Registration" : request.request_type}</span>
                  
                  <span className="text-sm font-medium">Submission:</span>
                  <span className="text-sm col-span-2">
                    {format(
                      new Date(
                        type === "registration" 
                          ? registration?.submission_date || new Date() 
                          : request.request_date || new Date()
                      ), 
                      "PPP"
                    )}
                  </span>
                </div>
              </div>

              {registration && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Additional Details</h4>
                  <div className="grid grid-cols-3 gap-2">
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
                    
                    {registration.phone && (
                      <>
                        <span className="text-sm font-medium">Phone:</span>
                        <span className="text-sm col-span-2">{registration.phone}</span>
                      </>
                    )}
                    
                    {registration.email && (
                      <>
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm col-span-2">{registration.email}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {request.notes && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                <p className="text-sm p-2 bg-muted rounded">{request.notes}</p>
              </div>
            )}

            {/* Photo display if available */}
            {registration?.photo_url && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Photo</h4>
                <div className="h-48 w-48 border rounded overflow-hidden">
                  <img 
                    src={registration.photo_url} 
                    alt={`Photo of ${registration.full_name}`} 
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

          <DrawerFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
