
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplications } from "@/hooks/useApplications";
import { useNotifications } from "@/hooks/useNotifications";
import StatusHero from "@/components/application-status/StatusHero";
import { RequestsManagement } from "@/components/requests/RequestsManagement";
import GroupedNotifications from "@/components/application-status/GroupedNotifications";

const ApplicationStatus = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const { data: applications = [], isLoading: isLoadingApps } = useApplications(activeFilter);
  const { notifications, markAsRead, isLoading: isLoadingNotifs } = useNotifications();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <StatusHero />
      
      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-0">
                <CardTitle>Registration Requests</CardTitle>
                <CardDescription>
                  {isLoadingApps ? "Loading..." : 
                   `Showing ${applications.length} requests`}
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
                  notifications={notifications || []}
                  onMarkAsRead={(id) => markAsRead(id)}
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
