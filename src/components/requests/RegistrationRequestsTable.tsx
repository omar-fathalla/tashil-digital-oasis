
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/application-status/StatusBadge";
import { RequestDetailsDrawer } from "./RequestDetailsDrawer";
import type { EmployeeRegistration } from "@/hooks/useEmployeeRegistrations";

export function RegistrationRequestsTable({ 
  requests 
}: { 
  requests: EmployeeRegistration[] 
}) {
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRegistration | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (request: EmployeeRegistration) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Request Type</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow 
                key={request.id} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => handleViewDetails(request)}
              >
                <TableCell className="font-medium">
                  {request.full_name}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {request.employee_id}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10">
                    {request.request_type || "Registration"}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(request.submission_date), "PPP")}
                </TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(request);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RequestDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        data={selectedRequest}
        type="registration"
      />
    </>
  );
}
