
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegistrationRequestsTable } from "@/components/requests/RegistrationRequestsTable";
import { RequestsManagement } from "@/components/requests/RequestsManagement";
import { useEmployeeRegistrations } from "@/hooks/useEmployeeRegistrations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const ApplicationStatus = () => {
  const [activeTab, setActiveTab] = useState("registration-requests");
  const { registrations, isLoading, error } = useEmployeeRegistrations();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Application Status</h1>
      
      <Tabs 
        defaultValue="registration-requests" 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="registration-requests">Registration Requests</TabsTrigger>
          <TabsTrigger value="employee-requests">Employee Requests</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="registration-requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registration Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Failed to load registration requests. Please try again later.
                    </AlertDescription>
                  </Alert>
                ) : registrations && registrations.length > 0 ? (
                  <RegistrationRequestsTable requests={registrations} />
                ) : (
                  <Alert>
                    <AlertDescription>
                      No registration requests found.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="employee-requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employee Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <RequestsManagement type="employee" />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ApplicationStatus;
