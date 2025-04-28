
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarNavItem } from "./SidebarNavItem";

interface SidebarNavGroupProps {
  label: string;
  links: Array<{
    href: string;
    label: string;
    icon: any;
    badge?: string;
    badgeVariant?: "new" | "count";
  }>;
}

export function SidebarNavGroup({ label, links }: SidebarNavGroupProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarNavItem key={link.href} {...link} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
