
import { formatDate } from "@/utils/print/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmployeePrintTableProps {
  employees: any[];
  onSelect: (employee: any) => void;
  selectedEmployee: any;
}

const EmployeePrintTable = ({ employees, onSelect, selectedEmployee }: EmployeePrintTableProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Employee Records</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Employee ID</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Registered Date</TableHead>
            <TableHead>Print Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow 
              key={employee.id}
              className={selectedEmployee?.id === employee.id ? "bg-muted/50" : ""}
            >
              <TableCell>{employee.full_name}</TableCell>
              <TableCell>{employee.employee_id}</TableCell>
              <TableCell>{employee.company_name}</TableCell>
              <TableCell>{formatDate(employee.submission_date)}</TableCell>
              <TableCell>
                {employee.printed ? (
                  <Badge className="bg-green-500">
                    <Check className="w-3 h-3 mr-1" />
                    Printed
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <X className="w-3 h-3 mr-1" />
                    Not Printed
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(employee)}
                >
                  <Printer className="w-4 h-4 mr-1" />
                  Preview & Print
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeePrintTable;
