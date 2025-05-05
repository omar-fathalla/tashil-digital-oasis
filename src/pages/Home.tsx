
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { SettingsCard } from "@/components/dashboard/SettingsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IDCardManager from "@/components/digital-id/IDCardManager";
import { RegistrationRequestsTable } from "@/components/requests/RegistrationRequestsTable";
import { useState } from "react";
import { useEmployeeRegistrations } from "@/hooks/useEmployeeRegistrations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printId = new URLSearchParams(location.search).get('print');
  
  // Filters for registration requests on dashboard
  const [regSearchQuery, setRegSearchQuery] = useState("");
  const [regStatusFilter, setRegStatusFilter] = useState("all");
  
  const { data: request } = useQuery({
    queryKey: ['print-request', printId],
    queryFn: async () => {
      if (!printId) return null;
      
      const { data, error } = await supabase
        .from('registration_requests')
        .select('*')
        .eq('id', printId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!printId
  });

  // Fetch employee registrations for the dashboard tab
  const {
    registrations,
    isLoading,
    error
  } = useEmployeeRegistrations();

  // Filter registration requests based on search query and status
  const filteredRegistrations = registrations?.filter(reg => {
    // First apply status filter
    if (regStatusFilter !== "all" && reg.status.toLowerCase() !== regStatusFilter.toLowerCase()) {
      return false;
    }

    // Then apply search filter if present
    if (regSearchQuery === "") return true;
    const searchLower = regSearchQuery.toLowerCase();
    return reg.full_name && reg.full_name.toLowerCase().includes(searchLower) || reg.employee_id && reg.employee_id.toLowerCase().includes(searchLower);
  });

  if (printId && request) {
    navigate(`/print/${printId}`);
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCards />
        <QuickActions />
        <AlertsCard />
        <SettingsCard />
      </div>
      
      <Card className="mt-8">
        <CardContent>
          <IDCardManager />
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Request Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="registration" className="w-full">
            <TabsList>
              <TabsTrigger value="registration">Registration Requests</TabsTrigger>
              <TabsTrigger value="company">Company Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="registration">
              <div className="space-y-4">
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="search" 
                      placeholder="Search by name or ID..." 
                      className="pl-8" 
                      value={regSearchQuery} 
                      onChange={e => setRegSearchQuery(e.target.value)} 
                    />
                  </div>
                  <Select value={regStatusFilter} onValueChange={setRegStatusFilter}>
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
                {!isLoading && !error && <div className="text-sm text-muted-foreground">
                    Showing {filteredRegistrations?.length || 0} registration {filteredRegistrations?.length === 1 ? 'request' : 'requests'}
                  </div>}

                {/* Content Area */}
                {isLoading ? <div className="flex justify-center items-center py-8">
                    <Spinner className="mr-2" />
                    <span>Loading registration requests...</span>
                  </div> : error ? <Alert variant="destructive">
                    <AlertDescription>
                      Failed to load registration requests. Please try again later.
                    </AlertDescription>
                  </Alert> : filteredRegistrations && filteredRegistrations.length > 0 ? <RegistrationRequestsTable requests={filteredRegistrations} /> : <Alert>
                    <AlertDescription>
                      {regSearchQuery || regStatusFilter !== "all" ? "No registration requests match your filters. Try adjusting your search criteria." : "No registration requests found."}
                    </AlertDescription>
                  </Alert>}
              </div>
            </TabsContent>
            <TabsContent value="company">
              <div className="p-4 text-center text-muted-foreground">
                Company Requests Management
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
