
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CheckCircle2, XCircle, FileText, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type RegistrationRequest = {
  id: string;
  full_name: string;
  national_id: string;
  submission_date: string;
  status: "pending" | "approved" | "rejected";
  employee_details: any;
  documents: any;
  submission_history: any[];
};

type RequestDetailsDialogProps = {
  request: RegistrationRequest | null;
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
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionType, setRejectionType] = useState("missing-documents");
  const { toast } = useToast();

  if (!request) return null;

  const rejectionReasons = {
    "missing-documents": "Missing required documents",
    "outdated-documents": "Outdated documents",
    "incorrect-information": "Incorrect information provided",
    "document-quality": "Poor document quality/unreadable",
    "other": "Other reason"
  };

  async function updateStatus(newStatus: "approved" | "rejected") {
    try {
      setIsUpdating(true);
      
      // Generate a unique ID for approved requests
      let idCard = null;
      if (newStatus === "approved") {
        idCard = {
          id: `EMP-${Math.floor(100000 + Math.random() * 900000)}`,
          issue_date: new Date().toISOString(),
          expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
        };
      }
      
      const statusUpdate = {
        status: newStatus,
        submission_history: [
          ...(request.submission_history || []),
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            reason: newStatus === "rejected" ? rejectionReason : undefined,
            rejection_type: newStatus === "rejected" ? rejectionType : undefined,
            updated_by: "admin" // In a real app, this would be the actual user ID
          },
        ],
      };
      
      // For approved requests, add the ID card information
      if (newStatus === "approved") {
        statusUpdate.id_card = idCard;
      }

      const { error } = await supabase
        .from("registration_requests")
        .update(statusUpdate)
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: `Request ${newStatus}`,
        description: newStatus === "approved" 
          ? "Digital ID has been generated and employee notified" 
          : "Employee has been notified with rejection reason",
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

  const getDocumentStatus = (doc: any) => {
    if (!doc) return "Missing";
    return "Uploaded";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Registration Request Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium text-lg">{request.full_name}</span>
              <span className="text-sm text-muted-foreground">#{request.national_id}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium 
              ${request.status === "approved" ? "bg-green-100 text-green-800" : 
                request.status === "rejected" ? "bg-red-100 text-red-800" : 
                "bg-yellow-100 text-yellow-800"}`}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Details Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">Employee Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Full Name:</span> {request.full_name}</p>
                <p><span className="font-medium">National ID:</span> {request.national_id}</p>
                <p>
                  <span className="font-medium">Submission Date:</span>{" "}
                  {format(new Date(request.submission_date), "PPP")}
                </p>
              </div>
              
              {request.employee_details && (
                <div className="mt-4 space-y-2">
                  {Object.entries(request.employee_details).map(([key, value]) => (
                    <p key={key}>
                      <span className="font-medium">{key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:</span>{" "}
                      {String(value)}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">Required Documents</h3>
              <div className="grid grid-cols-1 gap-3">
                {request.documents && Object.entries(request.documents).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between items-center border rounded-lg p-3">
                    <div>
                      <p className="font-medium capitalize">{key.replace(/_/g, " ")}</p>
                      <p className={`text-sm ${value ? "text-green-600" : "text-red-600"}`}>
                        {getDocumentStatus(value)}
                      </p>
                    </div>
                    {value && (
                      <a 
                        href={value} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:text-blue-700 text-sm underline"
                      >
                        View Document
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ID Card Section (for approved requests) */}
          {request.status === "approved" && request.id_card && (
            <div className="mt-4 border rounded-lg p-4 bg-green-50">
              <h3 className="font-medium text-lg mb-2 text-green-800 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Digital ID Card Generated
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <p><span className="font-medium">ID Number:</span> {request.id_card.id}</p>
                <p><span className="font-medium">Issue Date:</span> {format(new Date(request.id_card.issue_date), "PPP")}</p>
                <p><span className="font-medium">Expiry Date:</span> {format(new Date(request.id_card.expiry_date), "PPP")}</p>
              </div>
            </div>
          )}

          {/* Submission History Section */}
          <div>
            <h3 className="font-medium text-lg border-b pb-2 mb-3">Submission History</h3>
            <div className="space-y-3">
              {request.submission_history && request.submission_history.map((history: any, index: number) => (
                <div key={index} className="flex items-start gap-3 border-l-2 border-gray-200 pl-4 py-1">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {format(new Date(history.timestamp), "PPP p")}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                        ${history.status === "approved" ? "bg-green-100 text-green-800" : 
                          history.status === "rejected" ? "bg-red-100 text-red-800" : 
                          "bg-yellow-100 text-yellow-800"}`}
                      >
                        {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                      </span>
                    </div>
                    {history.reason && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Reason:</span> {history.reason}
                        {history.rejection_type && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({rejectionReasons[history.rejection_type as keyof typeof rejectionReasons]})
                          </span>
                        )}
                      </p>
                    )}
                    {history.updated_by && (
                      <p className="text-xs text-gray-500 mt-1">By: {history.updated_by}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Area */}
          {request.status === "pending" && (
            <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between pt-4 border-t">
              <div className="w-full">
                {/* Rejection Form */}
                <div className={`space-y-3 ${isUpdating ? "opacity-50" : ""}`}>
                  <h4 className="font-medium">If rejecting, please provide feedback:</h4>
                  <Select 
                    value={rejectionType}
                    onValueChange={setRejectionType}
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(rejectionReasons).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Please explain what needs to be corrected or additional documents that need to be uploaded."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    disabled={isUpdating}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <div className="flex gap-4 justify-end sm:min-w-[200px]">
                <Button
                  variant="outline"
                  onClick={() => updateStatus("rejected")}
                  disabled={isUpdating || rejectionReason.trim().length === 0}
                  className="flex items-center gap-1"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
                <Button
                  onClick={() => updateStatus("approved")}
                  disabled={isUpdating}
                  className="flex items-center gap-1"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </Button>
              </div>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
