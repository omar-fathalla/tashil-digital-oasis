
import { useState } from "react";
import { useEmployeeRequests, type EmployeeRequest } from "@/hooks/useEmployeeRequests";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Check, X } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function RequestsManagement() {
  const { requests, isLoading, updateRequestStatus } = useEmployeeRequests();
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRequest | null>(null);

  const handleUpdateStatus = async (status: "approved" | "rejected") => {
    if (!selectedRequest) return;
    
    await updateRequestStatus.mutate({
      id: selectedRequest.id,
      status,
      notes: status === "rejected" ? "Request rejected by admin" : undefined,
    });
    
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
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
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

              {selectedRequest.status === "pending" && (
                <DialogFooter className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateStatus("rejected")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button onClick={() => handleUpdateStatus("approved")}>
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
