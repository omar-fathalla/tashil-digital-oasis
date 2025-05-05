
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegistrationRequestsTable } from "@/components/requests/RegistrationRequestsTable";
import { useEmployeeRegistrations } from "@/hooks/useEmployeeRegistrations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const ApplicationStatus = () => {
  // Filters for registration requests
  const [regSearchQuery, setRegSearchQuery] = useState("");
  const [regStatusFilter, setRegStatusFilter] = useState("all");
  
  const { registrations, isLoading, error } = useEmployeeRegistrations();
  
  // Filter registration requests based on search query and status
  const filteredRegistrations = registrations?.filter((reg) => {
    // First apply status filter
    if (regStatusFilter !== "all" && reg.status.toLowerCase() !== regStatusFilter.toLowerCase()) {
      return false;
    }
    
    // Then apply search filter if present
    if (regSearchQuery === "") return true;
    
    const searchLower = regSearchQuery.toLowerCase();
    return (
      (reg.full_name && reg.full_name.toLowerCase().includes(searchLower)) ||
      (reg.employee_id && reg.employee_id.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Application Status</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Registration Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or ID..."
                className="pl-8"
                value={regSearchQuery}
                onChange={(e) => setRegSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={regStatusFilter}
              onValueChange={setRegStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Results Summary */}
          {!isLoading && !error && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredRegistrations?.length || 0} registration {filteredRegistrations?.length === 1 ? 'request' : 'requests'}
            </div>
          )}
          
          {/* Content Area */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner className="mr-2" />
              <span>Loading registration requests...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load registration requests. Please try again later.
              </AlertDescription>
            </Alert>
          ) : filteredRegistrations && filteredRegistrations.length > 0 ? (
            <RegistrationRequestsTable requests={filteredRegistrations} />
          ) : (
            <Alert>
              <AlertDescription>
                {regSearchQuery || regStatusFilter !== "all" 
                  ? "No registration requests match your filters. Try adjusting your search criteria."
                  : "No registration requests found."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationStatus;
