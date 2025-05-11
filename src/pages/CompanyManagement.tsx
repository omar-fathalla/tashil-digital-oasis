
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
import { Building2, Search, ArrowUpDown } from "lucide-react";
import { SkeletonTable } from "@/components/ui/skeleton/SkeletonTable";
import { CompanyDetailsDialog } from "@/components/company-management/CompanyDetailsDialog";
import { SeedCompanyDataButton } from "@/components/company-management/SeedCompanyDataButton";
import { CompaniesTable } from "@/components/company-management/CompaniesTable";

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
  
  // User permissions - in public mode we give full access
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

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setDetailsOpen(true);
    setIsEditMode(false);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setDetailsOpen(true);
    // Set edit mode to true after dialog is opened
    setTimeout(() => setIsEditMode(true), 100);
  };

  const handleDeleteDialog = (company: Company) => {
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
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
        <div className="flex gap-2 items-center">
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
          <SeedCompanyDataButton />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <CompaniesTable
            companies={paginatedCompanies}
            onViewDetails={handleViewDetails}
            onEdit={handleEditCompany}
            onDelete={handleDeleteDialog}
            sortField={sortField}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            canManageCompanies={canManageCompanies}
          />
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
