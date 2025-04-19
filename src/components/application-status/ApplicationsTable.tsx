
import { useEffect } from "react";
import { Eye, Download, Upload, File } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ApplicationsTableProps = {
  applications: Application[];
  isLoading: boolean;
  error: Error | null;
  onViewDetails: (application: Application) => void;
  onDownloadId?: (application: Application) => void;
  onReuploadDocuments?: (application: Application) => void;
};

const ApplicationsTable = ({ 
  applications, 
  isLoading, 
  error, 
  onViewDetails,
  onDownloadId,
  onReuploadDocuments
}: ApplicationsTableProps) => {
  const queryClient = useQueryClient();

  // Set up realtime subscription for application updates
  useEffect(() => {
    const channel = supabase
      .channel('applications-changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'applications',
        }, 
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["applications"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
          <TableRow key={application.id} className="group hover:bg-muted/50">
            <TableCell>
              <StatusIcon status={application.status} />
            </TableCell>
            <TableCell className="font-medium">{application.id.substring(0, 8)}</TableCell>
            <TableCell>{application.employee_name}</TableCell>
            <TableCell>{application.employee_id}</TableCell>
            <TableCell>{application.type}</TableCell>
            <TableCell>
              {new Date(application.request_date || '').toLocaleDateString('ar-SA')}
            </TableCell>
            <TableCell className="max-w-[200px] truncate" title={application.notes || ''}>
              {application.notes || '-'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onViewDetails(application)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {application.status === "approved" && onDownloadId && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDownloadId(application)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {application.status === "rejected" && onReuploadDocuments && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onReuploadDocuments(application)}
                  >
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
