
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AlertsCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Alerts</CardTitle>
        <AlertCircle className="h-4 w-4 text-red-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">2 Incomplete Employee Registrations</span>
            <Button size="sm" variant="outline">Review</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">1 Pending Company Approval</span>
            <Button size="sm" variant="outline">Review</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
