
import { format } from "date-fns";
import { Check, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmployeeRequest } from "@/hooks/useEmployeeRequests";

interface RequestsTableProps {
  requests: EmployeeRequest[];
  onApprove: (request: EmployeeRequest) => void;
  onReject: (request: EmployeeRequest) => void;
  onView: (request: EmployeeRequest) => void;
}

export function RequestsTable({ requests, onApprove, onReject, onView }: RequestsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {requests[0]?.type === 'employee' ? (
              <>
                <TableHead>Employee</TableHead>
                <TableHead>ID</TableHead>
              </>
            ) : (
              <>
                <TableHead>Company</TableHead>
                <TableHead>Num Company</TableHead>
              </>
            )}
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {request.type === 'employee' ? request.employee_name : request.company_name}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {request.type === 'employee' ? request.employee_id : request.company_number}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-primary/10">
                    {request.request_type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(request.request_date), "PPP")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      request.status === "approved"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : request.status === "rejected"
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {request.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApprove(request)}
                        className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReject(request)}
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
                    onClick={() => onView(request)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
