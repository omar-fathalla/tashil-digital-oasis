
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Users, BarChart3 } from "lucide-react";

export function DocumentActions() {
  const actions = [
    {
      title: "Security",
      description: "Manage document encryption and access",
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-50",
    },
    {
      title: "Bulk Actions",
      description: "Perform operations on multiple documents",
      icon: <FileText className="h-8 w-8 text-emerald-500" />,
      color: "bg-emerald-50",
    },
    {
      title: "Role Management",
      description: "Configure user roles and permissions",
      icon: <Users className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-50",
    },
    {
      title: "Analytics",
      description: "View document usage statistics",
      icon: <BarChart3 className="h-8 w-8 text-amber-500" />,
      color: "bg-amber-50",
    },
  ];

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Document Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
            >
              <div
                className={`${action.color} p-2 rounded-md flex items-center justify-center mr-3`}
              >
                {action.icon}
              </div>
              <div>
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
