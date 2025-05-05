
import { useState, useEffect } from "react";
import { RequestsTable } from "./RequestsTable";
import { RequestsHeader } from "./RequestsHeader";
import { RequestDetailsSheet } from "./RequestDetailsSheet";
import { RejectRequestDialog } from "./RejectRequestDialog";
import { useEmployeeRequests, type EmployeeRequest } from "@/hooks/useEmployeeRequests";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RequestsManagementProps {
  type?: "employee" | "company";
}

export const RequestsManagement = ({ type = "employee" }: RequestsManagementProps) => {
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Pass the statusFilter to the hook to enable server-side filtering
  const { requests, isLoading, error, updateRequestStatus } = useEmployeeRequests(statusFilter);
  
  // Filter requests based on type and search query
  const filteredRequests = requests
    ?.filter((request) => request.type === type)
    ?.filter((request) => {
      if (searchQuery === "") return true;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        request.employee_name.toLowerCase().includes(searchLower) ||
        request.employee_id.toLowerCase().includes(searchLower) ||
        (request.company_name && request.company_name.toLowerCase().includes(searchLower))
      );
    });

  // Set up realtime subscription for request updates
  useEffect(() => {
    const channel = supabase
      .channel('requests-changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'employee_requests',
        }, 
        (payload) => {
          // We'll let React Query handle refetching the data
          console.log('Employee request changed:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleViewDetails = (request: EmployeeRequest) => {
    console.log('Viewing request details:', request.id, 'with registration:', request.registration_id);
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleApprove = (request: EmployeeRequest) => {
    updateRequestStatus.mutate({ id: request.id, status: "approved" });
  };

  const handleReject = (request: EmployeeRequest) => {
    setSelectedRequest(request);
    setIsRejectOpen(true);
  };

  const handleRejectSubmit = (notes: string) => {
    if (selectedRequest) {
      updateRequestStatus.mutate({
        id: selectedRequest.id,
        status: "rejected",
        notes,
      });
      setIsRejectOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load requests. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!filteredRequests || filteredRequests.length === 0) {
    return (
      <div className="space-y-4">
        <RequestsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          title={type === "employee" ? "Employee Requests" : "Company Requests"}
        />
        <Alert>
          <AlertDescription>
            {searchQuery || statusFilter !== "all" 
              ? "No requests match your filters. Try adjusting your search criteria."
              : `No ${type} requests found.`}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RequestsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        title={type === "employee" ? "Employee Requests" : "Company Requests"}
      />
      <RequestsTable
        requests={filteredRequests || []}
        onView={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      <RequestDetailsSheet
        request={selectedRequest}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
      <RejectRequestDialog
        open={isRejectOpen}
        onOpenChange={setIsRejectOpen}
        onSubmit={handleRejectSubmit}
      />
    </div>
  );
};
