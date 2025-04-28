
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useCompanies, Company } from "@/hooks/useCompanies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Building2, 
  Download, 
  FileText, 
  Trash2, 
  Search, 
  Edit, 
  ArrowUpDown,
  Eye
} from "lucide-react";
import { SkeletonTable } from "@/components/ui/skeleton/SkeletonTable";
import { format } from "date-fns";
import { CompanyDetailsDialog } from "@/components/company-management/CompanyDetailsDialog";

export default function CompanyManagement() {
  const { user } = useAuth();
  const { 
    companies, 
    isLoading, 
    selectedCompany, 
    setSelectedCompany, 
    deleteCompany, 
    ensureDemoCompanyForUser 
  } = useCompanies();
  
  // UI state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"company_name" | "created_at">("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isEditMode, setIsEditMode] = useState(false);
  
  // User permissions
  const isAdmin = user?.role === 'admin';
  const canManageCompanies = isAdmin || user?.role === 'manager';
  
  useEffect(() => {
    if (user?.email) {
      ensureDemoCompanyForUser(user.email);
    }
  }, [user?.email, ensureDemoCompanyForUser]);

  // Filter and sort companies
  const filteredCompanies = companies.filter(company => {
    const searchLower = searchQuery.toLowerCase();
    return company.company_name.toLowerCase().includes(searchLower) || 
           company.register_number.toLowerCase().includes(searchLower);
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortField === "company_name") {
      const compareResult = a.company_name.localeCompare(b.company_name);
      return sortDirection === "asc" ? compareResult : -compareResult;
    } else {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage);
  const paginatedCompanies = sortedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field: "company_name" | "created_at") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteCompany = () => {
    if (selectedCompany) {
      deleteCompany.mutate(selectedCompany.id);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPP");
  };

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

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or register number..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as "company_name" | "created_at")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company_name">Company Name</SelectItem>
              <SelectItem value="created_at">Date Created</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className={`h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => toggleSort("company_name")}>
                      Company Name
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </th>
                  <th className="text-left p-3 font-medium">Address</th>
                  <th className="text-left p-3 font-medium">Register Number</th>
                  <th className="text-left p-3 font-medium">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => toggleSort("created_at")}>
                      Created
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCompanies.length > 0 ? (
                  paginatedCompanies.map((company) => (
                    <tr key={company.id} className="border-b hover:bg-accent/10">
                      <td className="p-3">{company.company_name}</td>
                      <td className="p-3">{company.address}</td>
                      <td className="p-3">{company.register_number}</td>
                      <td className="p-3">{formatDate(company.created_at)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCompany(company);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          
                          {canManageCompanies && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCompany(company);
                                  setDetailsOpen(true);
                                  // Set edit mode to true after dialog is opened
                                  setTimeout(() => setIsEditMode(true), 100);
                                }}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCompany(company);
                                  setDeleteDialogOpen(true);
                                }}
                                className="bg-red-50 text-red-600 hover:bg-red-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No companies found. Try adjusting your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* Company Details Dialog */}
      <CompanyDetailsDialog 
        company={selectedCompany} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the company record
              <strong className="font-semibold ml-1">
                {selectedCompany?.company_name}
              </strong> and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCompany} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
