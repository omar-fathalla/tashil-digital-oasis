
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { useDigitalIDCards } from "@/hooks/useDigitalIDCards";
import { Printer, Download, Search, Check, User } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ensureDemoData } from "@/utils/seedDemoData";

const IDCardManager = () => {
  const { idCards, isLoading: isLoadingCards } = useDigitalIDCards();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingDemoData, setIsLoadingDemoData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Ensure we have demo data when the component loads
  useEffect(() => {
    const loadDemoData = async () => {
      setIsLoadingDemoData(true);
      try {
        await ensureDemoData();
      } catch (error) {
        console.error("Failed to load demo data:", error);
      } finally {
        setIsLoadingDemoData(false);
      }
    };
    
    loadDemoData();
  }, []);

  const isLoading = isLoadingCards || isLoadingDemoData;

  // Filter records based on search query
  const filteredCards = idCards?.filter((card) => 
    card.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate pagination values
  const totalItems = filteredCards.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = filteredCards.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis before start if needed
      if (start > 2) {
        pages.push('ellipsis-start');
      }
      
      // Add pages in the middle
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after end if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const getStatusBadge = (status: string, item: any) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending ID Generation
          </Badge>
        );
      case "id_generated":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            ID Generated
          </Badge>
        );
      case "id_printed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" /> Printed
          </Badge>
        );
      case "id_collected":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            <User className="h-3 w-3 mr-1" /> Collected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Digital ID Management
          </div>
          <Link to="/print-batch">
            <Button size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Batch Print
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name or ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading ID cards...</div>
        ) : (
          <>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>ID Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((card) => (
                      <TableRow key={card.id}>
                        <TableCell className="font-medium">{card.full_name}</TableCell>
                        <TableCell className="font-mono text-sm">{card.employee_id}</TableCell>
                        <TableCell>{getStatusBadge(card.status, card)}</TableCell>
                        <TableCell>
                          {card.printed_at 
                            ? format(new Date(card.printed_at), "PPP") 
                            : card.submission_date 
                              ? format(new Date(card.submission_date), "PPP")
                              : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/print/${card.id}`}>
                              <Button variant="ghost" size="sm">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                toast.info("Downloading ID card...");
                                // In a real implementation, this would download the ID card
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No ID cards found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination UI */}
            {totalItems > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {endIndex} of {totalItems} {totalItems === 1 ? 'employee' : 'employees'}
                </div>
                
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {getPageNumbers().map((page, i) => (
                        typeof page === 'number' ? (
                          <PaginationItem key={`page-${page}`}>
                            <PaginationLink 
                              isActive={currentPage === page}
                              onClick={() => setCurrentPage(page)}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`${page}-${i}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
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
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IDCardManager;
