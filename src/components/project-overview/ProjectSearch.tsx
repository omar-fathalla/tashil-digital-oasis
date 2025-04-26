
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectSearchProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (status: string) => void;
  onSortChange?: (sort: string) => void;
}

export const ProjectSearch = ({
  onSearch,
  onFilterChange,
  onSortChange,
}: ProjectSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="space-y-4 mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Select onValueChange={onFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_desc">Last Updated</SelectItem>
              <SelectItem value="created_desc">Newest First</SelectItem>
              <SelectItem value="created_asc">Oldest First</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
