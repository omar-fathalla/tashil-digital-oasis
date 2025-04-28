
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
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
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const settingsGroups = [
  {
    id: "main",
    label: "Main Settings",
    items: [
      { id: "security", label: "Security", component: SecuritySettings },
      { id: "interface", label: "Interface", component: InterfaceSettings },
      { id: "notifications", label: "Notifications", component: NotificationSettings },
      { id: "email", label: "Email", component: EmailPreferences },
    ]
  },
  {
    id: "organization",
    label: "Organization",
    items: [
      { id: "companies", label: "Companies", component: CompanySettings },
      { id: "documents", label: "Documents", component: DocumentSettings },
    ]
  },
  {
    id: "advanced",
    label: "Advanced Settings",
    items: [
      { id: "workflow", label: "Workflow", component: WorkflowSettings },
      { id: "validation", label: "Validation", component: ValidationSettings },
      { id: "regions", label: "Regions", component: RegionSettings },
      { id: "backup", label: "Backup", component: BackupSettings },
      { id: "roles", label: "User Roles", component: UserRoleSettings },
      { id: "accounting", label: "Accounting", component: RepresentativeAccounting },
    ]
  }
];

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("security");
  const [openGroups, setOpenGroups] = useState<string[]>(["main"]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

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
            <div className="flex gap-6">
              {/* Sidebar Navigation */}
              <div className="w-64 shrink-0 space-y-2">
                {settingsGroups.map((group) => (
                  <Collapsible
                    key={group.id}
                    open={openGroups.includes(group.id)}
                    onOpenChange={() => toggleGroup(group.id)}
                    className="space-y-1"
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                      {group.label}
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          openGroups.includes(group.id) ? "transform rotate-180" : ""
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={cn(
                            "w-full rounded-lg px-3 py-2 text-sm transition-colors",
                            activeTab === item.id
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1">
                {settingsGroups.map(group => 
                  group.items.map(item => (
                    activeTab === item.id && (
                      <div key={item.id} className="w-full">
                        <item.component />
                      </div>
                    )
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
