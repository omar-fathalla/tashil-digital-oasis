
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileMinus, FileCheck, FileX } from "lucide-react";

type SearchAndFilterProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
};

const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: SearchAndFilterProps) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="البحث عن طريق رقم الطلب، الاسم أو رقم الموظف"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant={activeFilter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveFilter("all")}
          className={activeFilter === "all" ? "" : "text-gray-500"}
        >
          All
        </Button>
        <Button 
          variant={activeFilter === "under-review" ? "default" : "outline"}
          size="sm" 
          onClick={() => setActiveFilter("under-review")}
          className={activeFilter === "under-review" ? "" : "text-yellow-600"}
        >
          <FileMinus className="h-4 w-4 mr-1" />
          Under Review
        </Button>
        <Button 
          variant={activeFilter === "approved" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveFilter("approved")}
          className={activeFilter === "approved" ? "" : "text-green-600"}
        >
          <FileCheck className="h-4 w-4 mr-1" />
          Approved
        </Button>
        <Button 
          variant={activeFilter === "rejected" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveFilter("rejected")}
          className={activeFilter === "rejected" ? "" : "text-red-600"}
        >
          <FileX className="h-4 w-4 mr-1" />
          Rejected
        </Button>
      </div>
    </div>
  );
};

export default SearchAndFilter;
