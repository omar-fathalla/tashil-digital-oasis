
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
import { Progress } from "@/components/ui/progress";
import type { ReviewerActivity } from "@/hooks/useReportData";

type ReviewersActivityTableProps = {
  data: ReviewerActivity[];
};

export const ReviewersActivityTable = ({ data }: ReviewersActivityTableProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Reviewers Activity Report</CardTitle>
        <CardDescription>Performance overview of application reviewers</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reviewer</TableHead>
              <TableHead>Total Reviewed</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead>Rejected</TableHead>
              <TableHead>Approval Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((reviewer) => {
              const approvalRate = Math.round((reviewer.approved / reviewer.total) * 100);
              
              return (
                <TableRow key={reviewer.reviewer}>
                  <TableCell className="font-medium">{reviewer.reviewer}</TableCell>
                  <TableCell>{reviewer.total}</TableCell>
                  <TableCell className="text-green-600">{reviewer.approved}</TableCell>
                  <TableCell className="text-red-600">{reviewer.rejected}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={approvalRate} className="h-2 w-20" />
                      <span className="text-xs">{approvalRate}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
