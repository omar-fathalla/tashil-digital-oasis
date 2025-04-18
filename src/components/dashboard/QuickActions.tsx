
import { Link } from "react-router-dom";
import { UserPlus, Building, Download, BarChart, Printer, Search } from "lucide-react";
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
            <Building className="mr-2 h-4 w-4" />
            Register Company
          </Link>
        </Button>
        <Button variant="outline" className="flex items-center">
          <Search className="mr-2 h-4 w-4" />
          Advanced Search
        </Button>
        <Button variant="outline" className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
        <Button variant="outline" className="flex items-center">
          <Printer className="mr-2 h-4 w-4" />
          Batch Print IDs
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
