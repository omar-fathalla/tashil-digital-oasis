
import { useState } from "react";
import { useEmployeeRequests, type EmployeeRequest } from "@/hooks/useEmployeeRequests";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestsHeader } from "./RequestsHeader";
import { RequestsTable } from "./RequestsTable";
import { RequestDetailsSheet } from "./RequestDetailsSheet";
import { RejectRequestDialog } from "./RejectRequestDialog";

interface RequestsManagementProps {
  type?: "employee" | "company";
}

export function RequestsManagement({ type = "employee" }: RequestsManagementProps) {
  const { requests, isLoading, updateRequestStatus } = useEmployeeRequests();
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRequest | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [customNote, setCustomNote] = useState("");

  const filteredRequests = requests.filter(request => request.type === type);

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
      <RequestsHeader type={type} />
      
      <RequestsTable
        requests={filteredRequests}
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

      <RequestDetailsSheet
        request={selectedRequest}
        open={isViewingDetails}
        onOpenChange={setIsViewingDetails}
      />

      <RejectRequestDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        selectedRequest={selectedRequest}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        customNote={customNote}
        setCustomNote={setCustomNote}
        onConfirm={handleReject}
      />
    </div>
  );
}
