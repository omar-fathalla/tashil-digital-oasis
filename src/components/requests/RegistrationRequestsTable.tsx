
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
import { Badge } from "@/components/ui/badge";
import type { EmployeeRegistration } from "@/hooks/useEmployeeRegistrations";

export function RegistrationRequestsTable({ 
  requests 
}: { 
  requests: EmployeeRegistration[] 
}) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return "bg-green-100 text-green-800 border-green-200";
      case 'rejected':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
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
            <TableRow key={request.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{request.full_name}</TableCell>
              <TableCell className="font-mono text-sm">{request.employee_id}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10">
                  {request.request_type || "Registration"}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(request.submission_date), "PPP")}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(request.status)}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
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
  );
}
