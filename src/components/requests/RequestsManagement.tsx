
import { useState } from "react";
import { useEmployeeRequests, type EmployeeRequest, REJECTION_REASONS } from "@/hooks/useEmployeeRequests";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { FileText, Check, X } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

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
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Requests</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.employee_name}</TableCell>
                <TableCell className="font-mono">{request.employee_id}</TableCell>
                <TableCell>{request.request_type}</TableCell>
                <TableCell>{format(new Date(request.request_date), "PPP")}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {request.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(request)}
                        className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsRejectDialogOpen(true);
                        }}
                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsViewingDetails(true);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
                  <p className="font-medium">{selectedRequest.notes}</p>
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
