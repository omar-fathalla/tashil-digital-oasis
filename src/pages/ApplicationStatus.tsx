
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplications } from "@/hooks/useApplications";
import { useNotifications } from "@/hooks/useNotifications";
import StatusHero from "@/components/application-status/StatusHero";
import { RequestsManagement } from "@/components/requests/RequestsManagement";
import GroupedNotifications from "@/components/application-status/GroupedNotifications";
import { ensureDemoData } from "@/utils/seedDemoData";

const ApplicationStatus = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  const { data: applications = [], isLoading: isLoadingApps } = useApplications(activeFilter);
  const { notifications, markAsRead, isLoading: isLoadingNotifs } = useNotifications();

  // Ensure we have demo data on page load
  useEffect(() => {
    const loadDemoData = async () => {
      setIsDataLoading(true);
      try {
        await ensureDemoData();
      } catch (error) {
        console.error("Failed to load demo data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    loadDemoData();
  }, []);

  const isLoading = isDataLoading || isLoadingApps || isLoadingNotifs;

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
                  {isLoading ? "Loading..." : 
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
                  {isLoading ? "Loading..." : 
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
