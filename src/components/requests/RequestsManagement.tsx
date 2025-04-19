
import { useState } from "react";
import { useEmployeeRequests, type EmployeeRequest, REJECTION_REASONS } from "@/hooks/useEmployeeRequests";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestsHeader } from "./RequestsHeader";
import { RequestsTable } from "./RequestsTable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function RequestsManagement() {
  const { requests, isLoading, updateRequestStatus } = useEmployeeRequests();
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRequest | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [customNote, setCustomNote] = useState("");

  const handleApprove = async (request: EmployeeRequest) => {
    await updateRequestStatus.mutate({
      id: request.id,
      status: "approved",
    });
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    const notes = rejectionReason === "Other" ? customNote : rejectionReason;
    
    await updateRequestStatus.mutate({
      id: selectedRequest.id,
      status: "rejected",
      notes,
    });
    
    setIsRejectDialogOpen(false);
    setRejectionReason("");
    setCustomNote("");
    setSelectedRequest(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RequestsHeader />
      
      <RequestsTable
        requests={requests}
        onApprove={handleApprove}
        onReject={(request) => {
          setSelectedRequest(request);
          setIsRejectDialogOpen(true);
        }}
        onView={(request) => {
          setSelectedRequest(request);
          setIsViewingDetails(true);
        }}
      />

      <Sheet open={isViewingDetails} onOpenChange={setIsViewingDetails}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Request Details</SheetTitle>
          </SheetHeader>
          
          {selectedRequest && (
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Employee Name</p>
                  <p className="font-medium">{selectedRequest.employee_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium font-mono">{selectedRequest.employee_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Request Type</p>
                  <p className="font-medium">{selectedRequest.request_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={
                      selectedRequest.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : selectedRequest.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {selectedRequest.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium mt-1 text-sm">{selectedRequest.notes}</p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please select or provide a reason for rejecting this request.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <Select
              value={rejectionReason}
              onValueChange={setRejectionReason}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rejection reason" />
              </SelectTrigger>
              <SelectContent>
                {REJECTION_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {rejectionReason === "Other" && (
              <Textarea
                placeholder="Enter custom rejection reason..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsRejectDialogOpen(false);
              setRejectionReason("");
              setCustomNote("");
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectionReason || (rejectionReason === "Other" && !customNote)}
            >
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
