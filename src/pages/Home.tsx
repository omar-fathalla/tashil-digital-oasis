
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import DigitalIDCard from "@/components/dashboard/DigitalIDCard";
import { RequestsManagement } from "@/components/requests/RequestsManagement";
import { SettingsCard } from "@/components/dashboard/SettingsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IDCardManager from "@/components/digital-id/IDCardManager";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printId = new URLSearchParams(location.search).get('print');
  
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
      
      <div className="mt-8">
        <DigitalIDCard />
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Digital ID Management</CardTitle>
        </CardHeader>
        <CardContent>
          <IDCardManager />
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Request Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employee" className="w-full">
            <TabsList>
              <TabsTrigger value="employee">Employee Requests</TabsTrigger>
              <TabsTrigger value="company">Company Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="employee">
              <RequestsManagement />
            </TabsContent>
            <TabsContent value="company">
              <RequestsManagement type="company" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
