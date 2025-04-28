
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentActivity, DocumentActivityFilters } from "@/hooks/useDocumentActivity";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityTableProps {
  filters?: DocumentActivityFilters;
  limit?: number;
}

export const ActivityTable = ({ filters = {}, limit }: ActivityTableProps) => {
  const { activity, isLoading } = useDocumentActivity(filters);
  
  // Apply limit if provided
  const displayActivity = limit ? activity.slice(0, limit) : activity;
  
  const getActionColor = (action: string) => {
    switch(action.toLowerCase()) {
      case 'view':
      case 'download':
        return 'bg-blue-100 text-blue-800';
      case 'upload':
      case 'new_version':
        return 'bg-green-100 text-green-800';
      case 'edit':
      case 'update':
        return 'bg-amber-100 text-amber-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Document Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : displayActivity.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayActivity.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.document_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getActionColor(item.action)}>
                      {item.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.user_name || item.user_id.substring(0, 8)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(item.timestamp), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No recent activity found
          </div>
        )}
      </CardContent>
    </Card>
  );
};
