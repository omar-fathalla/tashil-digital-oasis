
import { useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  UserPlus, 
  FileText, 
  BarChart2, 
  Info, 
  HelpCircle, 
  Settings, 
  FileCheck,
  Printer
} from "lucide-react";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  
  const navigationItems = [
    { title: "Dashboard", path: "/", icon: LayoutDashboard },
    { title: "Register Employee", path: "/request-submission", icon: UserPlus },
    { title: "Register Company", path: "/company-registration", icon: FileText },
    { title: "Application Status", path: "/application-status", icon: BarChart2 },
    { title: "ID Card Management", path: "/print-batch", icon: Printer },
    { title: "Reports", path: "/report", icon: FileCheck },
    { title: "About", path: "/about", icon: Info },
    { title: "FAQ", path: "/faq", icon: HelpCircle },
    { title: "Settings", path: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar collapsible="icon">
      <div className="flex items-center p-2">
        <SidebarTrigger className="ml-auto" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
