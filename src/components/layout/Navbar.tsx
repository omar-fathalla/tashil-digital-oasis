
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  ChevronDown, 
  UserPlus, 
  FileText, 
  Settings, 
  Home,
  LayoutDashboard,
  PanelLeft,
  Info,
  HelpCircle
} from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2 mr-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-primary p-1">
              <PanelLeft className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary hidden sm:block">تسهيل</span>
            <span className="text-xl font-semibold text-foreground hidden sm:block">Platform</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/about">
              <Info className="h-4 w-4 mr-1" />
              About
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/services">
              <Settings className="h-4 w-4 mr-1" />
              Services
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/company-registration">
              <UserPlus className="h-4 w-4 mr-1" />
              Register Company
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/request-submission">
              <FileText className="h-4 w-4 mr-1" />
              Submit Request
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/application-status">
              <LayoutDashboard className="h-4 w-4 mr-1" />
              Status
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
          <Button size="sm" variant="outline" className="hidden md:flex">
            Sign In
          </Button>
          <Button size="sm" className="hidden md:flex">
            Register
          </Button>
          
          {/* Mobile menu button */}
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
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 px-4 pb-3 pt-2">
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/about">
              <Info className="h-4 w-4 mr-2" />
              About
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/services">
              <Settings className="h-4 w-4 mr-2" />
              Services
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/company-registration">
              <UserPlus className="h-4 w-4 mr-2" />
              Register Company
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/request-submission">
              <FileText className="h-4 w-4 mr-2" />
              Submit Request
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/application-status">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Status
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </Link>
          </Button>
          <div className="flex space-x-2 mt-3 pt-3 border-t">
            <Button size="sm" variant="outline" className="flex-1">
              Sign In
            </Button>
            <Button size="sm" className="flex-1">
              Register
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
