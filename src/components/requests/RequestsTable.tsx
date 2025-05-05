import { useState } from "react";
import { format } from "date-fns";
import { Check, FileText, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/application-status/StatusBadge";
import { RequestDetailsDrawer } from "./RequestDetailsDrawer";
import type { EmployeeRequest } from "@/hooks/requests/types";

interface RequestsTableProps {
  requests: EmployeeRequest[];
  onApprove: (request: EmployeeRequest) => void;
  onReject: (request: EmployeeRequest) => void;
  onView: (request: EmployeeRequest) => void;
}

export function RequestsTable({ requests, onApprove, onReject, onView }: RequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (request: EmployeeRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
    onView(request);
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No requests found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {requests[0]?.type === 'employee' ? (
                <>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>National ID</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Company</TableHead>
                  <TableHead>Num Company</TableHead>
                </>
              )}
              <TableHead>Type</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => {
                // Get registration data if available
                const registration = request.employee_registrations || null;
                
                // Check for broken link - has registration_id but missing registration data
                const hasBrokenLink = request.registration_id && !registration;
                
                return (
                  <TableRow 
                    key={request.id} 
                    className={`hover:bg-muted/50 cursor-pointer ${hasBrokenLink ? 'border-l-4 border-l-yellow-500' : ''}`}
                    onClick={() => handleViewDetails(request)}
                  >
                    <TableCell className="font-medium">
                      {request.type === 'employee' ? (
                        <div className="flex items-center">
                          {registration?.full_name || request.employee_name}
                          {hasBrokenLink && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="ml-2">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Linked registration data is missing</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      ) : (
                        request.company_name
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {request.type === 'employee' ? (
                        registration?.employee_id || request.employee_id
                      ) : (
                        request.company_number
                      )}
                    </TableCell>
                    {request.type === 'employee' && (
                      <TableCell className="font-mono text-sm">
                        {registration?.national_id || (
                          <span className="text-muted-foreground italic">Not available</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10">
                        {request.request_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(request.request_date || registration?.submission_date || new Date()), "PPP")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {request.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApprove(request);
                            }}
                            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReject(request);
                            }}
                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(request);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <RequestDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        data={selectedRequest}
        type="employee"
      />
    </>
  );
}
