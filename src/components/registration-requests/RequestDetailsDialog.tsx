import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface RegistrationRequest {
  id: string;
  full_name: string;
  national_id: string;
  submission_date: string;
  status: string;
  documents: any;
  photo_url?: string;
}

export function RequestDetailsDialog({
  request,
  onClose,
  onApprove,
  onReject,
}: {
  request: RegistrationRequest;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove(request.id);
      toast({
        title: "Request Approved",
        description: "This request has been successfully approved.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve the request.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await onReject(request.id, rejectionReason);
      toast({
        title: "Request Rejected",
        description: "This request has been successfully rejected.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the request.",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
          <DialogDescription>
            View detailed information about the registration request.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Full Name
            </Label>
            <Input
              type="text"
              id="name"
              value={request.full_name}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nationalId" className="text-right">
              National ID
            </Label>
            <Input
              type="text"
              id="nationalId"
              value={request.national_id}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="submissionDate" className="text-right">
              Submission Date
            </Label>
            <Input
              type="text"
              id="submissionDate"
              value={request.submission_date}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Input
              type="text"
              id="status"
              value={request.status}
              readOnly
              className="col-span-3"
            />
          </div>
        </div>
        {request.photo_url && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">ID Photo</h4>
            <img 
              src={request.photo_url} 
              alt="ID Photo" 
              className="w-32 h-32 object-cover rounded-md"
            />
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rejectionReason" className="text-right">
              Rejection Reason
            </Label>
            <Input
              type="text"
              id="rejectionReason"
              placeholder="Enter reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isRejecting}
            onClick={handleReject}
          >
            {isRejecting ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            type="button"
            disabled={isApproving}
            onClick={handleApprove}
          >
            {isApproving ? "Approving..." : "Approve"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
