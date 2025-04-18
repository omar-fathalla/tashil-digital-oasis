
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock, XCircle, Users } from "lucide-react";

type TotalEmployeesCardProps = {
  totalEmployees: number;
  approvedEmployees: number;
  pendingEmployees: number;
  rejectedEmployees: number;
};

export const TotalEmployeesCard = ({
  totalEmployees,
  approvedEmployees,
  pendingEmployees,
  rejectedEmployees,
}: TotalEmployeesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Total Registered Employees</CardTitle>
        <CardDescription>Overview of employee registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-2xl font-bold">{totalEmployees}</span>
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-2xl font-bold">{approvedEmployees}</span>
            <span className="text-sm text-muted-foreground">Approved</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
            <Clock className="h-8 w-8 text-yellow-600 mb-2" />
            <span className="text-2xl font-bold">{pendingEmployees}</span>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
            <XCircle className="h-8 w-8 text-red-600 mb-2" />
            <span className="text-2xl font-bold">{rejectedEmployees}</span>
            <span className="text-sm text-muted-foreground">Rejected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
