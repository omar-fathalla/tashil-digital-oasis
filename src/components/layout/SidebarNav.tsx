
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
  SidebarTrigger,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { NavLogo } from "./NavLogo";
import { 
  Home, 
  Info, 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Users, 
  FileBox,
  BarChart3,
  HelpCircle,
  Settings,
  LogOut,
  ChartBar
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SidebarNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const isActive = (path: string) => pathname === path;

  const navigationLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/services", label: "Services", icon: LayoutDashboard },
  ];

  const managementLinks = [
    { href: "/application-status", label: "Application Status", icon: CheckSquare },
    { href: "/project-overview", label: "Projects", icon: FileText },
    { href: "/employee-management", label: "Employee Management", icon: Users },
    { href: "/document-management", label: "Document Management", icon: FileBox },
  ];

  const analyticsLinks = [
    { href: "/document-analytics", label: "Analytics", icon: BarChart3 },
    { href: "/report", label: "View Reports", icon: ChartBar },
  ];

  const supportLinks = [
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader className="flex items-center justify-between p-4">
        <NavLogo />
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(link.href)}
                    tooltip={link.label}
                    className={cn(
                      "transition-all duration-200 hover:scale-[1.02]",
                      "relative overflow-hidden",
                      "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:transform before:scale-y-0 before:transition-transform before:duration-200",
                      isActive(link.href) && "before:scale-y-100 bg-accent/50"
                    )}
                  >
                    <Link to={link.href} className="flex items-center gap-3">
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(link.href)}
                    tooltip={link.label}
                    className={cn(
                      "transition-all duration-200 hover:scale-[1.02]",
                      "relative overflow-hidden",
                      "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:transform before:scale-y-0 before:transition-transform before:duration-200",
                      isActive(link.href) && "before:scale-y-100 bg-accent/50"
                    )}
                  >
                    <Link to={link.href} className="flex items-center gap-3">
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(link.href)}
                    tooltip={link.label}
                    className={cn(
                      "transition-all duration-200 hover:scale-[1.02]",
                      "relative overflow-hidden",
                      "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:transform before:scale-y-0 before:transition-transform before:duration-200",
                      isActive(link.href) && "before:scale-y-100 bg-accent/50"
                    )}
                  >
                    <Link to={link.href} className="flex items-center gap-3">
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(link.href)}
                    tooltip={link.label}
                    className={cn(
                      "transition-all duration-200 hover:scale-[1.02]",
                      "relative overflow-hidden",
                      "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:transform before:scale-y-0 before:transition-transform before:duration-200",
                      isActive(link.href) && "before:scale-y-100 bg-accent/50"
                    )}
                  >
                    <Link to={link.href} className="flex items-center gap-3">
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2 py-1 text-sm text-sidebar-foreground">
              <span className="truncate font-medium">{user.email}</span>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full transition-all duration-200 hover:scale-[1.02]" 
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" /> Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full transition-all duration-200 hover:scale-[1.02]" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button variant="default" size="sm" className="w-full transition-all duration-200 hover:scale-[1.02]" asChild>
              <Link to="/auth">Register</Link>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
