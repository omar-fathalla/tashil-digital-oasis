
import { useState } from "react";
import { FileCheck, FileX, FileClock, Download, Printer, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type RegistrationRequest } from "@/hooks/useRegistrationRequests";
import { DigitalID } from "./DigitalID";

type RequestDetailsDialogProps = {
  request: RegistrationRequest;
  open: boolean;
  onClose: () => void;
  onApprove: (requestId: string, notes?: string) => Promise<void>;
  onReject: (requestId: string, reason: string) => Promise<void>;
};

export const RequestDetailsDialog = ({ 
  request, 
  open, 
  onClose,
  onApprove,
  onReject
}: RequestDetailsDialogProps) => {
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(request.id, notes);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReject = async () => {
    if (!rejectionReason) return;
    
    setIsSubmitting(true);
    try {
      await onReject(request.id, rejectionReason);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusBadge = () => {
    switch (request.status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1 py-1 px-2">
            <FileCheck className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1 py-1 px-2">
            <FileX className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1 py-1 px-2">
            <FileClock className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>Registration Request: {request.id}</span>
            {getStatusBadge()}
          </DialogTitle>
          <DialogDescription>
            Submitted on {new Date(request.submissionDate).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Employee Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            {request.status === "approved" && (
              <TabsTrigger value="id">Digital ID</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm text-gray-500">Employee Name</h3>
                <p className="font-medium">{request.employeeName}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">Employee ID</h3>
                <p>{request.employeeId}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">National ID</h3>
                <p>{request.nationalId}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">Insurance Number</h3>
                <p>{request.insuranceNumber}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">Position</h3>
                <p className="capitalize">{request.position}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">Company</h3>
                <p>{request.company}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">Area</h3>
                <p className="capitalize">{request.area}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Reviewer Information</h3>
              {request.status !== "pending" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Reviewer</h3>
                    <p>{request.reviewerName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Review Date</h3>
                    <p>{request.reviewDate && new Date(request.reviewDate).toLocaleString()}</p>
                  </div>
                  {request.status === "rejected" && (
                    <div className="col-span-2">
                      <h3 className="font-medium text-sm text-gray-500">Rejection Reason</h3>
                      <p className="text-red-600">{request.rejectionReason}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <h3 className="font-medium text-sm text-gray-500">Notes</h3>
                    <p>{request.notes || "No notes provided"}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {request.status === "pending" && (
                    <>
                      <div>
                        <h3 className="font-medium text-sm text-gray-500 mb-1">Review Notes</h3>
                        <Textarea 
                          placeholder="Add notes about this registration request" 
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4">
                        <Button 
                          onClick={handleApprove}
                          disabled={isSubmitting}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve Request
                        </Button>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-gray-500 mb-1">Rejection Reason</h3>
                          <div className="flex gap-2">
                            <Textarea 
                              placeholder="Provide reason for rejection" 
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="min-h-[50px] flex-1"
                            />
                            <Button 
                              variant="destructive" 
                              onClick={handleReject}
                              disabled={isSubmitting || !rejectionReason}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">ID Document</h3>
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-2">
                  <img 
                    src={request.documents.idDocument} 
                    alt="ID Document" 
                    className="max-h-full object-contain"
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Employee Photo</h3>
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-2">
                  <img 
                    src={request.documents.photo} 
                    alt="Employee Photo" 
                    className="max-h-full object-contain"
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Insurance Document</h3>
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-2">
                  <img 
                    src={request.documents.insuranceDocument} 
                    alt="Insurance Document" 
                    className="max-h-full object-contain"
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Authorization Letter</h3>
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-2">
                  <img 
                    src={request.documents.authorizationLetter} 
                    alt="Authorization Letter" 
                    className="max-h-full object-contain"
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {request.status === "approved" && (
            <TabsContent value="id">
              <div className="flex flex-col items-center space-y-6">
                <DigitalID 
                  employeeName={request.employeeName}
                  employeeId={request.employeeId}
                  company={request.company}
                  position={request.position}
                  photo="/placeholder.svg"
                  issueDate={request.reviewDate || request.submissionDate}
                />
                
                <div className="flex gap-4">
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download ID
                  </Button>
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print ID
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
