
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  UserPlus, 
  FileText, 
  Info,
  HelpCircle,
  BarChart2
} from "lucide-react";
import { cn } from "@/lib/utils";

export const DesktopNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/request-submission", icon: UserPlus, label: "Register Employee" },
    { to: "/company-registration", icon: FileText, label: "Register Company" },
    { to: "/application-status", icon: BarChart2, label: "Status" },
    { to: "/about", icon: Info, label: "About" },
    { to: "/faq", icon: HelpCircle, label: "FAQ" },
  ];

  return (
    <div className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => (
        <Button
          key={item.to}
          variant="ghost"
          size="sm"
          asChild
          className={cn(
            "relative",
            isActive(item.to) && "bg-accent text-accent-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
          )}
        >
          <Link to={item.to}>
            <item.icon className="h-4 w-4 mr-1" />
            {item.label}
          </Link>
        </Button>
      ))}
    </div>
  );
};
