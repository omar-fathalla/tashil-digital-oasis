
import React from "react";
import { Company } from "@/hooks/useCompanies";
import { Button } from "@/components/ui/button";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

interface CompaniesTableProps {
  companies: Company[];
  onViewDetails: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  sortField: "company_name" | "created_at";
  sortDirection: "asc" | "desc";
  toggleSort: (field: "company_name" | "created_at") => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  canManageCompanies: boolean;
}

export function CompaniesTable({
  companies,
  onViewDetails,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  toggleSort,
  currentPage,
  setCurrentPage,
  totalPages,
  canManageCompanies,
}: CompaniesTableProps) {
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPP");
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium" onClick={() => toggleSort("company_name")}>
                Company Name
                <ArrowUpDown className="h-3 w-3 ml-1" />
              </Button>
            </TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Register Number</TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium" onClick={() => toggleSort("created_at")}>
                Created
                <ArrowUpDown className="h-3 w-3 ml-1" />
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length > 0 ? (
            companies.map((company) => (
              <TableRow key={company.id} className="hover:bg-accent/10">
                <TableCell>{company.company_name}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>{company.register_number}</TableCell>
                <TableCell>{formatDate(company.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(company)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    
                    {canManageCompanies && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(company)}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(company)}
                          className="bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No companies found. Try adjusting your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
