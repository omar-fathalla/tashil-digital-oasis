
import { Home, Info, LayoutDashboard, FileText, CheckSquare, Users, FileBox, BarChart3, HelpCircle, Settings, ChartBar } from "lucide-react";

export const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/services", label: "Services", icon: LayoutDashboard },
];

export const managementLinks = [
  { 
    href: "/application-status", 
    label: "Application Status", 
    icon: CheckSquare,
  },
  { href: "/project-overview", label: "Projects", icon: FileText },
  { href: "/employee-management", label: "Employee Management", icon: Users },
  { href: "/document-management", label: "Document Management", icon: FileBox },
];

export const analyticsLinks = [
  { 
    href: "/document-analytics", 
    label: "Analytics", 
    icon: BarChart3,
  },
  { 
    href: "/report", 
    label: "View Reports", 
    icon: ChartBar,
    badge: "New",
    badgeVariant: "new" 
  },
];

export const supportLinks = [
  { 
    href: "/faq", 
    label: "FAQ", 
    icon: HelpCircle,
    badge: "2",
    badgeVariant: "count"
  },
  { href: "/settings", label: "Settings", icon: Settings },
];
