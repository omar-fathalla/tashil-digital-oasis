
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, User } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEmployees } from "@/hooks/useEmployees";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeeDataTableProps {
  searchQuery: string;
  statusFilter: string;
  departmentFilter: string;
  roleFilter: string;
}

const EmployeeDataTable = ({
  searchQuery,
  statusFilter,
  departmentFilter,
  roleFilter,
}: EmployeeDataTableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Use our existing hook to fetch employees
  const { employees, isLoading } = useEmployees();
  
  // Filter employees based on search and filters
  const filteredEmployees = employees
    ? employees.filter((employee) => {
        const matchesSearch = 
          employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.employee_id.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
        
        // These filters would work with real data but our mock data doesn't have these fields
        const matchesDepartment = departmentFilter === "all" || employee.area === departmentFilter;
        const matchesRole = roleFilter === "all" || employee.position === roleFilter;
        
        return matchesSearch && matchesStatus && matchesDepartment && matchesRole;
      })
    : [];
    
  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pageSize);
  
  // Handle view employee details
  const handleViewEmployee = (employeeId: string) => {
    navigate(`/employee-profile/${employeeId}`);
  };
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end page numbers
      let startPage = Math.max(currentPage - 1, 2);
      let endPage = Math.min(startPage + 2, totalPages - 1);
      
      // Adjust start page if end page is too close to total pages
      if (endPage === totalPages - 1) {
        startPage = Math.max(endPage - 2, 2);
      }
      
      // Add ellipsis if necessary
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if necessary
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const renderPageNumbers = () => {
    return getPageNumbers().map((page, index) => (
      <PaginationItem key={index}>
        {page === '...' ? (
          <span className="px-4 py-2">...</span>
        ) : (
          <PaginationLink
            isActive={page === currentPage}
            onClick={() => typeof page === 'number' && setCurrentPage(page)}
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    ));
  };
  
  // Get status badge color based on status
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500">Suspended</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(null).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted/30 p-2 rounded-full">
                        {employee.photo_url ? (
                          <img 
                            src={employee.photo_url} 
                            alt={employee.full_name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      {employee.full_name}
                    </div>
                  </TableCell>
                  <TableCell>{employee.employee_id}</TableCell>
                  <TableCell>{employee.position || 'Not specified'}</TableCell>
                  <TableCell>{employee.area || 'Not specified'}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    {employee.submission_date 
                      ? format(new Date(employee.submission_date), "MMM d, yyyy") 
                      : 'Not available'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleViewEmployee(employee.id)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No employees found matching the selected filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {filteredEmployees.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredEmployees.length)} of {filteredEmployees.length} employees
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {renderPageNumbers()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default EmployeeDataTable;
