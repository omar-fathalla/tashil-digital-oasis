
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
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  mobileMenuOpen: boolean;
  onSignOut: () => Promise<void>;
}

export const MobileNav = ({ mobileMenuOpen, onSignOut }: MobileNavProps) => {
  const { user } = useAuth();

  return (
    <div 
      className={cn(
        "fixed inset-x-0 top-[64px] z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden transition-all duration-200 ease-in-out transform",
        mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
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
        <div className="pt-4 mt-4 border-t">
          {user ? (
            <div className="space-y-3">
              <span className="block text-sm text-gray-600">
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
            <div className="flex gap-2">
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
