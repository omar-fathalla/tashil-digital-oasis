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
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setPermissions([]);
      return;
    }
    supabase
      .rpc("get_user_permissions", { user_id: user.id })
      .then(res => setPermissions(Array.isArray(res.data) ? res.data.map((p: any) => p.permission_key) : []));
  }, [user]);

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
            <Tabs defaultValue="documents" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 mb-8">
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="form-fields">Form Fields</TabsTrigger>
                <TabsTrigger value="regions">Regions</TabsTrigger>
                <TabsTrigger value="validation">Validation</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="workflow">Workflow</TabsTrigger>
                <TabsTrigger value="interface">Interface</TabsTrigger>
                <TabsTrigger value="backup">Backup & Export</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="user-roles">User Roles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents" className="space-y-4">
                <DocumentSettings />
              </TabsContent>
              
              <TabsContent value="form-fields" className="space-y-4">
                <FormFieldSettings />
              </TabsContent>
              
              <TabsContent value="regions" className="space-y-4">
                <RegionSettings />
              </TabsContent>
              
              <TabsContent value="validation" className="space-y-4">
                <ValidationSettings />
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <NotificationSettings />
              </TabsContent>
              
              <TabsContent value="companies" className="space-y-4">
                <CompanySettings />
              </TabsContent>
              
              <TabsContent value="workflow" className="space-y-4">
                <WorkflowSettings />
              </TabsContent>
              
              <TabsContent value="interface" className="space-y-4">
                <InterfaceSettings />
              </TabsContent>
              
              <TabsContent value="backup" className="space-y-4">
                <BackupSettings />
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <SecuritySettings />
              </TabsContent>
              
              <TabsContent value="user-roles" className="space-y-4">
                <UserRoleSettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {permissions.includes("manage_backup") && (
        <div className="mb-8">
          <Link
            to="/backup-management"
            className="inline-flex items-center gap-2 text-base font-semibold bg-background border border-primary rounded px-4 py-2 hover:bg-muted transition"
          >
            <span>🔒</span> Backup Management
          </Link>
        </div>
      )}
    </div>
  );
};

export default Settings;
