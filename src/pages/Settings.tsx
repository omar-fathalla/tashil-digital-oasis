import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentSettings } from "@/components/settings/DocumentSettings";
import { FormFieldSettings } from "@/components/settings/FormFieldSettings";
import { RegionSettings } from "@/components/settings/RegionSettings";
import { ValidationSettings } from "@/components/settings/ValidationSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { CompanySettings } from "@/components/settings/CompanySettings";
import { WorkflowSettings } from "@/components/settings/WorkflowSettings";
import { InterfaceSettings } from "@/components/settings/InterfaceSettings";
import { BackupSettings } from "@/components/settings/BackupSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { UserRoleSettings } from "@/components/settings/UserRoleSettings";
import { RepresentativeAccounting } from "@/components/settings/RepresentativeAccounting";
import { EmailPreferences } from "@/components/settings/EmailPreferences";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure system settings and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Settings Management</CardTitle>
            <CardDescription>
              Configure various aspects of the system to suit your organization's needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="security" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="interface">Interface</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="more">More Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="security" className="space-y-4">
                <SecuritySettings />
              </TabsContent>
              
              <TabsContent value="interface" className="space-y-4">
                <InterfaceSettings />
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <NotificationSettings />
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4">
                <EmailPreferences />
              </TabsContent>
              
              <TabsContent value="companies" className="space-y-4">
                <CompanySettings />
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4">
                <DocumentSettings />
              </TabsContent>
              
              <TabsContent value="more">
                <Tabs defaultValue="workflow" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="workflow">Workflow</TabsTrigger>
                    <TabsTrigger value="validation">Validation</TabsTrigger>
                    <TabsTrigger value="regions">Regions</TabsTrigger>
                    <TabsTrigger value="backup">Backup</TabsTrigger>
                    <TabsTrigger value="roles">User Roles</TabsTrigger>
                    <TabsTrigger value="accounting">Accounting</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="workflow">
                    <WorkflowSettings />
                  </TabsContent>
                  
                  <TabsContent value="validation">
                    <ValidationSettings />
                  </TabsContent>
                  
                  <TabsContent value="regions">
                    <RegionSettings />
                  </TabsContent>
                  
                  <TabsContent value="backup">
                    <BackupSettings />
                  </TabsContent>
                  
                  <TabsContent value="roles">
                    <UserRoleSettings />
                  </TabsContent>
                  
                  <TabsContent value="accounting">
                    <RepresentativeAccounting />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
