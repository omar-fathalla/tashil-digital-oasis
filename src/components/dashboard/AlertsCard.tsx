
import { AlertCircle, Clock, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const AlertsCard = () => {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>System Alerts</CardTitle>
        <AlertCircle className="h-4 w-4 text-red-500" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-amber-50 p-3 rounded-md">
            <div className="flex items-start gap-3">
              <Clock className="text-amber-500 h-5 w-5 mt-0.5" />
              <div>
                <span className="font-medium">8 Registration Requests Pending</span>
                <p className="text-sm text-muted-foreground">Awaiting review for more than 48 hours</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Review</Button>
          </div>
          
          <div className="flex items-center justify-between bg-red-50 p-3 rounded-md">
            <div className="flex items-start gap-3">
              <FileWarning className="text-red-500 h-5 w-5 mt-0.5" />
              <div>
                <span className="font-medium">3 Documents Flagged by AI</span>
                <p className="text-sm text-muted-foreground">Possible missing or invalid information</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Review</Button>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Request REG-1024 approved by Admin</span>
              <span className="text-gray-500">2m ago</span>
            </li>
            <li className="flex justify-between">
              <span>New employee registered</span>
              <span className="text-gray-500">15m ago</span>
            </li>
            <li className="flex justify-between">
              <span>5 IDs generated and sent for printing</span>
              <span className="text-gray-500">1h ago</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
