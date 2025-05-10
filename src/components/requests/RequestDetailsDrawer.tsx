
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState, Dispatch, SetStateAction } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { ensureDemoData } from "@/utils/seedDemoData";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/application-status/StatusBadge";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { EmployeeRequest, EmployeeRegistration } from "@/hooks/requests/types";

export function SeedCompanyDataButton() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSeedCompanyData = async () => {
    setIsLoading(true);
    try {
      await ensureDemoData();
      
      // Refresh any cached data
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      
      toast.success("Successfully added company data");
    } catch (error) {
      console.error("Error seeding company data:", error);
      toast.error("Failed to add company data");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleSeedCompanyData}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          Adding Companies...
        </>
      ) : (
        'Add Sample Companies'
      )}
    </Button>
  );
}

// Define the props interface for RequestDetailsDrawer
export interface RequestDetailsDrawerProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  data: EmployeeRequest | EmployeeRegistration | null;
  type: "employee" | "registration" | "company";
}

export const RequestDetailsDrawer = ({ open, onOpenChange, data, type }: RequestDetailsDrawerProps) => {
  if (!data) {
    return null;
  }

  // Check if it's a registration request
  const isRegistration = type === "registration";
  
  // Check if linked registration data exists for employee requests
  const registration = isRegistration 
    ? data as EmployeeRegistration
    : (data as EmployeeRequest).employee_registrations;
    
  const hasBrokenLink = !isRegistration && (data as EmployeeRequest).registration_id && !registration;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Request Details</SheetTitle>
          <SheetDescription>
            View details for {isRegistration 
              ? (data as EmployeeRegistration).full_name 
              : (data as EmployeeRequest).employee_name}'s request
          </SheetDescription>
        </SheetHeader>

        {hasBrokenLink && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This request references registration ID {(data as EmployeeRequest).registration_id} but the linked data is missing or inaccessible.
            </AlertDescription>
          </Alert>
        )}

        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Request Information</h4>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium">ID:</span>
              <span className="text-sm col-span-2 font-mono">{data.id}</span>
              
              {!isRegistration && (
                <>
                  <span className="text-sm font-medium">Request Type:</span>
                  <span className="text-sm col-span-2">{(data as EmployeeRequest).request_type}</span>
                </>
              )}
              
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm col-span-2">
                {isRegistration 
                  ? (data as EmployeeRegistration).full_name 
                  : (data as EmployeeRequest).employee_name}
              </span>
              
              <span className="text-sm font-medium">ID Number:</span>
              <span className="text-sm col-span-2 font-mono">
                {isRegistration 
                  ? (data as EmployeeRegistration).employee_id 
                  : (data as EmployeeRequest).employee_id}
              </span>
              
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm col-span-2">
                {format(new Date(
                  isRegistration 
                    ? (data as EmployeeRegistration).submission_date || new Date()
                    : (data as EmployeeRequest).request_date || new Date()
                ), "PPP")}
              </span>
              
              <span className="text-sm font-medium">Status:</span>
              <div className="col-span-2">
                <StatusBadge status={data.status} />
              </div>
              
              {!isRegistration && (data as EmployeeRequest).notes && (
                <>
                  <span className="text-sm font-medium">Notes:</span>
                  <div className="text-sm col-span-2 bg-muted p-2 rounded">
                    {String((data as EmployeeRequest).notes || "")}
                  </div>
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
};
