import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useCompanies } from "@/hooks/useCompanies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, Download, FileText, Trash2 } from "lucide-react";
import { SkeletonTable } from "@/components/ui/skeleton/SkeletonTable";

export default function CompanyManagement() {
  const { user } = useAuth();
  const { companies, isLoading, selectedCompany, setSelectedCompany, deleteCompany, ensureDemoCompanyForUser } = useCompanies();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  
  useEffect(() => {
    if (user?.email) {
      ensureDemoCompanyForUser(user.email);
    }
  }, [user?.email, ensureDemoCompanyForUser]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <SkeletonTable rows={5} columns={6} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Company Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Tax Card Number</TableHead>
                <TableHead>Register Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.company_name}</TableCell>
                  <TableCell>{company.address}</TableCell>
                  <TableCell>{company.tax_card_number}</TableCell>
                  <TableCell>{company.register_number}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCompany(company);
                          setDetailsOpen(true);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this company?")) {
                              deleteCompany.mutate(company.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Company Name</label>
                  <p>{selectedCompany.company_name}</p>
                </div>
                <div>
                  <label className="font-medium">Address</label>
                  <p>{selectedCompany.address}</p>
                </div>
                <div>
                  <label className="font-medium">Tax Card Number</label>
                  <p>{selectedCompany.tax_card_number}</p>
                </div>
                <div>
                  <label className="font-medium">Register Number</label>
                  <p>{selectedCompany.register_number}</p>
                </div>
                <div>
                  <label className="font-medium">Company Number</label>
                  <p>{selectedCompany.company_number}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Documents</h3>
                <div className="flex gap-4">
                  {selectedCompany.commercial_register_url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedCompany.commercial_register_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Commercial Register
                    </Button>
                  )}
                  {selectedCompany.tax_card_url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedCompany.tax_card_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Tax Card
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
