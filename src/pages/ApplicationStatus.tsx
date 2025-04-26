
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplications } from "@/hooks/useApplications";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import StatusHero from "@/components/application-status/StatusHero";
import { RequestsManagement } from "@/components/requests/RequestsManagement";
import UnifiedSearch from "@/components/application-status/UnifiedSearch";
import GroupedNotifications from "@/components/application-status/GroupedNotifications";

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  const { data: applications = [], isLoading: isLoadingApps } = useApplications(activeFilter);
  const { notifications, markAsRead, isLoading: isLoadingNotifs } = useNotifications();
  
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

  const filteredNotifications = notifications?.filter(notif =>
    searchQuery ? (
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true
  ) ?? [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <StatusHero />
      
      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <UnifiedSearch 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={activeFilter}
            setStatusFilter={setActiveFilter}
          />
          
          <div className="mt-8 space-y-8">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-0">
                <CardTitle>Registration Requests</CardTitle>
                <CardDescription>
                  {isLoadingApps ? "Loading..." : 
                   `Showing ${filteredApplications.length} of ${applications.length} requests`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <RequestsManagement type="employee" />
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  {isLoadingNotifs ? "Loading..." : 
                   `${notifications?.filter(n => !n.read).length || 0} unread notifications`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GroupedNotifications 
                  notifications={filteredNotifications}
                  onMarkAsRead={(id) => markAsRead.mutate(id)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplicationStatus;
