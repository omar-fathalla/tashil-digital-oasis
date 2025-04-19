
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
import type { EmployeeRequest, RejectionReason } from "@/hooks/useEmployeeRequests";
import { REJECTION_REASONS } from "@/hooks/useEmployeeRequests";

interface RejectRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: EmployeeRequest | null;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  customNote: string;
  setCustomNote: (note: string) => void;
  onConfirm: () => void;
}

export function RejectRequestDialog({
  open,
  onOpenChange,
  selectedRequest,
  rejectionReason,
  setRejectionReason,
  customNote,
  setCustomNote,
  onConfirm,
}: RejectRequestDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
            onOpenChange(false);
            setRejectionReason("");
            setCustomNote("");
          }}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!rejectionReason || (rejectionReason === "Other" && !customNote)}
          >
            Confirm Rejection
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
