
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  UserPlus, 
  FileText, 
  Info,
  HelpCircle,
  LogOut,
  BarChart2,
  Printer
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface MobileNavProps {
  mobileMenuOpen: boolean;
  onSignOut: () => Promise<void>;
}

export const MobileNav = ({ mobileMenuOpen, onSignOut }: MobileNavProps) => {
  const { user } = useAuth();

  return (
    <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
      <div className="space-y-1 px-4 pb-3 pt-2">
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link to="/">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link to="/request-submission">
            <UserPlus className="h-4 w-4 mr-2" />
            Register Employee
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link to="/company-registration">
            <FileText className="h-4 w-4 mr-2" />
            Register Company
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link to="/application-status">
            <BarChart2 className="h-4 w-4 mr-2" />
            Status
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link to="/print">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link to="/about">
            <Info className="h-4 w-4 mr-2" />
            About
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link to="/faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </Link>
        </Button>
        <div className="flex space-x-2 mt-3 pt-3 border-t">
          {user ? (
            <div className="pt-4 mt-4 border-t w-full">
              <span className="block text-sm text-gray-600 mb-2">
                {user.email}
              </span>
              <Button 
                variant="outline" 
                onClick={onSignOut}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2 mt-3 pt-3 border-t w-full">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link to="/auth">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
