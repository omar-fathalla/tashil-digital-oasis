
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/application-status/StatusBadge";
import { format } from "date-fns";
import type { DocumentUpload } from "@/hooks/useReportData";

type DocumentUploadsTableProps = {
  data: DocumentUpload[];
};

export const DocumentUploadsTable = ({ data }: DocumentUploadsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Document Upload Log</CardTitle>
        <CardDescription>Recent documents uploaded to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((doc, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{doc.employeeName}</TableCell>
                <TableCell>{doc.documentType}</TableCell>
                <TableCell>
                  {format(new Date(doc.uploadDate), 'MMM d, yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  <StatusBadge status={doc.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
