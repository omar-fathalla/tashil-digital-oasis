
import { useState } from "react";
import { DocumentCategory, DocumentSearchFilters } from "@/utils/documentApi";
import { Search, Filter, Calendar, X, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface DocumentSearchProps {
  onSearch: (filters: DocumentSearchFilters) => void;
  categories: DocumentCategory[];
}

export function DocumentSearch({ onSearch, categories }: DocumentSearchProps) {
  const [filters, setFilters] = useState<DocumentSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Common file types
  const fileTypes = [
    { label: "PDF Documents", value: "application/pdf" },
    { label: "Word Documents", value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { label: "Excel Spreadsheets", value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { label: "Images (JPG, PNG)", value: "image/" },
    { label: "Text Files", value: "text/plain" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categoryId: categoryId === "all" ? undefined : categoryId
    }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      startDate: date
    }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      endDate: date
    }));
  };

  const handleFileTypeToggle = (fileType: string, checked: boolean) => {
    setFilters(prev => {
      const fileTypes = [...(prev.fileTypes || [])];
      
      if (checked) {
        if (!fileTypes.includes(fileType)) {
          fileTypes.push(fileType);
        }
      } else {
        const index = fileTypes.indexOf(fileType);
        if (index !== -1) {
          fileTypes.splice(index, 1);
        }
      }
      
      return {
        ...prev,
        fileTypes: fileTypes.length ? fileTypes : undefined
      };
    });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({});
    onSearch({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documents by name, description, or keywords..."
            className="pl-9 pr-4"
            value={filters.searchTerm || ""}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" /> {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
          
          {Object.keys(filters).length > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-1">
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={filters.categoryId || "all"} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.startDate ? 
                        format(filters.startDate, "PPP") : 
                        "Pick a date"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={filters.startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.endDate ? 
                        format(filters.endDate, "PPP") : 
                        "Pick a date"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={filters.endDate}
                      onSelect={handleEndDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* File Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <FileType className="h-4 w-4 mr-2" /> File Types
                </label>
                <div className="space-y-2">
                  {fileTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`file-type-${type.value}`}
                        checked={(filters.fileTypes || []).includes(type.value)}
                        onCheckedChange={(checked) => 
                          handleFileTypeToggle(type.value, checked === true)
                        }
                      />
                      <label 
                        htmlFor={`file-type-${type.value}`}
                        className="text-sm cursor-pointer"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {Object.keys(filters).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.categoryId && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {categories.find(c => c.id === filters.categoryId)?.name}
                    <button 
                      onClick={() => {
                        setFilters(prev => ({...prev, categoryId: undefined}));
                      }} 
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {filters.startDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    After: {format(filters.startDate, "MMM d, yyyy")}
                    <button 
                      onClick={() => {
                        setFilters(prev => ({...prev, startDate: undefined}));
                      }} 
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {filters.endDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Before: {format(filters.endDate, "MMM d, yyyy")}
                    <button 
                      onClick={() => {
                        setFilters(prev => ({...prev, endDate: undefined}));
                      }} 
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {filters.fileTypes && filters.fileTypes.length > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.fileTypes.length === 1 ? 'File type' : `${filters.fileTypes.length} file types`}
                    <button 
                      onClick={() => {
                        setFilters(prev => ({...prev, fileTypes: undefined}));
                      }} 
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
