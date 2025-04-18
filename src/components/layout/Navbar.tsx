import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { 
  Menu, 
  LayoutDashboard,
  UserPlus, 
  FileText, 
  Settings, 
  Info,
  HelpCircle,
  LogOut,
  BarChart2,
  Home,
  PanelLeft
} from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2 mr-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-primary p-1">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary hidden sm:block">تسهيل</span>
            <span className="text-xl font-semibold text-foreground hidden sm:block">Platform</span>
          </Link>
        </div>
        
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
        
        <div className="flex-1"></div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden md:block text-sm text-gray-600">
                {user.email}
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleSignOut}
                className="hidden md:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" asChild className="hidden md:flex">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="hidden md:flex">
                <Link to="/auth">Register</Link>
              </Button>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu />
          </Button>
        </div>
      </div>
      
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
              <>
                <div className="pt-4 mt-4 border-t">
                  <span className="block text-sm text-gray-600 mb-2">
                    {user.email}
                  </span>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex space-x-2 mt-3 pt-3 border-t">
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
    </nav>
  );
};

export default Navbar;
