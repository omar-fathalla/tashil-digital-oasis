
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplications } from "@/hooks/useApplications";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import StatusHero from "@/components/application-status/StatusHero";
import SearchAndFilter from "@/components/application-status/SearchAndFilter";
import { RequestsManagement } from "@/components/requests/RequestsManagement";
import NotificationsCard from "@/components/application-status/NotificationsCard";

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  const { data: applications = [], isLoading, error } = useApplications(activeFilter);
  
  if (!user) {
    navigate("/auth");
    return null;
  }

  const filteredApplications = applications.filter(app => 
    searchQuery ? (
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.type.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <StatusHero />
      
      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <SearchAndFilter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-0">
              <CardTitle>Registration Requests</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : 
                 `Showing ${filteredApplications.length} of ${applications.length} requests`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RequestsManagement />
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <NotificationsCard />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplicationStatus;
