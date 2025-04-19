
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import DigitalIDCard from "@/components/dashboard/DigitalIDCard";
import { RegistrationRequestsTable } from "@/components/registration-requests/RegistrationRequestsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  // If we have a print ID in the URL, redirect to the Print page with that ID
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
      </div>
      
      <div className="mt-8">
        <DigitalIDCard />
      </div>
      
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registration Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistrationRequestsTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
