
import { useNotifications } from "@/hooks/useNotifications";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavLogo } from "./NavLogo";
import { SidebarNavGroup } from "./sidebar/SidebarNavGroup";
import { SidebarAuth } from "./sidebar/SidebarAuth";
import { 
  navigationLinks, 
  managementLinks, 
  analyticsLinks, 
  supportLinks 
} from "./sidebar/navigation-config";

export default function SidebarNav() {
  const { unreadCount } = useNotifications();
  
  // Update the management links with unread count if needed
  const updatedManagementLinks = managementLinks.map(link => {
    if (link.href === "/application-status" && unreadCount > 0) {
      return { ...link, badge: unreadCount.toString(), badgeVariant: "count" as const };
    }
    return link;
  });

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
        <SidebarNavGroup label="Navigation" links={navigationLinks} />
        <SidebarSeparator className="my-4" />
        <SidebarNavGroup label="Management" links={updatedManagementLinks} />
        <SidebarSeparator className="my-4" />
        <SidebarNavGroup label="Analytics" links={analyticsLinks} />
        <SidebarSeparator className="my-4" />
        <SidebarNavGroup label="Support" links={supportLinks} />
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarAuth />
      </SidebarFooter>
    </Sidebar>
  );
}
