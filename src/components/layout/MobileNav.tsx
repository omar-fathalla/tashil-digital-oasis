
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { 
  LayoutDashboard, 
  UserPlus, 
  FileText, 
  BarChart2, 
  Info, 
  HelpCircle, 
  Settings, 
  FileCheck,
  LogOut,
  Printer
} from "lucide-react";

interface MobileNavProps {
  mobileMenuOpen: boolean;
  onSignOut: () => Promise<void>;
}

export const MobileNav = ({ mobileMenuOpen, onSignOut }: MobileNavProps) => {
  const [open, setOpen] = useState(mobileMenuOpen);
  
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          <Link to="/" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/request-submission" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
            <UserPlus className="h-5 w-5" />
            <span>Register Employee</span>
          </Link>
          <Link to="/company-registration" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
            <FileText className="h-5 w-5" />
            <span>Register Company</span>
          </Link>
          <Link to="/application-status" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
            <BarChart2 className="h-5 w-5" />
            <span>Application Status</span>
          </Link>
          <Link to="/print-batch" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
            <Printer className="h-5 w-5" />
            <span>ID Card Management</span>
          </Link>
          <Link to="/report" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
            <FileCheck className="h-5 w-5" />
            <span>Reports</span>
          </Link>
          <Link to="/about" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
            <Info className="h-5 w-5" />
            <span>About</span>
          </Link>
          <Link to="/faq" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
            <HelpCircle className="h-5 w-5" />
            <span>FAQ</span>
          </Link>
          <Link to="/settings" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={onSignOut} className="w-full">
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
