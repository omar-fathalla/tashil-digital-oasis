import { Home, Info, LayoutDashboard, FileText, CheckSquare, Users, FileBox, BarChart3, HelpCircle, Settings, ChartBar, Wallet } from "lucide-react";

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
  { href: "/accounting", label: "Accounting", icon: Wallet },
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
    badgeVariant: "new" as const
  },
];

export const supportLinks = [
  { 
    href: "/faq", 
    label: "FAQ", 
    icon: HelpCircle,
    badge: "2",
    badgeVariant: "count" as const
  },
  { href: "/settings", label: "Settings", icon: Settings },
];
