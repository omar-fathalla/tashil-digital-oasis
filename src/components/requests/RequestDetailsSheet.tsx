
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { EmployeeRequest } from "@/hooks/useEmployeeRequests";

interface RequestDetailsSheetProps {
  request: EmployeeRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDetailsSheet({ request, open, onOpenChange }: RequestDetailsSheetProps) {
  if (!request) return null;

  const isCompanyRequest = request.type === "company";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Request Details</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            {isCompanyRequest ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{request.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company Number</p>
                  <p className="font-medium font-mono">{request.company_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Card Number</p>
                  <p className="font-medium">{request.tax_card_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commercial Register</p>
                  <p className="font-medium">{request.commercial_register_number}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Employee Name</p>
                  <p className="font-medium">{request.employee_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium font-mono">{request.employee_id}</p>
                </div>
              </>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Request Type</p>
              <p className="font-medium">{request.request_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={
                  request.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : request.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
          </div>

          {request.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="font-medium mt-1 text-sm">{request.notes}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
