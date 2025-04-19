
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import DigitalIDCard from "@/components/dashboard/DigitalIDCard";
import { RegistrationRequestsTable } from "@/components/registration-requests/RegistrationRequestsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useLocation } from "react-router-dom";
import Print from "./Print";

const Dashboard = () => {
  const location = useLocation();
  const printId = new URLSearchParams(location.search).get('print');

  return (
    <div className="container mx-auto px-4 py-8">
      {printId ? (
        <Print />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
