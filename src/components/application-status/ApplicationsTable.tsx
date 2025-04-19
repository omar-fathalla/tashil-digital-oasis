import { Eye, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Application } from "@/hooks/useApplications";
import { StatusBadge } from "./StatusBadge";
import { StatusIcon } from "./StatusIcon";

type ApplicationsTableProps = {
  applications: Application[];
  isLoading: boolean;
  error: Error | null;
};

const ApplicationsTable = ({ applications, isLoading, error }: ApplicationsTableProps) => {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Status</TableHead>
            <TableHead>Request ID</TableHead>
            <TableHead>Employee Name</TableHead>
            <TableHead>Employee ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              جاري تحميل الطلبات...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (error) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Status</TableHead>
            <TableHead>Request ID</TableHead>
            <TableHead>Employee Name</TableHead>
            <TableHead>Employee ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-red-500">
              حدث خطأ أثناء تحميل الطلبات. الرجاء المحاولة مرة أخرى.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (applications.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Status</TableHead>
            <TableHead>Request ID</TableHead>
            <TableHead>Employee Name</TableHead>
            <TableHead>Employee ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
              لا توجد طلبات تطابق بحثك.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">Status</TableHead>
          <TableHead>Request ID</TableHead>
          <TableHead>Employee Name</TableHead>
          <TableHead>Employee ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell>
              <StatusIcon status={application.status} />
            </TableCell>
            <TableCell className="font-medium">{application.id}</TableCell>
            <TableCell>{application.employee_name}</TableCell>
            <TableCell>{application.employee_id}</TableCell>
            <TableCell>{application.type}</TableCell>
            <TableCell>{new Date(application.request_date).toLocaleDateString('ar-SA')}</TableCell>
            <TableCell>{application.notes}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                {application.status === "approved" && (
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {application.status === "rejected" && (
                  <Button variant="ghost" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ApplicationsTable;
