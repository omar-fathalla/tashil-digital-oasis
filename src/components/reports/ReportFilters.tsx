
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Filter } from "lucide-react";

type ReportFiltersProps = {
  onFilterChange: (filters: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    status: string;
    area: string;
    reviewer: string;
  }) => void;
};

export const ReportFilters = ({ onFilterChange }: ReportFiltersProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [status, setStatus] = useState("");
  const [area, setArea] = useState("");
  const [reviewer, setReviewer] = useState("");

  const handleFilterApply = () => {
    onFilterChange({
      startDate,
      endDate,
      status,
      area,
      reviewer,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters:</span>
      </div>

      <div className="flex flex-wrap gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Start Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>End Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={area} onValueChange={setArea}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            <SelectItem value="cairo">Cairo</SelectItem>
            <SelectItem value="alexandria">Alexandria</SelectItem>
            <SelectItem value="damanhur">Damanhur</SelectItem>
            <SelectItem value="north-coast">North Coast</SelectItem>
          </SelectContent>
        </Select>

        <Select value={reviewer} onValueChange={setReviewer}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Reviewer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviewers</SelectItem>
            <SelectItem value="reviewer1">Reviewer 1</SelectItem>
            <SelectItem value="reviewer2">Reviewer 2</SelectItem>
            <SelectItem value="reviewer3">Reviewer 3</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleFilterApply}>Apply Filters</Button>
      </div>
    </div>
  );
};
