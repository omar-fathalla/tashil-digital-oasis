
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type RequestDetailsDialogProps = {
  request: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: () => void;
};

export function RequestDetailsDialog({
  request,
  open,
  onOpenChange,
  onStatusUpdate,
}: RequestDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  if (!request) return null;

  async function updateStatus(newStatus: "approved" | "rejected") {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("registration_requests")
        .update({
          status: newStatus,
          submission_history: [
            ...(request.submission_history || []),
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
            },
          ],
        })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Request has been ${newStatus}`,
      });
      
      onOpenChange(false);
      onStatusUpdate();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Registration Request Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Basic Information</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Full Name:</span> {request.full_name}</p>
                <p><span className="font-medium">National ID:</span> {request.national_id}</p>
                <p>
                  <span className="font-medium">Submitted:</span>{" "}
                  {format(new Date(request.submission_date), "PPP")}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Employee Details</h3>
              <pre className="mt-2 whitespace-pre-wrap text-sm">
                {JSON.stringify(request.employee_details, null, 2)}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {request.documents && Object.entries(request.documents).map(([key, value]: [string, any]) => (
                <div key={key} className="p-4 border rounded-lg">
                  <p className="font-medium capitalize">{key.replace(/_/g, " ")}</p>
                  {value && <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Document</a>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Submission History</h3>
            <div className="space-y-2">
              {request.submission_history && request.submission_history.map((history: any, index: number) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">
                    {format(new Date(history.timestamp), "PPP p")}:
                  </span>{" "}
                  Status changed to {history.status}
                </div>
              ))}
            </div>
          </div>

          {request.status === "pending" && (
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => updateStatus("rejected")}
                disabled={isUpdating}
              >
                Reject
              </Button>
              <Button
                onClick={() => updateStatus("approved")}
                disabled={isUpdating}
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
