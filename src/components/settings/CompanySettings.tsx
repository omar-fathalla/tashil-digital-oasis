
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: string;
  name: string;
  status: "active" | "suspended" | "pending";
  accessRole: "full" | "submit" | "view";
  lastActivity: string;
}

export const CompanySettings = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([
    { 
      id: "1", 
      name: "Company A", 
      status: "active", 
      accessRole: "full", 
      lastActivity: "2023-05-15" 
    },
    { 
      id: "2", 
      name: "Company B", 
      status: "active", 
      accessRole: "submit", 
      lastActivity: "2023-05-14" 
    },
    { 
      id: "3", 
      name: "Company C", 
      status: "suspended", 
      accessRole: "view", 
      lastActivity: "2023-04-30" 
    },
    { 
      id: "4", 
      name: "Company D", 
      status: "pending", 
      accessRole: "submit", 
      lastActivity: "2023-05-16" 
    },
  ]);

  const handleStatusChange = (companyId: string, status: "active" | "suspended" | "pending") => {
    setCompanies(
      companies.map((company) =>
        company.id === companyId ? { ...company, status } : company
      )
    );
    
    toast({
      title: "Company Status Updated",
      description: `Company status has been changed to ${status}.`,
    });
  };

  const handleRoleChange = (companyId: string, role: "full" | "submit" | "view") => {
    setCompanies(
      companies.map((company) =>
        company.id === companyId ? { ...company, accessRole: role } : company
      )
    );
    
    toast({
      title: "Access Role Updated",
      description: `Company access role has been changed to ${role}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Company Access & Permissions</h2>
        <p className="text-muted-foreground">
          Manage company accounts, permissions, and activity logs.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Access Role</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          company.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : company.status === "suspended"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={company.accessRole}
                        onValueChange={(value) => 
                          handleRoleChange(company.id, value as "full" | "submit" | "view")
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Access</SelectItem>
                          <SelectItem value="submit">Submit Only</SelectItem>
                          <SelectItem value="view">View Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {company.lastActivity}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={company.status}
                        onValueChange={(value) => 
                          handleStatusChange(company.id, value as "active" | "suspended" | "pending")
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activate</SelectItem>
                          <SelectItem value="suspended">Suspend</SelectItem>
                          <SelectItem value="pending">Set Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
