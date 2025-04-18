
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileWarning, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { IncompleteSubmission } from "@/hooks/useReportData";

type IncompleteSubmissionsTableProps = {
  data: IncompleteSubmission[];
};

export const IncompleteSubmissionsTable = ({ data }: IncompleteSubmissionsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileWarning className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-xl">Incomplete Submissions</CardTitle>
        </div>
        <CardDescription>Employees with missing documents</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No incomplete submissions found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Missing Documents</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.employeeName}</TableCell>
                  <TableCell>{submission.employeeId}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {submission.missingDocuments.map((doc) => (
                        <Badge key={doc} variant="outline" className="bg-yellow-50">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/employee/${submission.id}`}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
