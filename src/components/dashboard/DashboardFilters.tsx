
import { Search, CalendarRange, Building, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/dashboard/DatePickerWithRange";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DashboardFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  dateRange: { from: Date | null; to: Date | null };
  setDateRange: (range: { from: Date | null; to: Date | null }) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
};

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
  setSelectedCompany,
}: DashboardFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, ID or national ID"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <DatePickerWithRange 
            date={dateRange} 
            setDate={setDateRange} 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All areas</SelectItem>
              <SelectItem value="alexandria">Alexandria</SelectItem>
              <SelectItem value="cairo">Cairo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Building className="h-4 w-4 text-gray-400" />
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All companies</SelectItem>
              <SelectItem value="TechCorp">TechCorp</SelectItem>
              <SelectItem value="GlobalServices">GlobalServices</SelectItem>
              <SelectItem value="LocalBusiness">LocalBusiness</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeFilter === "all" ? "default" : "outline"} 
          onClick={() => setActiveFilter("all")}
          size="sm"
        >
          All Requests
        </Button>
        <Button 
          variant={activeFilter === "pending" ? "default" : "outline"}
          onClick={() => setActiveFilter("pending")}
          size="sm"
          className={activeFilter !== "pending" ? "text-amber-600" : ""}
        >
          Pending
        </Button>
        <Button 
          variant={activeFilter === "approved" ? "default" : "outline"} 
          onClick={() => setActiveFilter("approved")}
          size="sm"
          className={activeFilter !== "approved" ? "text-green-600" : ""}
        >
          Approved
        </Button>
        <Button 
          variant={activeFilter === "rejected" ? "default" : "outline"} 
          onClick={() => setActiveFilter("rejected")}
          size="sm"
          className={activeFilter !== "rejected" ? "text-red-600" : ""}
        >
          Rejected
        </Button>
      </div>
    </div>
  );
};
