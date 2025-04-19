
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
import { FileText, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";

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
  const [filteredRequests, setFilteredRequests] = useState<RegistrationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch requests on component mount
  useEffect(() => {
    fetchRequests();

    // Set up realtime subscription
    const channel = supabase
      .channel('registration-changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'registration_requests',
        }, 
        (payload) => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter requests when search term or status filter changes
  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

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

  function filterRequests() {
    let filtered = [...requests];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.full_name.toLowerCase().includes(term) ||
        request.national_id.toLowerCase().includes(term) ||
        request.id.toLowerCase().includes(term)
      );
    }
    
    setFilteredRequests(filtered);
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
    if (!request.documents) return "0/0";
    
    const totalDocs = Object.keys(request.documents).length;
    const uploadedDocs = Object.values(request.documents).filter(Boolean).length;
    
    return `${uploadedDocs}/${totalDocs}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-28" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-9 w-28 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, ID or request number..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
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
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {requests.length === 0 
                    ? "No registration requests found" 
                    : "No requests match your search criteria"}
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.full_name}</TableCell>
                  <TableCell>{request.national_id}</TableCell>
                  <TableCell>
                    {format(new Date(request.submission_date), "PPP")}
                  </TableCell>
                  <TableCell className="text-center">{getDocumentStatus(request)}</TableCell>
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
      </div>

      <RequestDetailsDialog
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
        onStatusUpdate={fetchRequests}
      />
    </div>
  );
}
