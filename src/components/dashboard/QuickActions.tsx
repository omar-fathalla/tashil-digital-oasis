
import { Link } from "react-router-dom";
import { UserPlus, ShieldCheck, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const QuickActions = () => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button asChild variant="outline">
          <Link to="/request-submission" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Register Employee
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/company-registration" className="flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Register Company
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/report" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            View Reports
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
