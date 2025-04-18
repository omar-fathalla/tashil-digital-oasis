
import { useCallback } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";

interface DashboardFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  dateRange?: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
}

export const DashboardFilters = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  dateRange,
  setDateRange,
  selectedArea,
  setSelectedArea,
  selectedCompany,
  setSelectedCompany
}: DashboardFiltersProps) => {
  // Use memoized callbacks for event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);
  
  const handleFilterClick = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, [setActiveFilter]);
  
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("all");
    setDateRange(undefined);
    setSelectedArea("all");
    setSelectedCompany("all");
  }, [setSearchQuery, setActiveFilter, setDateRange, setSelectedArea, setSelectedCompany]);

  const handleAreaChange = useCallback((value: string) => {
    setSelectedArea(value);
  }, [setSelectedArea]);

  const handleCompanyChange = useCallback((value: string) => {
    setSelectedCompany(value);
  }, [setSelectedCompany]);
  
  const isFilterActive = searchQuery || activeFilter !== "all" || dateRange?.from || dateRange?.to || selectedArea !== "all" || selectedCompany !== "all";
  
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name, ID or national ID..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <Select value={selectedCompany} onValueChange={handleCompanyChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            <SelectItem value="TechCorp">TechCorp</SelectItem>
            <SelectItem value="GlobalServices">Global Services</SelectItem>
            <SelectItem value="LocalBusiness">Local Business</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedArea} onValueChange={handleAreaChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            <SelectItem value="alexandria">Alexandria</SelectItem>
            <SelectItem value="cairo">Cairo</SelectItem>
          </SelectContent>
        </Select>
        
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="text-sm font-medium">Status:</div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activeFilter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleFilterClick("all")}
          >
            All
          </Badge>
          <Badge
            variant={activeFilter === "pending" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleFilterClick("pending")}
          >
            Pending
          </Badge>
          <Badge
            variant={activeFilter === "approved" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleFilterClick("approved")}
          >
            Approved
          </Badge>
          <Badge
            variant={activeFilter === "rejected" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleFilterClick("rejected")}
          >
            Rejected
          </Badge>
        </div>
        
        {isFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
            onClick={handleClearFilters}
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
