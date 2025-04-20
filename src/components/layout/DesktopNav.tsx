
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  UserPlus, 
  FileText, 
  Info,
  HelpCircle,
  BarChart2,
  Printer
} from "lucide-react";

export const DesktopNav = () => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/">
          <LayoutDashboard className="h-4 w-4 mr-1" />
          Dashboard
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/request-submission">
          <UserPlus className="h-4 w-4 mr-1" />
          Register Employee
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/company-registration">
          <FileText className="h-4 w-4 mr-1" />
          Register Company
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/application-status">
          <BarChart2 className="h-4 w-4 mr-1" />
          Status
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/print">
          <Printer className="h-4 w-4 mr-1" />
          Print
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/about">
          <Info className="h-4 w-4 mr-1" />
          About
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/faq">
          <HelpCircle className="h-4 w-4 mr-1" />
          FAQ
        </Link>
      </Button>
    </div>
  );
};
