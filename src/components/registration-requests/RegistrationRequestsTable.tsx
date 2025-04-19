
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { RequestDetailsDialog } from "./RequestDetailsDialog";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type RegistrationRequest = {
  id: string;
  full_name: string;
  national_id: string;
  submission_date: string;
  status: "pending" | "approved" | "rejected";
  employee_details: any;
  documents: any;
  submission_history: any[];
  id_card?: {
    id: string;
    issue_date: string;
    expiry_date: string;
  };
};

export function RegistrationRequestsTable() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("registration_requests")
        .select("*")
        .order("submission_date", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className={`${baseClasses} bg-green-100 text-green-800 border-green-200`}>
            {getStatusIcon(status)} Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className={`${baseClasses} bg-red-100 text-red-800 border-red-200`}>
            {getStatusIcon(status)} Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className={`${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`}>
            {getStatusIcon(status)} Pending
          </Badge>
        );
    }
  };

  const getDocumentStatus = (request: RegistrationRequest) => {
    if (!request.documents) return 0;
    
    const totalDocs = Object.keys(request.documents).length;
    const uploadedDocs = Object.values(request.documents).filter(Boolean).length;
    
    return `${uploadedDocs}/${totalDocs}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-md p-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-6 w-[100px]" />
            </div>
            <div className="mt-2 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>National ID</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No registration requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.full_name}</TableCell>
                <TableCell>{request.national_id}</TableCell>
                <TableCell>
                  {format(new Date(request.submission_date), "PPP")}
                </TableCell>
                <TableCell>{getDocumentStatus(request)}</TableCell>
                <TableCell>
                  {getStatusBadge(request.status)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <FileText className="h-4 w-4" /> View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <RequestDetailsDialog
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
        onStatusUpdate={fetchRequests}
      />
    </div>
  );
}
