
import { useNavigate } from "react-router-dom";
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

interface RegistrationRequest {
  id: string;
  full_name: string;
  national_id: string;
  submission_date: string;
  status: string;
  documents: any;
}

export function RegistrationRequestsTable({ 
  requests 
}: { 
  requests: RegistrationRequest[] 
}) {
  const navigate = useNavigate();

  const viewRequest = (id: string) => {
    navigate(`/requests/${id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>National ID</TableHead>
          <TableHead>Submission Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.full_name}</TableCell>
            <TableCell>{request.national_id}</TableCell>
            <TableCell>
              {format(new Date(request.submission_date), "PPP")}
            </TableCell>
            <TableCell>
              <StatusBadge status={request.status} />
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => viewRequest(request.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
