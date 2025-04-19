
import { formatDate } from "@/utils/print/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  selectedEmployees: any[];
  onSelectEmployee: (employee: any, selected: boolean) => void;
  onRefresh: () => void;
}

const EmployeePrintTable = ({ 
  employees, 
  selectedEmployees, 
  onSelectEmployee,
  onRefresh 
}: EmployeePrintTableProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Employee Records</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={employees.length > 0 && selectedEmployees.length === employees.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    employees.forEach(emp => onSelectEmployee(emp, true));
                  } else {
                    employees.forEach(emp => onSelectEmployee(emp, false));
                  }
                }}
              />
            </TableHead>
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
              className={selectedEmployees.some(emp => emp.id === employee.id) ? "bg-muted/50" : ""}
            >
              <TableCell>
                <Checkbox 
                  checked={selectedEmployees.some(emp => emp.id === employee.id)}
                  onCheckedChange={(checked) => onSelectEmployee(employee, !!checked)}
                />
              </TableCell>
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
                  onClick={() => onSelectEmployee(employee, true)}
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
